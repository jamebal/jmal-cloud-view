<template>
  <div class="container">
    <el-card class="box-card">
      <a-affix>
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>外观设置</span>
            <el-button class="card-button" size="mini" type="primary" @click="save()">保存设置</el-button>
          </div>
        </div>
      </a-affix>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="网站首页背景" name="1">
          <div class="config-itme-label">站点背景大图：</div>
          <el-input autosize type="textarea" width="100%" v-model="form.backgroundSite"></el-input>
          <span class="instruction">在这里填入图片的URL地址, 以在网站首页显示一个背景大图。</span>
          <div class="config-itme-label">首页大图内文字：</div>
          <el-input autosize type="textarea" v-model="form.backgroundTextSite"></el-input>
          <span class="instruction">显示在博客首页大图内的描述。</span>
          <div class="config-itme-label">首页大图内描述：</div>
          <el-input autosize type="textarea" v-model="form.backgroundDescSite"></el-input>
          <span class="instruction">显示在博客首页大图内的描述。</span>
        </el-collapse-item>
        <el-collapse-item title="导航栏" name="2">
          <div class="config-itme-label">导航栏顶部 - 网站 Logo / 站点名称：</div>
          <el-input autosize type="textarea" width="100%" v-model="form.siteName"></el-input>
          <span class="instruction">配置网站的 Logo，该选项仅作用于顶部导航条</span>

          <div class="config-itme-label">导航栏操作按钮：</div>
          <el-input  :autosize="{ minRows: 4, maxRows: 6}" type="textarea" width="100%" v-model="form.operatingButtons"></el-input>
          <span class="instruction">一个操作按钮包含两个部分：<a href="https://fontawesome.com/icons?d=gallery" target="_blank">Font-awesome</a>图标标签和链接，使用'：'隔开。列如：{{example}}:https://github.com/jamebal</span>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>

import { updateSetting, getSetting } from '@/api/user'

export default {
  name: 'blogManager',
  components: {
  },
  data() {
    return {
      activeNames: ['1'],
      example: '<i class="fab fa-github"></i>',
      form: {
        backgroundSite: '',
        backgroundTextSite: '',
        backgroundDescSite: '',
        siteName: '',
        operatingButtons: '',
      }
    }
  },
  computed: {},
  mounted() {
    this.getSetting()
  },
  methods: {
    getSetting() {
      getSetting({userId: this.$store.state.user.userId}).then((res) => {
        if(res.data) {
          this.form = res.data;
        }
      }).catch(()=> {

      })
    },
    save() {
      this.form.userId = this.$store.state.user.userId
      updateSetting(this.form).then((res)=> {
        this.$message.success("保存成功！")
      }).catch(()=> {
        this.$message.error("保存失败！")
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/setting";
/deep/ .el-textarea {
  max-width: 1080px;
}
/deep/ .el-collapse-item__header {
  font-size: 16px;
  padding-left: 20px;
}
/deep/ .el-card__body {
  padding: 0;
}
.box-card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: rgba(235,235,235,0.3);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}
/deep/ .el-collapse-item__content {
  background-color: #fafafa;
  padding: 0 30px 20px;
  .config-itme-label {
    padding-top: 15px;
    font-size: 14px;
    font-weight: 500;
  }
}

</style>
