<template>
  <div class="burn-note-container view-burn-note">
    <el-card v-loading="loading" :element-loading-text="loadingText">
      <div slot="header">
        <div class="title">阅后即焚笔记</div>
      </div>

      <!-- 笔记不存在 -->
      <el-alert
        v-if="!loading && !exists"
        title="笔记不存在或已被查看"
        type="error"
        :closable="false"
      />


      <!-- 文本笔记 -->
      <div v-else-if="!isFileType && decryptedContent" class="content">
        <el-alert
          title="✅ 笔记已读取，即将销毁。"
          type="warning"
          :closable="false"
        />
        <div class="note-content">{{ decryptedContent }}</div>
      </div>

      <!-- 文件笔记 -->
      <div v-else-if="isFileType && noteMetadata" class="file-content">
        <el-alert
          title="✅ 文件笔记已读取，将在下载后销毁。"
          type="warning"
          :closable="false"
        />
        <div class="file-info">
          <p><strong>文件名：</strong>{{ noteMetadata.originalName }}</p>
          <p><strong>文件大小：</strong>{{ formatSize(noteMetadata.originalSize) }}</p>
          <p><strong>文件类型：</strong>{{ noteMetadata.mimeType }}</p>
        </div>

        <!-- 下载进度 -->
        <div v-if="downloading" class="download-progress">
          <p>{{ downloadStatus }}</p>
          <el-progress
            :percentage="downloadProgress"
            :status="downloadProgress === 100 ? 'success' : null"
          />
        </div>

        <!-- 下载按钮 -->
        <el-button
          round
          v-if="!downloaded"
          type="primary"
          icon="el-icon-download"
          :loading="downloading"
          :disabled="downloading"
          @click="handleDownload"
        >
          {{ downloading ? '下载中...' : '下载文件' }}
        </el-button>

        <el-alert
          v-if="downloaded"
          title="✅ 文件已下载并解密完成！已被销毁。"
          type="success"
          :closable="false"
          style="margin-top: 20px"
        />

        <el-alert
          v-if="!downloaded"
          title="⚠️ 注意：下载后此文件将被销毁"
          type="warning"
          :closable="false"
          style="margin-top: 10px"
        />
      </div>

      <!-- 等待用户确认查看 -->
      <div v-else-if="!loading && exists" class="confirm-view">
        <el-alert
          title="⚠️ 注意: 点击查看后，此笔记将被销毁。"
          type="warning"
          :closable="false"
        />
        <el-button
          round
          type="primary"
          style="margin-top: 20px"
          @click="handleView"
        >
          查看笔记
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { formatSize } from '@/utils/number'
import { BurnNoteCrypto } from '@/utils/crypto-util'
import { checkBurnNote, consumeBurnNote, confirmDelete } from '@/api/burn-note'

