<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" v-if="isShow" />
    <div class="main-container" :style="{'margin-left': isShow ? '': '0'}">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar v-if="isShow"/>
      </div>
      <app-main />
    </div>
     <!--全局音乐播放 -->
    <audio-preview></audio-preview>
    <!-- 将上传组件全局注册 -->
    <global-uploader></global-uploader>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { getToken } from '@/utils/auth'
import AudioPreview from "@/components/preview/AudioPreview";
import globalUploader from '@/components/SimpleUploader/globalUploader.vue'

import {toConnection} from "@/websocket/sockJS";
import ws from '@/websocket/websocket_config';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    AudioPreview,
    globalUploader
  },
  data() {
    return {
      isShow: true
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    window.pc = !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    if(getToken()){
      this.isShow = window.pc;
      //与服务器建立websocket连接
      if(!ws.isConnected){
        toConnection(this.$store.state.user.name,this.$store.state.user.token);
      }
      if(this.$route.path.startsWith('/articles')){
        this.isShow = false
      }
    }else{
      this.isShow = false
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  >>> .sidebar-logo-container {
    background-color:unset;
  }
</style>
