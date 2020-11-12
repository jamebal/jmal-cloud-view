<template>
  <div class="container" v-wechat-title="title">
    <el-dialog class="dialog-cm" :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="managerForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.showName" />
        </el-form-item>
        <el-form-item v-if="editMove===1" label="密码" prop="password">
          <el-input type="password" v-model="form.password"/>
        </el-form-item>
        <el-form-item v-if="editMove===1" label="确认密码" prop="checkPass">
          <el-input type="password" v-model="form.checkPass"/>
        </el-form-item>
        <el-form-item label="配额">
          <el-input v-model="form.quota"/>
        </el-form-item>
        <el-form-item>
          <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
          <el-button native-type="submit" type="primary" :loading="userUpdateLoading" @click.native.prevent="onSave('managerForm')">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>用户列表</span>
            <el-button class="card-button" size="mini" type="primary" @click="add()">添加用户</el-button>
          </div>
        </div>
      </div>
      <el-table
        :data="userList"
        stripe
      >
        <el-table-column
          prop="username"
          label="用户名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="showName"
          label="昵称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="quota"
          label="配额"
          width="150">
          <template slot-scope="scope">
            {{scope.row.quota}}GB
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button v-if="scope.row.username !== 'jmal'"
              size="mini"
              @click="handleEdit(scope.row.id,scope.row.username)"
            >
              编辑
            </el-button>
            <el-button v-if="scope.row.username !== 'jmal'"
              size="mini"
              @click="resetPassword(scope.row.id,scope.row.username)"
            >
              重置密码
            </el-button>
            <el-button v-if="scope.row.username !== 'jmal'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id,scope.row.username)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import { getInfo, userUpdate, addUser, delUser, resetPass, userList} from '@/api/user'
  import CropperDialog from '@/components/Cropper/dialog'

  export default {
    name: 'cusomerManager',
    components: {
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
        dialogVisible: false,
        dialogTitle: '',
        userUpdateLoading: false,
        valid: true,
        form: {
          username: '',
          password: '',
          showName: '',
          checkPass: '',
          quota: 10,
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码不能小于6个字符', trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass, trigger: 'blur' }
          ],
        },
        editMove: 1,// 1添加,2修改
      }
    },
    computed: {
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      getUserList(){
        userList().then(res => {
          this.userList = res.data
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
        })
      },
      resetPassword(id,username) {
        if(username === 'jmal'){
          return
        }
        this.$confirm('确定重置该用户密码吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetPass(id).then(() => {
          }).catch(() => {
            this.onError()
          })
        })
      },
      handleDelete(id,username) {
        if(username === 'jmal'){
          return
        }
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delUser(id).then(() => {
            this.onSuccess('删除成功!')
          }).catch(() => {
            this.onError()
          })
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
</style>
