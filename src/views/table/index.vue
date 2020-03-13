<template>
  <div v-html="htms"></div>
</template>

<script>
  converter.setOption('tables', true);    // 将表格显示出来
  export default {
    data() {
      return {
        htms: ""
      }
    },
    created() {
      this.setMakedown()
    },
    methods: {
      setMakedown() {
        this.htms = converter.makeHtml('# 这是一个标题')
      }
    }
  }
</script>
