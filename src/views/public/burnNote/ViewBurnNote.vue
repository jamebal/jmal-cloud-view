<template>
  <div class="view-burn-note">
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

      <!-- 显示解密后的内容 -->
      <div v-else-if="decryptedContent" class="content">
        <el-alert
          title="⚠️  你将无法再次查看该笔记，请尽快保存。"
          type="warning"
          :closable="false"
        />
        <div class="note-content" v-text="decryptedContent"></div>
      </div>

      <!-- 等待用户确认查看 -->
      <div v-else-if="!loading && exists" class="confirm-view">
        <el-alert
          title="⚠️ 注意: 点击下方按钮即可查看笔记，阅后即焚。"
          type="warning"
          :closable="false"
        />
        <el-button
          round
          type="primary"
          size="large"
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
import { BurnNoteCrypto } from '@/utils/crypto-util'
import { checkBurnNote, consumeBurnNote } from '@/api/burn-note'

export default {
  name: 'ViewBurnNote',
  data() {
    return {
      noteId: this.$route.params.id,
      key: this.$route.params.key,
      loading: true,
      loadingText: '检查中...',
      exists: false,
      decryptedContent: ''
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

        // 1. 读取笔记 (会触发销毁或减少次数)
        const response = await consumeBurnNote(this.noteId)

        // 2. 解密内容
        const encrypted = response.data.encryptedContent
        this.decryptedContent = await BurnNoteCrypto.decrypt(encrypted, this.key)

      } catch (error) {
        console.error('读取失败:', error)
        this.$message.error('读取失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">

@import 'src/styles/index';
@import 'src/styles/home-index';
@import "./style.scss";

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
      line-height: 1.6;
      font-size: 14px;
      color: var(--text-color);
      max-width: 100%;
    }
  }

  .confirm-view {
    text-align: center;
    padding: 40px 20px;
  }
}

</style>
