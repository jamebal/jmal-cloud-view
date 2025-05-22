<template>
  <div>
    <el-popover
      v-if="hasHistoryVersion"
      style="margin-right: 15px"
      :visible-arrow="false"
      :popper-class="(lightTheme ? 'file-history-popover' : 'dark-file-history-popover') + ' history-popover'"
      placement="bottom"
      @show="popoverShow"
      @hide="popoverHide"
      v-model="historyListPopoverVisible"
      trigger="manual">
      <el-table :data="fileHistoryList" height="300" row-class-name="file-history-row" :class="lightTheme? 'file-history-list' : 'dark-file-history-list'">
        <el-table-column show-overflow-tooltip width="200" property="metadata.filename" label="文件名"></el-table-column>
        <el-table-column width="190" property="metadata.time" label="版本日期"></el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <div style="display: flex">
              <el-button round
                size="mini"
                :class="lightTheme?'':'dark-button'"
                @click="viewHistoryFile(scope.row, true, false)" :loading="historyOperationLoading">预览</el-button>
              <el-popover
                placement="bottom"
                width="310"
                :popper-class="(lightTheme ? 'file-history-popover' : 'dark-file-history-popover') + ' delete-' + scope.row.id"
                style="margin: 0 10px;"
                :visible-arrow="false"
                trigger="click">
                <p class="el-popconfirm__main">
                  <i class="el-popconfirm__icon el-icon-question" style="color: rgb(255, 153, 0);"></i>
                  {{'确定要恢复到'+ scope.row.metadata.time +'吗？当前内容将被覆盖!'}}
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button round size="mini" type="text" @click="cancelRecovery(scope.row.id)">取消</el-button>
                  <el-button round type="primary" size="mini" @click="confirmRecoveryHistoryFile(scope.row)">确定</el-button>
                </div>
                <el-button round slot="reference" size="mini" :id="'recoveryVersionBtn-'+scope.row.id" type="warning" :loading="historyOperationLoading">恢复</el-button>
              </el-popover>
              <el-popover
                placement="bottom"
                width="310"
                :popper-class="(lightTheme ? 'file-history-popover' : 'dark-file-history-popover') + ' delete-' + scope.row.id"
                :visible-arrow="false"
                trigger="click">
                <p class="el-popconfirm__main">
                  <i class="el-popconfirm__icon el-icon-question" style="color: rgb(255, 153, 0);"></i>
                  {{'确定要删除'+ scope.row.metadata.time +'吗？这将永久删除该历史版本!'}}
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button round size="mini" type="text" @click="cancelDelete(scope.row.id)">取消</el-button>
                  <el-button round type="primary" size="mini" @click="confirmDeleteHistoryFile(scope.row.id)">确定</el-button>
                </div>
                <el-button round slot="reference" size="mini" :id="'deleteVersionBtn-'+scope.row.id" type="danger" :loading="historyOperationLoading">删除</el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-button round slot="reference" :style="versionBtnStyle" ref="versionBtn" :size="buttonSize" :class="lightTheme?' history-version-btn':'dark-button history-version-btn'" @click="showOrHidePopover">历史版本</el-button>
    </el-popover>
  </div>
</template>

<script>
import historyApi from "@/api/file-history"

