<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />

    <div class="right-content">
      <div class="right-content-button">
        <router-link target="_blank" to="/articles">
          <svg-icon icon-class="WEBSITE"></svg-icon>网站
      </router-link></div>
      <div class="right-username">{{username}}</div>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar :src="imageUrl+avatar" icon="el-icon-user-solid"></el-avatar>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/setting/user">
              <el-dropdown-item>
                <svg-icon icon-class="shezhi"></svg-icon>基本设置
              </el-dropdown-item>
            </router-link>
            <router-link to="/setting/website/manager-blog">
              <el-dropdown-item>
                <svg-icon icon-class="wangzhan"></svg-icon>网站管理
              </el-dropdown-item>
            </router-link>
            <!--<router-link to="/">-->
            <!--<el-dropdown-item>-->
            <!--首页-->
            <!--</el-dropdown-item>-->
            <!--</router-link>-->
            <!--<a target="_blank" href="https://github.com/jamebal/jmal-cloud-view/">-->
            <!--<el-dropdown-item>Github</el-dropdown-item>-->
            <!--</a>-->
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

export default {
  data() {
    return {
      activeIndex: '1',
      imageUrl: process.env.VUE_APP_BASE_API + '/view/thumbnail?jmal-token=' + this.$store.state.user.token + '&id=',
      username: this.$store.state.user.name,
    }
  },
  components: {
    Icon,
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
      margin-right: 10px;
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
    .avatar-container:hover {
      background-color: #00000006;
    }
  }
}
/deep/ .user-dropdown {
  top: 50px;
}
/deep/ .el-menu--horizontal {
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
  margin-right: 10px;
  padding: 0 10px;
  &:hover {
    background-color: #00000006;
  }
  svg {
    margin-right: 5px;
  }
}

.el-dropdown-menu__item {
  svg {
    margin-right: 5px;
  }
}
</style>
