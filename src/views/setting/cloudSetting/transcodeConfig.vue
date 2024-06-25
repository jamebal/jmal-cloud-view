<template>
  <div class="container">
    <el-form :rules="rules" ref="transcodeConfigForm" :model="configFormData" label-width="120px" size="small"
             style="width: 520px" autocomplete="off">
      <el-form-item label="功能状态" prop="enable">
        <el-switch
          v-model="configFormData.enable"
          active-text="启用"
          active-color="#13ce66"
          inactive-color="#ff4949"
          inactive-text="禁用">
        </el-switch>
      </el-form-item>

      <el-form-item label="最大线程数" prop="maxThreads">
        <div class="form-item-flex">
          <el-input-number v-model="configFormData.maxThreads" :min="1" :max="8" label="最大线程数"></el-input-number>
          <div>
            <el-tooltip class="item" effect="dark" content="最多同时的转码的任务数, 默认为1(可根据具体硬件配置酌情增加)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>

      <el-divider content-position="left">转码条件, 以下三个条件满足其一即可</el-divider>

      <el-form-item label="码率(kbps)" prop="bitrateCond">
        <div class="form-item-flex">
          <el-input placeholder="2500" v-model.number="configFormData.bitrateCond"></el-input>
          <div>
            <el-tooltip class="item" effect="dark" content="转码条件: 视频码率(kbps), 默认 2500 kbps, 小于该值则不转码" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="高度" prop="height">
        <div class="form-item-flex">
          <el-input placeholder="720" v-model.number="configFormData.heightCond"></el-input>
          <div>
            <el-tooltip class="item" effect="dark" content="转码条件: 视频高度(视频宽度, 默认随高度等比例缩放), 默认 720, 小于该值则不转码" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="帧率" prop="height">
        <div class="form-item-flex">
          <el-input placeholder="30" v-model.number="configFormData.frameRateCond"></el-input>
          <div>
            <el-tooltip class="item" effect="dark" content="转码条件: 视频帧率, 默认 30 fps, 小于该值则不转码" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>

      <el-divider content-position="left">转码参数</el-divider>

      <el-form-item label="目标码率(kbps)" prop="bitrate">
        <div class="form-item-flex">
          <el-input placeholder="2500" v-model.number="configFormData.bitrate"></el-input>
          <div>
            <el-tooltip class="item" effect="dark" content="转码后的视频码率(kbps),默认 2500 kbps" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="目标高度" prop="height">
        <div class="form-item-flex">
          <el-input placeholder="720" v-model.number="configFormData.height"></el-input>
          <div>
            <el-tooltip class="item" effect="dark" content="转码后的视频高度, 默认720(视频宽度则默认随高度等比例缩放)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="目标帧率" prop="height">
        <div class="form-item-flex">
          <el-input placeholder="30" v-model.number="configFormData.frameRate"></el-input>
          <div>
            <el-tooltip class="item" effect="dark" content="转码后的视频帧率, 默认 30 fps" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="vtt缩略图数量" prop="vttThumbnailCount">
        <div class="form-item-flex">
          <el-input placeholder="60" v-model.number="configFormData.vttThumbnailCount"></el-input>
          <div>
            <el-tooltip class="item" effect="dark" content="vtt缩略图数量, 默认 60 张" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="是否重新转码" prop="isReTranscode">
        <div class="form-item-flex">
          <el-switch v-model="configFormData.isReTranscode"></el-switch>
          <div>
            <el-tooltip class="item" effect="dark" content="转码参数变化后对已经转码过的视频重新转码, 默认开启" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="transcode-status">
          <el-button v-if="transcodeStatus.waitingTranscodingCount > 0 || transcodeStatus.transcodingCount > 0"  type="warning" v-loading="cancelTaskLoading" @click="cancelTask">取消任务</el-button>
          <el-button v-else type="primary" v-loading="saveConfigLoading" @click="saveConfig">保存配置</el-button>
          <div>
            <span v-if="transcodeStatus.waitingTranscodingCount > 0"><b>{{transcodeStatus.waitingTranscodingCount}}</b>个视频等待转码 </span>
            <span v-if="transcodeStatus.transcodingCount > 0"> <b>{{transcodeStatus.transcodingCount}}</b>个视频正在转码中</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import settingApi, { getTranscodeStatus } from '@/api/setting-api'
import { mapState } from 'vuex'

export default {
  name: 'TranscodeConfig',
  props: {
    data: {
      type: Array,
      default: []
    },
  },
  computed: {
    ...mapState(['message'])
  },
  watch: {
    message(msg) {
      if (msg.event === 'msg/transcodeStatus') {
        this.transcodeStatus = msg.data.body
      }
    }
  },
  data() {
    return {
      saveConfigLoading: false,
      cancelTaskLoading: false,
      configFormData: {
        enable: true,
        bitrate: undefined,
        height: undefined,
        frameRate: undefined,
        bitrateCond: undefined,
        maxThreads: undefined,
        heightCond: undefined,
        frameRateCond: undefined,
        vttThumbnailCount: undefined,
        isReTranscode: undefined
      },
      transcodeStatus: {
        waitingTranscodingCount: 0,
        transcodingCount: 0
      },
      configEnableOptions: [{
        value: true,
        label: '启用'
      }, {
        value: false,
        label: '禁用'
      }],
      rules: {
        bitrate: [
          {type: 'number', message: '码率必须为数字值', trigger: 'blur'}
        ],
        height: [
          {type: 'number', message: '高度必须为数字值', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.getTranscodeConfig()
    getTranscodeStatus().then(res => {
      this.transcodeStatus = res.data
    })
  },
  methods: {
    getTranscodeConfig() {
      settingApi.getTranscodeConfig().then(res => {
        this.configFormData = res.data
      })
    },
    saveConfig() {
      this.saveConfigLoading = true
      settingApi.setTranscodeConfig(this.configFormData).then(() => {
        this.saveConfigLoading = false
        this.$message.success('保存成功')
      }).catch(() => {
        this.saveConfigLoading = false
      })
    },
    cancelTask() {
      this.$confirm('确定要取消转码任务吗?可能导致转码后的视频不完整', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doCancelTask()
      })
    },
    doCancelTask() {
      this.cancelTaskLoading = true
      settingApi.cancelTranscodeTask().then(() => {
        this.$message.success('取消成功')
        this.cancelTaskLoading = false
      }).catch(() => {
        this.cancelTaskLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";
.transcode-status {
  display: flex;
  justify-content: space-between;
}
.container {
  padding: 0 !important;
}
</style>
