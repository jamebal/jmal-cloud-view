<template>
  <div class="create-burn-note">
    <el-card>
      <div slot="header">
        <div class="title">创建阅后即焚笔记</div>
      </div>

      <!-- 创建表单 -->
      <el-form v-if="!shareUrl" :model="form" label-width="120px">
        <el-form-item label="笔记内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="输入你的秘密信息..."
          />
        </el-form-item>

        <el-form-item label="设置方式">
          <el-radio-group v-model="expirationType">
            <el-radio label="views">查看次数</el-radio>
            <el-radio label="time">过期时间</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="expirationType === 'views'" label="查看次数">
          <el-input-number
            v-model="form.views"
            :min="1"
            :max="100"
            :step="1"
          />
          <span class="tip">笔记被查看指定次数后自动销毁</span>
        </el-form-item>

        <el-form-item v-if="expirationType === 'time'" label="过期时间">
          <el-input-number
            v-model="form.expirationMinutes"
            :min="1"
            :max="1440"
            :step="1"
          />
          <span class="tip">分钟后自动过期</span>
        </el-form-item>

        <el-form-item>
          <el-button
            round
            type="primary"
            :loading="loading"
            @click="handleCreate"
          >
            创建笔记
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 分享链接 -->
      <div v-else class="share-result">
        <el-alert
          title="笔记创建成功!"
          type="success"
          :closable="false"
        />

        <div class="share-url">
          <el-input
            v-model="shareUrl"
            readonly
          >
            <el-button round slot="append" @click="copyUrl">复制链接</el-button>
          </el-input>
        </div>

        <el-alert
          title="⚠️ 请妥善保管此链接，密钥已包含在 URL 中"
          type="warning"
          :closable="false"
        />

        <div class="qrcode-container">
          <canvas ref="qrcode"></canvas>
          <p class="qrcode-tip">扫码查看笔记</p>
        </div>

        <el-button round @click="reset" style="margin-top: 20px">
          创建新笔记
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { BurnNoteCrypto } from '@/utils/crypto-util'
import { createBurnNote } from '@/api/burn-note'
import QRCode from 'qrcode'

export default {
  name: 'CreateBurnNote',
  data() {
    return {
      form: {
        content: '',
        views: 1,
        expirationMinutes: 60
      },
      expirationType: 'views',
      loading: false,
      shareUrl: ''
    }
  },
  methods: {
    async handleCreate() {
      if (!this.form.content) {
        this.$message.warning('请输入笔记内容')
        return
      }

      try {
        this.loading = true

        // 1. 生成密钥（异步）
        const key = await BurnNoteCrypto.generateKey()

        // 2. 加密内容（异步）
        const encryptedContent = await BurnNoteCrypto.encrypt(this.form.content, key)

        // 3. 准备请求数据
        const data = {
          encryptedContent,
          meta: JSON.stringify({ type: 'text' }),
          views: this.expirationType === 'views' ? this.form.views : null,
          expirationMinutes: this.expirationType === 'time' ? this.form.expirationMinutes : null
        }

        // 4. 创建笔记
        const response = await createBurnNote(data)

        // 5. 生成分享链接
        const origin = window.location.origin
        this.shareUrl = `${origin}/burn-note/${response.data}/${key}`

        // 6. 生成二维码
        this.$nextTick(() => {
          this.generateQRCode()
        })

      } catch (error) {
        console.error('创建失败:', error)
        this.$message.error('创建失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },

    copyUrl() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.shareUrl).then(() => {
          this.$message.success('链接已复制到剪贴板')
        }).catch(() => {
          this.fallbackCopy()
        })
      } else {
        this.fallbackCopy()
      }
    },

    fallbackCopy() {
      const input = document.createElement('input')
      input.value = this.shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('链接已复制到剪贴板')
    },

    generateQRCode() {
      const canvas = this.$refs.qrcode
      if (canvas) {
        QRCode.toCanvas(canvas, this.shareUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }, (error) => {
          if (error) {
            console.error('生成二维码失败:', error)
          }
        })
      }
    },

    reset() {
      this.shareUrl = ''
      this.form.content = ''
      this.form.views = 1
      this.form.expirationMinutes = 60
      this.expirationType = 'views'
    }
  }
}
</script>

<style scoped lang="scss">
@import 'src/styles/index';
@import 'src/styles/home-index';
@import "./style.scss";

.create-burn-note {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
  }

  .tip {
    margin-left: 10px;
    color: var(--text-secondary-color);
    font-size: 12px;
  }

  .share-result {
    .share-url {
      margin: 20px 0;
    }

    .qrcode-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
      padding: 20px;
      background: var(--bg-color);
      border-radius: 4px;

      canvas {
        margin-bottom: 10px;
      }

      .qrcode-tip {
        margin: 0;
        color: var(--text-secondary-color);
        font-size: 14px;
      }
    }
  }
}
</style>
