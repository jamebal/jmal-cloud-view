<template>
  <div class="timeline-container">
    <el-scrollbar wrap-class="scrollbar-wrapper" @scroll="handleScroll">
      <div class="timeline-container-scrollbar">
        <div class="scroll-decoration" v-if="scrollDecorationTop"></div>
        <div v-for="(item, index) in dataList" :key="index" class="timeline-item">
          <div class="timeline-icon">
            <el-avatar :src="imageUrl + item.avatar" size="medium" icon="el-icon-user-solid"></el-avatar>
          </div>
          <div class="timeline-line" v-if="index !== dataList.length - 1"></div>
          <div class="timeline-content">
            <div class="timeline-date">{{ item.createTime }}</div>
            <div class="timeline-action">
              <span v-if="item.showName" class="timeline-action-icon">{{ item.showName }}</span>
              <el-tooltip v-if="isTooltip(item.operationFun)" class="item" effect="dark" :content="item.operationFun" placement="bottom">
                <span class="timeline-action-text">{{ splitOperationStr(item.operationFun) }}</span>
              </el-tooltip>
              <span v-else class="timeline-action-text">{{ item.operationFun }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import logApi from '@/api/log'
import IconFile from '@/components/Icon/IconFile.vue'

export default {
  name: 'TimelineComponent',
  components: { IconFile },
  props: {
    showOperationHistory: {
      type: Boolean,
      default: false
    },
    fileId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollDecorationTop: false,
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?id=`,
      loading: false,
      dataList: [],
      pageIndex: 1,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
    };
  },
  computed: {
  },
  watch: {
    showOperationHistory(newValue) {
      if (newValue) {
        this.loading = true
        logApi.getFileOperationHistory({
          page: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          fileId: this.fileId
        }).then(res => {
          this.dataList = res.data
          this.pagination.pageTotal = res.count
          this.loading = false
        })
      }
    }
  },
  mounted() {
    const scrollbarWrapper = document.querySelector('.file-operation-history .scrollbar-wrapper')
    scrollbarWrapper.onscroll = e => {
      this.handleScroll(e)
    }
  },
  methods: {
    handleScroll(e) {
      // this.scrollDecorationTop = e.target.scrollTop > 0;
    },
    isTooltip(str) {
      return !!(str && str.includes(','));
    },
    splitOperationStr(str) {
       return str.split(',')[0]
    }
  }
}
</script>

<style scoped>
.timeline-container {

  .timeline-container-scrollbar {
    height: 50vh;
    min-height: 450px;
    padding: 0 20px;

    .scroll-decoration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      box-shadow: #dddddd 0 6px 6px -6px inset;
    }

  }
}

.timeline-item {
  position: relative;
  display: flex;
  padding: 12px 0;
}

.timeline-icon {
  position: relative;
  z-index: 2;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  overflow: hidden;
}

.timeline-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline-line {
  position: absolute;
  left: 20px;
  top: 40px;
  bottom: 0;
  height: 100%;
  width: 1px;
  background-color: #e1e4e8;
  z-index: 1;
}

.timeline-content {
  margin-left: 16px;
  flex: 1;
}

.timeline-date {
  font-size: 14px;
  color: #24292e;
  font-weight: 500;
  margin-bottom: 2px;
}

.timeline-action {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #586069;
}

.timeline-action-icon {
  margin-right: 4px;
  color: #586069;
}
</style>
