<template>
  <div class="container" v-wechat-title="title">
    <el-dialog class="dialog-form" width="600px" :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form size="medium" ref="managerForm" label-width="90px"  :model="form" :rules="rules">
        <el-row :gutter="10">
          <el-col :sm="12">
            <el-form-item label="用户账号:" prop="username">
              <el-input placeholder="请输入账号" width="100%" v-model="form.username" :disabled="editMove===2" />
            </el-form-item>
            <el-form-item label="用户名:" prop="showName">
              <el-input placeholder="请输入账号" v-model="form.showName" />
            </el-form-item>
            <el-form-item label="角色:" prop="roles">
              <el-select v-model="form.roles" multiple placeholder="请选择角色">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item v-if="editMove===1" label="密码:" prop="password">
              <el-input type="password" v-model="form.password"/>
            </el-form-item>
            <el-form-item v-if="editMove===1" label="确认密码:" prop="checkPass">
              <el-input type="password" v-model="form.checkPass"/>
            </el-form-item>
            <el-form-item label="配额:">
              <el-input v-model="form.quota"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="editMove===2" size="small" type="danger" @click="resetPassword()">重置密码</el-button>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" :loading="userUpdateLoading" @click.native.prevent="onSave()">保 存</el-button>
      </div>
    </el-dialog>
    <el-card class="box-card table-search-header">
      <div slot="header">
        <div class="box-card-header">
          <el-form size="medium" class="search-form" ref="queryForm" label-width="77px"  :model="queryCondition" :rules="rules">
            <el-row :gutter="10">
              <el-col :sm="12" :md="8">
                <el-form-item label="用户账号:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.username" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="8">
                <el-form-item label="用户名:">
                  <el-input clearable placeholder="请输入" v-model="queryCondition.showName" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :md="8">
                <div class="el-form-actions">
                  <el-button class="card-btn-icon" size="medium" icon="el-icon-search" type="primary" @click="getUserList()">查询</el-button>
                  <el-button class="card-btn-icon" size="medium" icon="el-icon-plus" type="primary" @click="add()">添加</el-button>
                  <el-button :disabled="multipleSelection.length < 1" class="card-btn-icon" size="medium" type="danger" icon="el-icon-delete" @click="handleSelectDelete()">删除</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <table-list
        :tableData="userList"
        :loading="loading"
        :tableHeader="tableHeader"
        :pagination="pagination"
        @pageChange="pageChange"
        @selectFun="selectFun"
        @sortChange="sortChange"
      ></table-list>
    </el-card>

  </div>
</template>

<script>
import {addUser, delUser, getInfo, resetPass, userList, userUpdate} from '@/api/user'
import roleApi from '@/api/role'
import CropperDialog from '@/components/Cropper/dialog'
import TableList from "@/components/table/TableList";

export default {
    name: 'cusomerManager',
    components: {
      TableList,
      CropperDialog
    },
    props: {
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        title: "用户管理",
        userList: [],
        loading: false,
        roleList: [],
        dialogVisible: false,
        dialogTitle: '',
        userUpdateLoading: false,
        valid: true,
        form: {
          username: '',
          password: '',
          showName: '',
          roles: [],
          checkPass: '',
          quota: 10,
        },
        // 分页信息
        pagination: {
          pageIndex: 1,
          pageSize: 15,
          pageTotal: 0
        },
        // 查询条件
        queryCondition: {
          username: '',
          showName: '',
          sortProp: '',
          sortOrder: ''
        },
        tableHeader: [
          {prop: 'username', minWidth: 110, label: '用户账号',sortable: 'custom'},
          {prop: 'showName', minWidth: 100, label: '用户名',sortable: 'custom'},
          {prop: 'roles', minWidth: 120, label: '角色', tag: true,
            formatData: (roles)=> {
                if(roles){
                  let tagNames = this.roleList.map(role => {
                    if (roles.includes(role.id)) {
                      return role.name
                    }
                  })
                  tagNames = tagNames.filter(tagName => tagName !== undefined)
                  return tagNames
                }
            }
          },
          {prop: 'quota',label: '配额(G)',sortable: 'custom'},
          {prop: 'createTime',label: '创建时间',sortable: 'custom'},
          {label: '操作', minWidth: 130, active: [
              {name: '修改', icon: 'el-icon-edit', handle: (row) => this.handleEdit(row.id,row.username)},
              {name: '删除', icon: 'el-icon-delete', color: '#ff4d4f', handle: (row) => this.handleDelete([row.id])},
              ],
          },
        ],
        multipleSelection: [],
        rules: {
          username: [
            { required: true, message: '请输入用户账号', trigger: 'blur' },
          ],
          showName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码不能小于6个字符', trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
        },
        editMove: 1,// 1添加,2修改
      }
    },
    computed: {
    },
    mounted() {
      this.getUserList()
      this.getRoleList()
      this.resize()
    },
    methods: {
      resize(){
        let clientWidth = document.querySelector(".container").clientWidth
        const monbile = clientWidth <= 768;
        this.tableHeader[3].disabled = monbile
        this.tableHeader[4].disabled = monbile
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
        this.getUserList()
      },
      //分页导航
      pageChange(data) {
        this.pagination = data.backData;
        this.getUserList()
      },
      getUserList(){
        this.loading = true
        userList({
          page: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          ...this.queryCondition
        }).then(res => {
          this.userList = res.data
          this.pagination.pageTotal = res.count
          this.loading = false
        })
      },
      getRoleList(){
        roleApi.roleList().then(res => {
          this.roleList = res.data;
        })
      },
      async add() {
        this.dialogVisible = true
        this.dialogTitle = '添加用户'
        this.editMove = 1
        this.form.showName = ''
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
            this.userUpdateLoading = true
            if(this.editMove === 1){
              this.addUser(this.setFormData())
            }
            if(this.editMove === 2){
              this.userUpdate(this.setFormData())
            }
          } else {
            return false;
          }
        });
      },
      handleEdit(id) {
        this.editMove = 2
        this.dialogVisible = true
        this.dialogTitle = '修改用户'
        getInfo({
          id: id,
        }).then(res => {
          this.form = res.data
          // 判断角色是否存在
          if(this.form.roles){
            let roleIds = this.roleList.map(role => {
              if (this.form.roles.includes(role.id)) {
                return role.id
              }
            })
            roleIds = roleIds.filter(roleId => roleId !== undefined)
            this.form.roles = roleIds
          }
        })
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
        this.$confirm('确定要删除选中的用户吗, 此操作会删除用户的所有文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.forEach(row => {
            ids.push(row.id)
          })
          this.deleteUser(ids)
        })
      },
      handleDelete(ids) {
        this.$confirm('确定要删除此用户吗？此操作会删除用户的所有文件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteUser(ids)
        })
      },
      deleteUser(ids){
        delUser({ids: ids}).then(() => {
          this.onSuccess('删除成功!')
        }).catch(() => {
          this.onError()
        })
      },
      // 修改用户信息操作
      userUpdate(data){
        userUpdate(data).then(() => {
          this.onSuccess()
        }).catch(() => {
          this.onError()
        })
      },
      // 添加用户
      addUser(data){
        addUser(data).then(() => {
          this.onSuccess()
        }).catch(() => {
          this.onError()
        })
      },
      onSuccess(message){
        this.getUserList()
        let msg = '保存成功!'
        if(message){
          msg = message
        }
        this.userUpdateLoading = false
        this.dialogVisible = false
        this.$message({
          message: msg,
          type: 'success',
          duration: 1000
        })
      },
      onError() {
        this.userUpdateLoading = false
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
