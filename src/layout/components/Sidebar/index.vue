<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <div class="quota-space">
      <el-progress :class="{'collapse': isCollapse}" :percentage="percentage" :format="progressFormat" :color="customColors"></el-progress>
    </div>
    <div class="webdav">
      <div :class="{'normal': true, 'collapse': isCollapse}" @mousemove="showCopyBtn = true" @mouseleave="showCopyBtn = false">
        <svg-icon class="webdav-icon" icon-class="disk-drive"></svg-icon>
        <div class="wedav-text">WebDAV   </div>
        <el-tooltip placement="right" v-if="showCopyBtn">
          <div slot="content">点击复制WebDAV地址<br/>{{webdavUrl}}</div>
          <svg-icon class="copy-btn" icon-class="menu-fuzhi" @click="copyWebDAVLink('.copy-btn')" :data-clipboard-text="webdavUrl"></svg-icon>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import {formatSize} from "@/utils/number";
import fileConfig from "@/utils/file-config";
import Clipboard from "clipboard";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      percentage: 0,
      customColors: [
        {color: '#f56c6c', percentage: 100},
        {color: '#e6a23c', percentage: 80},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 40},
        {color: '#6f7ad3', percentage: 20}
      ],
      showCopyBtn: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'userInfo'
    ]),
    webdavUrl() {
      return fileConfig.webDAVUrl(this.name)
    },
    routes() {
      let routes = []
      if(this.$route.meta.menuType === 0){
        this.$router.options.routes.forEach(route => {
          if(route.menuType === 0){
            routes.push(route)
          }
        })
      } else {
        this.$router.options.routes.forEach(route => {
          if(route.menuType === 2){
            routes.push(route)
          }
        })
      }
      return routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    isCollapse(val){
      this.progressFormat()
    }
  },
  methods: {
    copyWebDAVLink(className) {
      let clipboard = new Clipboard(className)
      clipboard.on('success', e => {
        this.$message({message: '复制成功', type: 'success', duration: 1000})
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({message: '该浏览器不支持自动复制', type: 'warning', duration: 1000})
        clipboard.destroy()
      })
    },
    mouseleave() {
      console.log('mouseleave')
    },
    onmousemove() {
      console.log('onmousemove')
    },
    progressFormat() {
      const space = this.userInfo.takeUpSpace/1024/1024/1024
      const quota = this.userInfo.quota
      if(space && quota > 0){
        this.percentage = Number((space/quota * 100).toFixed(1))
        if(this.isCollapse){
          return `${formatSize(this.userInfo.takeUpSpace)}`
        } else {
          return `${formatSize(this.userInfo.takeUpSpace)}/${quota}GB`
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.sidebar-container.has-logo {
  /deep/.el-scrollbar {
    height: calc(100% - 132px) !important;
  }
}
.quota-space {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  /deep/.el-progress-bar {
    padding-right: 40px;
    margin-left: 20px;
  }
  /deep/.el-progress__text {
    margin-left: 20px;
    font-size: 12px!important;
  }
  .collapse {
    /deep/.el-progress-bar {
      padding-right: 4px;
      margin-left: 2px;
    }
    /deep/.el-progress__text {
      margin-left: 5px;
      display: block;
    }
  }
}
.webdav {
  .normal {
    font-size: 1.5rem;
    height: 46px;
    display: flex;
    line-height: 46px;
    padding-left: 20px;
    .webdav-icon {
      margin-top: 12px;
      margin-right: 0!important;
    }
    .copy-btn {
      margin-top: 10px;
      margin-left: 50px;
    }
    .copy-btn:hover {
      cursor: pointer;
    }
    .wedav-text {
      font-size: 12px;
      margin-left: 20px;
    }
  }
  .normal:hover {
    cursor: pointer;
  }
  .collapse {
    padding-left: 15px;
    .wedav-text {
      display: none;
    }
    .copy-btn {
      display: none;
    }
  }
}
</style>
