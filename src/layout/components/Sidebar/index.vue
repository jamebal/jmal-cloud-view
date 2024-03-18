<template>
  <div :class="{ 'has-logo': showLogo }">
    <div class="scrollbar-head">
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
          <sidebar-item
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </div>
    <div v-if="showTag && tagList.length > 0" class="scrollbar-tag" :class="{ collapse: isCollapse }">标签</div>
    <div class="scroll-decoration-top"></div>
    <el-scrollbar class="tag-list" wrap-class="scrollbar-wrapper">
      <div v-if="isCollapse">
        <ul class="infinite-list">
          <el-tooltip class="item"
            v-if="showTag"
            effect="dark"
            :content="tag.name"
            placement="right"
            v-for="tag in tagList"
            :key="tag.tagId">
            <li class="infinite-list-item collapse">
              <svg-icon :style="{ color: tag.color, fontSize: '14px' }" icon-class="tag2"></svg-icon>
            </li>
          </el-tooltip>
        </ul>
      </div>
      <div v-else>
        <ul class="infinite-list">
          <li v-for="tag in tagList"
              v-if="showTag"
            :key="tag.id"
            class="infinite-list-item"
            @click="tagClick(tag)">
            <svg-icon :style="{ color: tag.color, fontSize: '14px' }" icon-class="tag2"></svg-icon>
            <span>{{ tag.name }}</span>
          </li>
        </ul>
      </div>
    </el-scrollbar>
    <div class="scroll-decoration-bottom"></div>
    <div class="scrollbar-footer">
      <div class="quota-space">
        <el-progress
          v-show="percentage > 0"
          :class="{ collapse: isCollapse }"
          :percentage="percentage"
          :format="progressFormat"
          :color="customColors"
        ></el-progress>
      </div>
      <div class="webdav">
        <div
          :class="{ normal: true, collapse: isCollapse }"
          @mousemove="showCopyBtn = true"
          @mouseleave="showCopyBtn = false"
        >
          <svg-icon class="webdav-icon" icon-class="disk-drive"></svg-icon>
          <div class="wedav-text">WebDAV</div>
          <el-tooltip placement="right" v-if="showCopyBtn">
            <div slot="content">点击复制WebDAV地址<br />{{ webdavUrl }}</div>
            <svg-icon
              class="copy-btn"
              icon-class="menu-fuzhi"
              @click="copyWebDAVLink('.copy-btn')"
              :data-clipboard-text="webdavUrl"
            ></svg-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/assets/js/bus'
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import {formatSize} from "@/utils/number";
import fileConfig from "@/utils/file-config";
import Clipboard from "clipboard";
import tagApi from '@/api/tag'
import AppLink from './Link'

export default {
  components: { SidebarItem, Logo, AppLink },
  data() {
    return {
      percentage: 0,
      customColors: [
        {color: '#f56c6c', percentage: 150},
        {color: '#f56c6c', percentage: 100},
        {color: '#e6a23c', percentage: 80},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 40},
        {color: '#6f7ad3', percentage: 20}
      ],
      showCopyBtn: false,
      takeUpSpace: 0,
      tagList: [],
      showTag: false
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
    },
    $route(to) {
      console.log(to.meta.menuType)
      this.showTag = to.meta !== undefined && to.meta.menuType !== undefined && to.meta.menuType === 0;
    }
  },
  mounted() {
    this.getTagList()
    Bus.$on('msg/file/change', (msg) => this.onmessage(msg))
  },
  destroyed() {
    Bus.$off('msg/file/change')
  },
  methods: {
    getTagList() {
      if (this.$route.meta.menuType === 0) {
        this.showTag = true
      }
      tagApi.tagList({userId: this.$store.state.user.userId}).then(res => {
        this.tagList = res.data
      })
    },
    onmessage(msg) {
      const takeUpSpace = msg.space
      if (takeUpSpace) {
        this.takeUpSpace = takeUpSpace
        const space = takeUpSpace/1024/1024/1024
        const percentage = Number((space/this.userInfo.quota * 100).toFixed(1))
        this.percentage = percentage > 100 ? 100 : percentage
      }
    },
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
    tagClick(tag) {
      this.$router.push(`/tag?tagId=${tag.id}`);
    },
    mouseleave() {
    },
    onmousemove() {
    },
    progressFormat() {
      if (this.takeUpSpace === 0) {
        this.takeUpSpace = this.userInfo.takeUpSpace
      }
      const quota = this.userInfo.quota
      const space = this.takeUpSpace/1024/1024/1024
      if(space && quota > 0){
        const percentage = Number((space/quota * 100).toFixed(5))
        this.percentage = percentage > 100 ? 100 : percentage
        if(this.isCollapse){
          return `${formatSize(this.takeUpSpace)}`
        } else {
          return `${formatSize(this.takeUpSpace)}/${quota}GB`
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebar-container.has-logo {
  display: flex;
  flex-direction: column;
  height: 100%;
  .scrollbar-tag {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 14px;
    font-weight: 900;
    color: #a4a4a4;
  }
  .scrollbar-tag.collapse {
    padding-left: unset;
    text-align: center;
  }
  .tag-list {
    overflow-y: auto;
    flex: 1;
    .infinite-list {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .infinite-list-item {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
      margin: 0 8px 0 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .svg-icon {
        margin-right: 5px !important;
      }
      &:hover {
        background-color: #d9d9d9 !important;
        border-radius: 4px;
      }
    }
    .infinite-list-item.collapse {
      padding-left: unset;
      text-align: center;
      .svg-icon {
        margin-right: unset !important;
      }
    }
  }
  .scrollbar-footer {
    margin-top: 15px;
  }
}
.scrollbar-head {
  .el-scrollbar {
    padding-bottom: 15px;
  }
  >>> .submenu-title-noDropdown {
    padding-left: 15px !important;
    padding-right: 10px !important;
  }
  >>> .el-submenu__title {
    padding-left: 15px !important;
    padding-right: 10px !important;
    .el-submenu__icon-arrow {
      right: 15px;
    }
  }
  >>> .nest-menu {
    .el-menu-item {
      padding-left: 25px !important;
      padding-right: 20px !important;
      min-width: unset;
    }
  }
}
.quota-space {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  >>> .el-progress-bar {
    padding-right: 40px;
    margin-left: 20px;
  }
  >>> .el-progress__text {
    margin-left: 20px;
    font-size: 12px !important;
  }
  .collapse {
    >>> .el-progress-bar {
      padding-right: 4px;
      margin-left: 2px;
    }
    >>> .el-progress__text {
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
      margin-right: 0 !important;
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
