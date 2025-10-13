<template>
  <div class="container">
    <el-form :rules="rules" ref="previewConfigForm" :model="configFormData" label-width="120px" size="small"
             style="width: 860px" autocomplete="off">
      <el-form-item label="iframe 预览" prop="iframe">
        <span class="form-instruction"><a href="https://jmalcloud.github.io/guide/other/iframe-preview.html" target="_blank"><svg-icon icon-class="wailian"/>iframe预览示例 </a> </span>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2}"
          :placeholder="defaultIframeConfig"
          v-model="configFormData.iframe">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" :loading="saveConfigLoading" @click="submitForm">保存配置</el-button>
        <el-button round type="warning" @click="resetConfig">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import settingApi from '@/api/setting-api'
import { defaultPreviewConfig } from '@/utils'

export default {
  name: 'PreviewConfig',
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  computed: {},
  data() {
    const validateIframeFormat = async (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        try {
          this.configFormData.iframe = JSON.stringify(JSON.parse(value), null, 4)
        } catch (e) {
          callback(new Error('json格式错误'))
        }
        callback()
      }
    }
    return {
      saveConfigLoading: false,
      defaultIframeConfig: defaultPreviewConfig,
      configFormData: {
        iframe: '',
      },
      rules: {
        iframe: [
          { required: false, validator: validateIframeFormat, trigger: 'submit'}
        ],
      }
    }
  },
  mounted() {
    this.getPreviewConfig()
  },
  methods: {
    getPreviewConfig() {
      settingApi.getPreviewConfig().then(res => {
        this.configFormData = res.data
      })
    },
    submitForm() {
      this.$refs.previewConfigForm.validate((valid) => {
        if (valid) {
          this.saveConfig()
        } else {
          return false
        }
      });
    },
    resetConfig() {
      this.configFormData.iframe = this.defaultIframeConfig
    },
    saveConfig() {
      this.saveConfigLoading = true
      settingApi.updatePreviewConfig(this.configFormData).then(() => {
        this.saveConfigLoading = false
        this.$message.success('保存成功')
        this.$store.dispatch('user/getInfo')
      }).catch(() => {
        this.saveConfigLoading = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
}
</style>
