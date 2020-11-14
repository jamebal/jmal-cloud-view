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
      <div class="box-card-header">
        <div class="clearfix card-header-back">
          <span>文章管理</span>
          <el-button class="card-button" size="mini" type="primary" @click="newArticle">新建文章</el-button>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>

import MarkdownEditor from '@/views/markdown/index'
export default {
  name: 'articleManager',
  components: {
    MarkdownEditor
  },
  data() {
    return {
      newArticleDialogVisible: false,
      pageTitle: '文章管理',
      hasChange: false
    }
  },
  computed: {},
  mounted() {
    this.newArticleDialogVisible = !!this.$route.query.operation;
    // 监听返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  watch: {
    hasChange(val){
      if(val){
        window.onbeforeunload = function() {
          return "还有文件正在上传, 确定退出吗?";
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
    newArticle() {
      this.newArticleDialogVisible = true
      this.$router.push({path: this.$route.path, query: {operation: 'new'}})
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
</style>
