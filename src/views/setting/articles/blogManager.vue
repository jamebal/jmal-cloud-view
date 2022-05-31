<template>
  <div class="container">
    <el-card class="box-card">
      <a-affix>
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <div v-if="!subpage">
              <span>外观设置</span>
              <el-button class="card-button" size="mini" type="primary" @click="save()">保存设置</el-button>
            </div>
            <div v-if="subpage">
              <div class="card-header-back">
                <span class="header-back-title" @click="backParent">
                  <i class="el-icon-back"></i>
                  <span>返回</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-affix>

      <el-tabs v-if="!subpage" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="网站首页" name="1">
          <div class="config-itme-label">网站图标：</div>
          <upload-image-input v-model="form.siteIco" desc="只支持ico格式" :enable-select="false" :enable-url="false" accept="image/vnd.microsoft.icon"/>
          <span class="instruction"><a href="http://www.favicon-icon-generator.com/" target="_blank">在线制作ico</a></span>
          <div class="config-itme-label">站点名称：</div>
          <el-input autosize type="textarea" width="100%" v-model="form.siteName"></el-input>
          <span class="instruction">给您的网站取一个响亮的名字。</span>
          <div class="config-itme-label">站点地址：</div>
          <el-input autosize type="textarea" width="100%" v-model="form.siteUrl"></el-input>
          <span class="instruction">在这里填入站点的地址或域名。例如：<a href="https://blog.jmal.top" target="_blank">https://blog.jmal.top</a></span>
          <div class="config-itme-label">站点背景大图：</div>
          <upload-image-input v-model="form.backgroundSite"/>
          <span class="instruction">在这里填入图片的URL地址, 以在网站首页显示一个背景大图。</span>
          <div class="config-itme-label">首页大图内文字：
            <el-button type="text" @click="heartwings">历史记录</el-button>
          </div>
          <el-input autosize type="textarea" v-model="form.backgroundTextSite"></el-input>
          <span class="instruction">显示在博客首页大图内的描述。</span>
          <div class="config-itme-label">首页大图内描述：</div>
          <el-input autosize type="textarea" v-model="form.backgroundDescSite"></el-input>
          <span class="instruction">显示在博客首页大图内的描述。</span>
        </el-tab-pane>
        <el-tab-pane label="导航栏" name="2">
          <div class="config-itme-label">导航栏顶部 - 网站 Logo：</div>
          <el-input autosize type="textarea" width="100%" v-model="form.siteLogo"></el-input>
          <span class="instruction">配置网站的 Logo，该选项仅作用于顶部导航条</span>
          <div class="config-itme-label">导航栏操作按钮：</div>
          <el-input type="textarea" width="100%" v-model="form.operatingButtons" :autosize="{ minRows: 1, maxRows: 6 }"
                    @input="preview"></el-input>
          <span class="instruction">
            一个操作按钮包含两个部分：
            <a href="https://fontawesome.com/icons?d=gallery" target="_blank">Font-awesome</a>
            图标标签和链接，使用'：'隔开(标签里的内容为该图标的简述)。
            <br>
            列如：{{ example }}:https://github.com/jamebal (建议不超过5项)
          </span>
          <div>
            <el-divider content-position="center">预览</el-divider>
            <ul class="navbar-nav side-toolbar-list">
              <li v-for="operatingButton in operatingButtons">
                <a :href="operatingButton.url" :title="operatingButton.title" target="_blank">
                  <dl v-html="operatingButton.fontHtml">
                    {{ operatingButton.fontHtml }}
                  </dl>
                </a>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="归档、分类、标签" name="3">
          <div class="config-itme-label">页面显示与否：</div>
          <el-checkbox-group v-model="form.alonePages">
            <el-checkbox label="archives">归档</el-checkbox>
            <el-checkbox label="categories">分类</el-checkbox>
            <el-checkbox label="tags">标签</el-checkbox>
          </el-checkbox-group>
          <span class="instruction">选中项会显示在导航栏中</span>
          <div class="config-itme-label">归档界面背景大图：</div>
          <upload-image-input v-model="form.archiveBackground"/>
          <span class="instruction">在这里填入图片的URL地址, 以在归档页面显示一个背景大图。</span>
          <div class="config-itme-label">分类界面背景大图：</div>
          <upload-image-input v-model="form.categoryBackground"/>
          <span class="instruction">在这里填入图片的URL地址, 以在分类页面显示一个背景大图。</span>
          <div class="config-itme-label">标签界面背景大图：</div>
          <upload-image-input v-model="form.tagBackground"/>
          <span class="instruction">在这里填入图片的URL地址, 以在分类页面显示一个背景大图。</span>
        </el-tab-pane>
        <el-tab-pane label="网站页脚" name="4">
          <div class="config-itme-label">版权信息：</div>
          <el-input autosize type="textarea" width="100%" v-model="form.copyright"></el-input>
          <div class="config-itme-label">备案许可号：</div>
          <el-input autosize type="textarea" width="100%" v-model="form.recordPermissionNum"></el-input>
        </el-tab-pane>
      </el-tabs>
      <div v-if="subpage" class="list-body">
        <table-list
          ref="tableList"
          :less-client-height="280"
          :tableData="dataList"
          :loading="heartwingsLoading"
          :hasSelection="false"
          :tableHeader="tableHeader"
          :pagination="pagination"
          @pageChange="pageChange"
          @sizeChange="pageChange"
          @sortChange="sortChange"
        ></table-list>
      </div>
    </el-card>
  </div>
