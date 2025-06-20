<template>
  <li
    :class="classname"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <svg-icon v-if="iconClass" :icon-class="iconClass"></svg-icon>
<!--    <div class="v-contextmenu-submenu__title home-contextmenu">-->
<!--      <svg-icon v-if="iconClass" :icon-class="iconClass"></svg-icon>-->
<!--      <div class="home-contextmenu-title">-->
<!--        <span  class="menuitem text">{{ title }}</span>-->
<!--      </div>-->
<!--      <span class="v-contextmenu-iconfont v-contextmenu-submenu__icon" />-->
<!--    </div>-->

    <div class="v-contextmenu-submenu__title home-contextmenu-title">
      <span  class="menuitem text">{{ title }}</span>
      <span class="v-contextmenu-iconfont v-contextmenu-submenu__icon" />
    </div>

    <ul
      v-show="hover"
      ref="submenu"
      :class="submenuCls"
    >
      <slot />
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'VContextmenuSubmenu',

    props: {
      title: String,
      disabled: Boolean,
      iconClass: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        hover: false,
        submenuPlacement: [],
      }
    },
    computed: {
      classname () {
        return {
          'v-contextmenu-item': true,
          'v-contextmenu-submenu': true,
          'v-contextmenu-item--hover': this.hover,
          'v-contextmenu-item--disabled': this.disabled,
        }
      },
      submenuCls () {
        return [
          'v-contextmenu',
          'v-contextmenu-sub',
          ...this.submenuPlacement,
        ]
      },
    },

    methods: {
      handleMouseenter (event) {
        if (this.disabled) return

        const { target } = event
        const targetDimension = target.getBoundingClientRect()

        this.hover = true

        this.$emit('mouseenter', this, event)

        this.$nextTick(() => {
          const submenuWidth = this.$refs.submenu.clientWidth
          const submenuHeight = this.$refs.submenu.clientHeight
          const submenuPlacement = []

          if (targetDimension.right + submenuWidth >= window.innerWidth) {
            submenuPlacement.push('left')
          } else {
            submenuPlacement.push('right')
          }

          if (targetDimension.bottom + submenuHeight >= window.innerHeight) {
            submenuPlacement.push('bottom')
          } else {
            submenuPlacement.push('top')
          }

          this.submenuPlacement = submenuPlacement
        })
      },
      handleMouseleave (event) {
        if (this.disabled) return

        this.hover = false

        this.$emit('mouseleave', this, event)
      },
    },
  }
</script>
<style lang="scss" scoped>
</style>
