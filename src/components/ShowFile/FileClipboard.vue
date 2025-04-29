<template>
  <div class="file-clipboard">
    <el-card shadow="always">
      <div class="file-clipboard-content">
        <el-popover
          placement="bottom"
          popper-class="clipboard-popover"
          width="420"
          trigger="hover">
          <div>
            <dialog-file-list  class="clipboard-content-file-list" :file-list="fileList" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></dialog-file-list>
            <div class="clipboard-tips">
              <div class="kdb"><kbd :style="{fontSize: cmdKey === '⌘' ? '14px' : '12px'}">{{ cmdKey }}</kbd><kbd>V</kbd>复制 </div>
              <div class="kdb"><kbd :style="{fontSize: cmdKey === '⌘' ? '14px' : '12px'}">{{ cmdKey }}</kbd><kbd>X</kbd>移动 </div>
            </div>
          </div>
          <div  slot="reference">
            <el-badge :value="fileList.length" class="item">
              <el-button round size="mini" round>剪切板</el-button>
            </el-badge>
          </div>
        </el-popover>
        <div class="file-clipboard-operation">

          <el-tooltip :disabled="operationDisabled" popper-class="clipboard-operation-popover" :hide-after="0" effect="light" :content="'复制到: ' + targetPathName" placement="bottom">
            <el-button round :disabled="operationDisabled" icon="el-icon-document-copy" size="mini" circle @click="copy"></el-button>
          </el-tooltip>

          <el-tooltip :disabled="operationDisabled" popper-class="clipboard-operation-popover" effect="light" :content="'移动到: ' + targetPathName" placement="bottom">
            <el-button round :disabled="operationDisabled" icon="el-icon-scissors" size="mini" circle @click="move"></el-button>
          </el-tooltip>

          <el-button round icon="el-icon-close" size="mini" title="关闭" circle @click="clear"></el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

import DialogFileList from '@/components/ShowFile/DialogFileList.vue'

export default {
  components: { DialogFileList },
  name: 'FileClipboard',
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
    },
    /**
     * 当前路径
     */
    targetPath: {
      type: String,
      default: '/'
    },
    /**
     * 当前文件夹id
     */
    targetFolder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    targetPathName() {
      return this.targetPath.length > 0 ? this.targetPath : '/'
    },
    cmdKey() {
      return navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'
    },
    operationDisabled() {
      return this.$route.path !== '/' && (!this.targetPath || this.targetPath.length < 2)
    }
  },
  methods: {
    clear() {
      this.$store.dispatch('updateFileClipboard', [])
    },
    copy() {
      /**
       * @event onCopy
       * @param {Array} fileIdList 文件id列表
       * @param {String} targetPath 目标路径
       * @param {String} targetFolder 目标文件夹id
       */
      this.$emit('onCopy', this.getFileIdList(), this.targetPath, this.targetFolder)
    },
    move() {
      /**
       * @event onMove
       * @param {Array} fileIdList 文件id列表
       * @param {String} targetPath 目标路径
       * @param {String} targetFolder 目标文件夹id
       */
      this.$emit('onMove', this.getFileIdList(), this.targetPath, this.targetFolder)
    },
    getFileIdList() {
      return this.fileList.map(file => file.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.file-clipboard {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  >>> .el-card__body {
    padding: 10px;
  }
  >>> .el-card {
    border-radius: 35px;
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    background: rgba(255, 255, 255, .27) !important;
    border: 0;
  }
}
.file-clipboard-content {
  width: 185px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.file-clipboard-operation {
  display: flex;
}
.clipboard-tips {
  font-size: 12px;
  color: #5f6368ad;
  padding: 2px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  line-height: 22px;
  border-top: 1px solid #e0e0e0;
  background: #f6f6f6;
}
.clipboard-content-file-list {
  padding: 5px 10px;
}
.kdb {
  margin: 0 16px;
}

</style>
