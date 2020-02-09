<!-- 一个上传事例文件 -->
<template>
  <div>
    <el-button @click="upload">上传</el-button>
  </div>
</template>

<script>
import Bus from '@/assets/js/bus'

export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  mounted() {
    // 文件选择后的回调
    Bus.$on('fileAdded', () => {
      console.log('文件已选择')
    })

    // 文件上传成功的回调
    Bus.$on('fileSuccess', () => {
      console.log('文件上传成功')
    })
  },
  destroyed() {
    Bus.$off('fileAdded')
    Bus.$off('fileSuccess')
  },
  methods: {
    upload() {
      // 打开文件选择框
      Bus.$emit('openUploader', {
        id: '1111' // 传入的参数
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
