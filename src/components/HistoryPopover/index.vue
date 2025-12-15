<template>
  <el-popover
    ref="historyPopover"
    :value="historyListPopoverVisible"
    style="margin-right: 15px"
    :visible-arrow="false"
    popper-class="file-history-popover version-timeline-popover"
    placement="bottom"
    width="450"
    trigger="manual"
    @show="popoverShow"
    @hide="popoverHide"
  >
    <div class="version-history-timeline">
      <div class="scrollbar-wrapper" @scroll="handleScroll">
        <div class="timeline-container-scrollbar">
          <div v-if="loading && fileHistoryList.length === 0" class="timeline-loading">加载中...</div>
          <div v-if="!loading && fileHistoryList.length === 0 && finished" class="timeline-empty">暂无历史版本</div>
          <div v-for="(item, index) in fileHistoryList" :key="item.id" class="timeline-item" :class="{ 'is-viewing': viewHistoryId === item.id }">
            <div class="timeline-icon">
              <el-avatar :src="imageUrl + item.metadata.operator" size="medium" icon="el-icon-user-solid"></el-avatar>
            </div>
            <div class="timeline-line" v-if="index !== fileHistoryList.length - 1"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-date">{{ item.metadata.time }}</span>
                <span> {{ formatSize(item.metadata.size) }} </span>
                <span class="version-filename" :title="item.metadata.filename">{{ item.metadata.filename }}</span>
              </div>
              <div class="timeline-second-line">
                <div><span class="timeline-operator">{{ item.metadata.operator }}</span></div>
                <div class="timeline-actions">
                  <el-button round size="mini" @click="viewHistoryFile(item, true, false)" :loading="historyOperationLoading">预览
                  </el-button>

                  <el-popover placement="bottom" width="310"
                              :popper-class="'file-history-popover history-recovery recovery-' + item.id"
                              :visible-arrow="false" trigger="click">
                    <p class="el-popconfirm__main"><i class="el-popconfirm__icon el-icon-question"
                                                      style="color: rgb(255, 153, 0);"></i>{{ '确定要恢复到' + item.metadata.time + '吗？当前内容将被覆盖!'
                      }}
                    </p>
                    <div style="text-align: right; margin: 12px">
                      <el-button round size="mini" type="text" @click="cancelRecovery(item.id)">取消</el-button>
                      <el-button round type="primary" size="mini" @click="confirmRecoveryHistoryFile(item)">确定
                      </el-button>
                    </div>
                    <el-button round slot="reference" size="mini" :id="'recoveryVersionBtn-'+item.id" type="warning"
                               :loading="historyOperationLoading">恢复
                    </el-button>
                  </el-popover>

                  <el-popover placement="bottom" width="310"
                              :popper-class="'file-history-popover history-recovery delete-' + item.id"
                              :visible-arrow="false" trigger="click">
                    <p class="el-popconfirm__main"><i class="el-popconfirm__icon el-icon-question"
                                                      style="color: rgb(255, 153, 0);"></i>{{ '确定要删除' + item.metadata.time + '吗？这将永久删除该历史版本!'
                      }}
                    </p>
                    <div style="text-align: right; margin: 12px">
                      <el-button round size="mini" type="text" @click="cancelDelete(item.id)">取消</el-button>
                      <el-button round type="primary" size="mini" @click="confirmDeleteHistoryFile(item.id)">确定
                      </el-button>
                    </div>
                    <el-button round slot="reference" size="mini" :id="'deleteVersionBtn-'+item.id" type="danger"
                               :loading="historyOperationLoading">删除
                    </el-button>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
          <div v-if="loading && fileHistoryList.length > 0" class="timeline-loading-more">加载中...</div>
        </div>
      </div>
    </div>

    <el-button
      slot="reference"
      round
      :style="versionBtnStyle"
      :size="buttonSize"
      class="history-version-btn"
      v-show="hasHistoryVersion"
      @click="showOrHidePopover"
    >
      历史版本
    </el-button>
  </el-popover>
</template>

<script>
import historyApi from '@/api/file-history'
import { formatSize } from '@/utils/number'

