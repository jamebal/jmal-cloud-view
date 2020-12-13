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
          <el-tooltip class="item" effect="dark" placement="bottom" :disabled="!form.categoryBackground || form.categoryBackground.length === 0">
            <el-input autosize type="textarea" width="100%" v-model="form.backgroundSite"></el-input>
            <div slot="content">
              <el-image style="width: 150px;" :src="form.backgroundSite" fit="contain"></el-image>
            </div>
          </el-tooltip>
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
          <el-input type="textarea" width="100%" v-model="form.operatingButtons" :autosize="{ minRows: 4, maxRows: 6 }" @input="preview"></el-input>
          <span class="instruction">
            一个操作按钮包含两个部分：
            <a href="https://fontawesome.com/icons?d=gallery" target="_blank">Font-awesome</a>
            图标标签和链接，使用'：'隔开(标签里的内容为该图标的简述)。
            <br>
            列如：{{example}}:https://github.com/jamebal (建议不超过5项)
          </span>
          <div>
            <el-divider content-position="center">预览</el-divider>
            <ul class="navbar-nav side-toolbar-list">
              <li v-for="operatingButton in operatingButtons">
                <a :href="operatingButton.url" :title="operatingButton.title" target="_blank">
                  <dl v-html="operatingButton.fontHtml">
                    {{operatingButton.fontHtml}}
                  </dl>
                </a>
              </li>
            </ul>
          </div>

        </el-collapse-item>
        <el-collapse-item title="分类界面" name="3">
          <div class="config-itme-label">分类界面背景大图：</div>
          <el-tooltip class="item" effect="dark" placement="bottom" :disabled="!form.categoryBackground || form.categoryBackground.length === 0">
            <el-input autosize type="textarea" width="100%" v-model="form.categoryBackground"></el-input>
            <div slot="content">
              <el-image style="width: 150px;" :src="form.categoryBackground" fit="contain"></el-image>
            </div>
          </el-tooltip>
          <span class="instruction">在这里填入图片的URL地址, 以在分类页面显示一个背景大图。</span>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>

import '../../../assets/fontawesome-free-5.11.2-web/css/all.min.css'
import {getSetting, updateSetting} from '@/api/user'
import JInput from "@/components/input/JInput";

export default {
  name: 'blogManager',
  components: {
    JInput,
  },
  data() {
    return {
      activeNames: [],
      example: '<i class="fab fa-github">github</i>',
      form: {
        backgroundSite: '',
        backgroundTextSite: '',
        backgroundDescSite: '',
        siteName: '',
        operatingButtons: '',
        categoryBackground: '',
      },
      operatingButtons: []
    }
  },
  computed: {},
  mounted() {
    this.getSetting()
    this.$nextTick(() => {
      const that = this
      setTimeout(function (){
        that.activeNames = ['2']
      },50)
    })
  },
  methods: {
    preview(){
      this.operatingButtons = []
      if(this.form.operatingButtons) {
        this.form.operatingButtons.split(/[\n]/).forEach(button => {
          let operatingButton = {}
          const splitIndex = button.indexOf(":")
          const ihtml = button.substring(0, splitIndex)
          // 获取标签里的内容
          let regLabel = /[^><]+(?=<\/i>)/img
          const title = ihtml.match(regLabel)
          operatingButton.title = title ? title[0] : ''
          // 去掉标签里的内容
          operatingButton.fontHtml = ihtml.replace(regLabel, '')
          operatingButton.url = button.substring(splitIndex + 1, button.length)
          this.operatingButtons.push(operatingButton)
        })
      }
    },
    getSetting() {
      getSetting({userId: this.$store.state.user.userId}).then((res) => {
        if(res.data) {
          this.form = res.data;
          this.preview()
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
@import "src/styles/markdown";
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
/deep/ .el-divider__text {
  background-color: #fafafa;
}
.side-toolbar-list {
  text-align: center;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  li {
    position: relative;
    display: inline-block;
    margin: 0 .25rem;
  }
  li a {
    display: inline-block;
    height: 2.75rem;
    width: 2.75rem;
    line-height: 2.75rem;
    border-radius: 100%;
    font-size: 1rem;
    background: #f0f0f0;
    color: #333;
    vertical-align: middle;
    -webkit-transition: 0.3s ease all;
    -moz-transition: 0.3s ease all;
    -ms-transition: 0.3s ease all;
    -o-transition: 0.3s ease all;
    transition: 0.3s ease all;
    svg {
      width: 22px;
      height: 22px;
      margin-top: 10px;
    }
  }
  li a:hover {
    background: #333;
    color: #fff;
  }
}

</style>
