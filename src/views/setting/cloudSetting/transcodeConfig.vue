<template>
  <div class="container">
    <el-form :rules="rules" ref="transcodeConfigForm" :model="configFormData" label-width="120px" size="small"
             style="width: 520px" autocomplete="off">
      <el-form-item label="功能状态" prop="enable">
        <el-select v-model="configFormData.enable">
          <el-option
            v-for="item in configEnableOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标码率(kbps)" prop="bitrate">
        <el-input placeholder="2500" v-model.number="configFormData.bitrate"></el-input>
        <span class="form-instruction">默认2500 kbps,小于该值则不转码</span>
      </el-form-item>
      <el-form-item label="目标高度" prop="height">
        <el-input placeholder="720" v-model.number="configFormData.height"></el-input>
        <span class="form-instruction">默认720,小于该值则不转码(视频宽度则默认随高度等比例缩放)</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-loading="saveConfigLoading" @click="saveConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import settingApi from "@/api/setting-api";

export default {
  name: 'TranscodeConfig',
  props: {
    data: {
      type: Array,
      default: []
    },
  },
  computed: {
  },
  data() {
    return {
      saveConfigLoading: false,
      configFormData: {
        enable: true,
        bitrate: undefined,
        height: undefined
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
}
</style>
