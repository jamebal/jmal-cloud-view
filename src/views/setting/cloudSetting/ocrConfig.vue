<template>
  <div class="container">
    <div class="form-instruction">
      <p>此功能主要用于读取PDF文档内容，以便进行全文搜索</p>
    </div>
    <div>

    </div>
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

      <el-form-item label="OCR引擎" prop="ocrEngine">
        <el-radio-group v-model="configFormData.ocrEngine" size="medium" @input="changeOcrEngine">
          <el-radio border label="tesseract">Tesseract</el-radio>
          <el-radio border label="ocrLiteOnnx">OcrLiteOnnx</el-radio>
        </el-radio-group>
        <div class="form-instruction">
          <span><a href="https://github.com/tesseract-ocr/tesseract" target="_blank"><svg-icon icon-class="wailian"/>Tesseract</a> </span>
          <span> : 中文识别率高偏低，但是对低性能设备友好</span>
        </div>
        <div class="form-instruction single-line">
          <span><a href="https://github.com/DayBreak-u/chineseocr_lite" target="_blank"><svg-icon icon-class="wailian"/>OcrLiteOnnx</a> </span>
          <span> : 中文识别率高，但是对CPU性能要求较高，低性能CPU的识别速度会相对较慢</span>
        </div>
        <div class="form-instruction">
          <span>如果两者识别速度相近，建议选择OcrLiteOnnx。判断方法: </span>
        </div>
        <div class="form-instruction">
          <div>1.开启OCR功能</div>
          <div>2.找一个纯图片的PDF文件，对其重建索引</div>
          <div>3.使用两个不同的OCR引擎，并比较耗时</div>
        </div>
      </el-form-item>

      <el-form-item label="最大并发数" prop="maxTasks">
        <div class="form-item-flex">
          <el-input-number v-model="configFormData.maxTasks" :disabled="maxTasksDisable" :min="1" :max="8" label="最大并发数"></el-input-number>
          <div>
            <el-tooltip class="item" effect="dark" content="OCR识别最大并发任务数, 默认为1(通常建议保持不变。如果CPU有剩余性能，可以适当增加以加快识别速度。)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" v-loading="saveConfigLoading" @click="saveConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import settingApi from '@/api/setting-api'

export default {
  name: 'ocrConfig',
  props: {
    data: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      saveConfigLoading: false,
      cancelTaskLoading: false,
      maxTasksDisable: false,
      configFormData: {
        enable: false,
        maxTasks: 1,
        ocrEngine: 'tesseract'
      },
      configEnableOptions: [{
        value: true,
        label: '启用'
      }, {
        value: false,
        label: '禁用'
      }],
      rules: {
      }
    }
  },
  mounted() {
    this.getOcrConfig()
  },
  methods: {
    changeOcrEngine() {
      if (this.configFormData.ocrEngine === 'ocrLiteOnnx') {
        this.configFormData.maxTasks = 1
        this.maxTasksDisable = true
      } else {
        this.maxTasksDisable = false
      }
    },
    getOcrConfig() {
      settingApi.getOcrConfig().then(res => {
        this.configFormData = res.data
      })
    },
    saveConfig() {
      this.saveConfigLoading = true
      settingApi.setOcrConfig(this.configFormData).then(() => {
        this.saveConfigLoading = false
        this.$message.success('保存成功')
      }).catch(() => {
        this.saveConfigLoading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";
.container {
  padding: 0 !important;
}
.form-instruction.single-line {
  white-space: nowrap;
}
</style>
