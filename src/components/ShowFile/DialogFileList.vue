<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="delete-file-list">
        <div v-for="file in fileList" :key="file.id">
          <div class="del-file-item">
            <div>
              <icon-file :item="file" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></icon-file>
            </div>
            <div class="del-file-name">{{file.name}}</div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>

import IconFile from '@/components/Icon/IconFile.vue'

export default {
  components: { IconFile },
  name: 'DialogFileList',
  props: {
    fileList: {
      type: Array,
      default: []
    },
    imageUrl: {
      type: String,
      default: ''
    },
    audioCoverUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
.delete-file-list {
  max-height: 50vh;
  .del-file-item {
    display: flex;
    margin: 5px 0;
    .del-file-name {
      align-content: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 10px;
    }
  }
}
>>> .svg-icon {
  font-size: 28px;
}
>>> .el-avatar {
  width: 28px;
  height: 28px;
  line-height: 28px;
}
</style>
