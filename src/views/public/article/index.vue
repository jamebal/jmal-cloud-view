<template>
  <div v-wechat-title="pageTitle">
    <al-back-top></al-back-top>
    <div class="content">
      <el-row :gutter="0">
        <el-col :xs="0" :sm="1" :md="4" :lg="5" :xl="6"><div style="color: white">c</div></el-col>
        <el-col :xs="24" :sm="22" :md="16" :lg="14" :xl="12">
          <el-main class="main-content">
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
        <el-col :xs="0" :sm="1" :md="4" :lg="5" :xl="6">
        </el-col>
      </el-row>
      <div v-show="titleList.length > 0" class="right-bj">
        <div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto; height: 662px;">
          <div class="right-menu" id="inner-content-div" style="overflow: hidden; width: auto; height: 662px;">
            <div class="toc-content">
              <header class="toc-header"><svg-icon icon-class="contents"></svg-icon><span>目录</span></header>
            </div>
            <div class="j-titleList titleList">
              <div class="j-bj" style="height: 40px; top: 0px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AlBackTop from "@/components/backtop/AlBackTop";
  import markdownApi from '@/api/markdown-api'
  import $ from 'jquery'
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
        titleList: []
      }
    },
    mounted() {
      console.log(777)
      if(this.$route.query.mark){
        this.getMarkDown()
        this.showList = false
      }
    },
    methods: {
      onScroll() {
        // console.log(document.documentElement.scrollTop)
      },
      getMarkDown() {
        markdownApi.getMarkdown({
          mark: this.$route.query.mark
        }).then((res) => {
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

            const hTag = document.querySelector("h1");
            if(hTag){
              this.pageTitle = hTag.innerText
            }

            let a = $('.el-main').html().match(/<h1.*?<\/h1>|<h2.*?<\/h2>/g);
            if(a && a.length >0 ){
              a = a.splice(a.length/2,a.length)
              for (let i = 0; i < a.length; i++) {
                a[i] = a[i].replace(/id="/g, 'href="#')
                if (a[i].indexOf('h2') != -1) {
                  a[i] = '<li class="pl">' + a[i].replace(/<h2>|<\/h2>/g, '') + '</li>'
                } else {
                  a[i] = '<li>' + a[i].replace(/<h1>|<\/h1>/g, '') + '</li>'
                }
                this.titleList.push(i)
              }
              $('.j-titleList').prepend(a)

              //获取id数组
              for (let i = 0; i < a.length; i++) {
                a[i] = a[i].replace(/.*?#(.*)".*/g, '$1')
              }
              $(window).on("scroll",function () {
                for (let i = 0; i < a.length; i++) {
                  if ($(window).scrollTop() > $('#' + a[i]).offset().top - 100 || $(this).scrollTop() + $(this).height() == $(document).height()) {
                    $('.j-titleList').find('li').eq(i).addClass('active').siblings('li').removeClass('active');
                    $('.j-bj').css('top', i * 44)
                  }
                }
              })

              let $root = $('html, body');
              $('.j-titleList li').on("click", function () {
                $root.animate({
                  scrollTop: $($.attr(this.querySelector("a"), 'href')).offset().top - 20
                }, 400);
                return false
              });
            }

          })

          // const doc = document.querySelector(".v-show-content");
          // document.addEventListener("scroll", _this.onScroll);

        })
      }
    },
    destroyed() {
      $(window).unbind("scroll")
      $('.j-titleList li').unbind("click");
    }
  }
</script>
<style lang="scss" scoped>
  @import "src/styles/markdown";

  /deep/ .v-note-wrapper {
    position: unset;
  }

  @media only screen and (max-width: 768px){
    .el-main {
      padding: 20px 0px 20px 0px;
    }
  }

  @media only screen and (min-width: 768px){
    .el-main {
      padding: 20px;
    }
  }

  @media only screen and (min-width: 992px){
    .el-main {
      padding: 20px;
    }
  }

  @media only screen and (min-width: 1200px){
    .el-main {
      padding: 20px;
    }
  }

  @media only screen and (min-width: 1920px){
    .el-main {
      padding: 20px;
    }
  }

</style>
