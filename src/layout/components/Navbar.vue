<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />

    <div class="right-content">
      <app-link
       v-for="route in routes.topRouters"
       :key="route.path"
       :to="resolvePath(route.path)"
       v-if="!route.children[0].hidden"
      >
        <div class="right-content-button">
          <svg-icon :icon-class="route.children[0].meta.icon"></svg-icon>
          {{route.children[0].name}}
        </div>
      </app-link>
      <div class="right-username">{{showName}}</div>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar :src="avatar ? imageUrl + avatar : defaultAvatar" icon="el-icon-user-solid"></el-avatar>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <app-link
              v-for="route in routes.rightTopRoutes"
              :key="route.path"
              :to="resolvePath(route.path)"
            >
              <el-dropdown-item>
                <svg-icon :icon-class="route.children[0].meta.icon"></svg-icon>
                {{route.children[0].name}}
              </el-dropdown-item>
            </app-link>
            <el-dropdown-item divided @click.native="logout">
              <svg-icon icon-class="tuichudenglu"></svg-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Icon from '@/components/Icon/Icon.vue'
import AppLink from './Sidebar/Link'
import store from "@/store"
import {isExternal} from "@/utils/validate";
import path from "path";

export default {
  data() {
    return {
      isShow: true,
      activeIndex: '1',
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}&id=`,
      defaultAvatar: require('../../assets/img/default-avatar.png')
    }
  },
  components: {
    Icon,
    Breadcrumb,
    Hamburger,
    AppLink
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'showName'
    ]),
    routes() {
      let routes = {}
      let topRouters = []
      let rightTopRoutes = []
      this.$router.options.routes.forEach(route => {
        if(route.menuType === 3){
          topRouters.push(route)
        }
        if(route.menuType === 4){
          rightTopRoutes.push(route)
        }
      })
      routes.topRouters = topRouters
      routes.rightTopRoutes = rightTopRoutes
      return routes
    },
  },
  mounted() {
    this.isShow = this.$pc;
  },
  methods: {
    handleSelect(key, keyPath) {
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;

    .right-username {
      line-height: 50px;
      margin: 0 10px;
    }

  }

  .right-menu {
    float: right;
    height: 100%;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      cursor: pointer;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    &:hover {
      background-color: #00000006;
    }
  }
}
>>> .user-dropdown {
  top: 50px;
}
>>> .el-menu--horizontal {
  padding: 0 15px;
  .el-menu-item {
    height: 50px;
    line-height: 50px;
  }
  .el-submenu .el-submenu__title {
    height: 50px;
    line-height: 50px;
  }
}

.right-content-button {
  line-height: 50px;
  padding: 0 10px;
  &:hover {
    background-color: #00000006;
  }
}

.el-dropdown-menu__item {
  svg {
    margin-right: 5px;
  }
}
</style>
