<template>
  <div class="upload-input-image">
    <el-row>
      <el-col :xs="24">
        <select-file
          title="选择图片"
          @select="handleSelectedFile"
          :visible.sync="dialogSelectFile"
        />

        <div class="upload">
          <el-button
            v-if="enableSelect"
            round
            class="upload-select-btn"
            title="选择文件"
            type="primary"
            size="small"
            icon="el-icon-folder"
            circle
            @click="dialogSelectFile = true"
          />

          <el-upload
            ref="uploadRef"
            class="upload"
            action="/api/upload-markdown-image"
            :headers="uploadHeaders"
            :data="uploadData"
            name="files"
            :accept="accept"
            :show-file-list="false"
            :file-list="fileList"
            :limit="1"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
            :on-remove="handleFileListRemove"
            :on-progress="handleProgress"
          >
            <el-button
              round
              title="上传"
              type="primary"
              size="small"
              icon="el-icon-upload2"
              circle
            />
            <span v-if="desc">{{ desc }}</span>

            <div v-if="showUploadTip" class="url-desc" slot="tip">
              <span>{{ uploadStateText }}</span>
              <i :class="uploadStateIcon" />
            </div>
          </el-upload>
        </div>
      </el-col>

      <el-col :xs="24">
        <el-tooltip class="item" effect="dark" placement="bottom">
          <el-input
            :autosize="inputAutosize"
            :placeholder="inputPlaceholder"
            type="textarea"
            v-model="currentValue"
            @change="handleChange"
            @focus="handleFocus"
            @blur="handleBlur"
          />

          <div slot="content">
            <el-image
              :style="{ maxWidth: tipImageMaxWidth + 'px' }"
              :src="currentValue"
              fit="contain"
              @load="handleImageLoad"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import fileApi from '@/api/file-api'
import fileConfig from '@/utils/file-config'
import SelectFile from '@/components/ShowFile/SelectFile'

// 上传状态枚举
const UPLOAD_STATE = {
  IDLE: 0,
  UPLOADING: 1,
  SUCCESS: 2,
  UNSUPPORTED: 3,
  LOADING: 4
}

// 上传成功提示显示时长
const SUCCESS_TIP_DURATION = 3000

// 自动上传延迟时间
const AUTO_UPLOAD_DELAY = 300

