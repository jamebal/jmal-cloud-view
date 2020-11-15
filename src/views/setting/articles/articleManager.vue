<template>
  <div class="container" v-wechat-title="pageTitle">
    <el-dialog
      :title="pageTitle"
      :fullscreen="true"
      :visible.sync="newArticleDialogVisible"
      :before-close="handleClose"
      :destroy-on-close="true"
      @open="openDialog"
      @close="closeDialog"
    >
      <markdown-editor ref="editor" :has-change.sync="hasChange" @onTitle="onTitle"></markdown-editor>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>文章管理</span>
            <el-button class="card-button" size="mini" type="primary" @click="newArticle">新建文章</el-button>
          </div>
        </div>
      </div>
      <div>
        <div class="table-top">
          <div class="table-top-left">
            <el-radio-group v-model="query.radioStatus" size="mini">
              <el-radio-button label="release">可用</el-radio-button>
              <el-radio-button label="draft">草稿</el-radio-button>
            </el-radio-group>
            <span class="table-top-author">作者:</span>
            <el-radio-group v-model="query.radioUser" size="mini">
              <el-radio-button label="">所有</el-radio-button>
              <el-radio-button :label="$store.state.userId">我的</el-radio-button>
            </el-radio-group>
          </div>
          <div class="table-top-right">
            <el-input v-model="query.keyword" size="mini" placeholder="请输入关键字"></el-input>
            <el-cascader
              v-model="query.parentCategoryId"
              placeholder="不选择"
              :options="categories"
              :show-all-levels="false"
              size="mini"
              :props="{ checkStrictly: true }"
              clearable></el-cascader>
            <el-button type="primary" size="mini">筛选</el-button>
          </div>
        </div>
        <el-table
          :data="articleList"
          stripe
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            :show-overflow-tooltip="true"
            min-width="250"
            label="标题">
            <template slot-scope="scope">
              <el-tooltip :content="'编辑 '+scope.row.name" placement="top">
                <router-link :to="'/setting/website/manager-articles?operation=editor&id='+scope.row.id" target="_blank">{{scope.row.name}}<svg-icon icon-class="bianji-"></svg-icon></router-link>
              </el-tooltip>
              <el-tooltip :content="'浏览 '+scope.row.name" placement="top">
                <router-link :to="'/articles/article?mark='+scope.row.id" target="_blank"><svg-icon class="wailian" icon-class="wailian"></svg-icon></router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="状态">
            <template slot-scope="scope">
              <el-tag size="medium" type="success">{{ scope.row.release?'已发布':'未发布' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            width="100"
            label="作者">
            <template slot-scope="scope">
              <router-link :to="$route.path+'?uid='+scope.row.userId">{{scope.row.username}}</router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="categories"
            label="分类">
            <template slot-scope="scope">
            <span v-for="(category,i) in scope.row.categories">
              <router-link to="#">{{category.name}}</router-link>
              {{i===0?' ,':''}}
            </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateDate"
            label="日期">
            <template slot-scope="scope">
              <span>{{scope.row.updateDate.substring(0, 16)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        style="text-align: center"
        :hide-on-single-page="true"
        :current-page.sync="pagination.pageIndex"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="currentChange"
        layout="prev, pager, next">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

import MarkdownEditor from '@/views/markdown/index'
import markdownApi from "@/api/markdown-api";
import categoryApi from "@/api/category";
export default {
  name: 'articleManager',
  components: {
    MarkdownEditor
  },
  data() {
    return {
      newArticleDialogVisible: false,
      pageTitle: '文章管理',
      hasChange: false,
      articleList: [],
      pagination: {
        pageIndex: 1,
        pageSize: 15,
        total: 0,
      },
      categories: [],
      query: {
        radioStatus: 'release',
        radioUser: this.$store.state.userId,
        keyword: '',
      },
    }
  },
  computed: {},
  mounted() {
    this.getArticleList()
    this.categoryTree()
    this.newArticleDialogVisible = !!this.$route.query.operation
    // 监听返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  watch: {
    hasChange(val){
      if(val){
        window.onbeforeunload = function() {
          return "还有文件正在上传, 确定退出吗?"
        }
      }
    }
  },
  methods: {
    beforeunloadFn(){
      console.log('beforeunloadFn')
      return '是的发生'
    },
    goBack() {
      const operation = this.$route.query.operation
      console.log(operation)
      if(operation){
        this.newArticleDialogVisible = true
        if(operation === 'new') {
          this.pageTitle = '撰写新文章'
        }
        if(operation === 'editor') {
          this.pageTitle = '编辑文章'
        }
      } else {
        this.newArticleDialogVisible = false
      }
    },
    getArticleList() {
      markdownApi.getMarkdown({pageIndex: this.pagination.pageIndex, pageSize: this.pagination.pageSize}).then((res) => {
        this.articleList = res.data
        this.pagination.total = res.count
        this.$nextTick(() => {
          this.isLoading = false
          this.pagination.pageIndex = parseInt(decodeURI(this.$route.query.page))
        })
      })
    },
    currentChange() {
      this.getMarkDown()
    },
    newArticle() {
      this.newArticleDialogVisible = true
      this.$router.push({path: this.$route.path, query: {operation: 'new'}})
    },
    categoryTree() {
      categoryApi.categoryTree({userId: this.$store.state.user.userId}).then(res => {
        this.categories = res.data
      })
    },
    handleClose(done) {
      console.log(this.hasChange)
      if(this.hasChange){
        this.$confirm('还有未保存的内容，确定要离开吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
        return
      }
      done()
    },
    onTitle(val){
      const operation = this.$route.query.operation
      if(operation === 'new'){
        this.pageTitle = '撰写新文章 ' + val
      }
      if(operation === 'editor'){
        this.pageTitle = '编辑：' + val
      }
    },
    openDialog() {
      this.pageTitle = '撰写新文章'
      console.log('pageTitle')
    },
    closeDialog(){
      console.log('closeDialog')
      this.$router.replace({path: this.$route.path})
      window.onbeforeunload = null
      this.pageTitle = '文章管理'
      this.hasChange = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/setting";
.table-top-author {
  margin-left: 15px;
}
.wailian {
  margin-left: 8px;
}
</style>
