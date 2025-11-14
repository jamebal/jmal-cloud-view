<template>
  <div :style="appStyle">

    <div class="create-burn-note burn-note-container" :style="uploadStyle">
      <el-card class="burn-card">

        <div v-if="netdiskLogo" class="title-container">
          <div class="title">
            <Logo v-model="netdiskLogo" width="65"></Logo>
            <div class="jmal-cloud-name">
              <div>{{ netdiskName ? netdiskName : 'JmalCloud' }}</div>
            </div>
          </div>
        </div>

        <!-- HTTPS 安全警告 -->
        <el-alert
          v-if="!isHttps"
          title="⚠️ 安全警告"
          type="error"
          :closable="false"
          show-icon
          class="https-warning"
        >
          <template slot>
            <p class="warning-text">
              当前连接不安全！阅后即焚笔记使用端到端加密，但在非 HTTPS 连接下：
            </p>
            <ul class="warning-list">
              <li>🚨 传输过程可能被窃听</li>
              <li>🚨 Web Crypto API 可能受限</li>
              <li>🚨 无法保证数据安全性</li>
            </ul>
          </template>
        </el-alert>

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
              rows="6"
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
                支持任意格式，最大 1 GB
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
              class="upload-file"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                点击或拖拽文件到此处
                <em>支持任意格式，最大 1 GB</em>
              </div>
            </el-upload>
          </el-form-item>

          <!-- 上传进度 -->
          <el-form-item v-if="uploading"  label="上传进度">
            <el-progress :percentage="uploadProgress" :status="uploadProgress === 100 ? 'success' : null" :stroke-width="10"></el-progress>
          </el-form-item>


          <el-form-item class="form-item-submit">
            <div class="form-item-submit-content">
              <el-button
                round
                size="medium"
                type="primary"
                :loading="loading"
                :disabled="encrypting || uploading"
                @click="beforeHandleCreate"
                class="create-btn"
              >
                {{ loading ? '创建中...' : '创建笔记' }}
              </el-button>
              <span v-if="expirationType === 'views'" class="tip">该笔记将在查看 <strong>{{ form.views }}</strong> 次后销毁。或在24小时后自动销毁。</span>
              <span v-if="expirationType === 'time'"  class="tip">该笔记将在 <strong>{{ form.expirationMinutes }}</strong> 分钟后销毁。</span>
            </div>
          </el-form-item>

          <el-collapse class="collapse-setting">
            <el-collapse-item title="更多设置" name="1">

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
                <el-input-number v-model="form.views" :min="1" :max="100" class="input-number"/>
              </el-form-item>

              <el-form-item v-if="expirationType === 'time'" :label="isMobile ? '' : '过期时间'">
                <el-input-number v-model="form.expirationMinutes" :min="1" :max="1440" class="input-number"/>
              </el-form-item>

            </el-collapse-item>
          </el-collapse>

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
            <el-button round size="medium" @click="reset" class="new-note-btn">
              创建新笔记
            </el-button>
          </div>
        </div>
      </el-card>
      <wechat-guide></wechat-guide>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo/index.vue'
import background from './mixins/background'
import WechatGuide from '@/components/WechatGuide/index.vue'
import { copyText } from '@/utils/copy-text'
import { BurnNoteCrypto } from '@/utils/crypto-util'
import { createBurnNote } from '@/api/burn-note'
import QRCode from 'qrcode'
import request from '@/utils/request'