export default {
  name: 'UploadImageInput',

  components: { SelectFile },

  props: {
    value: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    tipImageMaxWidth: {
      type: Number,
      default: 250
    },
    placeholder: {
      type: String,
      default: '点击上传'
    },
    inputAutosize: {
      type: Object,
      default: () => ({ minRows: 1, maxRows: 6 })
    },
    enableSelect: {
      type: Boolean,
      default: true
    },
    enableUrl: {
      type: Boolean,
      default: true
    },
    desc: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      currentValue: this.value,
      fileList: [],
      isInputFocused: false,
      autoUploadTimer: null,
      uploadState: UPLOAD_STATE.IDLE,
      dialogSelectFile: false,
      uploadPercentage: 0
    }
  },

  computed: {
    // 用户信息
    userInfo() {
      return {
        token: this.$store.state.user.token,
        name: this.$store.state.user.name,
        userId: this.$store.state.user.userId
      }
    },

    // 上传请求头
    uploadHeaders() {
      return {
        'jmal-token': this.userInfo.token,
        'name': this.userInfo.name,
        'username': this.userInfo.name,
        'userId': this.userInfo.userId
      }
    },

    // 上传额外数据
    uploadData() {
      return {
        'username': this.userInfo.name,
        'userId': this.userInfo.userId
      }
    },

    // 输入框占位符
    inputPlaceholder() {
      const urlPrefix = this.enableUrl ? '请输入图片的url 或 ' : ''
      return urlPrefix + this.placeholder
    },

    // 是否显示上传提示
    showUploadTip() {
      return this.uploadState !== UPLOAD_STATE.IDLE
    },

    // 上传状态文本
    uploadStateText() {
      const stateTexts = {
        [UPLOAD_STATE.UPLOADING]: '图片上传中' + this.uploadPercentage + '%',
        [UPLOAD_STATE.SUCCESS]: '图片上传成功',
        [UPLOAD_STATE.UNSUPPORTED]: '该图片不支持自动上传',
        [UPLOAD_STATE.LOADING]: '图片加载中'
      }
      return stateTexts[this.uploadState] || ''
    },

    // 上传状态图标
    uploadStateIcon() {
      return {
        'el-icon-loading': [UPLOAD_STATE.UPLOADING, UPLOAD_STATE.LOADING].includes(this.uploadState),
        'el-icon-check': this.uploadState === UPLOAD_STATE.SUCCESS,
        'el-icon-warning-outline': this.uploadState === UPLOAD_STATE.UNSUPPORTED
      }
    },

    // 当前值是否为外部URL
    isExternalUrl() {
      return this.currentValue && !this.currentValue.startsWith(window.location.origin)
    }
  },

  watch: {
    value(val) {
      this.currentValue = val
    }
  },

  beforeDestroy() {
    // 清理定时器，防止内存泄漏
    this.clearAutoUploadTimer()
  },

  methods: {
    // 处理输入框变化
    handleChange(value) {
      this.isInputFocused = false
      this.$emit('input', value)
    },

    // 处理输入框聚焦
    handleFocus() {
      this.isInputFocused = true
    },

    // 处理输入框失焦
    handleBlur() {
      this.isInputFocused = false
    },

    // 处理文件选择
    handleSelectedFile(row) {
      fileApi.setPublic({ fileId: row.id }).then(() => {
        this.currentValue = window.location.origin + fileConfig.previewUrl(
          this.userInfo.name,
          row,
          undefined
        )
        this.handleChange(this.currentValue)
      })
    },

    // 上传前钩子
    handleBeforeUpload() {
      this.uploadState = UPLOAD_STATE.UPLOADING
      this.uploadPercentage = 0
    },

    // 上传进度处理
    handleProgress(event, file) {
      this.updateProgress(Math.floor(file.percentage))
    },

    // 更新上传进度
    updateProgress(percentage) {
      this.uploadPercentage = percentage
    },

    // 上传成功处理
    handleSuccess(response) {
      if (response.code === 0 && response.data && response.data.length > 0) {
        const filepath = response.data[0].filepath
        this.formatImageUrl(filepath)
      }
      this.handleUploadComplete()
    },

    // 上传完成后处理
    handleUploadComplete() {
      this.uploadState = UPLOAD_STATE.SUCCESS
      this.fileList = []

      // 3秒后隐藏成功提示
      setTimeout(() => {
        if (this.uploadState === UPLOAD_STATE.SUCCESS) {
          this.uploadState = UPLOAD_STATE.IDLE
        }
      }, SUCCESS_TIP_DURATION)
    },

    // 文件列表移除处理
    handleFileListRemove(file, fileList) {
      this.fileList = fileList
    },

    // 格式化图片URL
    formatImageUrl(filepath) {
      this.currentValue = fileConfig.markdownPreviewUrl(filepath)
      this.handleChange(this.currentValue)
    },

    // 图片加载成功处理
    handleImageLoad() {
      // 只在启用URL模式、输入框聚焦且为外部URL时自动上传
      if (!this.enableUrl || !this.isInputFocused || !this.isExternalUrl) {
        return
      }

      this.clearAutoUploadTimer()

      this.autoUploadTimer = setTimeout(() => {
        this.autoUploadExternalImage()
      }, AUTO_UPLOAD_DELAY)
    },

    // 自动上传外部图片
    autoUploadExternalImage() {
      this.uploadState = UPLOAD_STATE.LOADING

      this.urlToBlob(this.currentValue)
        .then((blob) => {
          const file = this.createFileFromBlob(blob)
          return this.uploadImageFile(file)
        })
        .catch((error) => {
          this.uploadState = UPLOAD_STATE.UNSUPPORTED
          console.error('自动上传失败:', error)
        })
    },

    // URL转Blob
    urlToBlob(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'

        xhr.onload = function() {
          if (this.status === 200) {
            resolve(this.response)
          } else {
            reject(new Error('HTTP ' + this.status))
          }
        }

        xhr.onerror = function() {
          reject(new Error('网络错误'))
        }

        xhr.send()
      })
    },

    // 从Blob创建File对象
    createFileFromBlob(blob) {
      let fileName = this.getFileNameFromUrl(this.currentValue)

      // 如果文件名没有扩展名，从blob类型推断
      if (blob.type.startsWith('image/') && fileName.indexOf('.') === -1) {
        const suffix = blob.type.replace('image/', '.')
        fileName += suffix
      }

      return new File([blob], fileName, { type: blob.type })
    },

    // 上传图片文件
    uploadImageFile(file) {
      const self = this
      self.uploadState = UPLOAD_STATE.UPLOADING

      const formData = new FormData()
      formData.append('files', file)
      formData.append('username', self.userInfo.name)
      formData.append('userId', self.userInfo.userId)

      return axios.post('/api/upload-markdown-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'jmal-token': self.userInfo.token,
          'name': self.userInfo.name
        },
        onUploadProgress: function(progressEvent) {
          const percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
          self.updateProgress(percentage)
        }
      })
        .then(function(res) {
          if (res.data && res.data.data && res.data.data[0]) {
            self.formatImageUrl(res.data.data[0].filepath)
            self.handleUploadComplete()

            if (self.$refs.uploadRef) {
              self.$refs.uploadRef.clearFiles()
            }
          }
        })
        .catch(function(error) {
          self.uploadState = UPLOAD_STATE.UNSUPPORTED
          throw error
        })
    },

    // 从URL获取文件名
    getFileNameFromUrl(url) {
      const urlRegex = /^[a-zA-Z]+:\/\/[^\s]*$/

      if (!urlRegex.test(url)) {
        return 'image'
      }

      // 移除查询参数
      const cleanUrl = url.split('?')[0]
      const parts = cleanUrl.split('/')
      return parts[parts.length - 1] || 'image'
    },

    // 清理自动上传定时器
    clearAutoUploadTimer() {
      if (this.autoUploadTimer) {
        clearTimeout(this.autoUploadTimer)
        this.autoUploadTimer = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-input-image {
  .upload {
    margin-bottom: 1px;
    display: flex;
    align-items: center;

    .upload-select-btn {
      margin-right: 5px;
    }

    .url-desc {
      padding: 4px 10px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}

>>> .el-checkbox {
  font-size: 13px;
  padding: 0 10px;

  .el-checkbox__label {
    padding-left: 5px;
    font-size: 13px;
  }
}

>>> .el-upload-list--picture {
  .el-upload-list__item-thumbnail {
    width: auto;
    height: 90px;
    object-fit: cover;
  }

  .el-upload-list__item {
    margin-top: 0;
    padding: 0 0 0 80px;

    &.is-success .el-upload-list__item-name {
      line-height: 90px;
    }
  }
}

>>> .el-upload-list__item-name {
  margin-right: 10px;
}
</style>
