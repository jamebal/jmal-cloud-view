<template>
  <div class="create-burn-note burn-note-container">
    <el-card>
      <div slot="header">
        <div class="title">创建阅后即焚笔记</div>
      </div>

      <el-form v-if="!shareUrl" :model="form" label-width="100px" class="note-form" :label-position="isMobile ? 'top' : 'right'">
        <!-- 类型选择 -->
        <el-form-item :label="isMobile ? '' : '类型选择'" class="form-item-type">

          <van-radio-group v-if="isMobile" v-model="noteType" direction="horizontal">
            <van-radio name="text">文本</van-radio>
            <van-radio name="file">文件</van-radio>
          </van-radio-group>

          <el-radio-group v-else v-model="noteType">
            <el-radio label="text">文本</el-radio>
            <el-radio label="file">文件</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 文本输入 -->
        <el-form-item v-if="noteType === 'text'" :label="isMobile ? '' : '笔记内容'" class="form-item-content">

          <van-field
            v-if="isMobile"
            v-model="form.content"
            rows="12"
            autosize
            type="textarea"
            placeholder="输入你的秘密信息..."
            maxlength="10000"
            show-word-limit
          />

          <el-input
            v-else
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="输入你的秘密信息..."
            maxlength="10000"
            show-word-limit
          />
        </el-form-item>

        <!-- 文件上传 -->
        <el-form-item v-if="noteType === 'file'" :label="isMobile ? '' : '文件选择'" class="form-item-file">
          <el-upload
            v-if="isMobile"
            ref="upload"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            :limit="1"
          >
            <el-button round size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">
              支持任意格式，最大 100MB
            </div>
          </el-upload>
          <el-upload
            v-else
            ref="upload"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="fileList"
            :limit="1"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              点击或拖拽文件到此处
              <em>支持任意格式，最大 1 GB</em>
            </div>
          </el-upload>
        </el-form-item>

        <!-- 加密进度 -->
        <el-form-item v-if="encrypting" label="加密进度">
          <el-progress :percentage="encryptProgress" :status="encryptProgress === 100 ? 'success' : null" :stroke-width="10"></el-progress>
        </el-form-item>

        <!-- 上传进度 -->
        <el-form-item v-if="uploading"  label="上传进度">
          <el-progress :percentage="uploadProgress" :status="uploadProgress === 100 ? 'success' : null" :stroke-width="10"></el-progress>
        </el-form-item>

        <el-form-item :label="isMobile ? '' : '设置方式'" class="form-item-expiry">
          <van-radio-group v-if="isMobile" v-model="expirationType" direction="horizontal">
            <van-radio name="views">查看次数</van-radio>
            <van-radio name="time">过期时间</van-radio>
          </van-radio-group>

          <el-radio-group v-else v-model="expirationType">
            <el-radio label="views">查看次数</el-radio>
            <el-radio label="time">过期时间</el-radio>
          </el-radio-group>

        </el-form-item>

        <el-form-item v-if="expirationType === 'views'" :label="isMobile ? '' : '查看次数'">
          <el-input-number v-model="form.views" :min="1" :max="100"/>
          <span class="tip">次后销毁</span>
        </el-form-item>

        <el-form-item v-if="expirationType === 'time'" :label="isMobile ? '' : '过期时间'">
          <el-input-number v-model="form.expirationMinutes" :min="1" :max="1440" />
          <span class="tip">分钟后过期</span>
        </el-form-item>

        <el-form-item class="form-item-submit">
          <el-button
            round
            type="primary"
            :loading="loading"
            :disabled="encrypting || uploading"
            @click="handleCreate"
            class="create-btn"
          >
            {{ loading ? '创建中...' : '创建笔记' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 分享链接 -->
      <div v-else class="share-result">
        <el-alert title="笔记创建成功!" type="success" :closable="false" />

        <div class="share-url">
          <el-input v-model="shareUrl" readonly>
            <el-button slot="append" icon="el-icon-document-copy" @click="copyUrl">
              复制
            </el-button>
          </el-input>
        </div>

        <el-alert
          title="⚠️ 请妥善保管"
          description="此链接包含解密密钥，分享后无法撤回"
          type="warning"
          :closable="false"
          show-icon
        />

        <div class="qrcode-container">
          <canvas ref="qrcode"></canvas>
          <p class="qrcode-tip">扫码查看笔记</p>
        </div>

        <div class="result-actions">
          <el-button round @click="reset" class="new-note-btn">
            创建新笔记
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { BurnNoteCrypto } from '@/utils/crypto-util'
import { createBurnNote } from '@/api/burn-note'
import QRCode from 'qrcode'
import request from '@/utils/request'

export default {
  name: 'CreateBurnNote',
  data() {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
      noteType: 'text',
      form: {
        content: '',
        views: 1,
        expirationMinutes: 60
      },
      expirationType: 'views',
      loading: false,
      encrypting: false,
      uploading: false,
      encryptProgress: 0,
      uploadProgress: 0,
      shareUrl: '',
      fileList: [],
      selectedFile: null
    }
  },
  methods: {
    handleFileChange(file) {
      this.selectedFile = file.raw
      this.fileList = [file]
    },
    handleFileRemove() {
      this.selectedFile = null
      this.fileList = []
    },

    async handleCreate() {
      // 校验
      if (this.noteType === 'text' && !this.form.content) {
        this.$message.warning('请输入笔记内容')
        return
      }

      if (this.noteType === 'file' && !this.selectedFile) {
        this.$message.warning('请选择文件')
        return
      }

      if (this.selectedFile && this.selectedFile.size > 1024 * 1024 * 1024) {
        this.$message.error('文件大小不能超过 1GB')
        return
      }

      try {
        this.loading = true

        // 生成密钥
        const key = await BurnNoteCrypto.generateKey()

        if (this.noteType === 'text') {
          // 文本笔记
          await this.createTextNote(key)
        } else {
          // 文件笔记
          await this.createFileNote(key)
        }
      } catch (error) {
        console.error('创建失败:', error)
        this.$message.error('创建失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
        this.encrypting = false
        this.uploading = false
      }
    },

    /**
     * 创建文本笔记
     */
    async createTextNote(key) {
      // 加密内容
      const encryptedContent = await BurnNoteCrypto.encrypt(this.form.content, key)

      // 创建笔记
      const data = {
        encryptedContent,
        isFile: false,
        views: this.expirationType === 'views' ? this.form.views : null,
        expirationMinutes: this.expirationType === 'time' ? this.form.expirationMinutes : null
      }

      const response = await createBurnNote(data)
      this.shareUrl = `${window.location.origin}/b/${response.data}/${key}`
      this.$nextTick(() => this.generateQRCode())
    },

    /**
     * 创建文件笔记
     */
    async createFileNote(key) {
      // 1. 加密文件
      this.encrypting = true
      const result = await BurnNoteCrypto.encryptFile(
        this.selectedFile,
        key,
        (progress) => {
          this.encryptProgress = progress
        }
      )
      this.encrypting = false
      const encryptedContent = await BurnNoteCrypto.encrypt(JSON.stringify(result.metadata), key)
      // 2. 创建笔记记录
      const noteData = {
        encryptedContent: encryptedContent,
        isFile: true,
        totalChunks: result.encryptedChunks.length,
        fileSize: this.selectedFile.size,
        views: this.expirationType === 'views' ? this.form.views : null,
        expirationMinutes: this.expirationType === 'time' ? this.form.expirationMinutes : null
      }

      const response = await createBurnNote(noteData)
      const noteId = response.data

      // 3. 上传分片
      this.uploading = true
      for (let i = 0; i < result.encryptedChunks.length; i++) {
        // 将 Base64URL 转为 Blob
        const binaryData = this.base64URLToBlob(result.encryptedChunks[i])

        const formData = new FormData()
        formData.append('file', binaryData, `chunk_${i}`)

        await request({
          url: `/burn-notes/${noteId}/chunks/${i}`,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        })

        this.uploadProgress = Math.round(((i + 1) / result.encryptedChunks.length) * 100)
      }
      this.uploading = false

      // 4. 生成分享链接
      this.shareUrl = `${window.location.origin}/b/${noteId}/${key}`
      this.$nextTick(() => this.generateQRCode())
    },

    /**
     * Base64URL 转 Blob
     */
    base64URLToBlob(base64url) {
      let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')

      const padding = base64.length % 4
      if (padding > 0) {
        base64 += '='.repeat(4 - padding)
      }

      const binaryString = window.atob(base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      return new Blob([bytes], { type: 'application/octet-stream' })
    },

    copyUrl() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.shareUrl).then(() => {
          this.$message.success('链接已复制到剪贴板')
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
          margin: 2
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
      this.noteType = 'text'
      this.fileList = []
      this.selectedFile = null
      this.encryptProgress = 0
      this.uploadProgress = 0
    }
  }
}
</script>

<style scoped lang="scss">
@import 'src/styles/index';
@import 'src/styles/home-index';

.create-burn-note {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

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

  .el-progress {
    line-height: 40px;
  }
}

@import "./style.scss";
</style>