</template>

<script>

import {getSetting, getHeartwings, updateSetting} from '@/api/setting-api'
import UploadImageInput from "@/components/input/UploadImageInput"
import TableList from "@/components/table/TableList"

export default {
  name: 'blogManager',
  components: {
    UploadImageInput,
    TableList
  },
  data() {
    return {
      subpage: false,
      activeName: '1',
      example: '<i class="fab fa-github">github</i>',
      form: {
        siteUrl: '',
        backgroundSite: '',
        backgroundTextSite: '',
        backgroundDescSite: '',
        siteIco: '',
        siteName: '',
        siteLogo: '',
        operatingButtons: '',
        categoryBackground: '',
        archiveBackground: '',
        tagBackground: '',
        alonePages: [],
        copyright: '',
        recordPermissionNum: ''
      },
      operatingButtons: [],
      dataList: [],
      heartwingsLoading: false,
      tableHeader: [
        {prop: 'heartwings',label: '心语', minWidth: 450},
        {prop: 'username',label: '账号', minWidth: 110},
        {prop: 'createTime',label: '创建时间', minWidth: 110, sortable: 'custom'},
      ],
      queryCondition: {
        sortProp: '',
        sortOrder: 'descending'
      },
      pagination: {
        pageIndex: 1,
        pageSize: 15,
        pageTotal: 0
      },
    }
  },
  computed: {},
  mounted() {
    this.getSetting()
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
    }
  },
  methods: {
    backParent() {
      this.subpage = false
    },
    heartwings() {
      this.subpage = true
      this.heartwingsLoading = true
      this.getHeartwingsList()
    },
    getHeartwingsList() {
      getHeartwings({
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        order: this.queryCondition.sortOrder
      }).then((res) => {
        this.dataList = res.data
        this.heartwingsLoading = false
        this.pagination.pageTotal = res.count
      }).catch(() => {
        this.heartwingsLoading = false
      })
    },
    pageChange(data) {
      this.pagination = data.backData;
      this.getHeartwingsList()
    },
    sortChange(data) {
      let column = data.backData;
      this.queryCondition.sortProp = column.prop
      this.queryCondition.sortOrder = column.order
      this.getHeartwingsList()
    },
    handleClick(tab) {
      this.$router.push({query: {tab: tab.name}})
    },
    preview() {
      this.operatingButtons = []
      if (this.form.operatingButtons) {
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
        if (res.data) {
          this.form = res.data;
          this.preview()
        }
      }).catch(() => {

      })
    },
    save() {
      this.form.userId = this.$store.state.user.userId
      updateSetting(this.form).then(() => {
        this.$message.success("保存成功！")
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/setting";
@import "src/styles/markdown";

>>> .el-collapse-item__header {
  font-size: 16px;
  padding-left: 20px;
}
.list-body {
  padding-bottom: 15px;
}
>>> .el-card__body {
  padding: 0;
}

.box-card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: rgba(235, 235, 235, 0.3);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}

>>> .el-divider__text {
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

>>> .el-tabs__header {
  margin: 0;
  @media screen and (min-width: 768px) {
    .el-tabs__nav {
      padding: 0 20px;
    }
    .el-tabs__active-bar {
      left: 20px;
    }
  }
}
.config-itme-label {
  >>> .el-button {
    padding: 0 0;
  }
}
</style>
