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
import fileConfig from '@/utils/file-config'
import { copyText } from '@/utils/copy-text'

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
    getDirectLink(file, isCopy) {
      directFileApi.createDirectLink({ fileId: file.id }).then(res => {
        this.directUrl = fileConfig.directFileUrl(res.data, file)
        if (isCopy) {
          copyText(this.directUrl)
        }
      })
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
