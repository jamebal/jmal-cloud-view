<template>
  <div class="container">

    <van-list>
      <van-sticky :offset-top="0">
        <van-nav-bar
          title="文件上传列表"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft">
        </van-nav-bar>

      </van-sticky>

      <ul class="file-list">
        <li v-for="file in fileList" :key="file.id">
          <uploader-file ref="files" :class="'file_' + file.id" :file="file" :list="true"></uploader-file>
        </li>
        <div v-if="!fileList.length" class="no-file">
          <van-empty description="暂无待上传文件" />
          </van-button>
        </div>
      </ul>
    </van-list>
  </div>
</template>
<script>

  import { strlen, substring10, formatTime, formatSize } from '@/utils/number'
  import IconFile from "../../../components/Icon/IconFile";
  import Bus from '@/assets/js/bus'
  export default {
    components: {IconFile},
    data() {
      return {
        fileList: []
      };
    },
    mounted(){
      if (window.uploader) {
        this.fileList = window.uploader.fileList
      }
    },
    destroyed(){
      window.removeEventListener('popstate', this.goBack, false)
    },
    methods: {
      onClickLeft() {
        this.$router.push(`/_m`)
        Bus.$emit('uploadFileListBack', true)
      }
    }
  }
</script>
<style lang="scss" scoped>
  >>> .uploader-file-info {
    font-size: 14px;
  }
  >>> .uploader-file-name {
    width: 50%;
  }
  >>> .uploader-file-status {
    width: 30%;
    span {
      span {
        display: none;
      }
      i {
        display: none;
      }
    }
  }
  >>> .uploader-file-size {
    display: none;
  }
  >>> .uploader-file-meta {
    display: none;
  }
  >>> .uploader-file-actions {
    width: 20%;
    span {
      padding: 10px;
      margin-right: 16px;
    }
  }
  .no-file {
    .plus {
      position: absolute;
      bottom: 1rem;
      right: 2rem;
    }
  }
</style>
