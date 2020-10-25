<template>
  <div v-wechat-title="pageTitle">
    <transition name="fade">
      <al-loading v-if="isLoading"></al-loading>
    </transition>
    <al-back-top></al-back-top>

    <div id="top" style="display: block;" class="animateIn">
      <div class="navbar animated fadeIn fast delay-1s">
        <div class="container-fluid">
          <a class="navbar-brand text-brand">JMAL'S</a>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item dropdown"></li>
              <li class="nav-item">
                <a class="nav-link" href="https://www.jmal.top/archives.html" title="归档">归档</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="https://www.jmal.top/archives.html" title="归档">归档</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="https://www.jmal.top/archives.html" title="归档">归档</a>
              </li>
            </ul>

            <ul class="navbar-nav side-toolbar-list">
              <li class="nav-item">
                <a id="nav-side-toolbar-github" href="https://github.com/jamebal" title="Github" target="_blank">fff<i class="fa fa-github"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="scrollbar gradient-bg-rev" style="width: 0;"></div>
    </div>
    <div class="article-header">
      <div class="article-background" :style="{backgroundImage: `url(${file.cover})`}"></div>
      <div class="inner">
        <div class="blog-title"><span id="article-title">{{pageTitle}}</span><span class="typed-cursor">_</span></div>
        <div class="blog-description font-mono">
          <a itemprop="name" href="https://www.jmal.top/author/1/" rel="author">{{file.username}}</a>
          · {{file.uploadDate}}
        </div>
      </div>
    </div>
    <div class="body-wrapper">
          <el-main id="main_body" class="l_main">
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
            <a-affix class="sdf">
              <div class="slimScrollDiv">
                <div class="right-menu" :style="{maxHeight:maxMenuHeight+'px'}">
                  <div class="toc-content">
                    <header class="toc-header"><svg-icon icon-class="contents"></svg-icon><span>目录</span></header>
                  </div>
                  <div class="j-titleList titleList">
                    <div class="j-bj" style="height: 30px; top: 0;"></div>
                  </div>
                </div>
              </div>
            </a-affix>
          </div>
    </div>
    <footer class="clearfix">
      <div class="copyright"><p><a href="/articles">Copyright © 2020 jmal</a></p></div>
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
        file: {},
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
        maxMenuHeight: document.documentElement.clientHeight - 155,
        top: 70
      }
    },
    mounted() {
      if(this.$route.query.mark){
        this.getMarkDown()
        this.showList = false
      }
      let that = this
      window.onresize = function temp() {
        that.maxMenuHeight= document.documentElement.clientHeight - 155
      }
    },
    methods: {
      onScroll() {
        // let befterScrollTop = document.documentElement.scrollTop;
      },
      dynamicTyping() {
        let divTyping = document.getElementById('article-title')
        let i = 0,timer = 0,str = this.pageTitle
        function typing () {
          if (i <= str.length) {
            divTyping.innerHTML = str.slice(0, i++)
            timer = setTimeout(typing, 100)
          } else {
            // 结束打字
            clearTimeout(timer)
          }
        }
        typing()
      },
      getMarkDown() {
        markdownApi.getMarkdown({
          mark: this.$route.query.mark
        }).then((res) => {
          this.file = res.data
          const filename = res.data.name
          this.pageTitle = filename.substring(0,filename.length - res.data.suffix.length-1)
          this.content = res.data.contentText
          this.$nextTick(()=>{  // DOM更新之后获取子元素

            let main = document.querySelector('.v-show-content.scroll-style.scroll-style-border-radius')
            let p = document.createElement("p")
            // let p = "<p class=\"note note-info\">\n" +
            //   "                \n" +
            //   "                  本文最后更新于：2020年9月16日 上午\n" +
            //   "                \n" +
            //   "              </p>"
            p.className = "note-update-date"
            p.innerText = `本文最后更新于：${this.file.updateDate}`
            // main.insertAdjacentHTML('beforebegin', '<b>复制代码</b>');
            // main.childNodes[0].insertAdjacentHTML('beforebegin', '<p class="note note-info"></p>')
            main.insertBefore(p , main.childNodes[0])

            // 动态打字效果
            this.dynamicTyping()

            const hTag = document.querySelector("h1");
            if(hTag){
              this.pageTitle = hTag.innerText
            }

            let a = $('.el-main').html().match(/<h1.*?<\/h1>|<h2.*?<\/h2>|<h3.*?<\/h3>|<h4.*?<\/h4>|<h5.*?<\/h5>|<h6.*?<\/h6>/g);
            if(a && a.length >0 ){
              a = a.splice(a.length/2,a.length)
              for (let i = 0; i < a.length; i++) {
                a[i] = a[i].replace(/id="/g, 'href="#')
                if (i ===0 && a[i].indexOf('h1') !== -1) {
                  a[i] = '<li first class="h-1">' + a[i].replace(/<h1>|<\/h1>/g, '') + '</li>'
                }else if (a[i].indexOf('h2') !== -1) {
                  a[i] = '<li class="pl h-2">' + a[i].replace(/<h2>|<\/h2>/g, '') + '</li>'
                }else if (a[i].indexOf('h3') !== -1) {
                  a[i] = '<li class="pl h-3">' + a[i].replace(/<h3>|<\/h3>/g, '') + '</li>'
                }else if (a[i].indexOf('h4') !== -1) {
                  a[i] = '<li class="pl h-4">' + a[i].replace(/<h4>|<\/h4>/g, '') + '</li>'
                }else if (a[i].indexOf('h5') !== -1) {
                  a[i] = '<li class="pl h-5">' + a[i].replace(/<h5>|<\/h5>/g, '') + '</li>'
                }else if (a[i].indexOf('h6') !== -1) {
                  a[i] = '<li class="pl h-6">' + a[i].replace(/<h6>|<\/h6>/g, '') + '</li>'
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
                    $('.j-bj').css('top', i * 34)
                  }
                }

                // 判断是上滑还是下滑
                var afterScrollTop = document.documentElement.scrollTop;
                let delta = afterScrollTop - beforeScrollTop;
                beforeScrollTop = afterScrollTop;
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                var progress = ((afterScrollTop + document.body.clientHeight)/scrollHeight) * 100
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
  @import "src/styles/index";
  @import "src/styles/markdown";
  @import "src/styles/articles";
  @import "src/styles/article";
</style>
