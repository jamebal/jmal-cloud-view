<template>
  <div class="timeline-container">
    <div class="scrollbar-wrapper" @scroll="handleScroll">
      <div class="timeline-container-scrollbar">
        <div v-if="loading && dataList.length === 0" class="timeline-loading">加载中...</div>
        <div v-if="!loading && dataList.length === 0 && finished" class="timeline-empty">暂无操作记录</div>
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
        <div v-if="loading && dataList.length > 0" class="timeline-loading-more">加载中...</div>
      </div>
    </div>
  </div>
</template>

<script>
import logApi from '@/api/log'
// import IconFile from '@/components/Icon/IconFile.vue' // IconFile 未在模板中使用，可以移除

export default {
  name: 'TimelineComponent',
  // components: { IconFile }, // 移除未使用的组件
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
      // scrollDecorationTop: false, // 这个可能不再需要或需要重新实现
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?id=`,
      loading: false,
      dataList: [],
      pageLoadCompleteList: {}, // 使用对象可能更安全，避免稀疏数组问题
      finished: false,
      // pageIndex: 1, // pageIndex 由 pagination 管理
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      isInitialLoadComplete: false // 添加一个标志，判断首次加载是否完成
    };
  },
  watch: {
    showOperationHistory(newValue) {
      if (newValue && !this.isInitialLoadComplete) { // 仅在需要显示且未完成初始加载时加载
        this.resetAndLoadHistory(); // 重置状态并加载
      } else if (!newValue) {
        // 可选：当 popover 关闭时重置状态，以便下次打开时重新加载
        this.resetState();
      }
    },
    // 监听 fileId 变化，如果变化了也需要重置并重新加载
    fileId(newId, oldId) {
      if (newId && newId !== oldId && this.showOperationHistory) {
        this.resetAndLoadHistory();
      }
    }
  },
  mounted() {
  },
  methods: {
    resetState() {
      this.dataList = [];
      this.pagination.pageIndex = 1;
      this.finished = false;
      this.loading = false;
      this.pageLoadCompleteList = {};
      this.isInitialLoadComplete = false;
      // 重置滚动条位置（如果需要）
      const scrollWrapper = this.$el.querySelector('.scrollbar-wrapper');
      if (scrollWrapper) {
        scrollWrapper.scrollTop = 0;
      }
    },
    resetAndLoadHistory() {
      this.resetState();
      this.loadHistory();
    },
    loadHistory(onLoad = false) {
      // 防止重复加载
      if (this.loading || (onLoad && this.finished)) {
        return;
      }

      const currentPageIndex = onLoad ? this.pagination.pageIndex + 1 : 1;

      // 如果是加载下一页，但上一页尚未完成，则阻止
      if (onLoad && !this.pageLoadCompleteList[this.pagination.pageIndex]) {
        console.warn('Previous page load not complete, skipping load more.');
        return;
      }

      this.loading = true;
      this.pageLoadCompleteList[currentPageIndex] = false; // 标记当前页开始加载

      logApi.getFileOperationHistory({
        page: currentPageIndex,
        pageSize: this.pagination.pageSize,
        fileId: this.fileId
      }).then(res => {
        // 更新页码要在请求成功后
        this.pagination.pageIndex = currentPageIndex;

        res.data.forEach(item => {
          this.dataList.push(item);
        });

        this.pagination.pageTotal = res.count;
        this.finished = this.dataList.length >= res.count;

        // *** 关键：发出事件 ***
        // 确保只在首次加载成功后触发
        if (currentPageIndex === 1 && !this.isInitialLoadComplete) {
          this.isInitialLoadComplete = true; // 标记首次加载完成
          // 使用 $nextTick 确保 DOM 更新后再通知父组件
          this.$nextTick(() => {
            this.$emit('initial-load-complete');
          });
        }

      }).catch(error => {
        console.error("Failed to load history:", error);
        // 处理错误，例如显示错误消息
        // 如果加载失败，可能需要重置 loading 状态，并允许重试
        if (currentPageIndex === 1) {
          this.isInitialLoadComplete = false; // 允许下次重试时再次触发事件
        }
      }).finally(() => {
        this.loading = false;
        this.pageLoadCompleteList[currentPageIndex] = true; // 标记当前页加载完成（无论成功或失败）
      });
    },
    handleScroll(e) {
      // 防抖/节流可以优化性能，但对于滚动加载通常还好
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      // 接近底部时加载更多
      if (scrollHeight - scrollTop - clientHeight < 150) {
        this.loadHistory(true); // 传入 true 表示加载下一页
      }

      // 更新顶部阴影的逻辑 (如果需要)
      // this.scrollDecorationTop = scrollTop > 0;
    },
    isTooltip(str) {
      return !!(str && str.includes(','));
    },
    splitOperationStr(str) {
      return str ? str.split(',')[0] : ''; // 添加空值检查
    }
  }
}
</script>

<style scoped>
.timeline-container {
  /* 限制 Popover 内容区的高度 */
  /* 将高度控制移到 scrollbar-wrapper */
  height: 100%; /* 让 timeline-container 填充其父容器（popover的内容区） */
}

.scrollbar-wrapper {
  height: 100%;
  max-height: 400px;
  overflow-y: auto; /* 超出最大高度时显示滚动条 */
  position: relative; /* 为了可能的绝对定位子元素 */
  margin: 5px;

  /* macOS风格滚动条 (保持不变) */
  &::-webkit-scrollbar {
    width: 6px; /* 给滚动条一个宽度 */
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(180,180,180,0.28);
    border-radius: 6px;
    transition: background 0.2s;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(180,180,180,0.48);
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}

.timeline-container-scrollbar {
  padding: 0 15px 0 20px; /* 增加底部 padding */
}

/* 移除 .scroll-decoration 或重新设计，它依赖于外部滚动条可能不准确 */
/* .scroll-decoration { ... } */

.timeline-item {
  position: relative;
  display: flex;
  padding: 12px 0;
}

.timeline-icon {
  position: relative;
  z-index: 2;
  width: 40px; /* 与 el-avatar 的 size="medium" 对应 */
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #f0f0f0; */ /* Avatar自带背景色 */
  overflow: hidden;
  flex-shrink: 0; /* 防止 icon 被压缩 */
}

/* Avatar 样式可能不需要额外设置，Element UI 会处理 */
/* .timeline-icon img { ... } */

.timeline-line {
  position: absolute;
  left: 20px; /* (Avatar宽度 / 2) */
  top: 45px;  /* 大约是 Avatar 下方开始 */
  /* bottom: 0; */ /* 不再使用 bottom */
  height: calc(100% - 40px); /* 从 Avatar 下方到底部 */
  width: 1px;
  background-color: #e1e4e8;
  z-index: 1;
}

.timeline-content {
  margin-left: 16px;
  flex: 1;
  padding-bottom: 5px; /* 给内容一点底部空间，避免与线条重叠 */
}

.timeline-date {
  font-size: 14px;
  color: #24292e;
  font-weight: 500;
  margin-bottom: 4px; /* 稍微增大间距 */
}

.timeline-action {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #586069;
  flex-wrap: wrap; /* 如果内容过长可以换行 */
}

.timeline-action-icon {
  margin-right: 4px;
  color: #586069;
  font-weight: bold; /* 可以加粗显示操作人 */
}

.timeline-action-text {
  word-break: break-all; /* 长文本换行 */
}

/* 加载和空状态样式 */
.timeline-loading, .timeline-empty, .timeline-loading-more {
  text-align: center;
  color: #909399;
  padding: 15px 0;
  font-size: 14px;
}
</style>
