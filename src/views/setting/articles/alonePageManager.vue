<template>
  <div class="container">
    <article-manager :page-title="pageTitle" alone-page></article-manager>
  </div>
</template>

<script>
import ArticleManager from "@/views/setting/articles/articleManager";
export default {
  name: 'alonePageManager',
  components: {
    ArticleManager
  },
  data() {
    return {
      pageTitle: '管理独立页面',
    }
  },
  computed: {},
  created(){
  },
  mounted() {
  },
  watch: {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
