<template>
  <div>
    <el-dialog :visible.sync="visible" class="details-content" :show-close="false" :custom-class="officePreview ? 'dialog-office':''">
      <div v-if="officePreview" class="office-preview">
        <vue-office-docx
          v-if="file.suffix === 'docx' && visible"
          :src="fleUrl"
          @rendered="rendered"
        />
        <vue-office-excel
          v-if="file.suffix === 'xlsx' && visible"
          :options="excelOptions"
          :src="fleUrl"
          @rendered="rendered"
        />
      </div>
      <div v-else class="drawer-icon">
        <el-image v-if="file && file.showCover" fit="contain" :src="imageUrl + file.id + '&showCover=true'" class="cover">
          <div slot="error" class="image-slot-error">
            <svg-icon icon-class="image"/>
          </div>
        </el-image>
        <icon-file
          v-else
          class="drawer-icon-font"
          :lazy="false"
          :grid="true"
          :details="true"
          :item="file"
          :image-url="imageUrl"
          :audio-cover-url="audioCoverUrl"
        ></icon-file>
      </div>
      <el-form class="details-form">
        <el-form-item v-if="!isOSSFile(file)" label="重建索引:" class="details-scan">
          <el-popover
            placement="bottom"
            trigger="click">
            <p class="el-popconfirm__main">
              <i class="el-popconfirm__icon el-icon-question" style="color: rgb(255, 153, 0);"></i>
              是否开始扫描?
            </p>
            <div style="text-align: right; margin: 0">
              <el-button round size="mini" type="text" @click="cancelScan()">取消</el-button>
              <el-button round type="primary" size="mini" @click="scanDirectory(file)">确定</el-button>
            </div>
            <el-button round slot="reference" id="scanDirectoryBtn-file" class="file-detail-btn" type="primary" size="small" :loading="syncLoading"><i class="el-icon-refresh"></i></el-button>
          </el-popover>
          <span v-show="syncPercent < 100">正在同步文件基本信息: {{ syncPercent }}%</span>
          <span v-show="indexingPercent > 0 && indexingPercent < 100">正在为文件内容创建索引: </span><span v-show="indexingPercent > 0 && indexingPercent < 100">{{ indexingPercent }}%</span>
        </el-form-item>

        <el-scrollbar wrap-class="scrollbar-wrapper" class="details-form-list">
          <el-form-item label="名称:">
            <span>{{ file.name }}</span>
          </el-form-item>
          <el-form-item label="类型:">
          <span>{{
              file.isFolder ? '文件夹' : file.contentType
            }}</span>
          </el-form-item>
          <div v-if="file.music">
            <el-form-item label="🎵 歌手:">
              <span>{{ file.music.singer }}</span>
            </el-form-item>
            <el-form-item label="🎵 专辑:">
              <span>{{ '《' + file.music.album + '》' }}</span>
            </el-form-item>
            <el-form-item label="🎵 歌名:">
              <span>{{ '《' + file.music.songName + '》' }}</span>
            </el-form-item>
          </div>
          <el-form-item
            v-show="file.w && file.h"
            label="尺寸:"
            class="details-resolution"
          >
            <span>{{ file.w + ' x ' + file.h }}</span>
          </el-form-item>
          <el-form-item label="大小:">
            <span> {{ formatSize(file.size) }}</span>
          </el-form-item>
          <el-form-item label="位置:" class="details-position">
            <span><a :href="pathUrl" v-tooltip="{content: '文件所在位置', placement: 'bottom'}">{{ filepath }}</a></span>
          </el-form-item>
          <el-form-item label="上传时间:">
            <span>{{ file.uploadDate }}</span>
          </el-form-item>
          <el-form-item label="修改时间:">
            <el-popover
              ref="historyPopover"
              placement="right"
              popper-class="file-operation-history"
              width="400"
              trigger="click"
              :visible-arrow="false"
              transition=""
              @show="showOperationHistory"
              @hide="hideOperationHistory">
              <timeline-component :show-operation-history="operationHistory" :file-id="file.id" @initial-load-complete="handleHistoryInitialLoad"></timeline-component>
              <span slot="reference" v-tooltip="{content: '文件操作历史', placement: 'bottom'}" class="file-operation-history-btn">{{ file.updateDate }}</span>
            </el-popover>
          </el-form-item>
          <el-form-item v-if="file.exif" label="">
            <span style="white-space: break-spaces;">{{ formatExif(file.exif) }}</span>
          </el-form-item>
          <el-form-item v-if="file.video" label="">
            <span style="white-space: break-spaces;">{{ formatVideo(file.video) }}</span>
          </el-form-item>
        </el-scrollbar>
        <el-button round v-if="allowOpenFile" type="primary" size="small" @click="openFile" class="file-detail-btn open-file">打开文件</el-button>
        <el-button round v-if="onlyOfficeSupportedFormats(file)" type="primary" size="small" @click="openOnlyOffice" class="file-detail-btn open-file">使用OnlyOffice打开</el-button>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import tippy from 'tippy.js';
