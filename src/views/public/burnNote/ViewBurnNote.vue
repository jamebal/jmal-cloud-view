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
import streamSaver from 'streamsaver';
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
     * 下载并解密文件
     * 采用【分批并发下载】+【有序流式写入】，保证文件正确性、高性能和低内存占用
     */
    async handleDownload() {
      this.downloading = true;
      this.downloadProgress = 0;
      this.downloadStatus = '准备下载...';
      let writer = null;

      try {
        const totalChunks = this.noteMetadata.totalChunks;

        // 1. 获取文件写入流 (不变)
        let fileStream;
        this.downloadStatus = '等待用户授权保存...';
        const suggestedFilename = this.getDownloadFilename(this.noteMetadata.originalName);
        if (window.showSaveFilePicker) {
          const handle = await window.showSaveFilePicker({ suggestedName: suggestedFilename });
          fileStream = await handle.createWritable();
        } else {
          fileStream = streamSaver.createWriteStream(suggestedFilename, { size: this.noteMetadata.originalSize });
        }
        writer = fileStream.getWriter();

        // 并发数
        const concurrencyLimit = 4;
        let processedChunks = 0;

        this.downloadStatus = `下载中...`;
        // 外层循环按“批”进行
        for (let i = 0; i < totalChunks; i += concurrencyLimit) {

          // a. 创建当前批次的任务 Promises
          const batchPromises = [];
          const batchEnd = Math.min(i + concurrencyLimit, totalChunks);
          for (let j = i; j < batchEnd; j++) {
            // 定义一个立即执行的异步函数来处理单个分片
            const processChunk = async (chunkIndex) => {
              // 下载
              const response = await axios({
                url: `${process.env.VUE_APP_BASE_API}/public/burn-notes/${this.noteId}/chunks/${chunkIndex}`,
                method: 'get',
                responseType: 'arraybuffer'
              });
              const encryptedArrayBuffer = response.data;
              // 解密
              return await BurnNoteCrypto.decryptChunk(encryptedArrayBuffer, this.key, chunkIndex);
            };
            batchPromises.push(processChunk(j));
          }

          // b. 并发执行当前批次的所有任务
          // `Promise.all` 会保持结果的原始顺序
          const decryptedBatch = await Promise.all(batchPromises);

          // c. 按顺序将该批次的结果写入文件流
          for (const decryptedChunk of decryptedBatch) {
            await writer.write(decryptedChunk);

            // d. 更新总进度
            processedChunks++;
            this.downloadProgress = Math.round((processedChunks / totalChunks) * 100);
          }
        }

        // 3. 关闭文件流
        this.downloadStatus = '文件合并完成，正在保存...';
        await writer.close();
        writer = null;

        this.downloaded = true;

        // 4. 确认删除
        await this.confirmDelete();

      } catch (error) {
        if (error.name === 'AbortError') {
          this.$message.info('您取消了文件保存');
        } else {
          console.error('下载失败:', error);
          this.$message.error('下载失败: ' + (error.message || '未知错误'));
        }
        if (writer) {
          await writer.abort(error);
        }
      } finally {
        this.downloading = false;
      }
    },

    /**
     * 根据原始文件名，生成一个包含【用户本地时区】时间戳的唯一文件名
     * @param {string} originalName - 原始文件名，例如 "report.docx"
     * @returns {string} - 唯一文件名，例如 "report_2025-11-13_10-30-00.docx"
     */
    getDownloadFilename(originalName) {
      const now = new Date();
      const year = now.getFullYear();
      // getMonth() 返回 0-11，所以需要 +1
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      // 拼接成用户友好的本地时间戳
      const timestamp = `${year}-${month}-${day}_${hours}-${minutes}`;
      // ==========================================================

      // 文件名和扩展名拼接逻辑保持不变
      const dotIndex = originalName.lastIndexOf('.');
      let uniqueName;

      if (dotIndex === -1) {
        // 没有扩展名，例如 "archive"
        uniqueName = `${originalName}_${timestamp}`;
      } else {
        // 有扩展名，例如 "report.docx"
        const basename = originalName.slice(0, dotIndex);
        const extension = originalName.slice(dotIndex); // .docx
        uniqueName = `${basename}_${timestamp}${extension}`;
      }

      return uniqueName;
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
