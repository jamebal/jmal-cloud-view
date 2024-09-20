<template>
  <div class="container">
    <el-form ref="previewConfigForm" :model="configFormData" label-width="120px" size="small" style="width: 450px" autocomplete="off">
      <el-form-item :label="$t('common.lang')" prop="lang">
        <el-select v-model="configFormData.lang" @change="changeLanguage">
          <el-option
            v-for="item in languageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { loadLocaleMessages, getBrowserLocale } from '@/utils/loadLocaleMessages';

export default {
  name: 'LanguageConfig',
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  computed: {},
  data() {
    return {
      languageOptions: [
        { value: 'en_US', label: 'English' },
        { value: 'zh_CN', label: '简体中文' },
      ],
      configFormData: {
        lang: '',
      },
    }
  },
  mounted() {
    if (this.$store.getters.lang) {
      this.configFormData.lang = this.$store.getters.lang
    } else {
      this.configFormData.lang = getBrowserLocale(loadLocaleMessages())
    }
  },
  methods: {
    changeLanguage(lang) {
      this.$store.dispatch('app/setLang', lang)
      this.$i18n.locale = lang;
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
}
</style>
