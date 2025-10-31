<template>
  <div class="container">
    <div class="form-instruction">
      <p style="font-weight: bolder; font-size: 20px">启用强制两步验证</p>
      <p>启用后可要求用户必须使用两步验证进行登录，以增强安全性，未设置两步验证的用户在下次登录时必须要先完成设置才能正常使用。用户可以在个人设置中启用两步验证。</p>
    </div>

    <div>
      <el-switch
        class="description-container"
        v-model="mfaForceEnable"
        active-text="启用"
        active-color="#13ce66"
        inactive-color="#ff4949"
        inactive-text="禁用"
        @change="changeEnable">
      </el-switch>
    </div>

    <div class="config-itme-label">重置两步验证：

      <el-dialog
        class="reset-mfa-dialog"
        title="重要提示"
        top="0px"
        :visible.sync="dialogVisible"
        width="420px">
        <i class="el-icon-warning"/>
        <span>确定要重置所有用户的两步验证吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button round size="mini" :loading="restMfaLoading" @click="dialogVisible = false">取 消</el-button>
          <el-button round size="mini" :loading="restMfaLoading" type="danger" @click="resetMfa">确 定</el-button>
        </span>
      </el-dialog>
      <el-button round size="mini" :loading="restMfaLoading" type="primary" @click="dialogVisible = true"><i class="el-icon-refresh"></i></el-button>
    </div>
    <span class="instruction">此操作会重置所有用户的两步验证，仅在<a href="https://jmalcloud.github.io/guide/installation.html#encryption-secret-key" target="_blank">更换密钥</a>时执行。重置后，所有用户的两步验证都将失效，需要重新设置。请谨慎操作。</span>

  </div>
</template>

<script>

import settingApi from '@/api/setting-api'

export default {
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      mfaForceEnable: false,
      restMfaLoading: false,
      dialogVisible: false,
    }
  },
  mounted() {
    this.getMfaConfig()
  },
  methods: {
    getMfaConfig() {
      settingApi.getMfaForceEnable().then(res => {
        this.mfaForceEnable = res.data
      })
    },
    changeEnable(value) {
      settingApi.setMfaForceEnable({mfaForceEnable: value}).then(() => {
        if (value) {
          this.$message.success('已启用强制两步验证')
        } else {
          this.$message.warning('已禁用强制两步验证')
        }
      }).catch(() => {
        this.mfaForceEnable = !value
      })
    },
    resetMfa() {
      this.restMfaLoading = true
      settingApi.restMfa().then(() => {
        this.$message.success('已重置所有用户的两步验证')
        this.dialogVisible = false
      }).catch(() => {
      }).finally(() => {
        this.restMfaLoading = false
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

.reset-mfa-dialog {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  >>> .el-dialog {

    .el-dialog__body {
      padding: 15px 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .el-icon-warning {
        color: #f56c6d;
        font-size: 24px;
        margin-right: 10px;
      }

    }
  }
}
</style>
