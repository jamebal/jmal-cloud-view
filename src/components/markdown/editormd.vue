<template>
  <div class="markdown-view-box">
    <link rel="stylesheet" href="~@/assets/editor.md/css/editormd.min.css">
    <link rel="stylesheet" href="~@/assets/editor.md/examples/css/style.css" />
    <link rel="stylesheet" href="~@/assets/editor.md/css/editormd.preview.min.css" />
    <div id="markdown-view">
      <textarea style="display: none;">{{doc.content}}</textarea>
    </div>
  </div>
</template>
<script>
  import scriptjs from 'scriptjs'
  import { defaultConfig } from '@/components/markdown/config/editormd'
  export default {
    name: 'editromd',
    props: {
      viewId: {
        'type': String,
        'default': 'markdown-view'
      },
      config: { // 编辑器配置
        type: Object
      },
      initData: {
        'type': String
      },
      initDataDelay: {
        'type': Number, // 延迟初始化数据时间，单位毫秒
        'default': 0
      }
    },
    data: function () {
      return {
        doc: {},
        editor: null
      }
    },
    methods: {
      fetchScript: function (url) {
        return new Promise((resolve) => {
          scriptjs(url, () => {
            resolve()
          })
        })
      },
      getDoc: function () {
        return this.doc
      },
      getConfig: function () {
        return { ...defaultConfig, ...this.config }
      },
      forceUpdate: function () {
        this.$forceUpdate()
      },
      initView: function () {
        (async () => {
          await this.fetchScript('~@/assets/editor.md/jquery.min.js')
          await this.fetchScript('~@/assets/editor.md/lib/marked.min.js')
          await this.fetchScript('~@/assets/editor.md/lib/prettify.min.js')
          await this.fetchScript('~@/assets/editor.md/lib/raphael.min.js')
          await this.fetchScript('~@/assets/editor.md/lib/underscore.min.js')
          await this.fetchScript('~@/assets/editor.md/lib/sequence-diagram.min.js')
          await this.fetchScript('~@/assets/editor.md/lib/flowchart.min.js')
          await this.fetchScript('~@/assets/editor.md/lib/jquery.flowchart.min.js')
          await this.fetchScript('~@/assets/editor.md/editormd.min.js')
          this.$nextTick(() => {
            this.editor = window.editormd.markdownToHTML(this.viewId, this.getConfig())
          })
        })()
      },
      setDoc (doc) {
        if (doc) {
          let vm = this
          vm.doc = doc
          let markdownViewDiv = document.getElementById('markdown-view')
          if (markdownViewDiv) {
            markdownViewDiv.innerHTML = '<textarea style="display: none;"></textarea>'
            vm.initView()
            if (doc.content) {
              markdownViewDiv.getElementsByTagName('textarea')[0].innerHTML = doc.content
            }
          }
        }
      },
      showContent (id) {
        let vm = this
      }
    },
    mounted: function () {
      let vm = this
      let docId = vm.$router.currentRoute.name
      vm.showContent(docId)
    }
  }
</script>
