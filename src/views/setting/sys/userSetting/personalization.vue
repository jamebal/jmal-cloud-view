<template>
  <div class="container">
    <el-form :rules="rules" ref="form" :model="personalizationFormData" label-width="120px" size="small"
             style="width: 450px" autocomplete="off">
      <el-form-item label="主题" prop="theme">
        <el-select ref="selectTheme" v-model="personalizationFormData.theme" placeholder="请选主题">
          <el-option
            v-for="item in themeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button round type="primary" :loading="saveConfigLoading" @click="savePersonalizationConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import settingApi from '@/api/setting-api'
import { applyUserTheme } from '@/utils/theme'

export default {
  name: 'personalization',
  data() {
    return {
      rules: {},
      saveConfigLoading: false,
      personalizationFormData: {
        theme: 'auto'
      },
      themeList: [
        { value: 'auto', label: '跟随系统' },
        { value: 'light', label: '浅色主题' },
        { value: 'dark', label: '深色主题' },
      ]
    }
  },
  mounted() {
    this.getPersonalizationConfig()
  },
  methods: {
    getPersonalizationConfig() {
      settingApi.getPersonalizationConfig().then(response => {
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          this.personalizationFormData = { ...this.personalizationFormData, ...response.data };
        }
      })
    },
    savePersonalizationConfig() {
      this.saveConfigLoading = true
      settingApi.savePersonalizationConfig(this.personalizationFormData).then(() => {
        this.saveConfigLoading = false
        this.$message({
          message: '保存成功',
          type: 'success',
        })
        applyUserTheme(this.personalizationFormData.theme)
      }).finally(() => {
        this.saveConfigLoading = false
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";

.container {
  padding: 0 !important;
}
</style>
