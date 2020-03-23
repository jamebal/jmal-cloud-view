<template>
  <div class="demo">
    <!--<tw-markdown-view v-if="!editor.isEditing" ref="markdownView"></tw-markdown-view>-->
    <editormd></editormd>
  </div>
</template>

<script>
  import editormd from '@/components/markdown/editormd'
  export default {
    components: {
      editormd
    },
    data () {
      return {
      }
    },
    mounted() {
    },
    methods: {
    },
  }
</script>

<style scoped>

</style>
