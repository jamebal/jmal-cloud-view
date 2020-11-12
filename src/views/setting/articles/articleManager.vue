<template>
  <div class="container" v-wechat-title="title">
    <el-dialog title="新增文章" :fullscreen="true" :visible.sync="newArticleDialogVisible">
      <markdown-editor></markdown-editor>
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
      title: "文章管理",
      newArticleDialogVisible: false,
    }
  },
  computed: {},
  mounted() {
    if(this.$route.query.markdown){
      this.newArticleDialogVisible = true
    }
  },
  methods: {
    newArticle() {
      this.newArticleDialogVisible = true
      this.$router.push({path:'/setting/website/manager-articles', query: {markdown: 'new'}})
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/setting";
</style>
