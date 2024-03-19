<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <Logo v-model="netdiskLogo" width="50" padding="8"></Logo>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link logo-expand"
        to="/"
      >
        <Logo v-model="netdiskLogo" width="50" padding="8"></Logo>
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import Bus from "@/assets/js/bus";
import Logo from "@/components/Logo";
import { mapState } from "vuex";

export default {
  name: 'SidebarLogo',
  components: {Logo},
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(['message']),
    title() {
      if (this.$store.state.user.netdiskName) {
        return this.$store.state.user.netdiskName
      }
      return 'JmalCloud'
    },
    netdiskLogo() {
      if (this.$store.state.user.netdiskLogo) {
        return this.$store.state.user.netdiskLogo
      }
      return ''
    }
  },
  watch: {
    message(msg) {
      if (msg.event === 'updateLogo') {
        this.netdiskLogo = this.$store.state.user.netdiskLogo
      }
    }
  },
  mounted() {
  },
  data() {
    return {
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
      margin-right: 2px !important;
    }

    & .sidebar-logo-expand {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px !important;
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
      margin-right: 0;
    }
  }

  .logo-expand {
    display: inline-flex !important;
    width: auto !important;
  }
}
</style>
