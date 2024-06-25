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
          <div class="title-status">
            <div class="setting-title-desc-text">OCR识别任务和视频转码任务</div>
            <div>
              <span v-if="transcodeStatus.waitingTranscodingCount > 0"><b>{{transcodeStatus.waitingTranscodingCount}}</b>个视频等待转码 </span>
              <span v-if="transcodeStatus.transcodingCount > 0"> <b>{{transcodeStatus.transcodingCount}}</b>个视频正在转码中</span>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
        <task-progress :data="taskProgressDataList"></task-progress>
      </div>
    </el-card>
  </div>
</template>

<script>

import TaskProgress from "@/components/TaskProgress/index.vue";
import { getTaskProgress, getTranscodeStatus } from '@/api/setting-api'
import { mapState } from 'vuex'

export default {
  components: { TaskProgress },
  data() {
    return {
      taskProgressDataList: [],
      transcodeStatus: {
        waitingTranscodingCount: 0,
        transcodingCount: 0
      }
    }
  },
  mounted() {
    getTaskProgress().then(res => {
      this.taskProgressDataList = res.data
    })
    getTranscodeStatus().then(res => {
      this.transcodeStatus = res.data
    })
  },
  computed: {
    ...mapState(['message'])
  },
  watch: {
    message(msg) {
      if (msg.event === 'msg/transcodeStatus') {
        this.transcodeStatus = msg.data.body
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";
.title-status {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.progress {
  margin-top: 5px;
  >>> .el-card__header {
    padding: 8px 20px;
  }
}

</style>
