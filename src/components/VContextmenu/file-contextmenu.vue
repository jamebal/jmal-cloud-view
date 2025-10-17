<template>

  <v-contextmenu ref="contextShow" class="file-contextmenu" :class="className" @show="show" @hide="hide" @contextmenu="contextmenu">
    <div v-for="item of menus" :key="item.label">
      <!-- 一级菜单 -->
      <v-contextmenu-item v-if="!item.child" :divider="!!item.divider" @click="menusOperations(item.operation, $event)"
                          class="menuitem home-contextmenu">
        <svg-icon v-if="item.iconClass" :icon-class="item.iconClass"></svg-icon>
        <div class="home-contextmenu-title">
          <span class="menuitem text">{{ item.label }}</span>
          <span v-if="item.shortcut">
                <kbd v-for="key in item.shortcut" :style="{fontSize: key === '⌘' ? '14px' : '12px'}">{{ key }}</kbd>
              </span>
        </div>
      </v-contextmenu-item>
      <v-contextmenu-submenu class="home-contextmenu" v-else :icon-class="item.iconClass" :title="item.label">
        <!-- 二级菜单 -->
        <div v-for="itemSecond of item.child" :key="itemSecond.operation">
          <v-contextmenu-item
            v-if="!itemSecond.child"
            :divider="!!itemSecond.divider"
            @click="menusOperations(itemSecond.operation, $event)"
          >
            <svg-icon
              v-if="itemSecond.iconClass"
              :icon-class="itemSecond.iconClass"
            ></svg-icon>
            {{ itemSecond.label }}
          </v-contextmenu-item>
          <v-contextmenu-submenu
            v-if="itemSecond.child"
            :icon-class="itemSecond.iconClass"
            :title="itemSecond.label"
          >
          </v-contextmenu-submenu>
        </div>
      </v-contextmenu-submenu>
    </div>
  </v-contextmenu>

</template>

<script>
export default {
  name: 'file-contextmenu',
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  methods: {
    menusOperations() {
      this.$emit('menusOperations', ...arguments)
    },
    showMenu(e) {
      this.$refs.contextShow.show(e)
    },
    hideMenu(e) {
      this.$refs.contextShow.hide(e)
    },
    show() {
      this.$emit('show')
    },
    hide() {
      this.$emit('hide')
    },
    contextmenu() {
      this.$emit('contextmenu')
    }
  }
}

</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";
>>> .v-contextmenu.v-contextmenu-sub {
  border-radius: $dialogBorderRadius;
  padding: 8px;
}

.file-contextmenu.v-contextmenu {
  min-width: 180px;
  border-radius: $dialogBorderRadius;
  padding: 8px;
  background-color: var(--vcontextmenu-bg-color);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  backdrop-filter: blur(16px) saturate(180%);

  .v-contextmenu-divider {
    margin: 5px 0;
  }

  li {
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    min-width: 136px;
    line-height: 35px;
    &:hover {
      border-radius: 10px;
      background-color: var(--vcontextmenu-hover-bg-color);
      color: var(--text-color-hover);
    }
  }
  li > .text {
    font-weight: normal;
  }
  li > .svg-icon {
    font-size: 20px;
    cursor: pointer;
  }

  .v-contextmenu-item {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    >>> .svg-icon {
      margin-right: 10px;
      font-size: 20px;
    }
  }

  >>> .home-contextmenu-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

}
</style>