export default {
  name: "history-popover",
  props: {
    hasHistoryVersion: {
      type: Object,
      default: function () {
        return {metadata: {}}
      }
    },
    lightTheme: {
      type: Boolean,
      default: true
    },
    historyListPopoverVisible: {
      type: Boolean,
      default: false
    },
    historyOperationLoading: {
      type: Boolean,
      default: false
    },
    saved: {
      type: Boolean,
      default: true
    },
    buttonSize: {
      type: String,
      default: 'mini'
    },
    transparent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    versionBtnStyle() {
      if (this.transparent) {
        return 'background: #00000000;border: 0;'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      fileHistoryList: [],
      recoveryHistoryListenerMap: new Map(),
      deleteHistoryListenerMap: new Map(),
      historyPageIndex: 1,
      historyPageSize: 50
    }
  },
  watch: {
    historyListPopoverVisible(value) {
      if (value) {
        document.getElementById('app').addEventListener('click', this.onGlobalClick)
      } else {
        // destroy elementListeners
        document.getElementById('app').removeEventListener('click', this.onGlobalClick)
      }
    },
  },
  methods: {
    loadHistoryList(id) {
      if (!this.$store.state.user.token || !this.$store.state.user.name) {
        return
      }
      historyApi.fileHistoryList({fileId: id, username: this.$store.state.user.name, pageIndex: this.historyPageIndex, pageSize: this.historyPageSize}).then((res) => {
        if (res.count && res.count > 0) {
          this.fileHistoryList = res.data
          this.$emit('update:hasHistoryVersion', true)
        } else {
          this.$emit('update:hasHistoryVersion', false)
        }
      })
    },
    loadHistoryPathList(pathname) {
      if (!this.$store.getters.token) {
        return
      }
      historyApi.fileHistoryPathList({path: encodeURI(pathname), username: this.$store.state.user.name, pageIndex: this.historyPageIndex, pageSize: this.historyPageSize}).then((res) => {
        this.fileHistoryList = res.data
        this.$emit('loadHistoryPathListSuccess', {res: res, pathname: pathname})
      })
    },
    onGlobalClick(event) {
      let eventClass = event.target.getAttribute('class') || event.target.parentElement.getAttribute('class')
      if (eventClass && eventClass.indexOf('history-version-btn') > -1) {
        return
      }
      if (this.historyListPopoverVisible) {
        this.$emit('update:historyListPopoverVisible', false)
      }
      if (event.target.getAttribute("data-tab") === "file") {
        setTimeout(() => {
          let parentDoc = document.querySelector('.component-only-office')
          let doc = parentDoc.getElementsByTagName('iframe')[0].contentWindow.document
          doc.getElementById('fm-btn-history').style.display = 'none'
        })
      }
    },
    popoverShow() {
      this.$emit('update:historyListPopoverVisible', true)
    },
    showOrHidePopover() {
      if (this.historyListPopoverVisible) {
        this.$emit('update:historyListPopoverVisible', false)
      } else {
        this.$emit('update:historyListPopoverVisible', true)
      }
    },
    popoverHide() {
      this.$emit('update:historyListPopoverVisible', false)
    },
    viewHistoryFile(historyInfo, diff, recovery) {
      this.$emit('viewHistoryFile', {historyInfo: historyInfo, diff: diff, recovery: recovery})
    },
    cancelDelete(id) {
      document.getElementById('deleteVersionBtn-'+id).click()
    },
    cancelRecovery(id) {
      document.getElementById('recoveryVersionBtn-'+id).click()
    },
    confirmRecoveryHistoryFile(historyInfo) {
      if (!this.saved) {
        this.$message({type: 'info', message: "请先保存当前修改的内容"})
        return
      }
      this.cancelRecovery(historyInfo.id)
      this.$emit('update:historyOperationLoading', true)
      historyApi.recoveryHistory({id: historyInfo.id}).then((res) => {
        this.$emit('recoverySuccess', {historyInfo: historyInfo, result: res})
      })
    },
    confirmDeleteHistoryFile(id) {
      this.cancelDelete(id)
      this.$emit('update:historyOperationLoading', true)
      historyApi.deleteHistory({id: id}).then(() => {
        this.$emit('update:historyOperationLoading', false)
        this.$message({message: '删除成功',type: 'success'})
        let deleteIndex = this.fileHistoryList.findIndex(fileHistory => fileHistory.id === id)
        this.fileHistoryList.splice(deleteIndex, 1)
        if (this.fileHistoryList.length < 1) {
          this.$emit('update:hasHistoryVersion', false)
        }
      })
    }
  }
}

</script>

<style scoped>

</style>
