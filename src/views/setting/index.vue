<template>
  <div class="app-container">
    <el-tabs type="border-card" :value="tabsDefault" @tab-click="tabClick">
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-user"></i> 个人信息</span>

        <!--<div class="img-dialog" :v-show="dialogVisible">-->
          <!--<img id="image" :src="userInfo.avatar"/>-->
        <!--</div>-->

        <el-dialog class="dialog-avatar" title="修改头像" :visible.sync="dialogVisible">
          <cropper-dialog :src="userInfo.avatar" @croppedCanvas="saveAvatar"></cropper-dialog>
        </el-dialog>

        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="头像" class="form-item-avatar">
            <el-avatar class="avatar-value" shape="circle" :size="100" fit="fit" :src="userInfo.avatar" ></el-avatar>
            <el-avatar class="avatar-overlay" shape="circle" :size="100" @click.native="dialogVisible = true"> 修改头像 </el-avatar>
          </el-form-item>
          <el-form-item label="username">
            <el-input readonly="readonly" v-model="form.username" />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.showName" />
          </el-form-item>
          <el-form-item label="标语">
            <el-input class="form-slogan" v-model="form.slogan" />
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input type="textarea" v-model="form.introduction"></el-input>
          </el-form-item>
          <el-form-item label="使用情况">
            <el-progress class="quota-space" :percentage="percentage" :format="progressFormat" :color="customColors"></el-progress>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="3" label="消息中心">

      </el-tab-pane>
      <el-tab-pane name="4" label="角色管理">
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
        tabsDefault: '1',
        userInfo: {},
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
        form: {
          avatar: '',
          showName: '',
        }
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
          this.$nextTick(() => {
            this.form = this.userInfo
          })
        })
      },
      tabClick(tab) {
        this.$router.push({path: this.$route.path, query: {tab: tab.name}})
      },
      onSubmit() {
        this.userUpdate(this.setFormData())
        // this.$message('submit!')
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      progressFormat() {
        const space = this.userInfo.takeUpSpace/1024/1024/1024
        const quota = this.userInfo.quota
        if(space && quota > 0){
          this.percentage = (space/quota * 100).toFixed(1)
          return `${this.percentage}% (${formatSize(this.userInfo.takeUpSpace)}/${quota}GB)`;
          // return `${this.percentage}%`;
        }
      },
      setFormData() {
        let data = new FormData();
        for (let formKey in this.form) {
          if(this.form.hasOwnProperty(formKey)){
            if(formKey !== 'avatar'){
              console.log(formKey,this.form[formKey])
              data.append(formKey,this.form[formKey])
            }
          }
        }
        return data
      },
      // 保存头像
      saveAvatar(dataURL) {
        this.dialogVisible = false
        this.userInfo.avatar = dataURL
        let data = new FormData();
        data.append('id', this.$store.state.user.userId)
        data.append('avatar', dataURL)
        this.userUpdate(data,dataURL)
      },
      userUpdate(data, dataURL){
        userUpdate(data).then(() => {
          this.$message({
            message: '保存成功!',
            type: 'success',
            duration: 1000
          })
          if(dataURL){
            this.$store.state.user.avatar = dataURL
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
