<template>
  <div>
    <mavon-editor
      v-if="!showList"
      v-model="content"
      :subfield="false"
      :boxShadow="false"
      defaultOpen="preview"
      :navigation="toolbarsFlag"
      :toolbarsFlag="toolbarsFlag"
      :toolbars="toolbars"
      @navigationToggle="navigationToggle"
    />

    Scroll down to see the bottom-right button.
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >
        UP
      </div>
    </el-backtop>
  </div>
</template>

<script>
  import markdownApi from '@/api/markdown-api'
  export default {
    data() {
      return {
        showList: true,
        toolbars:{
          navigation: true,
        },
        toolbarsFlag: false,
        content:'',
        html:'',
      }
    },
    mounted() {
      if(this.$route.query.mark){
        this.showList = false
      }
      this.getMarkDown()
    },
    methods: {
      getMarkDown() {
        markdownApi.getMarkdown({
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
