<template>
  <div v-wechat-title="pageTitle">
    <transition name="fade">
      <al-loading v-if="isLoading"></al-loading>
    </transition>
    <al-back-top></al-back-top>

    <div id="top" style="display: block;" class="animateIn">
      <div class="bar" style="width: 0;"></div>
      <div class="navigation animated fadeIn fast delay-1s">
        <a href="/public/articles"><svg-icon id="home-icon" class="icon-home" icon-class="home" ></svg-icon></a>
        <div id="play-icon" title="Play/Pause" class="iconfont icon-play"></div>
        <h3 class="subtitle" style="display: block;">{{pageTitle}}</h3>
      </div>
      <div class="scrollbar gradient-bg-rev" style="width: 0;"></div>
    </div>
    <div class="body-wrapper">
          <el-main class="l_main">
            <mavon-editor
              ref="md"
              v-if="!showList"
              v-model="content"
              :subfield="false"
              :boxShadow="true"
              :toolbarsFlag="false"
              codeStyle="atom-one-dark"
              defaultOpen="preview"
            />
          </el-main>

          <div v-show="titleList.length > 0" class="right-bj">
            <div class="slimScrollDiv">
              <div class="right-menu" style="max-height: 700px">
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
    <footer class="clearfix">
      <div class="copyright"><p><a href="http://blog.jmal.top">Copyright © 2020 jmal</a></p></div>
    </footer>
  </div>
</template>

<script>
  import AlLoading from "@/components/loading/AlLoading";
  import AlBackTop from "@/components/backtop/AlBackTop";
  import markdownApi from '@/api/markdown-api'
  import { addCodeBtn } from '@/assets/js/mavon-line'
  import $ from 'jquery'
  export default {
    components: { AlBackTop, AlLoading },
    data() {
      return {
        isLoading: true,
        pageTitle: "文章",
        showList: true,
        toolbars: null,
        toolbarsFlag: true,
        content:'',
        html:'',
        titleList: [],
        tocMaxHeight: 500,
        befterScrollTop: 0,
      }
    },
    mounted() {
      if(this.$route.query.mark){
        this.getMarkDown()
        this.showList = false
      }

    },
    methods: {
      onScroll() {
        console.log("befterScrollTop")
        // let befterScrollTop = document.documentElement.scrollTop;
        // console.log("befterScrollTop",befterScrollTop)
      },
      getMarkDown() {
        markdownApi.getMarkdown({
          mark: this.$route.query.mark
        }).then((res) => {
          const filename = res.data.name
          this.pageTitle = filename.substring(0,filename.length - res.data.suffix.length-1)
          this.content = res.data.contentText
          // setTimeout(function () {
          //   // 刷新界面 回到上次滚动条的位置
          //   if (document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null) {
          //     const arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/); //cookies中不为空，则读取滚动条位置
          //     document.documentElement.scrollTop = parseInt(arr[1]);
          //     document.body.scrollTop = parseInt(arr[1]);
          //   }
          // },10)

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
                if (i ===0 && a[i].indexOf('h1') !== -1) {
                  a[i] = '<li first>' + a[i].replace(/<h1>|<\/h1>/g, '') + '</li>'
                }else if (a[i].indexOf('h2') !== -1) {
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

              let beforeScrollTop = document.documentElement.scrollTop;
              let fn = fn || function (direction) {
                console.log(direction)
                // 判断是上滑显示,下滑隐藏
                if(direction === 'down'){
                  $('#top').removeClass('animateIn')
                  $('#top').addClass('animateOut')
                }
                if(direction === 'up'){
                  $('#top').removeClass('animateOut')
                  $('#top').addClass('animateIn')
                }
              };

              $(window).on("scroll",function (event) {
                for (let i = 0; i < a.length; i++) {
                  if ($(window).scrollTop() > $('#' + a[i]).offset().top - 100 || $(this).scrollTop() + $(this).height() == $(document).height()) {
                    $('.j-titleList').find('li').eq(i).addClass('active').siblings('li').removeClass('active');
                    $('.j-bj').css('top', i * 44)
                  }
                }

                // 判断是上滑还是下滑
                var afterScrollTop = document.documentElement.scrollTop;
                let delta = afterScrollTop - beforeScrollTop;
                beforeScrollTop = afterScrollTop;
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();

                var progress = (afterScrollTop/scrollHeight) * 100
                // 改变top bar 进度条
                document.querySelector(".scrollbar").style.width = progress +'%'

                if (scrollTop + windowHeight > scrollHeight - 10) {  //滚动到底部执行事件
                  fn('bottom');
                  return;
                }
                if (afterScrollTop < 10 || afterScrollTop > $(document.body).height - 10) {
                  fn('up');
                } else {
                  if (Math.abs(delta) < 10) {
                    return false;
                  }
                  fn(delta > 0 ? "down" : "up");
                }
              })

              let $root = $('html, body');
              $('.j-titleList li').on("click", function () {
                console.log(typeof($(this).attr("first"))!=="undefined")
                let top = 70
                if (typeof($(this).attr("first"))!=="undefined") {
                  // 点击第一个目录
                  top = 100
                }
                $root.animate({
                  scrollTop: $($.attr(this.querySelector("a"), 'href')).offset().top - top
                }, 400)
                return false
              });
            }

            const _this = this
            setTimeout(function () {
              // 添加行数
              const clientWidth = document.documentElement.clientWidth;
              if(clientWidth > 425){
                addCodeBtn();
              }
              _this.isLoading = false
            },150)
          })
          // const doc = document.querySelector(".v-show-content");

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
  @import "src/styles/articles";
  /deep/ .el-backtop {
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(1px);
    background-color: rgba(255,255,255,0.5);
    color: #272936;
  }
</style>