import fileApi from '@/api/file-api'
import TimelineComponent from '@/components/Timeline'
import { onlyOfficeSupportedFormats } from '@/utils/file-type'

// 引入VueOfficeDocx 组件
import VueOfficeDocx from '@vue-office/docx'
// 引入VueOfficeDocx 相关样式
import '@vue-office/docx/lib/index.css'

// 引入VueOfficeExcel 组件
import VueOfficeExcel from '@vue-office/excel'
// 引入VueOfficeExcel 相关样式
import '@vue-office/excel/lib/index.css'

import fileConfig from '@/utils/file-config'
import { formatSize } from '@/utils/number'
import IconFile from '@/components/Icon/IconFile'
import {mapState} from "vuex";
import {formatExif,formatVideo} from "@/utils/media";
import settingApi from "@/api/setting-api";

export default {
  name: 'FileDetails',
  components: {
    TimelineComponent,
    IconFile,
    VueOfficeDocx,
    VueOfficeExcel
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    file: {
      type: Object,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    audioCoverUrl: {
      type: String,
      required: true,
    },
    fileUsername: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      syncLoading: false,
      clickSync: false,
      indexingPercent: 100,
      syncPercent: 100,
      excelOptions: {
        minColLength: 10,
        minRowLength: 10,
        widthOffset: 10,
        heightOffset: 10,
        excel: window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
      },
      filepath: '',
      pathUrl: '',
      operationHistory: false
    }
  },
  computed: {
    ...mapState(['message']),
    fleUrl() {
      return window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
    },
    officePreview() {
      return ['docx', 'xlsx'].includes(this.file.suffix) && this.file.size > 0 && this.file.size < 1024 * 1024 * 5
    },
    allowOpenFile() {
      if (!this.file.contentType) {
        return false
      }
      return (this.file.contentType.indexOf('office') > -1 || ['pdf', 'epub'].includes(this.file.suffix))
    },
  },
  watch: {
    message(msg) {
      if (msg.event === 'msg/synced') {
        this.updateSyncStatus(msg.data.body)
      }
    },
    visible(val) {
      this.$emit('update:visible', val)
      if (val) {
        this.filepath = this.getLocalPath(this.file.path)
        this.pathUrl = `/?path=${this.filepath}&highlight=${this.file.name}`
        this.getIsSync()
        const isMountFile = this.fileUsername || this.file.userId !== this.$store.getters.userId ? this.file.userId : undefined
        if (isMountFile) {
          fileApi.getMountFileInfo({
            fileId: this.file.id,
            fileUserId: this.file.userId,
          }).then((res) => {
            const path = this.getLocalPath(res.data.path)
            this.filepath = path
            this.pathUrl = `/?path=${path}&highlight=${this.file.name}&folder=${res.data.folder}`
          })
        }
      }
    }
  },
  mounted() {
    if (this.$refs.viewOperationHistoryTitle) {
      tippy(this.$refs.viewOperationHistoryTitle, {
        content: '这是一个即时显示的提示!',
        delay: 0, // 关键：设置延迟为 0毫秒
        placement: 'top', // 提示框位置 (可选)
        // animation: 'scale', // 动画效果 (可选, 需要引入对应 css)
        // theme: 'light', // 主题 (可选, 需要引入对应 css)
        // interactive: true, // 允许鼠标与提示框交互 (可选)
        // arrow: true, // 显示箭头 (可选)
      });
    }
  },
  methods: {
    getLocalPath(path) {
      if (path === '/') {
        return path
      }
      return path.endsWith('/') ? path.slice(0, -1) : path
    },
    isOSSFile(file) {
      if (!file || !file.id) {
        return false
      }
      // 判断id字符串里是否有斜杠,如果则返回false
      return this.file.id.indexOf('/') > -1 || this.file.ossFolder
    },
    openFile() {
      this.$emit('openFile', this.file)
    },
    showOperationHistory() {
      this.operationHistory = true
    },
    hideOperationHistory() {
      this.operationHistory = false
    },
    handleHistoryInitialLoad() {
      // 当 TimelineComponent 首次加载完成时，更新 Popover 位置
      this.$nextTick(() => { // 确保 DOM 更新完毕
        if (this.$refs.historyPopover) {
          this.$refs.historyPopover.updatePopper(); // 调用 Element UI Popover 的方法
        }
      });
    },
    openOnlyOffice() {
      this.$emit('openOnlyOffice', this.file)
    },
    rendered() {
      //console.log('rendered')
    },
    formatSize(size) {
      return formatSize(size)
    },
    formatExif(exifInfo) {
      return formatExif(exifInfo, '\r\n')
    },
    formatVideo(videoInfo) {
      return formatVideo(videoInfo, '\r\n')
    },
    getIsSync() {
      settingApi.isSync({username: this.$store.state.user.name}).then((res) => {
        this.updateSyncStatus(res.data)
      })
    },
    onlyOfficeSupportedFormats(file) {
      if (!file || !file.suffix) {
        return false
      }
      return onlyOfficeSupportedFormats.includes(file.suffix.toLowerCase())
    },
    setTip() {
      if (this.$refs.updateDateTip) {
        tippy(this.$refs.updateDateTip, {
          content: '显示文件操作历史!',
          delay: 0, // 关键：设置延迟为 0毫秒
          placement: 'top', // 提示框位置 (可选)
          // animation: 'scale', // 动画效果 (可选, 需要引入对应 css)
          // theme: 'light', // 主题 (可选, 需要引入对应 css)
          // interactive: true, // 允许鼠标与提示框交互 (可选)
        })
      }
    },
    updateSyncStatus(dataPercent) {

      this.setTip()

      if (this.clickSync) {
        return
      }
      const {syncPercent, indexingPercent} = dataPercent
      if (syncPercent) {
        this.syncPercent = syncPercent
      } else {
        this.syncPercent = 0
      }
      if (indexingPercent) {
        this.indexingPercent = indexingPercent
      } else {
        this.indexingPercent = 0
      }
      this.syncLoading = !((this.syncPercent === 100 && this.indexingPercent === 100) || (this.syncPercent === 0 && this.indexingPercent === 0));
    },
    cancelScan() {
      document.getElementById('scanDirectoryBtn-file').click()
    },
    scanDirectory(file) {
      this.cancelScan()
      this.syncLoading = true
      this.syncPercent = 0
      this.clickSync = true
      settingApi.syncUser({username: this.$store.state.user.name, path: decodeURIComponent(file.path + file.name)}).then(() => {
        this.clickSync = false
      }).catch(() => {
        this.clickSync = false
      })
    },
  }
}
</script>