export default {
  name: 'CreateBurnNote',
  components: { Logo, WechatGuide },
  mixins: [background],
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
      uploadProgress: 0,
      shareUrl: '',
      fileList: [],
      selectedFile: null,
      isHttps: false,
      uploadStyle: { '--icon-display': 'block', '--el-upload-list--text': -1 }
    }
  },
  watch: {
    netdiskName(newValue) {
      $J.setTile(`创建阅后即焚笔记 - ${newValue}`)
    },
    fileList(newValue) {
      if (newValue && newValue.length > 0) {
        this.uploadStyle = { '--icon-display': 'none', '--el-upload-list--text': 1  }
      } else {
        this.uploadStyle = { '--icon-display': 'block', '--el-upload-list--text': -1  }
      }
    },
  },
  mounted() {
    this.checkHttps()
  },
  methods: {
    /**
     * 检查是否使用 HTTPS
     */
    checkHttps() {
      this.isHttps = window.location.protocol === 'https:'

      // 生成 HTTPS URL（如果当前是 HTTP）
      if (!this.isHttps) {
        // 检查浏览器是否支持 Web Crypto API
        if (!window.crypto || !window.crypto.subtle) {
          this.$message.error('当前浏览器不支持加密功能，请使用 HTTPS 或更换浏览器')
        }
      }
    },

    handleFileChange(file) {
      this.selectedFile = file.raw
      this.fileList = [file]
    },
    handleFileRemove() {
      this.selectedFile = null
      this.fileList = []
    },
    async beforeHandleCreate() {
      // HTTPS 检查
      if (!this.isHttps) {
        this.$confirm(
          '当前连接不安全，无法保证数据加密传输。请使用HTTPS! ',
          '安全警告',
          {
            confirmButtonText: '无视继续',
            cancelButtonText: '取消',
            type: 'error'
          }
        ).then(() => {
          this.handleCreate()
        })
      } else {
        await this.handleCreate()
      }
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
      this.shareUrl = this.getShareUrl(response.data, key)
      this.$nextTick(() => this.generateQRCode())
    },

    /**
     * 创建文件笔记
     */
    async createFileNote(key) {
      // 加密文件
      this.encrypting = true
      const result = await BurnNoteCrypto.encryptFile(
        this.selectedFile,
        key
      )
      this.encrypting = false
      // 加密元数据
      const encryptedContent = await BurnNoteCrypto.encrypt(JSON.stringify(result.metadata), key)
      // 创建笔记记录
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

      // 上传分片
      await this.uploadChunk(noteId, result.encryptedChunks)

      // 生成分享链接
      this.shareUrl = this.getShareUrl(noteId, key)
      this.$nextTick(() => this.generateQRCode())
    },
    getShareUrl(noteId, key) {
      return `${window.location.origin}/b/${noteId}#${key}`
    },

    async uploadChunk(noteId, encryptedChunks) {
      this.uploading = true;
      this.uploadProgress = 0;
      const totalChunks = encryptedChunks.length;
      let uploadedChunks = 0;

      // 创建一个分片任务队列
      const chunksQueue = [...encryptedChunks.entries()];

      // 并发池大小
      const concurrencyLimit = 4;

      const worker = async () => {
        while (true) {
          const task = chunksQueue.shift();

          if (!task) {
            break;
          }

          const [index, chunk] = task;

          try {
            const chunkBlob = new Blob([chunk], { type: 'application/octet-stream' });
            const formData = new FormData();
            formData.append('file', chunkBlob, `chunk_${index}`);

            await request({
              url: `/burn-notes/${noteId}/chunks/${index}`,
              method: 'post',
              headers: { 'Content-Type': 'multipart/form-data' },
              data: formData
            });

            // 只有在上传成功后才更新进度
            uploadedChunks++;
            this.uploadProgress = Math.round((uploadedChunks / totalChunks) * 100);

          } catch (error) {
            throw new Error(`分片 ${index} 上传失败`);
          }
        }
      };

      // 创建并启动 worker 池
      const workerPromises = [];
      for (let i = 0; i < concurrencyLimit; i++) {
        workerPromises.push(worker());
      }

      // 等待所有 worker 完成
      await Promise.all(workerPromises);

      this.uploading = false;
    },

    copyUrl() {
      copyText(this.shareUrl)
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
      this.uploadProgress = 0
    }
  }
}
</script>

<style scoped lang="scss">
@import 'src/styles/index';
@import 'src/styles/home-index';

.https-warning {
  margin-bottom: 20px;
}

.collapse-setting {
  margin: 0 0 10px 35px;
  border-top: none;
  >>>.el-collapse-item__wrap,>>>.el-collapse-item__header {
    background: inherit;
    color: var(--text-color);
  }
}

.create-burn-note {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  .input-number {
    width: 135px;
  }

  .form-item-submit-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (min-width: 768px) {
    >>>.el-upload,>>>.el-upload-dragger {
      border-radius: 12px;
      width: 100%;
      .el-icon-upload {
        display: var(--icon-display);
      }
      .el-upload__text {
        display: var(--icon-display);
      }
    }

    >>>.el-upload-list--text {
      position: absolute;
      top: 0;
      z-index: var(--el-upload-list--text);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      .el-upload-list__item {
        width: auto;
        display: flex;
        align-items: center;
        font-size: 14px;
        padding: 10px;
        border-radius: 10px;
        max-width: 400px;
        .el-icon-close {
          position: relative;
          top: 0;
          right: 0;
        }
        &:hover {
          background: var(--tip-bg-color);
        }
      }
    }

    .upload-file {

      max-height: 180px;

    }
  }

  .tip {
    margin: 0;
    padding: 12px 20px;
    background: var(--tip-bg-color);
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    line-height: 1.6;

    strong {
      color: var(--primary-color);
      font-weight: 700;
    }
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

  /* 移动端适配 */
  @media (max-width: 768px) {
    .form-item-submit-content {
      flex-direction: column;
      gap: 1rem;
    }
  }

}

@import "./style.scss";
</style>
