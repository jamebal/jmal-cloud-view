<template>
  <div class="container">
    <!-- 加/修改用户组弹窗 -->
    <el-dialog class="dialog-form" width="500px" :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form size="medium" ref="groupForm" label-width="90px" :model="form" :rules="rules" v-if="dialogVisible">
        <el-form-item label="组名称:" prop="name">
          <el-input placeholder="请输入用户组名称" width="100%" v-model="form.name"/>
        </el-form-item>
        <el-form-item label="组标识:" prop="code">
          <el-input placeholder="请输入用户组标识 (如: dev_group)" v-model="form.code" :disabled="editMove===2"/>
        </el-form-item>
        <el-form-item label="分配角色:" prop="roles">
          <el-select ref="selectRole" v-model="form.roles" multiple placeholder="请选择该组拥有的角色" @change="changeRole">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input type="textarea" autosize :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入描述信息" v-model="form.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button round size="small" type="primary" :loading="updateLoading" @click.native.prevent="onSave()">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 分配用户弹窗 -->
    <el-dialog
      title="成员管理"
      :visible.sync="dialogAssignVisible"
      width="500px"
      :close-on-click-modal="false">

      <el-form label-width="80px" v-loading="assignLoading">
        <el-form-item label="组内成员">
          <el-select
            v-model="assignedUsernameList"
            multiple
            filterable
            reserve-keyword
            placeholder="搜索并选择用户"
            style="width: 100%">
            <el-option
              v-for="item in allUserList"
              :key="item.username"
              :label="item.showName"
              :value="item.username">
              <div class="add-group">
                <span class="add-group-name">{{ item.showName }}</span>
                <span class="add-group-code">{{ item.username }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button round size="small" @click="dialogAssignVisible = false">取 消</el-button>
        <el-button round size="small" type="primary" :loading="assignSubmitLoading" @click="saveAssignUsers()">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 列表与搜索 -->
    <el-card class="box-card table-search-header">
      <div slot="header">
        <div class="box-card-header">
          <el-form size="medium" class="search-form" ref="queryForm" label-width="77px" :model="queryCondition">
            <el-row :gutter="10">
              <el-col :sm="12" :md="6">
                <el-form-item label="组名称:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.name" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="6">
                <el-form-item label="组标识:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.code" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="12">
                <div class="el-form-actions">
                  <el-button round class="card-btn-icon" size="medium" icon="el-icon-search" type="primary" @click="getGroupList()">查询</el-button>
                  <el-button round class="card-btn-icon" size="medium" icon="el-icon-plus" type="primary" :loading="updateLoading" @click="add()">添加</el-button>
                  <el-button round :disabled="multipleSelection.length < 1" class="card-btn-icon" size="medium" type="danger" icon="el-icon-delete" :loading="updateLoading" @click="handleSelectDelete()">删除</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <table-list
        :less-client-height="280"
        :tableData="dataList"
        :loading="loading"
        :tableHeader="tableHeader"
        :pagination="pagination"
        @pageChange="pageChange"
        @sizeChange="pageChange"
        @selectFun="selectFun"
        @sortChange="sortChange"
      ></table-list>
    </el-card>

  </div>
</template>

<script>
import * as groupApi from '@/api/group'
import roleApi from '@/api/role'
import { userList } from '@/api/user'
import TableList from "@/components/table/TableList";

const initForm = {
  id: '',
  name: '',
  code: '',
  description: '',
  roles: []
}

export default {
  name: 'groupManager',
  components: {
    TableList
  },
  data() {
    return {
      title: "用户组管理",
      dataList: [],
      roleList: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      updateLoading: false,
      valid: true,
      form: { ...initForm },
      // 分页信息
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0,
        pageSizes: [10, 20, 50, 100]
      },
      // 查询条件
      queryCondition: {
        name: '',
        code: '',
        sortProp: '',
        sortOrder: ''
      },
      // 表头定义
      tableHeader: [
        {prop: 'name', label: '组名称', minWidth: 110, sortable: 'custom'},
        {prop: 'code', label: '组标识', minWidth: 110, sortable: 'custom'},
        {prop: 'description', label: '描述', minWidth: 120},
        {prop: 'roles', minWidth: 120, label: '角色', tag: true,
          formatData: (roles) => {
            if (roles && roles.length > 0 && this.roleList.length > 0) {
              let tags = this.roleList.map(role => {
                if (roles.includes(role.id)) {
                  return { name: role.name }
                }
              })
              return tags.filter(tag => tag !== undefined)
            }
            return []
          }
        },
        {label: '操作', minWidth: 130, active: [
            {name: '修改', icon: 'el-icon-edit', handle: (row) => this.handleEdit(row.id)},
            {name: '成员', icon: 'el-icon-user', handle: (row) => this.handleAssignUser(row)},
          ],
        },
      ],
      multipleSelection: [],
      rules: {
        name: [
          { required: true, message: '请输入组名称', trigger: 'blur' },
          { max: 64, message: '长度在 64 个字符以内', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入组标识', trigger: 'blur' },
          { max: 32, message: '长度在 32 个字符以内', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '仅支持字母、数字和下划线', trigger: 'blur' }
        ],
        roles: [
        ]
      },
      editMove: 1, // 1添加, 2修改

      // 分配用户弹窗相关变量
      dialogAssignVisible: false,
      assignLoading: false, // 弹窗内容加载状态
      assignSubmitLoading: false, // 提交按钮加载状态
      currentGroupId: '',
      allUserList: [],     // 所有用户列表
      assignedUsernameList: [], // 选中的用户ID
    }
  },
  mounted() {
    // 先获取角色列表，再获取用户组列表，确保Tag能正确渲染
    this.initData()
  },
  methods: {
    async initData() {
      await this.getRoleList()
      this.getGroupList()
      userList({ page: 1, pageSize: 5000 }).then(res => {
        this.allUserList = res.data
      })
    },
    // 获取所有角色列表
    getRoleList() {
      return roleApi.roleList().then(res => {
        this.roleList = res.data;
      })
    },
    getGroupList() {
      this.loading = true
      groupApi.groupList({
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        ...this.queryCondition
      }).then(res => {
        this.dataList = res.data
        this.pagination.pageTotal = res.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 表格选择
    selectFun(data) {
      this.multipleSelection = data.backData;
    },
    // 排序
    sortChange(data) {
      let column = data.backData;
      this.queryCondition.sortProp = column.prop
      this.queryCondition.sortOrder = column.order
      this.getGroupList()
    },
    // 分页
    pageChange(data) {
      this.pagination = data.backData;
      this.getGroupList()
    },
    async add() {
      this.dialogVisible = true
      this.dialogTitle = '添加用户组'
      this.editMove = 1
      this.form = { ...initForm, roles: [] } // 重置表单
      await this.$nextTick()
      if(this.$refs.groupForm) {
        this.$refs.groupForm.resetFields()
      }
    },
    /**
     * 获取所有用户
     */
    getAllUsers() {
      if (this.allUserList.length > 0) return Promise.resolve()
      return userList({ page: 1, pageSize: 5000 }).then(res => {
        this.allUserList = res.data
      })
    },
    /**
     * 保存成员分配
     */
    saveAssignUsers() {
      this.assignSubmitLoading = true
      const data = {
        groupId: this.currentGroupId,
        usernameList: this.assignedUsernameList
      }
      groupApi.assignUsers(data).then(() => {
        this.$message.success('成员分配成功')
        this.dialogAssignVisible = false
        this.getGroupList()
      }).finally(() => {
        this.assignSubmitLoading = false
      })
    },
    async handleAssignUser(row) {
      this.currentGroupId = row.id
      this.dialogAssignVisible = true
      this.assignLoading = true
      this.assignedUsernameList = []

      try {
        const p1 = this.getAllUsers()
        const p2 = groupApi.getAssignedUserList(row.id)

        const [_, assignedRes] = await Promise.all([p1, p2])
        this.assignedUsernameList = assignedRes.data
      } catch (e) {
        console.error(e)
      } finally {
        this.assignLoading = false
      }
    },
    handleEdit(id) {
      this.editMove = 2
      this.dialogVisible = true
      this.dialogTitle = '修改用户组'

      groupApi.getGroupInfo(id).then(res => {
        this.form = res.data
        // 确保 roles 是数组
        if (!this.form.roles) {
          this.form.roles = []
        }
        if (this.roleList.length > 0) {
          this.form.roles = this.form.roles.filter(rId => this.roleList.some(r => r.id === rId));
        }
      })
    },
    changeRole() {
      this.$refs.selectRole.blur()
    },
    // 构造提交数据
    getSubmitData() {
      return {
        id: this.form.id,
        name: this.form.name,
        code: this.form.code,
        description: this.form.description,
        roles: this.form.roles
      }
    },
    onSave() {
      this.$refs.groupForm.validate((valid) => {
        this.valid = valid
        if (valid) {
          this.updateLoading = true
          const data = this.getSubmitData()

          let promise
          if (this.editMove === 1) {
            promise = groupApi.addGroup(data)
          } else {
            promise = groupApi.updateGroup(data)
          }

          promise.then(() => {
            this.onSuccess()
          }).catch(() => {
            this.onError()
          }).finally(() => {
            this.updateLoading = false
          })
        } else {
          return false;
        }
      });
    },
    handleSelectDelete () {
      this.$confirm('确定要删除选中的用户组吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = this.multipleSelection.map(row => row.id)
        this.deleteGroup(ids)
      })
    },
    deleteGroup(ids){
      this.updateLoading = true
      groupApi.deleteGroup(ids).then(() => {
        this.onSuccess('删除成功!')
      }).finally(() => {
        this.updateLoading = false
      })
    },
    onSuccess(message){
      this.getGroupList()
      let msg = '保存成功!'
      if(message){
        msg = message
      }
      this.updateLoading = false
      this.dialogVisible = false
      this.$message({
        message: msg,
        type: 'success',
        duration: 1000
      })
    },
    onError() {
      this.updateLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";
@import "src/styles/group-manage";
>>> .el-input {
  width: 100%;
}
>>> .el-select {
  width: 100%;
}
</style>
