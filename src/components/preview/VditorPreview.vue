<template>
<div>
  <div id="vditor" :style="{height: height}"></div>
</div>
</template>
<script>
import vditor from 'vditor/dist/method.min'
import "vditor/src/assets/less/index.less"
  export default {
    name: "VidtorPreview",
    components: {
    },
    props: {
      height: {
        type: String,
        default: null
      },
      content: {
        type: String,
        default: ''
      },
    },
    computed: {

    },
    data(){
      return{
        vditorPreviewShow: false
      }
    },
    watch: {
      content(val){
        this.setContent(val)
      }
    },
    mounted() {
      if(this.content){
        this.vditorPreviewInit(this.content)
        this.vditorPreviewShow = true
      }
    },
    methods:{
      setContent(val) {
        if(!this.vditorPreviewShow){
          this.vditorPreviewInit(val)
          this.vditorPreviewShow = true
        }
      },
      vditorPreviewInit(content){
        const that = this
        vditor.preview(document.getElementById('vditor'),
          content,{
            speech: {
              enable: true,
            },
            hljs: {
              lineNumber: true
            },
            after() {
              that.$emit('after')
            }
          })
      },
    }
  }
</script>

<style>
</style>
