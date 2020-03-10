<template>
  <div v-wechat-title="pageTitle">
    <al-back-top></al-back-top>
    <div class="body-wrapper">
          <el-main class="l_main">
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

          <div v-show="titleList.length > 0" class="right-bj">
            <div class="slimScrollDiv">
              <div class="right-menu">
                <div class="toc-content">
                  <header class="toc-header"><svg-icon icon-class="contents"></svg-icon><span>目录</span></header>
                </div>
                <div class="j-titleList titleList">
                  <div class="j-bj" style="height: 40px; top: 0;"></div>
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
          this.content.r
          let n = this.content.replace(/(?:!\[(.*?)\]\((.*?)\))/,(matched,capture1,capture2,capture3,capture4)=>{
            console.log("matched:"+matched,"capture1:"+capture1,"capture2:"+capture2,"capture3:"+capture3);
                console.log(capture3)
                if(!capture2.includes("/file/public")){
                  return "/file/public/view?relativePath="+path + capture2 +"&userId="+userId;
                }
          })
          console.log(n);
          // console.log(this.content.match(/(?:!\[(.*?)\]\((.*?)\))/));
          let path = res.data.path
          let userId = res.data.userId
          setTimeout(function () {
            // 刷新界面 回到上次滚动条的位置
            if (document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null) {
              const arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/); //cookies中不为空，则读取滚动条位置
              document.documentElement.scrollTop = parseInt(arr[1]);
              document.body.scrollTop = parseInt(arr[1]);
            }
          },10)

          this.$nextTick(()=>{  // DOM更新之后获取子元素

            const hTag = document.querySelector("h1");
            if(hTag){
              this.pageTitle = hTag.innerText
            }

            // setTimeout(function () {
            //   let images = document.querySelector(".el-main").getElementsByTagName("img");
            //   console.log(images.item(1).getAttribute('src'))
            //   for (let i = 0; i < images.length/2; i++) {
            //     const oldSrc = images.item(i).getAttribute('src')
            //     if(!oldSrc.includes("/file/public")){
            //       const newPath = "/file/public/view?relativePath="+path + oldSrc +"&userId="+userId;
            //       images.item(i).src = newPath
            //     }
            //   }
            // },0)

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

  .body-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;
  }

  /deep/ .v-note-wrapper {
    position: unset;
  }

  .l_main {
    width: calc(100% - 1 * 285px);
    float: left;
  }

  @media screen and (max-width: 1440px){
    .l_main {
      width: calc(100% - 1 * 240px);
    }
  }

  @media screen and (max-width: 768px){
    .l_main {
      width: 100%;
    }
  }

</style>
