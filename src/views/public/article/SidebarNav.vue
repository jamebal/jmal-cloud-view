<template>
  <div>
    <div id="toggle-nav">
      <el-button round @click="toggle">MENU</el-button>
    </div>
    <div id="sidebar-nav">
      <div class="author navbar-header">
        <a href="/articles">
          <img src="https://www.jmal.top/avatar.jpg" alt="Avatar" width="100" height="100">
        </a>
      </div>
      <ul id="menu-menu-1" class="menu navbar-nav">
        <li class="menu-item">
          <a href="/articles">首页</a>
        </li>
        <li class="menu-item">
          <a class="nav-link" href="https://www.jmal.top/archives.html" title="归档"><svg-icon icon-class="guidang"></svg-icon><span class="nav-link-label">归档</span></a>
        </li>
        <li class="menu-item">
          <a class="nav-link" href="https://www.jmal.top/archives.html" title="分类"><svg-icon icon-class="leimupinleifenleileibie"></svg-icon><span class="nav-link-label">分类</span></a>
        </li>
        <li class="menu-item">
          <a class="nav-link" href="https://www.jmal.top/archives.html" title="关于"><svg-icon icon-class="myself"></svg-icon><span class="nav-link-label">关于</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import '../../../assets/fontawesome-free-5.11.2-web/css/all.min.css'
import Icon from '@/components/Icon/Icon.vue'
export default {
  name: 'SidebarNav',
  components: {
    Icon
  },
  props: {
  },
  methods: {
    toggle() {
      let body = document.getElementById("body")
      let toggleNav = document.getElementById("toggle-nav")
      let sidebarNav = document.getElementById("sidebar-nav")
      if(body.style.transform.length > 0){
        body.style.transform = ''
        toggleNav.style.transform = ''
        sidebarNav.style.transform = ''
      } else {
        body.style.transform = 'translateX(20rem)'
        toggleNav.style.transform = 'translateX(17.5rem)'
        sidebarNav.style.transform = 'translateX(20rem)'
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/markdown";
</style>
