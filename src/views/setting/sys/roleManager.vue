<template>
  <div class="container" v-wechat-title="title">
    <el-dialog class="dialog-form" width="400px" :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form size="medium" ref="managerForm" label-width="90px"  :model="form" :rules="rules">
            <el-form-item label="角色名称:" prop="name">
              <el-input placeholder="请输入角色名称" width="100%" v-model="form.name"/>
            </el-form-item>
            <el-form-item label="角色标识:" prop="code">
              <el-input placeholder="请输入角色标识" v-model="form.code" />
            </el-form-item>
            <el-form-item label="备注:" prop="remarks">
              <el-input type="textarea" autosize :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入备注" v-model="form.remarks" />
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" :loading="updateLoading" @click.native.prevent="onSave()">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog width="400px" title="分配权限" :visible.sync="dialogAuthVisible">
      <el-scrollbar>
        <el-tree
          style="max-height: 50vh"
          ref="authTree"
          :data="menuList"
          :check-strictly="true"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="menuCheckedList"
          :props="{value: 'id', label: 'name'}">
        </el-tree>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogAuthVisible = false">取 消</el-button>
        <el-button size="small" type="primary" :loading="updateLoading" @click.native.prevent="saveAuth()">保 存</el-button>
      </div>
    </el-dialog>
    <el-card class="box-card table-search-header">
      <div slot="header">
        <div class="box-card-header">
          <el-form size="medium" class="search-form" ref="queryForm" label-width="77px"  :model="queryCondition" :rules="rules">
            <el-row :gutter="10">
              <el-col :sm="12" :md="6">
                <el-form-item label="角色名称:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.name" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="6">
                <el-form-item label="角色标识:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.code" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="5" :xl="6">
                <el-form-item label="备注:" label-width="50px">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.remarks" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="7" :xl="6">
                <div class="el-form-actions">
                  <el-button class="card-btn-icon" size="medium" icon="el-icon-search" type="primary" @click="getRoleList()">查询</el-button>
                  <el-button class="card-btn-icon" size="medium" icon="el-icon-plus" type="primary" @click="add()">添加</el-button>
                  <el-button :disabled="multipleSelection.length < 1" class="card-btn-icon" size="medium" type="danger" icon="el-icon-delete" @click="handleSelectDelete()">删除</el-button>
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
import roleApi from '@/api/role'
import menuApi from '@/api/menu'
import TableList from "@/components/table/TableList";

