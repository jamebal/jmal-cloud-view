<template>
  <transition name="fade">
    <div v-if="isVisible" class="wechat-guide">
      <div class="guide-arrow"></div>
      <div class="guide-text">
        <p>点击右上角<span class="dots"><svg-icon icon-class="more"/></span></p>
        <p>选择在 <span class="browser-text">浏览器</span> 中打开</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'WechatGuide',
  data() {
    return {
      isVisible: false
    };
  },
  mounted() {
    this.checkWechatBrowser();
  },
  methods: {
    isWeChat() {
      const ua = navigator.userAgent.toLowerCase();
      return /micromessenger/.test(ua);
    },
    checkWechatBrowser() {
      if (this.isWeChat()) {
        this.isVisible = true;
      }
    },
    hide() {
      // this.isVisible = false;
    }
  }
};
</script>

<style scoped>

.wechat-guide {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  z-index: 9999;

  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.guide-arrow {
  position: absolute;
  top: 15px;
  right: 25px;
  width: 60px;
  height: 60px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 85,15 C 70,30 70,30 50,50' stroke='white' stroke-width='8' fill='none' stroke-linecap='round' /%3E%3Cpath d='M 85,15 L 70,15' stroke='white' stroke-width='8' fill='none' stroke-linecap='round' /%3E%3Cpath d='M 85,15 L 85,30' stroke='white' stroke-width='8' fill='none' stroke-linecap='round' /%3E%3C/svg%3E");
  background-size: contain;
  animation: bounce 1.5s infinite;
}

.guide-text {
  position: absolute;
  top: 100px;
  right: 15px;
  color: #fff;
  text-align: right;
  font-size: 18px;
  line-height: 1.6;
  font-weight: 300;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.guide-text .dots {
  font-weight: bold;
  font-size: 24px;
  display: inline-block;
  vertical-align: middle;
}

.guide-text .browser-text {
  background-color: #ffffff;
  color: #000000;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 500;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

</style>
