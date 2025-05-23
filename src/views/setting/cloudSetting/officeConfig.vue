<template>
  <div class="container">
    <el-form ref="officeConfigForm" :model="configFormData" label-width="150px" size="small"
             style="width: 520px" autocomplete="off">
      <el-form-item label="OnlyOffice地址" prop="documentServer">
        <el-input placeholder="OnlyOffice Server 地址, 一般不用填" v-model.number="configFormData.documentServer"></el-input>
        <span class="form-instruction">使用外部OnlyOffice服务时需要填写</span>
      </el-form-item>
      <el-form-item label="密钥" prop="secret">
        <el-input type="password" placeholder="OnlyOffice JWT (留空为不使用密钥)" v-model="configFormData.secret"></el-input>
        <span class="form-instruction">建议使用密钥,防止office服务被白嫖。<a href="https://helpcenter.onlyoffice.com/installation/docs-configure-jwt.aspx" target="_blank">查看OnlyOffice文档</a></span>
      </el-form-item>
      <el-form-item label="回调服务地址" prop="callbackServer">
        <el-input placeholder="JmalCloud Server 地址, 一般不用填" v-model.number="configFormData.callbackServer"></el-input>
        <span class="form-instruction">使用外部OnlyOffice服务时需要填写</span>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" :loading="saveConfigLoading" @click="saveConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import settingApi from "@/api/setting-api";

export default {
  name: 'OfficeConfig',
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
        documentServer: undefined,
        secret: undefined,
        tokenEnabled: false,
        callbackServer: undefined
      },
    }
  },
  mounted() {
    this.getOfficeConfig()
  },
  methods: {
    getOfficeConfig() {
      settingApi.getOfficeConfig().then(res => {
        this.configFormData = res.data
      })
    },
    saveConfig() {
      this.saveConfigLoading = true
      if (this.configFormData.documentServer === '') {
        this.configFormData.documentServer = undefined
      }
      if (this.configFormData.callbackServer === '') {
        this.configFormData.callbackServer = undefined
      }
      settingApi.updateOfficeConfig(this.configFormData).then(() => {
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
