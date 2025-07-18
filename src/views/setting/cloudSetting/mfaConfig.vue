<template>
  <div class="container">
    <div class="form-instruction">
      <p>两步验证是一个额外的验证步骤，可让您的登录体验更加安全; <span
        style="color: #F56C6C">两步验证密码是基于当前时间生成，请确保服务器时间已同步</span></p>
    </div>

    <div>
      <div class="description-container">当前状态:
        <el-tag v-if="mfaSetupResponse.mfaEnable" type="success">开启</el-tag>
        <el-tag v-else type="danger">关闭</el-tag>
      </div>
    </div>

    <div>
      <el-steps v-if="!mfaSetupResponse.mfaEnable" direction="vertical">
        <el-step title="安装身份验证器App" status="process">
          <template slot="description">
            <div class="description-container">
              <span class="step-instruction">安装身份验证器App，例如Google Authenticator、Microsoft Authenticator、Bitwarden、LastPass、Bitwarden、Authenticator等</span>
            </div>
          </template>
        </el-step>
        <el-step title="配置生成验证码" status="process">
          <template slot="description">
            <div class="description-container">
              <div class="step-instruction">使用手机应用扫描以下二维码，获取 6 位验证码。</div>
              <el-image style="width: 150px; height: 150px" :src="mfaSetupResponse.qrCodeImageUri" alt="二维码" />
              <div class="step-instruction">密钥 ：{{ mfaSetupResponse.secret }}
                <svg-icon
                  class="copy-btn"
                  icon-class="menu-fuzhi"
                  @click="copySecret('.copy-btn')"
                  :data-clipboard-text="mfaSetupResponse.secret"
                ></svg-icon>
              </div>
            </div>
          </template>
        </el-step>
        <el-step title="验证并开启" status="process">
          <template slot="description">
            <div class="description-container">
              <div class="step-instruction">请输入身份验证器 App 生成的 6 位动态验证码，开启两步验证。</div>
              <div class="step-instruction enable-mfa">
                <el-input placeholder="6位动态验证码" size="small" class="code-input" v-model="enableMfaCode"></el-input>
                <el-button size="small" type="primary" round :disabled="enableMfaCode.length !== 6" @click="enableMFA">开启 2FA</el-button>
              </div>
            </div>
          </template>
        </el-step>
      </el-steps>
      <div v-if="mfaSetupResponse.mfaEnable">
        <div class="step-instruction enable-mfa">
          <el-input placeholder="6位动态验证码" size="small" class="code-input" v-model="disableMfaCode"></el-input>
          <el-button size="small" type="warning" round :disabled="disableMfaCode.length !== 6" @click="disableMFA">禁用 2FA</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import settingApi from '@/api/setting-api'
import Clipboard from 'clipboard'

export default {
  name: 'mfaConfig',
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      verifyLoading: false,
      mfaSetupResponse: {
        mfaEnable: true,
        qrCodeImageUri: '',
        secret: '',
      },
      enableMfaCode: '',
      disableMfaCode: ''
    }
  },
  mounted() {
    this.getMfaConfig()
  },
  methods: {
    getMfaConfig() {
      settingApi.setupMfaConfig().then(res => {
        this.mfaSetupResponse = res.data
      })
    },
    copySecret(className) {
      let clipboard = new Clipboard(className)
      clipboard.on('success', e => {
        this.$message({ message: '复制成功', type: 'success', duration: 1000 })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({ message: '该浏览器不支持自动复制', type: 'warning', duration: 1000 })
        clipboard.destroy()
      })
    },
    enableMFA() {
      this.verifyLoading = true
      settingApi.enableMfaConfig({ code: this.enableMfaCode, secret: this.mfaSetupResponse.secret }).then(() => {
        this.verifyLoading = false
        this.$message.success('开启2FA成功')
        this.getMfaConfig()
      }).catch(() => {
        this.verifyLoading = false
      })
    },
    disableMFA() {
      this.verifyLoading = true
      settingApi.disableMfaConfig({ code: this.disableMfaCode }).then(() => {
        this.verifyLoading = false
        this.$message.success('禁用2FA成功')
        this.getMfaConfig()
      }).catch(() => {
        this.verifyLoading = false
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

.copy-btn {
  font-size: 18px;
  cursor: pointer;
}

.description-container {
  padding: 10px 0 20px 0;
}

.enable-mfa {

  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  width: 250px;

  .code-input {
    width: 150px;
  }
}

.step-instruction {
  font-size: 14px;
}
</style>
