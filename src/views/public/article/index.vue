<template>
  <div v-wechat-title="pageTitle">
    <transition name="fade">
      <al-loading v-if="isLoading"></al-loading>
    </transition>
    <al-back-top></al-back-top>

    <!--SideBar menu-->
    <SidebarNav  :setting="userSetting"/>

    <div id="body">
      <div id="top" class="animateIn">
        <ArticleTop :setting="userSetting"/>
        <div class="scrollbar gradient-bg-rev" style="width: 0;"></div>
      </div>
      <div class="article-header">
        <div class="article-background" :style="{backgroundImage: `url(${file.cover})`}"></div>
        <div class="inner">
          <div class="blog-title"><span id="article-title">{{pageTitle}}</span><span class="typed-cursor">_</span></div>
          <div class="blog-description font-mono">
            <a itemprop="name" href="https://www.jmal.top/author/1/" rel="author">{{file.username}}</a>
            · {{file.uploadDate}}
            <span v-if="isEditor">
              · <a :href="'/markdown/editor?id='+file.id" target="_blank">编辑</a>
            </span>
          </div>
        </div>
      </div>
      <div class="body-wrapper">
        <el-main id="main_body" :content="titleList.length > 0?'show':'hide'" class="l_main article_l_main">
          <div id="vditor" class="article-body"></div>
<!--          <mavon-editor-->
<!--            ref="md"-->
<!--            v-if="!showList"-->
<!--            v-model="content"-->
<!--            :subfield="false"-->
<!--            :boxShadow="true"-->
<!--            :toolbarsFlag="false"-->
<!--            codeStyle="atom-one-dark"-->
<!--            defaultOpen="preview"-->
<!--          />-->
        </el-main>
        <div v-show="titleList.length > 0" class="right-bj">
          <a-affix>
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
  </div>
</template>

<script>
import AlLoading from "@/components/loading/AlLoading";
import AlBackTop from "@/components/backtop/AlBackTop";
import markdownApi from '@/api/markdown-api'
import $ from 'jquery'
import ArticleTop from "@/views/public/article/ArticleTop";
import {getSetting} from '@/api/user'
import SidebarNav from "@/views/public/article/SidebarNav";

import VditorPreview from 'vditor/dist/method.min'
import "vditor/src/assets/scss/index.scss"

export default {
    components: {SidebarNav, ArticleTop, AlBackTop, AlLoading },
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
        userSetting: {},
        titleList: [],
        tocMaxHeight: 500,
        befterScrollTop: 0,
        maxMenuHeight: document.documentElement.clientHeight - 155,
        top: 70,
        isEditor : false,
        contentEditor: '',
      }
    },
    mounted() {
      this.getSetting()
      if(this.$route.query.mark){
        this.getMarkDown()
        this.showList = false
      }
      let that = this
      window.onresize = function temp() {
        that.maxMenuHeight= document.documentElement.clientHeight - 155
      }
    },
    // beforeRouteLeave(to, from, next) {
    //   to.meta.keepAlive = true;
    //   next();
    // },
    activated() {
      console.log('activated', 'article')
    },
    deactivated() {
      console.log('deactivated')
      // this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    },
    methods: {
      getSetting() {
        getSetting({userId: this.$store.state.user.userId}).then((res) => {
          this.userSetting = res.data;
          this.$nextTick(()=>{
            this.dynamicTyping()
          })
        })
      },
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
          if(this.file.userId === this.$store.state.user.userId) {
            this.isEditor = true
          }
          const filename = res.data.name
          this.pageTitle = filename.substring(0,filename.length - res.data.suffix.length-1)
          this.content = res.data.contentText

          const that = this
          VditorPreview.preview(document.getElementById('vditor'),
            this.content,{
              speech: {
                enable: true,
              },
              anchor: 1,
              after() {
                that.renderAfter()
              }
            })

          this.$nextTick(()=>{  // DOM更新之后获取子元素
            // // 在文章最前面添加更新时间
            // let main = document.getElementById('vditor')
            // let p = document.createElement("p")
            // p.className = "note-update-date"
            // p.innerText = `本文最后更新于：${this.file.updateDate}`
            // main.insertBefore(p , main.childNodes[0])

            // 动态打字效果
            this.dynamicTyping()

            const hTag = document.querySelector("h1");
            if(hTag){
              this.pageTitle = hTag.innerText
            }
          })
          this.isLoading = false
        })
      },
      renderAfter(){
        let headers = $('.article-body').find(":header")
        let a = []
        if(headers && headers.length >0 ){
          const that = this
          headers.each(function () {
            const tagName = $(this).prop("tagName")
            if(tagName === 'H3'){
              let li = '<li class="pl h-3"><a href="#'+$(this).attr('id')+'">'+$(this).text()+'</a></li>'
              a.push(li)
              that.titleList.push(li)
            }
          })

          // for (let i = 0; i < a.length; i++) {
          //   // a[i] = a[i].replace(/id="/g, 'href="#')
          //   if (i ===0 && a[i].indexOf('h1') !== -1) {
          //     a[i] = '<li first class="h-1">' + a[i].replace(/<h1>|<\/h1>/g, '') + '</li>'
          //   }else if (a[i].indexOf('h1') !== -1) {
          //     a[i] = '<li first class="pl h-1">' + a[i].replace(/<h1>|<\/h1>/g, '') + '</li>'
          //   }else if (a[i].indexOf('h2') !== -1) {
          //     a[i] = '<li class="pl h-2">' + a[i].replace(/<h2>|<\/h2>/g, '') + '</li>'
          //   }else if (a[i].indexOf('h3') !== -1) {
          //     a[i] = '<li class="pl h-3">' + a[i].replace(/<h3>|<\/h3>/g, '') + '</li>'
          //   }else if (a[i].indexOf('h4') !== -1) {
          //     a[i] = '<li class="pl h-4">' + a[i].replace(/<h4>|<\/h4>/g, '') + '</li>'
          //   }else if (a[i].indexOf('h5') !== -1) {
          //     a[i] = '<li class="pl h-5">' + a[i].replace(/<h5>|<\/h5>/g, '') + '</li>'
          //   }else if (a[i].indexOf('h6') !== -1) {
          //     a[i] = '<li class="pl h-6">' + a[i].replace(/<h6>|<\/h6>/g, '') + '</li>'
          //   } else {
          //     a[i] = '<li>' + a[i].replace(/<h1>|<\/h1>/g, '') + '</li>'
          //   }
          //   this.titleList.push(i)
          // }
          $('.j-titleList').prepend(this.titleList)

          // 获取id数组
          for (let i = 0; i < a.length; i++) {
            a[i] = a[i].replace(/.*?#(.*)".*/g, '$1')
          }

          let beforeScrollTop = document.documentElement.scrollTop;
          let fn = fn || function (direction) {
            // 判断是上滑显示,下滑隐藏
            const top = $('#top')
            const toogleNav = $('#toggle-nav')

            const body = document.getElementById("body")

            if(direction === 'down'){
              top.removeClass('animateIn')
              top.addClass('animateOut')
              toogleNav.removeClass('animateRight')
              toogleNav.addClass('animateLeft')
              if(body.style.transform.length > 0) {
                document.getElementById("sidebar-nav").style.transform = ''
                body.style.transform = ''
                document.getElementById("toggle-nav").style.transform = ''
              }
            }
            if(direction === 'up'){
              top.removeClass('animateOut')
              top.addClass('animateIn')
              toogleNav.removeClass('animateLeft')
              toogleNav.addClass('animateRight')
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
      },
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
