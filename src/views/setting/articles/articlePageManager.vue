<template>
  <div class="container">
    <article-manager :page-title="pageTitle" :new-article-text="newArticleText"></article-manager>
  </div>
</template>

<script>
import ArticleManager from "@/views/setting/articles/articleManager";

export default {
  name: 'articlePageManager',
  components: {
    ArticleManager
  },
  data() {
    return {
      pageTitle: '管理文章',
      newArticleText: '写文章'
    }
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  watch: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@import "src/styles/setting";
</style>
