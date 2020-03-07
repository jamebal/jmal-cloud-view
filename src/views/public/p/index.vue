<template>
  <div v-wechat-title="pageTitle">
    <al-back-top></al-back-top>
    <div class="content">
      <el-row :gutter="0">
        <el-col :xs="0" :sm="1" :md="3" :lg="5" :xl="6"><div style="color: white">c</div></el-col>
        <el-col :xs="24" :sm="22" :md="18" :lg="14" :xl="12">
          <el-main>
            <mavon-editor
              ref="md"
              v-if="!showList"
              v-model="content"
              :subfield="false"
              :boxShadow="true"
              :toolbarsFlag="false"
              defaultOpen="preview"
            />
          </el-main>
        </el-col>
        <el-col :xs="0" :sm="1" :md="3" :lg="5" :xl="6"></el-col>
      </el-row>
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
        pageTitle: "文章列表",
        showList: true,
        toolbars: null,
        toolbarsFlag: true,
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
          console.log(res)
          this.pageTitle = res.data.name
          this.content = res.data.contentText
          const _this = this
          setTimeout(function () {
            if (document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null) {
              var arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/); //cookies中不为空，则读取滚动条位置
              document.documentElement.scrollTop = parseInt(arr[1]);
              document.body.scrollTop = parseInt(arr[1]);
            }
          },10)

          this.$nextTick(()=>{  // DOM更新之后获取子元素
            this.pageTitle = document.querySelector("h1").innerText
          })

          // const doc = document.querySelector(".v-show-content");
          document.addEventListener("scroll", _this.onScroll);

        })
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
