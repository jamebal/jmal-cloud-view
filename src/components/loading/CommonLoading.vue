<template>
  <div class="common-loading-container">
    <div class="spinner"></div>
    <div class="loading-text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "CommonLoading",
  props: {
    text: {
      type: String,
      default: "资源加载中..."
    }
  }
}
</script>

<style lang="scss" scoped>
.common-loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--model-preview-bg-color);
  z-index: 10;
}

.loading-text {
  margin-top: 15px;
  font-size: 14px;
  color: var(--text-color);
  letter-spacing: 1px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--model-preview-spinner-bg-color);
  border-top: 3px solid var(--text-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
