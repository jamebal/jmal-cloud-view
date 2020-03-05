<template>
    <mavon-editor
      v-model="content"
      :subfield="false"
      :boxShadow="false"
      defaultOpen="preview"
      :navigation="true"
      :toolbarsFlag="toolbarsFlag"
      :toolbars="toolbars"
      @navigationToggle="navigationToggle"
    />
</template>

<script>
  import api from '@/api/markdown-api'
  export default {
    data() {
      return {
        toolbars:{
          navigation: true,
        },
        toolbarsFlag: true,
        content:'',
        html:'',
      }
    },
    mounted() {
      this.getMarkDown()
    },
    methods: {
      getMarkDown() {
        api.getMarkdown({
          mark: this.$route.query.mark
        }).then((res) => {
          this.content = res.data.contentText
          console.log(res.data)
        })
      },
      navigationToggle(d){
        console.log(d)
      }
    }
  }
</script>
