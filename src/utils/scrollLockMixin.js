export const scrollLockMixin = {
  methods: {
    // 鼠标进入滚动区域时，禁止body滚动
    disableBodyScroll() {
      document.body.style.overflow = 'hidden';
    },
    // 鼠标离开时，恢复body滚动
    enableBodyScroll() {
      document.body.style.overflow = 'auto'; // 或者 'visible'
    }
  },
  // 关键：在组件销毁前，确保恢复body滚动，防止页面卡死
  beforeDestroy() {
    this.enableBodyScroll();
  }
};
