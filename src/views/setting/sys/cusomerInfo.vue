<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>个人设置</span>
          </div>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('app.generalSetting')" name="1" class="setting-tab-panel">
            <div v-if="activeName === '1'">
              <user-setting/>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('app.mfaAuth')" name="2" class="setting-tab-panel">
            <div v-if="activeName === '2'">
              <mfa-config/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>

import MfaConfig from '@/views/setting/cloudSetting/mfaConfig.vue'
import userSetting from '@/views/setting/sys/userSetting/index.vue'

export default {
  name: 'cusomerInfo',
  components: { userSetting, MfaConfig },
  data() {
    return {
      activeName: '1',
      title: this.$t('app.setting'),
    }
  },
  mounted() {
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
    }
  },
  methods: {
    handleClick(tab) {
      this.$router.push({query: {tab: tab.name}})
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";

>>> .el-card__body {
  padding: 0;
}

>>> .el-tabs__header {
  margin: 0;
  @media screen and (min-width: 768px) {
    .el-tabs__nav {
      padding: 0 20px;
    }
    .el-tabs__active-bar {
      left: 20px;
    }
  }
}

.setting-tab-panel {
  padding-top: 20px;

  >>> .el-loading-spinner .circular {
    width: 25px !important;
  }
}

</style>
