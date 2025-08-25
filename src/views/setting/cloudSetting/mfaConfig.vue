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
</style>
