<template>
  <div>
    <el-dialog :visible.sync="visible" class="details-content" :custom-class="officePreview ? 'dialog-office':''">
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
              <el-button size="mini" type="text" @click="cancelScan()">取消</el-button>
              <el-button type="primary" size="mini" @click="scanDirectory(file)">确定</el-button>
            </div>
            <el-button slot="reference" id="scanDirectoryBtn-file" type="primary" size="small" :loading="syncLoading"><i class="el-icon-refresh"></i></el-button>
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
            <a :href="'/?path=' + file.path + '&highlight=' + file.name">{{ file.path }}</a>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span>{{ file.uploadDate }}</span>
          </el-form-item>
          <el-form-item label="修改时间:">
            <span>{{ file.updateDate }}</span>
          </el-form-item>
          <el-form-item v-if="file.exif" label="">
            <span style="white-space: break-spaces;">{{ formatExif(file.exif) }}</span>
          </el-form-item>
          <el-form-item v-if="file.video" label="">
            <span style="white-space: break-spaces;">{{ formatVideo(file.video) }}</span>
          </el-form-item>
        </el-scrollbar>
        <el-button v-if="allowOpenFile" type="primary" size="small" @click="openFile" class="open-file">打开文件</el-button>
        <el-button v-if="onlyOfficeSupportedFormats(file)" type="primary" size="small" @click="openOnlyOffice" class="open-file">使用OnlyOffice打开</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
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
      }
    }
  },
  mounted() {
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
        this.getIsSync()
      }
    }
  },
  methods: {
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
    openOnlyOffice() {
      this.$emit('openOnlyOffice', this.file)
    },
    rendered() {
      console.log('rendered')
    },
    formatSize(size) {
      return formatSize(size)
    },
    formatExif(exifInfo) {
      return formatExif(exifInfo)
    },
    formatVideo(videoInfo) {
      return formatVideo(videoInfo)
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
    updateSyncStatus(dataPercent) {
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
>>> .el-drawer__header {
  color: #000000;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.details-form {
  padding-bottom: 20px;
  width: 280px;

  >>> .el-scrollbar__view {
    max-height: 50vh;
  }

  >>> .el-form-item__content {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    line-height: 25px;
  }

  >>> .el-form-item__label {
    line-height: 25px;
  }

  >>> .el-form-item {
    margin-bottom: 0;
  }

  >>> .details-scan {
    .el-form-item__label {
      line-height: 32.5px;
    }
    margin-bottom: 10px;
    .el-button--mini, .el-button--mini.is-round {
      padding: 5px 15px;
    }
  }

  >>> .details-position {
    margin: 10px 0;

    .el-form-item__content {
      line-height: 20px;
      color: #84a0c3;
    }

    .el-form-item__label {
      line-height: 20px;
    }
  }

  a:hover {
    color: #409eff;
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
  >>> .icon-favorite {
    display: none;
  }
  >>> .icon-share {
    display: none;
  }
  >>> .icon-tag {
    display: none;
  }
}

.drawer-icon-font {
  margin-bottom: 40px;
  >>> .svg-icon {
    font-size: 8rem;
  }
}

.details-content {
  display: flex;
  align-items: center;
  justify-content: center;
  >>> .el-dialog__body {
    display: flex;
  }
}
>>> .el-image {
  height: 200px !important;
}
>>> .el-image.cover {
  height: unset !important;
  margin-bottom: 20px;
}

>>> .el-dialog {
  margin-top: 0 !important;
  width: fit-content;
  min-width: 500px;
  max-width: 800px;
}

>>> .dialog-office {
  max-width: 1400px;
  min-width: 1225px;
  height: 90vh;
}

.office-preview {
  flex: 20;
  height: 80vh;
  max-width: 885px;
  margin-right: 20px;
  >>> .docx-wrapper {
    padding: 10px;
  }
}

.open-file {
  margin-top: 10px;
}
</style>
