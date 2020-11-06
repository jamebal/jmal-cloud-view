<template>
  <div class="navbar animated fadeIn fast delay-1s">
    <div class="container-fluid">
      <a class="navbar-brand text-brand" href="/articles">{{setting.siteName}}</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="https://www.jmal.top/archives.html" title="归档"><svg-icon icon-class="guidang"></svg-icon><span class="nav-link-label">归档</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://www.jmal.top/archives.html" title="分类"><svg-icon icon-class="leimupinleifenleileibie"></svg-icon><span class="nav-link-label">分类</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://www.jmal.top/archives.html" title="关于"><svg-icon icon-class="myself"></svg-icon><span class="nav-link-label">关于</span></a>
          </li>
        </ul>

        <ul class="navbar-nav side-toolbar-list">
          <li v-for="operatingButton in operatingButtons">
<!--            <a :href="operatingButton.url" :title="operatingButton.fontName" target="_blank"><i :class="'fab fa-'+operatingButton.fontName.toLowerCase()"></i></a>-->
            <a :href="operatingButton.url" :title="operatingButton.title" target="_blank">
              <dl v-html="operatingButton.fontHtml">
                {{operatingButton.fontHtml}}
              </dl>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import '../../../assets/fontawesome-free-5.11.2-web/css/all.min.css'
import Icon from '@/components/Icon/Icon.vue'
export default {
  name: 'ArticleTop',
  components: {
    Icon
  },
  props: {
    setting: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      operatingButtons: []
    }
  },
  watch: {
    setting(setting){
      if(setting.operatingButtons) {
        setting.operatingButtons.split(/[\n]/).forEach(button => {
          let operatingButton = {}
          const splitIndex = button.indexOf(":")
          operatingButton.fontHtml = button.substring(0, splitIndex)
          operatingButton.url = button.substring(splitIndex + 1, button.length)
          operatingButton.title = button.match(/fa-(\S*?)"/)[1]
          this.operatingButtons.push(operatingButton)
        })
      }
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
  @import "src/styles/index";
  @import "src/styles/markdown";
  @import "src/styles/articles";
  @import "src/styles/article";
</style>
