<template>
  <div class="app-container" v-wechat-title="title">
    <el-tabs type="border-card" :value="tabsDefault" @tab-click="tabClick">
      <el-tab-pane
        :key="item.name"
        v-for="item in tabs"
        :label="item.label"
        :name="item.name"
        lazy
      >
        <span v-if="item.name === 'cusomerInfo'" slot="label"><i class="el-icon-user"></i>{{item.label}}</span>
        <div v-if="item.name === 'cusomerInfo'">
          <el-dialog class="dialog-avatar" title="修改头像" :visible.sync="dialogVisible">
            <cropper-dialog :src="srcImage" @croppedCanvas="saveAvatar"></cropper-dialog>
          </el-dialog>
          <el-form ref="cusomerInfoForm" :model="cusomerInfoForm" label-width="120px">
            <el-form-item label="头像" class="form-item-avatar">
              <el-avatar class="avatar-value" shape="circle" :size="100" fit="fit" :src="srcImage" ></el-avatar>
              <el-avatar class="avatar-overlay" shape="circle" :size="100" @click.native="dialogVisible=true"> 修改头像 </el-avatar>
            </el-form-item>
            <el-form-item label="username">
              <el-input readonly="readonly" v-model="cusomerInfoForm.username" />
            </el-form-item>
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
        <span v-if="item.name === 'cusomerManager'" slot="label"><i class="el-icon-user-solid"></i>{{item.label}}</span>
        <div v-if="item.name === 'cusomerManager'">
          <el-table>

          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import { getInfo, userUpdate} from '@/api/user'
  import { formatSize } from '@/utils/number'
  import CropperDialog from '@/components/Cropper/dialog'

  export default {
    components: {
      CropperDialog
    },
    data() {
      return {
        imageUrl: process.env.VUE_APP_BASE_API + '/view/thumbnail?jmal-token=' + this.$store.state.user.token + '&id=',
        title: "设置",
        tabs: [
          {name: 'cusomerInfo', label:'个人信息'},
        ],
        adminTabs: [
          {name: 'cusomerManager', label:'用户管理'}
        ],
        tabsDefault: 'cusomerInfo',
        userInfo: {},
        userUpdateLoading: false,
        dialogVisible:false,
        cropper:'',
        percentage: 0,
        customColors: [
          {color: '#f56c6c', percentage: 100},
          {color: '#e6a23c', percentage: 80},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 40},
          {color: '#6f7ad3', percentage: 20}
        ],
        cusomerInfoForm: {
        },
        srcImage: '',
      }
    },
    computed: {
    },
    mounted() {
      if(this.$route.query.tab){
        this.tabsDefault = this.$route.query.tab
      }
      this.getInfo()
    },
    methods: {
      getInfo(){
        getInfo({
          id: this.$store.state.user.userId,
          takeUpSpace: true,
        }).then(res => {
          console.log(res.data)
          this.userInfo = res.data
          this.srcImage = this.imageUrl + this.userInfo.avatar
          if(this.userInfo.roles.includes('admin')){
            this.adminTabs.forEach(tab => {
              this.tabs.push(tab)
            })
          }
          this.$nextTick(() => {
            this.cusomerInfoForm = this.userInfo
          })
        })
      },
      tabClick(tab) {
        if(tab.name === 'cusomerManager'){
          // 用户管理

        }
        this.$router.push({path: this.$route.path, query: {tab: tab.name}})
      },
      onSubmit() {
        this.userUpdate(this.setFormData())
        // this.$message('submit!')
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
        for (let formKey in this.form) {
          if(this.cusomerInfoForm.hasOwnProperty(formKey)){
            if(formKey !== 'avatar'){
              console.log(formKey,this.form[formKey])
              data.append(formKey,this.form[formKey])
            }
          }
        }
        return data
      },
      // 保存头像
      saveAvatar(dataURL,blob) {
        this.dialogVisible = false
        this.srcImage = dataURL
        let data = new FormData();
        data.append('id', this.$store.state.user.userId)
        data.append('avatar', dataURL)
        data.append('blobAvatar',blob)
        this.userUpdate(data,dataURL)
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
</style>
