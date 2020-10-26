<template>
  <div class="articles" v-wechat-title="pageTitle">
    <transition name="fade">
      <al-loading v-if="isLoading"></al-loading>
    </transition>
    <al-back-top></al-back-top>
    <div id="top" style="display: block;" class="animateIn">
      <div class="navbar animated fadeIn fast delay-1s">
        <div class="container-fluid">
          <a class="navbar-brand text-brand" href="/articles">JMAL'S</a>
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
    <div class="cover-wrapper">
      <div class="cover half" style="position: relative; z-index: 0; background-image: none;">
        <div class="cover-body">
          <div class="a">
            <p class="title">jmal</p>
            <p class="subtitle">「清空你的杯子, 方能再行注满」</p>
          </div>
        </div>
        <div class="backstretch">
          <img class="blog-background" src="https://images.unsplash.com/photo-1603378991000-2dda90e8563a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3200&q=80"
          onerror="this.src='~@/assets/img/widget-img1.jpg'">
        </div>
      </div>
    </div>
    <div class="l_body">
      <div class="body-wrapper articles_l_main">
        <el-main class="l_main">
          <section class="post-list">
            <div v-for="article in articleList" class="post-wrapper">
              <article  class="post white-box shadow reveal">
                <section class="meta">
                  <div class="meta" id="header-meta">
                    <h2 class="title">
                      <a :href="$route.path+'/article?mark='+article.id">{{article.name}}</a>
                    </h2>
                    <div class="new-meta-box">
                      <div class="new-meta-item author">
                        <a href="http://www.jmal.top" rel="nofollow">
                          <img :src="imageUrl+article.avatar" :data-original="imageUrl+article.avatar">
                          <p>{{article.username}}</p>
                        </a>
                      </div>
                      <div class="new-meta-item date">
                        <a class="notlink">
                          <svg-icon icon-class="release"></svg-icon>
                          <p>发布于 {{article.uploadTime}}</p>
                        </a>
                      </div>
                    </div>
                    <hr>
                  </div>
                </section>
                <section class="article typo">
                  <a :href="$route.path+'/article?mark='+article.id">
                    <div class="article-entry" itemprop="articleBody">
                      <p><img class="blog-background articles-list" :src="article.cover" onerror="this.src='https://images.unsplash.com/photo-1582230587856-7fec01506148?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'"/></p>
                      <!--<div class="button readmore"><a :href="$route.path+'/article?mark='+article.id">阅读全文 <i class="fas fa-chevron-right"></i></a></div>-->
                    </div>
                  </a>
                </section>
              </article>
            </div>
          </section>
        </el-main>
      </div>
    </div>
    <footer class="clearfix">
      <br><br><br>
      <div class="copyright"><p><a href="http://blog.jmal.top">Copyright © 2020 journey magical AL</a></p></div>
    </footer>
  </div>
</template>

<script>
  import AlBackTop from "@/components/backtop/AlBackTop";
  import AlLoading from "@/components/loading/AlLoading";
  import markdownApi from '@/api/markdown-api'
  export default {
    components: { AlBackTop, AlLoading },
    data() {
      return {
        imageUrl: process.env.VUE_APP_BASE_API + '/public/s/view/thumbnail?id=',
        isLoading: true,
        pageTitle: "文章列表",
        articleList: [],
        backImageSrc: "~@/assets/img/widget-img1.jpg",
      }
    },
    mounted() {
      this.getMarkDown()

      const that = this
      window.onresize = function() {

      }
    },
    methods: {
      getCookie (name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
          return unescape(arr[2]);
        else
          return null;
      },
      onScroll() {
      },
      getMarkDown() {
        markdownApi.getMarkdown().then((res) => {
          this.articleList = res.data
          console.log(this.articleList)
          this.$nextTick(() => {
            this.isLoading = false
          })
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import "src/styles/index";
  @import "src/styles/markdown";
  @import "src/styles/articles";
  @import "src/styles/article";
  .l_side {
    width: 285px;
    float: right;
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  @media screen and (max-width: 1440px){
    .l_side {
      width: 240px;
    }
  }
  .widget.blogger {
    transition: all .28s ease;
    -moz-transition: all .28s ease;
    -webkit-transition: all .28s ease;
    -o-transition: all .28s ease;
  }
  .widget.desktop {
    display: block;
  }
  .widget {
    z-index: 0;
    background: #fff;
    margin-top: 16px;
    border-radius: 12px;
    width: 100%;
    display: none;
  }
  .articles {
    height: 100%;
    background: #f5f5f5;
  }
  .articles-list {
    max-height: 15rem;
  }
  .articles_l_main {
    max-width: 960px;
  }
</style>
