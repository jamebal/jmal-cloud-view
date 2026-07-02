<template>
  <div>
    <!--直链-->
    <el-dialog :title="'直链 - ' + filename" :style="{ fontWeight: 600 }" :visible.sync="dialogVisible" @close="dialogClose">
      <div>
        <div class="direct-file-content">
          <el-input placeholder="" v-model="directUrl" readonly></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button round size="small" type="danger" @click="resetAllDirectLink" :loading="resetAllLoading">重置所有直链</el-button>
        <el-button round size="small" @click="resetDirectLink" :loading="resetLoading">重置直链</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


import directFileApi from '@/api/direct-file'
import settingApi from '@/api/setting-api'
import fileConfig from '@/utils/file-config'
import { copyText } from '@/utils/copy-text'

function normalizeDirectLinkOptions(optionsOrIsCopy) {
  if (typeof optionsOrIsCopy === 'boolean') {
    return {
      copy: optionsOrIsCopy,
      mode: 'normal',
    }
  }

  return {
    copy: !!(optionsOrIsCopy && optionsOrIsCopy.copy),
    mode: (optionsOrIsCopy && optionsOrIsCopy.mode) || 'normal',
    copyFormat: (optionsOrIsCopy && optionsOrIsCopy.copyFormat) || 'url',
  }
}

function createHandledError(message) {
  const error = new Error(message)
  error.isHandledMessage = true
  return error
}

export default {
  name: "DirectLinkDialog",
  components: {
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      filename: '',
      directUrl: '',
      resetLoading: false,
      resetAllLoading: false
    }
  },
  computed: {
  },
  watch: {
    status(visible) {
      if (visible) {
        this.dialogVisible = true
        this.filename = this.file.name
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:status', this.dialogVisible)
    },
    async buildDynamicDirectLink(mark, file) {
      const dynamicAddressConfig = this.$store.getters.dynamicAddressConfig || {}
      if (dynamicAddressConfig.enabled !== true) {
        throw createHandledError(this.$t('msg.dynamicAddressDisabled').toString())
      }

      const response = await settingApi.getDynamicAddress()
      const addr = typeof response.data === 'string' ? response.data.trim() : ''
      if (!addr) {
        throw createHandledError(this.$t('msg.dynamicAddressUnavailable').toString())
      }

      try {
        return fileConfig.dynamicDirectFileUrl(mark, file, addr, dynamicAddressConfig.domain)
      } catch {
        throw createHandledError(this.$t('msg.dynamicAddressInvalidAddr').toString())
      }
    },
    async getDirectLink(file, optionsOrIsCopy) {
      const options = normalizeDirectLinkOptions(optionsOrIsCopy)

      try {
        const response = await directFileApi.createDirectLink({ fileId: file.id })
        const mark = response.data
        this.directUrl = options.mode === 'dynamic'
          ? await this.buildDynamicDirectLink(mark, file)
          : fileConfig.directFileUrl(mark, file)

        if (options.copy) {
          const copyContent = options.copyFormat === 'execute'
            ? fileConfig.directFileExecuteCommand(this.directUrl)
            : this.directUrl
          await copyText(copyContent)
        }
      } catch (error) {
        if (error && error.isHandledMessage) {
          this.$message.error(error.message)
        }
      }
    },
    resetDirectLink() {
      this.resetLoading = true
      this.$confirm('确定要重置该直链吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        directFileApi.resetDirectLink({ fileId: this.file.id }).then(res => {
          this.directUrl = fileConfig.directFileUrl(res.data, this.file)
          this.resetLoading = false
          this.$message.success('重置成功')
        }).catch(() => {
            this.resetLoading = false
          }
        )
      }).catch(() => {
          this.resetLoading = false
        }
      )
    },
    resetAllDirectLink() {
      this.resetAllLoading = true

      this.$confirm('确定要重置所有直链吗? 此用户下的所有直链都将失效', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        directFileApi.resetAllDirectLink({ fileId: this.file.id }).then(res => {
          this.directUrl = fileConfig.directFileUrl(res.data, this.file)
          this.resetAllLoading = false
          this.$message.success('重置所有直链成功')
        }).catch(() => {
            this.resetAllLoading = false
          }
        )
      }).catch(() => {
          this.resetAllLoading = false
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
