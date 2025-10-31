<template>
  <div class="container">
    <select-file title="选择头像" @select="selectedFile" :visible.sync="dialogSelectFile"></select-file>
    <el-dialog class="dialog-avatar" title="修改头像" :visible.sync="dialogAvatar" @close="handleCloseDialogAvatar">
      <cropper-dialog
        ref="cropperDialog"
        :file-img="fileImg"
        :select-img="selectedImgRow"
        :avatar="userInfo.avatar"
        @noCropSave="saveNoCropAvatar"
        @croppedCanvas="saveAvatar">
      </cropper-dialog>
    </el-dialog>
    <el-dialog class="dialog-cm" width="400px" :title="passwordFormTitle" :visible.sync="dialogChangePassword">
      <el-form ref="passwordForm" size="medium" :model="passwordForm" :rules="rules" label-width="100px" @submit.native.prevent>
        <el-form-item v-show="!validOldPass" label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" @keyup.enter.native="onSavePassword" show-password />
        </el-form-item>
        <el-form-item v-show="validOldPass" label="新密码" prop="password">
          <el-input ref="newPasswordInput" type="password" v-model="passwordForm.password" show-password/>
        </el-form-item>
        <el-form-item v-show="validOldPass" label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="passwordForm.checkPass" @keyup.enter.native="onSavePassword" show-password/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <a class="forget-password" @click="forget">忘记密码?</a>
        <el-button round size="small" @click="dialogChangePassword = false">取 消</el-button>
        <el-button round size="small" :loading="userUpdateLoading" type="primary" @click="onSavePassword">确 定</el-button>
      </div>
    </el-dialog>
    <el-form ref="consumerInfoForm" :model="consumerInfoForm" label-width="80px">
      <el-form-item label="头像" class="form-item-avatar">
        <div style="height: 100px; width: 100px;">
          <el-avatar icon="el-icon-user-solid" class="avatar-value" shape="circle" :size="100" fit="fit" :src="srcImage"  ></el-avatar>
        </div>
        <div class="avatar-button">
          <el-button round title="选择文件" type="primary" icon="el-icon-folder" circle @click="selectImg"></el-button>
          <el-button round title="上传" type="primary" icon="el-icon-upload2" circle @click="uploadImg"></el-button>
          <input ref="selectImg" type="file" style="display: none;" accept="image/*" @change="changImg"></input>
        </div>
      </el-form-item>
      <el-form-item label="密码">
        <el-button round size="mini" @click="changePassword">修改密码</el-button>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="consumerInfoForm.showName" class="input-none-width"/>
      </el-form-item>

      <el-form-item label="标语">
        <el-input class="form-slogan" v-model="consumerInfoForm.slogan" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input class="form-slogan" type="textarea" v-model="consumerInfoForm.introduction"></el-input>
      </el-form-item>

      <el-form-item v-show="percentage > 0" :label="$t('app.enableWebP')">
        <div>
          <el-switch
            v-model="webpEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="consumerInfoForm.webpDisabled = !webpEnable"
          >
          </el-switch>
        </div>
        <span class="instruction">
                {{ $t('app.storageWebP') }}
        </span>
      </el-form-item>

      <el-form-item v-show="percentage > 0" label="使用情况">
        <el-progress class="quota-space" :percentage="percentage" :format="progressFormat" :color="customColors"></el-progress>
      </el-form-item>

      <el-form-item>
        <el-button round type="primary" size="medium" :loading="userUpdateLoading" @click="onSubmit">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo, userUpdate, validOldPass, updatePass} from '@/api/user'
import { formatSize } from '@/utils/number'
import CropperDialog from '@/components/Cropper/dialog'
import SelectFile from "@/components/ShowFile/SelectFile"

