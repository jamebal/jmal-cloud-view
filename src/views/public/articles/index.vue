<template>
  <div class="articles" v-wechat-title="pageTitle">
    <transition name="fade">
      <al-loading v-if="isLoading"></al-loading>
    </transition>
    <al-back-top></al-back-top>
    <div class="cover-wrapper">
      <div class="cover half" style="position: relative; z-index: 0; background-image: none;">
        <div class="cover-body">
          <div class="a">
            <p class="title">jmal</p>
            <p class="subtitle">「清空你的杯子, 方能再行注满」</p>
          </div>
          <div class="b">
            <div class="m_search">
              <form name="searchform" class="form u-search-form">
                <input type="text" class="input u-search-input" placeholder=""> <i class="icon fas fa-search fa-fw"> <svg-icon icon-class="search" /></i>
              </form>
            </div>
          </div>
        </div>
        <div class="backstretch">
          <img src="~@/assets/img/widget-img1.jpg">
          <!--<el-image  :src="backImageSrc">-->
          <!--</el-image>-->
        </div>
      </div>
    </div>
    <div class="l_body">
      <div class="body-wrapper">
        <el-main class="l_main">
          <section class="post-list">
            <div v-for="article in articleList" class="post-wrapper">
              <article  class="post white-box shadow reveal">
                <section class="meta">
                  <div class="meta" id="header-meta">
                    <h2 class="title">
                      <a :href="$route.path+'/article?mark='+article.id" @click="clearCooike">{{article.name}}</a>
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
                      <p><img class="blog-background" :src="article.cover" onerror="this.src='https://images.unsplash.com/photo-1582230587856-7fec01506148?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'"/></p>
                      <!--<div class="button readmore"><a :href="$route.path+'/article?mark='+article.id">阅读全文 <i class="fas fa-chevron-right"></i></a></div>-->
                    </div>
                  </a>
                </section>
              </article>
            </div>
          </section>

        </el-main>

        <aside class="l_side">
          <section class="widget blogger shadow desktop">
            <div class="content">
              <div class="avatar">
                <img class="avatar" src="~@/assets/img/widget-img.jpeg">
              </div>
              <div class="social-wrapper">
                <a href="" class="social fas fa-rss flat-btn waves-effect waves-button" target="_blank" rel="external nofollow noopener noreferrer">
                  <svg-icon icon-class="widget-subscription"></svg-icon>
                </a>
                <a href="mailto:zhushilun084@163.com" class="social fas fa-envelope flat-btn waves-effect waves-button" target="_blank" rel="external nofollow noopener noreferrer">
                  <svg-icon icon-class="widget-email"></svg-icon>
                </a>
                <a href="https://github.com/jamebal" class="social fab fa-github flat-btn waves-effect waves-button" target="_blank" rel="external nofollow noopener noreferrer">
                  <svg-icon icon-class="widget-github"></svg-icon>
                </a>
                <a href="https://music.163.com/#/user/home?id=60353124" class="social fas fa-headphones-alt flat-btn waves-effect waves-button" target="_blank" rel="external nofollow noopener noreferrer">
                  <svg-icon icon-class="widget-music"></svg-icon>
                </a>
              </div>
            </div>
          </section>
          <!--<section class="widget category shadow desktop">-->
          <!--<header>-->
          <!--<a href="/blog/categories/">-->
          <!--<i class="fas fa-folder-open fa-fw" aria-hidden="true"></i>-->
          <!--<span class="name">文章分类</span>-->
          <!--</a>-->
          <!--</header>-->
          <!--<div class="content">-->
          <!--<ul class="entry navigation">-->
          <!--<li>-->
          <!--<a class="flat-box waves-effect waves-block" title="/blog/categories/dev/" href="/blog/categories/dev/" id="blogcategoriesdev">-->
          <!--<div class="name">Dev</div>-->
          <!--<div class="badge">(34)</div>-->
          <!--</a>-->
          <!--</li>-->
          <!--<li>-->
          <!--<a class="flat-box child waves-effect waves-block" title="/blog/categories/dev/cocoa/" href="/blog/categories/dev/cocoa/" id="blogcategoriesdevcocoa">-->
          <!--<div class="name">Cocoa</div>-->
          <!--<div class="badge">(30)</div>-->
          <!--</a>-->
          <!--</li>-->
          <!--<li>-->
          <!--<a class="flat-box child waves-effect waves-block" title="/blog/categories/dev/git/" href="/blog/categories/dev/git/" id="blogcategoriesdevgit">-->
          <!--<div class="name">Git</div>-->
          <!--<div class="badge">(2)</div>-->
          <!--</a>-->
          <!--</li>-->
          <!--<li>-->
          <!--<a class="flat-box child waves-effect waves-block" title="/blog/categories/dev/hexo/" href="/blog/categories/dev/hexo/" id="blogcategoriesdevhexo">-->
          <!--<div class="name">Hexo</div>-->
          <!--<div class="badge">(1)</div>-->
          <!--</a>-->
          <!--</li>-->
          <!--<li>-->
          <!--<a class="flat-box child waves-effect waves-block" title="/blog/categories/dev/windows/" href="/blog/categories/dev/windows/" id="blogcategoriesdevwindows">-->
          <!--<div class="name">Windows</div>-->
          <!--<div class="badge">(1)</div>-->
          <!--</a>-->
          <!--</li>-->
          <!--<li>-->
          <!--<a class="flat-box waves-effect waves-block" title="/blog/categories/essay/" href="/blog/categories/essay/" id="blogcategoriesessay">-->
          <!--<div class="name">Essay</div>-->
          <!--<div class="badge">(2)</div>-->
          <!--</a>-->
          <!--</li>-->
          <!--</ul>-->
          <!--</div>-->
          <!--</section>-->
          <!--<section class="widget tagcloud shadow desktop">-->
          <!--<header>-->
          <!--<a href="/blog/tags/">-->
          <!--<i class="fas fa-tags fa-fw" aria-hidden="true"></i>-->
          <!--<span class="name">热门标签</span>-->
          <!--</a>-->
          <!--</header>-->
          <!--<div class="content">-->
          <!--<a href="/blog/tags/alamofire/" style="font-size:14px;color:#999">Alamofire</a>-->
          <!--<a href="/blog/tags/ble/" style="font-size:14px;color:#999">BLE</a>-->
          <!--<a href="/blog/tags/cocoapods/" style="font-size:15.67px;color:#8e8e8e">CocoaPods</a>-->
          <!--<a href="/blog/tags/framework/" style="font-size:14px;color:#999">Framework</a>-->
          <!--<a href="/blog/tags/gcd/" style="font-size:14px;color:#999">GCD</a>-->
          <!--<a href="/blog/tags/git/" style="font-size:17.33px;color:#828282">Git</a>-->
          <!--<a href="/blog/tags/hexo/" style="font-size:14px;color:#999">Hexo</a>-->
          <!--<a href="/blog/tags/objc/" style="font-size:19px;color:#777">ObjC</a>-->
          <!--<a href="/blog/tags/reactivecocoa/" style="font-size:14px;color:#999">ReactiveCocoa</a>-->
          <!--<a href="/blog/tags/runtime/" style="font-size:15.67px;color:#8e8e8e">Runtime</a>-->
          <!--<a href="/blog/tags/socket/" style="font-size:14px;color:#999">Socket</a>-->
          <!--<a href="/blog/tags/swift/" style="font-size:20.67px;color:#6c6c6c">Swift</a>-->
          <!--<a href="/blog/tags/ios/" style="font-size:24px;color:#555">iOS</a>-->
          <!--<a href="/blog/tags/%E5%93%8D%E5%BA%94%E5%BC%8F%E7%BC%96%E7%A8%8B/" style="font-size:14px;color:#999">响应式编程</a>-->
          <!--<a href="/blog/tags/%E5%BC%80%E6%BA%90%E5%BA%93/" style="font-size:22.33px;color:#606060">开源库</a>-->
          <!--<a href="/blog/tags/%E6%9E%B6%E6%9E%84/" style="font-size:14px;color:#999">架构</a>-->
          <!--<a href="/blog/tags/%E6%B2%99%E7%9B%92/" style="font-size:14px;color:#999">沙盒</a>-->
          <!--<a href="/blog/tags/%E7%BC%93%E5%AD%98/" style="font-size:14px;color:#999">缓存</a>-->
          <!--<a href="/blog/tags/%E8%A7%A3%E8%80%A6/" style="font-size:14px;color:#999">解耦</a>-->
          <!--<a href="/blog/tags/%E9%9D%99%E6%80%81%E5%BA%93/" style="font-size:14px;color:#999">静态库</a>-->
          <!--</div>-->
          <!--</section>-->
          <!--<section class="widget text shadow desktop">-->
          <!--<header>-->
          <!--<a href="https://github.com/xaoxuu/" target="_blank" rel="external nofollow noopener noreferrer">-->
          <!--<i class="fab fa-widget-github.svg fa-fw" aria-hidden="true"></i>-->
          <!--<span class="name">近期项目</span>-->
          <!--</a>-->
          <!--</header>-->
          <!--<div class="content">-->
          <!--<p>这些是近期更新的 iOS 开源库，如果喜欢请点个赞支持一下。</p>-->
          <!--<p>-->
          <!--<a href="https://github.com/xaoxuu/ProHUD" target="_blank" rel="external nofollow noopener noreferrer">-->
          <!--<img src="https://cdn.jsdelivr.net/gh/xaoxuu/cdn-assets/proj/prohud/logo.png" data-original="https://cdn.jsdelivr.net/gh/xaoxuu/cdn-assets/proj/prohud/logo.png" height="50px">-->
          <!--</a>-->
          <!--</p>-->
          <!--<p><a href="https://github.com/xaoxuu/ValueX" target="_blank" rel="external nofollow noopener noreferrer"><img src="https://cdn.jsdelivr.net/gh/xaoxuu/cdn-assets/proj/valuex/logo.png" data-original="https://cdn.jsdelivr.net/gh/xaoxuu/cdn-assets/proj/valuex/logo.png" height="50px"></a></p>-->
          <!--<p><a href="https://github.com/xaoxuu/Inspire" target="_blank" rel="external nofollow noopener noreferrer"><img src="https://cdn.jsdelivr.net/gh/xaoxuu/cdn-assets/proj/inspire/logo.png" data-original="https://cdn.jsdelivr.net/gh/xaoxuu/cdn-assets/proj/inspire/logo.png" height="50px"></a></p>-->
          <!--</div>-->
          <!--</section>-->
        </aside>


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
      clearCooike() {
        // let name = "scrollTop"
        // var exp = new Date();
        // exp.setTime(exp.getTime() - 1);
        // var cval=getCookie(name);
        // if(cval!=null){
        //   document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        // }
        document.cookie = "scrollTop=" + scrollPos
        alert(document.cookie)
      },
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

  .blog-background {
    object-fit: cover;
    width: 100%;
    height: 100%;
    max-height: 15em;
}
</style>
