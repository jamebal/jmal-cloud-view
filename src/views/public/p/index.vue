<template>
  <div>
    <al-back-top></al-back-top>
    <div class="content">

      <el-row :gutter="0">
        <el-col :xs="0" :sm="1" :md="3" :lg="5" :xl="6"><div>{{leftContent}}d</div></el-col>
        <el-col :xs="24" :sm="22" :md="18" :lg="14" :xl="12">
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
        </el-col>
        <el-col :xs="0" :sm="1" :md="3" :lg="5" :xl="6"></el-col>
      </el-row>
      <!--{{content}}-->
      <!--<mavon-editor-->
        <!--v-if="!showList"-->
        <!--v-model="content"-->
        <!--:subfield="false"-->
        <!--:boxShadow="false"-->
        <!--defaultOpen="preview"-->
        <!--:navigation="toolbarsFlag"-->
        <!--:toolbarsFlag="toolbarsFlag"-->
        <!--:toolbars="toolbars"-->
        <!--@navigationToggle="navigationToggle"-->
      <!--/>-->
    </div>
  </div>
</template>

<script>
  import AlBackTop from "@/components/backtop/AlBackTop";
  import markdownApi from '@/api/markdown-api'
  export default {
    components: { AlBackTop },
    data() {
      return {
        leftContent: '',
        backTopTarget: ".content",
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
      onScroll() {
        // console.log(document.documentElement.scrollTop)
      },
      getMarkDown() {
        markdownApi.getMarkdown({
          mark: this.$route.query.mark
        }).then((res) => {
          this.content = res.data.contentText
          const _this = this
          setTimeout(function () {
            _this.backTopTarget = ".v-note-wrapper .markdown-body"

            if (document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null) {
              var arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/); //cookies中不为空，则读取滚动条位置
              console.log('arr',arr)
              document.documentElement.scrollTop = parseInt(arr[1]);
              document.body.scrollTop = parseInt(arr[1]);
            }
          },10)

          const doc = document;
          // const doc = document.querySelector(".v-show-content");
          console.log(doc)
          doc.addEventListener("scroll", _this.onScroll);

        })
      },
      navigationToggle(d){
        console.log(d)
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .v-note-wrapper {
    position: unset;
  }
  .content {
    /*font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",*/
    /*"Microsoft YaHei", "微软雅黑", Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*overflow-y: scroll;*/
  }

</style>