<style scoped lang="scss">

@import "src/styles/element-ui.scss";

$primary: #409eff;
$bg-blur: rgba(255, 255, 255, 0.75);

.details-content {
  display: flex;
  align-items: center;
  justify-content: center;

  >>> .el-dialog__header {
    padding: 0;
  }

  >>> .el-dialog__body {
    display: flex;
    background: $bg-blur;
    border-radius: 18px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.18);
    padding: 32px 32px 24px 32px;
  }
}
>>> .el-dialog {
  margin-top: 0 !important;
  width: fit-content;
  min-width: 500px;
  max-width: 800px;
  border-radius: 18px;
  overflow: hidden;
  background: transparent;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
}

>>> .dialog-office {
  max-width: 1400px;
  min-width: 1225px;
  border-radius: 18px;
}

.details-form {
  padding-bottom: 20px;
  width: 320px;
  font-family: "San Francisco", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 15px;
  color: #222;

  >>> .el-scrollbar__view {
    max-height: 50vh;
  }

  >>> .el-form-item__content {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    line-height: 25px;
    color: #222;
  }

  >>> .el-form-item__label {
    line-height: 25px;
    color: #888;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  >>> .el-form-item {
    margin-bottom: 0;
    border-radius: 10px;
    padding: 6px;
    transition: background 0.2s;
  }

  >>> .details-scan {
    .el-form-item__label {
      line-height: 32.5px;
    }
    margin-bottom: 10px;
    .el-button--mini, .el-button--mini.is-round {
      padding: 5px 15px;
      border-radius: 8px;
    }
  }

  >>> .details-position {
    .el-form-item__content {
      line-height: 25px;
      color: $primary;
    }
    .el-form-item__label {
      line-height: 25px;
    }
  }

  a {
    color: $primary;
    text-decoration: none;
    border-radius: 6px;
    padding: 2px 4px;
    transition: background 0.2s;
    &:hover {
      background: rgba(64,158,255,0.12);
      color: #1a73e8;
    }
  }
}