export default {
  name: 'ViewBurnNote',
  data() {
    return {
      noteId: this.$route.params.id,
      key: this.$route.params.key,
      loading: true,
      loadingText: '检查中...',
      exists: false,
      isFileType: false,
      decryptedContent: '',
      noteMetadata: null,
      downloading: false,
      downloadProgress: 0,
      downloadStatus: '',
      downloaded: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      if (!this.key) {
        this.$message.error('缺少解密密钥')
        this.loading = false
        return
      }

      // 检查笔记是否存在
      try {
        const response = await checkBurnNote(this.noteId)
        this.exists = response.data
      } catch (error) {
        console.error('检查失败:', error)
        this.exists = false
      } finally {
        this.loading = false
      }
    },

    async handleView() {
      try {
        this.loading = true
        this.loadingText = '读取中...'

        // 读取笔记
        const response = await consumeBurnNote(this.noteId)
        const burnNote = response.data

        // 解析元数据
        const encrypted = burnNote.encryptedContent
        if (burnNote.isFile) {
          // 文件类型
          this.isFileType = true
          this.noteMetadata = JSON.parse(await BurnNoteCrypto.decrypt(encrypted, this.key))
        } else {
          // 文本类型
          this.isFileType = false
          this.decryptedContent = await BurnNoteCrypto.decrypt(encrypted, this.key)
        }
      } catch (error) {
        console.error('读取失败:', error)
        this.$message.error('读取失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },

    /**
     * 下载并解密文件（边下载边解密）
     */
    async handleDownload() {
      try {
        this.downloading = true
        this.downloadProgress = 0
        this.downloadStatus = '准备下载...'

        const totalChunks = this.noteMetadata.totalChunks
        const decryptedChunks = []

        // 逐块下载并解密
        for (let i = 0; i < totalChunks; i++) {
          this.downloadStatus = `下载分片 ${i + 1}/${totalChunks}...`

          // 1. 下载二进制分片
          const response = await axios({
            url: `/api/public/burn-notes/${this.noteId}/chunks/${i}`,
            method: 'get',
            responseType: 'arraybuffer'
          })

          const encryptedArrayBuffer = response.data

          // 2. 解密分片
          // 将 ArrayBuffer 转为 Base64URL
          const encryptedBase64URL = this.arrayBufferToBase64URL(encryptedArrayBuffer)

          // 解密
          const decryptedUint8Array = await BurnNoteCrypto.decryptChunk(
            encryptedBase64URL,
            this.key
          )

          decryptedChunks.push(decryptedUint8Array)

          // 3. 更新进度
          this.downloadProgress = Math.round(((i + 1) / totalChunks) * 100)
        }

        // 4. 合并所有解密后的分片
        this.downloadStatus = '合并文件...'
        const blob = new Blob(decryptedChunks, { type: this.noteMetadata.mimeType })

        // 5. 触发浏览器下载
        this.downloadStatus = '保存文件...'
        this.downloadFile(blob, this.noteMetadata.originalName)

        this.downloaded = true
        this.$message.success('文件下载完成！')

        // 6. 确认删除
        await this.confirmDelete()

      } catch (error) {
        console.error('下载失败:', error)
        this.$message.error('下载失败: ' + (error.message || '未知错误'))
      } finally {
        this.downloading = false
      }
    },

    /**
     * 触发浏览器下载
     */
    downloadFile(blob, filename) {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    },

    /**
     * 确认删除笔记
     */
    async confirmDelete() {
      try {
        await confirmDelete(this.noteId)
        console.log('笔记已确认删除')
      } catch (error) {
        console.error('确认删除失败:', error)
      }
    },

    /**
     * ArrayBuffer 转 Base64URL
     */
    arrayBufferToBase64URL(buffer) {
      const bytes = new Uint8Array(buffer)
      let binary = ''
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    },

    /**
     * 格式化文件大小
     */
    formatSize(bytes) {
      return formatSize(bytes)
    }
  }
}
</script>

<style scoped lang="scss">

@import 'src/styles/index';
@import 'src/styles/home-index';

.view-burn-note {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  .content {
    .note-content {
      margin-top: 20px;
      padding: 20px;
      background: var(--burn-note-content-bg-color);
      border-radius: 16px;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-height: 1.8;
      font-size: 14px;
      color: var(--text-color, #303133);
      max-width: 100%;
    }
  }

  .file-content {
    .file-info {
      margin: 20px 0;
      padding: 15px;
      background: var(--burn-note-content-bg-color);
      border-radius: 8px;

      p {
        margin: 8px 0;
        font-size: 14px;
        color: var(--text-color);

        strong {
          color: var(--text-color-hover);
          margin-right: 10px;
        }
      }
    }

    .download-progress {
      margin: 20px 0;

      p {
        margin-bottom: 10px;
        color: var(--text-color);
      }
    }
  }

  .confirm-view {
    text-align: center;
    padding: 40px 20px;
  }
}

@import "./style.scss";

</style>
