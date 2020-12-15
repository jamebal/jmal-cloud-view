<template>
  <div class="container" v-wechat-title="title">
    <el-dialog class="dialog-avatar" title="修改头像" :visible.sync="dialogAvatar">
      <cropper-dialog :src="srcImage" @croppedCanvas="saveAvatar"></cropper-dialog>
    </el-dialog>
    <el-dialog class="dialog-cm" :title="passwordFormTitle" :visible.sync="dialogChangePassword">
      <el-form ref="passwordForm" :model="passwordForm" :rules="rules" label-width="120px">
        <el-form-item v-if="!validOldPass" label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword"/>
        </el-form-item>
        <el-form-item v-if="validOldPass" label="新密码" prop="password">
          <el-input type="password" v-model="passwordForm.password"/>
        </el-form-item>
        <el-form-item v-if="validOldPass" label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="passwordForm.checkPass"/>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" :loading="userUpdateLoading" type="primary" @click.native.prevent="onSavePassword">确定</el-button>
          <a class="forget-password" @click="forget">忘记密码?</a>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-form ref="cusomerInfoForm" :model="cusomerInfoForm" label-width="120px">
      <el-form-item label="头像" class="form-item-avatar">
        <el-avatar icon="el-icon-user-solid" class="avatar-value" shape="circle" :size="100" fit="fit" :src="srcImage" ></el-avatar>
        <el-avatar class="avatar-overlay" shape="circle" :size="100" @click.native="dialogAvatar=true"> 修改头像 </el-avatar>
      </el-form-item>
      <el-form-item label="密码">
        <el-button size="mini" round @click="changePassword">修改密码</el-button>
      </el-form-item>
      <!--<el-form-item label="用户名">-->
        <!--<el-input readonly="readonly" v-model="cusomerInfoForm.username" />-->
      <!--</el-form-item>-->
      <el-form-item label="昵称">
        <el-input v-model="cusomerInfoForm.showName" />
      </el-form-item>
      <el-form-item label="标语">
        <el-input class="form-slogan" v-model="cusomerInfoForm.slogan" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input type="textarea" v-model="cusomerInfoForm.introduction"></el-input>
      </el-form-item>
      <el-form-item label="使用情况">
        <el-progress class="quota-space" :percentage="percentage" :format="progressFormat" :color="customColors"></el-progress>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="userUpdateLoading" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getInfo, userUpdate, validOldPass, updatePass} from '@/api/user'
  import { formatSize } from '@/utils/number'
  import CropperDialog from '@/components/Cropper/dialog'

  export default {
    name: 'cusomerInfo',
    components: {
      CropperDialog
    },
    props: {
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        imageUrl: process.env.VUE_APP_BASE_API + '/view/thumbnail?jmal-token=' + this.$store.state.user.token + '&id=',
        title: "个人信息",
        userUpdateLoading: false,
        dialogAvatar: false,
        dialogChangePassword: false,
        cropper:'',
        percentage: 0,
        userInfo: {},
        customColors: [
          {color: '#f56c6c', percentage: 100},
          {color: '#e6a23c', percentage: 80},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 40},
          {color: '#6f7ad3', percentage: 20}
        ],
        cusomerInfoForm: {
        },
        passwordForm: {
          oldPassword: '',
          password: '',
          checkPass: '',
        },
        srcImage: '',
        rules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 6, message: '密码不能小于6个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码不能小于6个字符', trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass, trigger: 'blur' }
          ],
        },
        validOldPass: false,
        passwordFormTitle: '旧密码'
      }
    },
    computed: {
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getInfo(){
        getInfo({
          id: this.$store.state.user.userId,
          takeUpSpace: true,
        }).then(async res => {
          this.userInfo = res.data
          if (this.userInfo.roles && this.userInfo.roles.includes('admin')) {
            this.$emit('isAdmin', true)
          }
          await this.$nextTick()
          this.cusomerInfoForm = this.userInfo
          this.srcImage = this.imageUrl + this.userInfo.avatar
        })
      },
      async changePassword() {
        this.validOldPass = false
        this.dialogChangePassword = true
        await this.$nextTick()
        this.$refs.passwordForm.resetFields()
      },
      onSubmit() {
        this.userUpdate(this.setFormData())
      },
      // 忘记密码
      forget() {
        this.$alert('请联系管理员重置密码', '提示', {
          confirmButtonText: '确定',
        });
      },
      // 确认密码
      onSavePassword() {
        this.$refs.passwordForm.validate((valid) => {
          this.valid = valid
          if (valid) {
            if(this.validOldPass){
              // 修改密码
              this.userUpdateLoading = true
              let data = new FormData()
              data.append("id",this.$store.state.user.userId)
              data.append("password",this.passwordForm.password)
              updatePass(data).then(() => {
                this.userUpdateLoading = false
                this.dialogChangePassword = false
              }).catch(()=>{
                this.userUpdateLoading = false
              })
            }else{
              // 验证旧密码
              this.userUpdateLoading = true
              validOldPass({
                id: this.$store.state.user.userId,
                password: this.passwordForm.oldPassword
              }).then(() => {
                this.userUpdateLoading = false
                this.validOldPass = true
                this.passwordFormTitle = '新密码'
              }).catch(()=>{
                this.userUpdateLoading = false
              })
            }
          } else {
            return false;
          }
        });
      },
      progressFormat() {
        const space = this.userInfo.takeUpSpace/1024/1024/1024
        const quota = this.userInfo.quota
        if(space && quota > 0){
          this.percentage = Number((space/quota * 100).toFixed(1))
          return `${this.percentage}% (${formatSize(this.userInfo.takeUpSpace)}/${quota}GB)`;
          // return `${this.percentage}%`;
        }
      },
      // 设置formData
      setFormData() {
        let data = new FormData();
        for (let formKey in this.cusomerInfoForm) {
          if(this.cusomerInfoForm.hasOwnProperty(formKey)){
            if(formKey !== 'avatar'){
              data.append(formKey,this.cusomerInfoForm[formKey])
            }
          }
        }
        return data
      },
      // 保存头像
      saveAvatar(dataURL,blob) {
        this.dialogAvatar = false
        this.srcImage = dataURL
        let data = new FormData();
        data.append('id', this.$store.state.user.userId)
        data.append('avatar', dataURL)
        data.append('blobAvatar',blob)
        this.userUpdate(data,dataURL)
      },
      // 修改用户信息操作
      userUpdate(data, dataURL){
        console.log('this.$store.state.user.avatar', this.$store.state.user.avatar)
        this.userUpdateLoading = true
        userUpdate(data).then((res) => {
          this.userUpdateLoading = false
          this.$message({
            message: '保存成功!',
            type: 'success',
            duration: 1000
          })
          if(dataURL){
            this.srcImage = this.imageUrl + res.data
            this.$store.state.user.avatar = res.data
          }
        }).catch(() => {
          this.$message({
            message: '保存失败!',
            type: 'error'
          })
        })
      }
    }
  }
</script>

<!--<style src="@styles/cropper.css"></style>-->
<style lang="scss" scoped>
  @import "src/styles/setting";
  .forget-password {
    font-size: 12px;
    margin-left: 10px;
    color: #409eff;;
  }
</style>