.drawer-icon {
  margin-right: 20px;
  text-align: center;
  position: relative;
  flex: 1;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  justify-content: center;
  >>> .icon-favorite,
  >>> .icon-share,
  >>> .icon-tag {
    display: none;
  }
}

.drawer-icon-font {
  margin-bottom: 40px;
  >>> .svg-icon {
    font-size: 8rem;
    border-radius: 18px;
    background: rgba(255,255,255,0.7);
    box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.10);
    padding: 16px;
    color: $primary;
  }
}

>>> .el-image {
  height: 200px !important;
  border-radius: 16px;
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.10);
  background: #f8fafc;
}
>>> .el-image.cover {
  height: unset !important;
  margin-bottom: 20px;
  max-width: 100%;
  max-height: 60vh;
  border-radius: 16px;
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.10);
}

.vue-office-docx {
  border-radius: 12px;
  overflow: auto;
  /* macOS风格滚动条 */
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(180,180,180,0.28);
    border-radius: 6px;
    transition: background 0.2s;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(180,180,180,0.48);
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(180,180,180,0.28) transparent;
  &:hover {
    scrollbar-color: rgba(180,180,180,0.48) transparent;
  }
}

.office-preview {
  flex: 20;
  height: 80vh;
  max-width: 885px;
  margin-right: 20px;
  >>> .docx-wrapper {
    padding: 10px;
    border-radius: 12px;
    background: rgba(255,255,255,0.8);
    box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.08);
  }
}

.open-file {
  margin-top: 16px;
}

/* 自定义滚动条 */
>>> .el-scrollbar__bar.is-vertical {
  width: 7px;
  background: transparent;
}
>>> .el-scrollbar__thumb {
  background: #7c7c7c2e;
  border-radius: 4px;
  transition: background 0.2s;
  &:hover {
    background: #7c7c7c2e;
  }
}

.file-operation-history-btn {
  cursor: pointer;
  color: $primary;
  text-decoration: none;
  border-radius: 6px;
  padding: 2px 4px;
  transition: background 0.2s;
  &:hover {
    background: rgba(64,158,255,0.12);
    color: #1a73e8;
  }
}
</style>