export default {
  name: 'userSetting',
  components: {
    CropperDialog, SelectFile
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
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?id=`,
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
      consumerInfoForm: {
      },
      passwordForm: {
        oldPassword: '',
        password: '',
        checkPass: '',
      },
      srcImage: '',
      fileImg: new Blob(),
      selectedImgRow: {},
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
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
      },
      validOldPass: false,
      passwordFormTitle: '',
      dialogSelectFile: false,
      webpEnable: false,
    }
  },
  computed: {
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    uploadImg() {
      this.$refs.selectImg.click()
    },
    selectImg() {
      this.dialogSelectFile = true
    },
    selectedFile(row) {
      this.dialogAvatar = true
      this.selectedImgRow = row
      if(this.$refs.cropperDialog){
        this.$refs.cropperDialog.setSelectImg(this.selectedImgRow)
      }
    },
    handleCloseDialogAvatar() {
      this.$refs.selectImg.value = ''
    },
    changImg(e) {
      const files = e.target.files
      if(files.length < 1){
        return
      }
      if(files[0].size/1024/1024 > 5){
        this.$message({
          message: '选择的图片不能超过5M',
          type: 'warning'
        });
        return
      }
      this.fileImg = files[0]
      this.dialogAvatar = true
      this.selectedImgRow = {}
      if(this.$refs.cropperDialog){
        this.$refs.cropperDialog.changImg(files[0])
      }
    },
    getInfo(){
      getInfo().then(async res => {
        this.userInfo = res.data
        if (this.userInfo.roles && this.userInfo.roles.includes('admin')) {
          this.$emit('isAdmin', true)
        }
        await this.$nextTick()
        this.consumerInfoForm = this.userInfo
        this.webpEnable = !this.userInfo.webpDisabled
        this.srcImage = this.userInfo.avatar ? this.imageUrl + this.userInfo.avatar : require('@/assets/img/default-avatar.png')
      })
    },
    async changePassword() {
      this.validOldPass = false
      this.dialogChangePassword = true
      await this.$nextTick()
      this.passwordFormTitle = '旧密码'
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
      if(this.validOldPass){
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
            }
            return true
          }
          return false
        });
      } else {
        // 验证旧密码
        this.userUpdateLoading = true
        validOldPass({
          id: this.$store.state.user.userId,
          password: this.passwordForm.oldPassword
        }).then(() => {
          this.userUpdateLoading = false
          this.validOldPass = true
          this.passwordFormTitle = '新密码'
          let that = this
          setTimeout(function (){
            that.$refs.newPasswordInput.focus()
          })
        }).catch(()=>{
          this.userUpdateLoading = false
        })
      }
    },
    progressFormat() {
      const spaceBytes = this.userInfo.takeUpSpace;
      const quotaBytes = this.userInfo.quota * 1024 * 1024 * 1024;

      if (spaceBytes && quotaBytes > 0) {
        const percentage = Number((spaceBytes / quotaBytes * 100).toFixed(1));
        this.percentage = percentage > 100 ? 100 : percentage;
        return `${this.percentage}% (${formatSize(spaceBytes)}/${formatSize(quotaBytes)})`;
      }
    },
    // 设置formData
    setFormData() {
      let data = new FormData();
      for (let formKey in this.consumerInfoForm) {
        if(this.consumerInfoForm.hasOwnProperty(formKey)){
          if(formKey !== 'avatar'){
            data.append(formKey,this.consumerInfoForm[formKey])
          }
        }
      }
      data.delete("personalization")
      data.delete("createTime")
      data.delete("updateTime")
      return data
    },
    // 保存头像
    saveAvatar(dataURL, blob) {
      this.dialogAvatar = false
      this.srcImage = dataURL
      let data = new FormData();
      data.append('id', this.$store.state.user.userId)
      // data.append('avatar', dataURL)
      data.append('blobAvatar',blob)
      this.userUpdate(data,dataURL)
    },
    blobToFile(blob){
      return new window.File(
        [blob],
        blob.name,
        { type: blob.type }
      )
    },
    // 保存不剪裁的头像
    saveNoCropAvatar(fileId) {
      this.dialogAvatar = false
      let data = new FormData();
      data.append('id', this.$store.state.user.userId)
      data.append('avatar', fileId)
      this.userUpdate(data)
    },
    // 修改用户信息操作
    userUpdate(data, dataURL){
      this.userUpdateLoading = true
      userUpdate(data).then((res) => {
        this.userUpdateLoading = false
        this.$message({
          message: '保存成功!',
          type: 'success',
          duration: 1000
        })
        if(dataURL || res.data){
          this.srcImage = this.imageUrl + res.data
          this.$store.state.user.avatar = res.data
        }
        if(data.get('showName') != null){
          this.$store.state.user.showName = data.get('showName')
        }
      }).catch(() => {
        this.userUpdateLoading = false
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
>>>.form-item-avatar {
  .el-form-item__content {
    display: flex;
    .avatar-button {
      padding: 30px 12px;
    }
  }
  .el-button+.el-button {
    margin-left: 0;
  }
}
@media screen and (max-width: 768px) {
  >>> .el-divider--vertical {
    display: none;
  }
  .avatar-preview {
    display: none;
  }
}
</style>
