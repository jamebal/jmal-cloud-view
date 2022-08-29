<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!--<img v-if="logo" :src="logo" class="sidebar-logo">-->
<!--        <svg-icon class="sidebar-logo" icon-class="jmal-cloud"></svg-icon>-->
        <Logo v-model="netdiskLogo" width="25"></Logo>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!--<img v-if="logo" :src="logo" class="sidebar-logo">-->
<!--        <svg-icon class="sidebar-logo-expand" icon-class="jmal-cloud"></svg-icon>-->
        <Logo v-model="netdiskLogo" width="25" class="sidebar-logo-expand"></Logo>
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import Bus from "@/assets/js/bus";
import Logo from "@/components/Logo";

export default {
  name: 'SidebarLogo',
  components: {Logo},
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    Bus.$on('updateLogo', () => {
      console.log('updateLogo', this.$store.state.user.netdiskLogo)
      this.netdiskLogo = this.$store.state.user.netdiskLogo
    })
  },
  data() {
    return {
      title: 'jmalcloud',
      netdiskLogo: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 2px!important;
    }

    & .sidebar-logo-expand {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px!important;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
