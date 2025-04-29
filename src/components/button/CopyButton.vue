<template>
  <div>
    <el-button round type="primary" class="copy-text" @click="copyText" :data-clipboard-text="shareLink">复制链接</el-button>
  </div>
</template>

<script>
export default {
  name: "CopyButton"
}
</script>

<style scoped>

</style>