export default {
    components: {
      TableList
    },
    props: {
    },
    data() {
      return {
        title: "角色管理",
        dataList: [],
        menuList: [],
        menuCheckedList: [],
        loading: false,
        dialogVisible: false,
        dialogAuthVisible: false,
        dialogTitle: '',
        updateLoading: false,
        updateAuthLoading: false,
        valid: true,
        form: {
          name: '',
          code: '',
          remarks: '',
          menuIds: []
        },
        // 分页信息
        pagination: {
          pageIndex: 1,
          pageSize: 15,
          pageTotal: 0
        },
        // 查询条件
        queryCondition: {
          name: '',
          code: '',
          remarks: '',
          sortProp: '',
          sortOrder: ''
        },
        tableHeader: [
          {prop: 'name',label: '角色名称', minWidth: 110, sortable: 'custom'},
          {prop: 'code',label: '角色标识', minWidth: 110, sortable: 'custom'},
          {prop: 'remarks',label: '备注', minWidth: 110, sortable: 'custom'},
          {prop: 'createTime',label: '创建时间', minWidth: 110, sortable: 'custom'},
          {label: '操作', minWidth: this.$pc ? 0 : 160, active: [
              {name: '修改', icon: 'el-icon-edit', handle: (row) => this.handleEdit(row.id)},
              {name: '分配权限', icon: 'el-icon-finished', handle: (row) => this.authorization(row.id)},
              ],
          },
        ],
        multipleSelection: [],
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入角色标识', trigger: 'blur' },
          ],
        },
        editMove: 1,// 1添加,2修改
      }
    },
    computed: {
    },
    mounted() {
      this.getRoleList()
      this.getMenuTree()
      this.resize()
    },
    methods: {
      resize(){
        let clientWidth = document.querySelector(".container").clientWidth
        const monbile = clientWidth <= 768;
        this.tableHeader[2].disabled = monbile
        this.tableHeader[3].disabled = monbile
      },
      // 组件选择完后把数据传过来
      selectFun(data) {
        this.multipleSelection = data.backData;
      },
      //表格组件返回排序对象
      sortChange(data) {
        let column = data.backData;
        this.queryCondition.sortProp = column.prop
        this.queryCondition.sortOrder = column.order
        this.getRoleList()
      },
      //分页导航
      pageChange(data) {
        this.pagination = data.backData;
        this.getRoleList()
      },
      getRoleList(){
        this.loading = true
        roleApi.roleList({
          page: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          ...this.queryCondition
        }).then(res => {
          this.dataList = res.data
          this.pagination.pageTotal = res.count
          this.loading = false
        })
      },
      getMenuTree() {
        menuApi.menuTree().then(res => {
          this.menuList = res.data
        })
      },
      async add() {
        this.dialogVisible = true
        this.dialogTitle = '添加角色'
        this.editMove = 1
        await this.$nextTick()
        this.$refs.managerForm.resetFields()
      },
      // 设置formData
      setFormData() {
        let data = new FormData();
        for (let formKey in this.form) {
          if(this.form.hasOwnProperty(formKey)){
            data.append(formKey,this.form[formKey])
          }
        }
        data.delete("createTime")
        data.delete("updateTime")
        return data
      },
      // 保存
      onSave() {
        this.$refs.managerForm.validate((valid) => {
          this.valid = valid
          if (valid) {
            this.updateLoading = true
            if(this.editMove === 1){
              this.addRole(this.setFormData())
            }
            if(this.editMove === 2){
              this.updateRole(this.setFormData())
            }
          } else {
            return false;
          }
        });
      },
      // 保存分配权限
      saveAuth() {
        this.form.menuIds = this.$refs.authTree.getCheckedKeys()
        this.updateRole(this.setFormData())
      },
      // 分配权限
      authorization(roleId) {
        const req = require.context('@/icons/svg', false, /\.svg$/)
        this.dialogAuthVisible = true
        const findIndex = this.dataList.findIndex(data => data.id === roleId)
        const role = this.dataList[findIndex]
        this.form = role
        if(this.$refs.authTree){
          this.$refs.authTree.setCheckedKeys(role.menuIds)
        } else {
          this.menuCheckedList = role.menuIds
        }
      },
      handleEdit(id) {
        this.editMove = 2
        this.dialogVisible = true
        this.dialogTitle = '修改角色'
        const findIndex = this.dataList.findIndex(data => data.id === id)
        this.form = this.dataList[findIndex]
      },
      resetPassword() {
        this.$confirm('确定重置该用户密码吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetPass(this.form.id).then(() => {
          }).catch(() => {
            this.onError()
          })
        })
      },
      // 删除选中
      handleSelectDelete () {
        this.$confirm('确定要删除选中的角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.forEach(row => {
            ids.push(row.id)
          })
          this.deleteRole(ids)
        })
      },
      handleDelete(ids) {
        this.$confirm('确定要删除此角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRole(ids)
        })
      },
      deleteRole(ids){
        roleApi.delete({roleIds: ids}).then(() => {
          this.onSuccess('删除成功!')
        }).catch(() => {
          this.onError()
        })
      },
      // 修改用户信息操作
      updateRole(data){
        roleApi.update(data).then(() => {
          this.onSuccess()
        }).catch(() => {
          this.onError()
        })
      },
      // 添加角色
      addRole(data){
        roleApi.add(data).then(() => {
          this.onSuccess()
        }).catch(() => {
          this.onError()
        })
      },
      onSuccess(message){
        this.getRoleList()
        let msg = '保存成功!'
        if(message){
          msg = message
        }
        this.updateLoading = false
        this.dialogVisible = false
        this.dialogAuthVisible = false
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
/deep/ .el-input {
  width: 100%;
}
/deep/ .el-select {
  width: 100%;
}
</style>