export default {
  name: 'history-popover',
  props: {
    hasHistoryVersion: {
      type: Boolean,
      default: false
    },
    fileId: { type: String, default: null },
    historyListPopoverVisible: { type: Boolean, default: false },
    historyOperationLoading: { type: Boolean, default: false },
    saved: { type: Boolean, default: true },
    buttonSize: { type: String, default: 'mini' },
    transparent: { type: Boolean, default: false },
  },
  data() {
    return {
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail/user/`,
      fileHistoryList: [],
      loading: false,
      finished: false,
      historyPageIndex: 1,
      historyPageSize: 20,
      loadApiFunction: null,
      loadApiParams: {},
      viewHistoryId: '',
    }
  },
  computed: {
    versionBtnStyle() {
      if (this.transparent) {
        return 'background: #00000000;border: 0;'
      }
      return ''
    },
  },
  watch: {
    historyListPopoverVisible(value) {
      if (value) {
        document.getElementById('app').addEventListener('click', this.onGlobalClick)
      } else {
        document.getElementById('app').removeEventListener('click', this.onGlobalClick)
      }
    },
  },
  methods: {
    formatSize,
    /**
     * @public
     */
    loadHistoryList(id) {
      this._clearViewHistoryId()
      if (!this.$store.state.user.token || !this.$store.state.user.name) return
      this.resetState()
      this.loadApiFunction = historyApi.fileHistoryList
      this.loadApiParams = { fileId: id, username: this.$store.state.user.name }
      this._internalLoadHistory()
    },

    /**
     * @public
     */
    loadHistoryPathList(pathname) {
      this._clearViewHistoryId()
      if (!this.$store.getters.token) return
      this.resetState()
      this.loadApiFunction = historyApi.fileHistoryPathList
      this.loadApiParams = { path: encodeURIComponent(pathname), username: this.$store.state.user.name }
      this._internalLoadHistory()
    },
    cancelPreview() {
      this._clearViewHistoryId()
    },
    _clearViewHistoryId() {
      this.viewHistoryId = ''
    },
    // --- 内部方法 ---

    _internalLoadHistory(isLoadMore = false) {
      if (this.loading || (isLoadMore && this.finished)) return

      if (!isLoadMore) {
        this.historyPageIndex = 1
        this.fileHistoryList = []
      } else {
        this.historyPageIndex++
      }

      this.loading = true
      const params = {
        ...this.loadApiParams,
        pageIndex: this.historyPageIndex,
        pageSize: this.historyPageSize,
      }

      this.loadApiFunction(params).then(res => {
        if (res.data && res.data.length > 0) {
          this.fileHistoryList.push(...res.data)
        }
        this.finished = this.fileHistoryList.length >= res.count

        if (this.loadApiFunction === historyApi.fileHistoryList) {
          this.$emit('update:hasHistoryVersion', res.count > 0)
        } else {
          this.$emit('loadHistoryPathListSuccess', { res, pathname: this.loadApiParams.path })
        }
      }).catch(err => {
        console.error('加载历史版本失败', err)
        if (isLoadMore) this.historyPageIndex--
      }).finally(() => {
        this.loading = false
      })
    },

    resetState() {
      this.fileHistoryList = []
      this.historyPageIndex = 1
      this.finished = false
      this.loading = false
      const scrollWrapper = this.$el ? this.$el.querySelector('.scrollbar-wrapper') : null
      if (scrollWrapper) scrollWrapper.scrollTop = 0
    },

    handleScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target
      if (scrollHeight - scrollTop - clientHeight < 100) {
        this._internalLoadHistory(true)
      }
    },
    onGlobalClick(event) {
      let eventClass = event.target.getAttribute('class') || (event.target.parentElement ? event.target.parentElement.getAttribute('class') : '')
      if (eventClass && eventClass.includes('history-version-btn')) {
        return
      }
      if (this.historyListPopoverVisible) {
        this.$emit('update:historyListPopoverVisible', false)
      }
      // 这段逻辑非常特定，必须保留
      if (event.target.getAttribute('data-tab') === 'file') {
        setTimeout(() => {
          let parentDoc = document.querySelector('.component-only-office')
          if (parentDoc) {
            let doc = parentDoc.getElementsByTagName('iframe')[0].contentWindow.document
            let btn = doc.getElementById('fm-btn-history')
            if (btn) btn.style.display = 'none'
          }
        })
      }
    },

    popoverShow() {
      this.$emit('update:historyListPopoverVisible', true)
    },
    popoverHide() {
      this.$emit('update:historyListPopoverVisible', false)
    },
    showOrHidePopover() {
      this.$emit('update:historyListPopoverVisible', !this.historyListPopoverVisible)
    },
    viewHistoryFile(historyInfo, diff, recovery) {
      this.$emit('viewHistoryFile', { historyInfo, diff, recovery })
      this.viewHistoryId = historyInfo.id
    },

    cancelDelete(id) {
      document.getElementById('deleteVersionBtn-' + id).click()
    },
    cancelRecovery(id) {
      document.getElementById('recoveryVersionBtn-' + id).click()
    },

    confirmRecoveryHistoryFile(historyInfo) {
      this.viewHistoryId = historyInfo.id
      if (!this.saved) {
        this.$message({ type: 'info', message: '请先保存当前修改的内容' })
        return
      }
      this.cancelRecovery(historyInfo.id)
      this.$emit('update:historyOperationLoading', true)
      historyApi.recoveryHistory({ id: historyInfo.id, fileId: this.fileId }).then((res) => {
        this._internalLoadHistory()
        this.$emit('recoverySuccess', { historyInfo, result: res })
      })
    },

    confirmDeleteHistoryFile(id) {
      this.cancelDelete(id)
      this.$emit('update:historyOperationLoading', true)
      historyApi.deleteHistory({ id: id, fileId: this.fileId }).then(() => {
        this.$emit('update:historyOperationLoading', false)
        this.$message({ message: '删除成功', type: 'success' })
        let deleteIndex = this.fileHistoryList.findIndex(fileHistory => fileHistory.id === id)
        this.fileHistoryList.splice(deleteIndex, 1)
        if (this.fileHistoryList.length < 1) {
          this.$emit('update:hasHistoryVersion', false)
        }
      })
    },
  },
}
</script>

<style>
/* 非 Scoped 样式 */
.el-popover.file-history-popover {
  padding: 0;
  border-radius: 12px;
  background-color: var(--file-history-bg-color);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  backdrop-filter: blur(16px) saturate(180%);

  .el-popconfirm {
    width: 310px;
  }

}

.el-popover.history-recovery {
  margin: 5px;
  .el-popconfirm__main {
    margin: 12px 12px;
  }
}

</style>

<style scoped>
.version-history-timeline {
  height: 100%;
}

.scrollbar-wrapper {
  height: 400px;
  overflow-y: auto;
  position: relative;
}

.scrollbar-wrapper::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

.scrollbar-wrapper::-webkit-scrollbar-thumb {
  background: rgba(180, 180, 180, 0.48);
  border-radius: 6px;
}

.timeline-container-scrollbar {
  padding: 5px;
}

.timeline-item {
  position: relative;
  display: flex;
  padding: 15px 10px;
  border-radius: 12px;
}

.timeline-item.is-viewing {
  background-color: #409EFF;
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
  flex-shrink: 0;
  background-color: var(--timeline-timeline-icon-color);
}

.timeline-line {
  position: absolute;
  left: 30px;
  top: 45px;
  bottom: -35px;
  width: 1px;
  background-color: var(--timeline-line-color);
  z-index: 1;
}

.timeline-content {
  margin-left: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.timeline-date {
  font-size: 14px;
  color: var(--timeline-date-text-color);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.version-filename {
  font-size: 12px;
  color: var(--timeline-action-text-color);
  flex-shrink: 0;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-second-line {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.timeline-operator {
  color: var(--timeline-action-text-color);
  font-weight: bold;
}

.timeline-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeline-actions .el-button {
  margin: 0 !important;
}

.timeline-loading, .timeline-empty, .timeline-loading-more {
  text-align: center;
  color: var(--timeline-empty-text-color);
  padding: 20px 0;
  font-size: 14px;
}

.el-popconfirm__main {
  margin: 12px 0;
}
</style>
