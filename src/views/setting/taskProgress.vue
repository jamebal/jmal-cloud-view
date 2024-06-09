<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>任务进度</span>
          </div>
        </div>
      </div>
      <div>
        <div class="setting-title-desc">
          <div class="setting-title-desc-text">OCR识别任务和视频转码任务</div>
          <el-divider></el-divider>
        </div>
        <task-progress :data="taskProgressDataList"></task-progress>
      </div>
    </el-card>
  </div>
</template>

<script>

import TaskProgress from "@/components/TaskProgress/index.vue";
import {getTaskProgress} from "@/api/setting-api";

export default {
  components: { TaskProgress },
  data() {
    return {
      taskProgressDataList: [],
    }
  },
  mounted() {
    getTaskProgress().then(res => {
      this.taskProgressDataList = res.data
    })
  },
  computed: {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";

.progress {
  margin-top: 5px;
  >>> .el-card__header {
    padding: 8px 20px;
  }
}

</style>
