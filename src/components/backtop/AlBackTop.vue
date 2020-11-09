<template>
  <transition name="el-fade-in">
    <div
      v-if="visible"
      @click.stop="handleClick"
      :style="{
        'right': styleRight,
        'bottom': styleBottom
      }"
      class="el-backtop">
      <slot>
        <el-icon name="caret-top"></el-icon>
      </slot>
    </div>
  </transition>
</template>

<script>
  import throttle from 'throttle-debounce/throttle';

  const cubic = value => Math.pow(value, 3);
  const easeInOutCubic = value => value < 0.5
    ? cubic(value * 2) / 2
    : 1 - cubic((1 - value) * 2) / 2;

  export default {
    name: 'AlBackTop',

    props: {
      visibilityHeight: {
        type: Number,
        default: 200
      },
      target: [String],
      right: {
        type: Number,
        default: 40
      },
      bottom: {
        type: Number,
        default: 40
      }
    },

    data() {
      return {
        el: null,
        container: null,
        visible: false
      };
    },

    computed: {
      styleBottom() {
        return `${this.bottom}px`;
      },
      styleRight() {
        return `${this.right}px`;
      }
    },

    mounted() {
      this.init();
      this.throttledScrollHandler = throttle(300, this.onScroll);
      this.container.addEventListener('scroll', this.throttledScrollHandler);

      // window.onbeforeunload = function () {
      //   let scrollPos;
      //   if (typeof window.pageYOffset != 'undefined') {
      //     scrollPos = window.pageYOffset;
      //   }
      //   else if (typeof document.compatMode != 'undefined' && document.compatMode !== 'BackCompat') {
      //     scrollPos = document.documentElement.scrollTop;
      //   }
      //   else if (typeof document.body != 'undefined') {
      //     scrollPos = document.body.scrollTop;
      //   }
      //   document.cookie = "scrollTop=" + scrollPos; //存储滚动条位置到cookies中
      // }

    },

    methods: {
      init() {
        this.container = document;
        this.el = document.documentElement;
        if (this.target) {
          this.el = document.querySelector(this.target);
          if (!this.el) {
            throw new Error(`target is not existed: ${this.target}`);
          }
          this.container = this.el;
        }
      },
      getScroll(el){
        return window.pageYOffset || el.scrollTop || document.body.scrollTop || 0
      },
      onScroll() {
        const scrollTop = this.getScroll(this.el);
        this.visible = scrollTop >= this.visibilityHeight;
      },
      handleClick(e) {
        this.scrollToTop();
        this.$emit('click', e);
      },
      nextPageScrollTop() {
        this.el.scrollTop = document.body.clientHeight * 0.7 - 150
      },
      scrollToTop() {
        const el = this.el;
        const beginTime = Date.now();
        const beginValue = this.getScroll(el);
        const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));
        const frameFunc = () => {
          const progress = (Date.now() - beginTime) / 500;
          if (progress < 1) {
            if(el.scrollTop !== 0){
              el.scrollTop = beginValue * (1 - easeInOutCubic(progress));
            }else if(window.pageYOffset !== 0){
              window.pageYOffset = beginValue * (1 - easeInOutCubic(progress));
            }else{
              document.body.scrollTop = beginValue * (1 - easeInOutCubic(progress));
            }
            rAF(frameFunc);
          } else {
            if(el.scrollTop !== 0){
              el.scrollTop = 0;
            }else if(window.pageYOffset !== 0){
              window.pageYOffset = 0;
            }else{
              document.body.scrollTop = 0;
            }
          }
        };
        rAF(frameFunc);
      }
    },

    beforeDestroy() {
      this.container.removeEventListener('scroll', this.throttledScrollHandler);
    }
  };
</script>
<style lang="scss" scoped>

</style>
