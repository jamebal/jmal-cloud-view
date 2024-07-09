<template>
  <div>
    <!--文件详细信息-->
<!--    <el-drawer :title="rowContextData.name" :visible.sync="visible">-->
<!--      -->
<!--    </el-drawer>-->
    <el-dialog :visible.sync="visible" width="420px">
      <div class="drawer-icon">
        <icon-file
          class="drawer-icon-font"
          :grid="true"
          :details="true"
          :item="rowContextData"
          :image-url="imageUrl"
          :audio-cover-url="audioCoverUrl"
        ></icon-file>
      </div>
      <el-form class="details-form">
        <el-form-item label="重建索引:" class="details-scan">
          <el-button type="primary" size="mini" :loading="syncLoading" @click="scanDirectory(rowContextData)" ><i class="el-icon-refresh"></i></el-button>
          <span v-show="syncPercent < 100">正在同步文件基本信息: {{ syncPercent }}%</span>
          <span v-show="indexingPercent > 0 && indexingPercent < 100">正在为文件内容创建索引: </span><span v-show="indexingPercent > 0 && indexingPercent < 100">{{ indexingPercent }}%</span>
        </el-form-item>

        <el-scrollbar wrap-class="scrollbar-wrapper" class="details-form-list">
          <el-form-item label="名称:">
            <span>{{ rowContextData.name }}</span>
          </el-form-item>
          <el-form-item label="类型:">
          <span>{{
              rowContextData.isFolder ? '文件夹' : rowContextData.contentType
            }}</span>
          </el-form-item>
          <div v-if="rowContextData.music">
            <el-form-item label="🎵 歌手:">
              <span>{{ rowContextData.music.singer }}</span>
            </el-form-item>
            <el-form-item label="🎵 专辑:">
              <span>{{ '《' + rowContextData.music.album + '》' }}</span>
            </el-form-item>
            <el-form-item label="🎵 歌名:">
              <span>{{ '《' + rowContextData.music.songName + '》' }}</span>
            </el-form-item>
          </div>
          <el-form-item
            v-show="rowContextData.w && rowContextData.h"
            label="尺寸:"
            class="details-resolution"
          >
            <span>{{ rowContextData.w + ' x ' + rowContextData.h }}</span>
          </el-form-item>
          <el-form-item label="大小:">
            <span> {{ formatSize(rowContextData.size) }}</span>
          </el-form-item>
          <el-form-item label="位置:" class="details-position">
            <a :href="'/?path=' + rowContextData.path + '&highlight=' + rowContextData.name">{{ rowContextData.path }}</a>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span>{{ rowContextData.uploadDate }}</span>
          </el-form-item>
          <el-form-item label="修改时间:">
            <span>{{ rowContextData.updateDate }}</span>
          </el-form-item>
          <el-form-item v-if="rowContextData.exif" label="">
            <span style="white-space: break-spaces;">{{ formatExif(rowContextData.exif) }}</span>
          </el-form-item>
          <el-form-item v-if="rowContextData.video" label="">
            <span style="white-space: break-spaces;">{{ formatVideo(rowContextData.video) }}</span>
          </el-form-item>
        </el-scrollbar>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { formatSize } from '@/utils/number'
import IconFile from '@/components/Icon/IconFile'
import {mapState} from "vuex";
import {formatExif,formatVideo} from "@/utils/media";
import settingApi from "@/api/setting-api";

export default {
  name: 'FileDetails',
  components: {
    IconFile
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    rowContextData: {
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
    }
  },
  mounted() {
  },
  computed: {
    ...mapState(['message']),
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
    scanDirectory(file) {
      this.$confirm('是否开始扫描? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.syncLoading = true
        this.syncPercent = 0
        this.clickSync = true
        settingApi.syncUser({username: this.$store.state.user.name, path: decodeURIComponent(file.path + file.name)}).then(() => {
          this.clickSync = false
        }).catch(() => {
          this.clickSync = false
        })
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
  padding: 20px 0;

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
  text-align: center;
  position: relative;
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

.drawer-icon-font >>> .svg-icon {
  font-size: 8rem;
}
</style>
