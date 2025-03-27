<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :show-close="false"
    width="70%"
    custom-class="no-header-dialog"
    class="file-search-dialog"
    @open="handleDialogOpen"
    @close="handleDialogClose">

    <!-- 关闭按钮 -->
    <div class="dialog-close-btn">
      <el-button type="text" icon="el-icon-close" @click="dialogVisible = false"></el-button>
    </div>

    <!-- 头部第一行 -->
    <div class="search-header">
      <div class="path-selector">
        <span>搜索路径：{{ currentPath }}</span>
        <el-button type="text" icon="el-icon-folder-opened" @click="selectPath"></el-button>
      </div>
      <div class="sort-options">
        <el-dropdown @command="handleSort" trigger="click">
          <el-button type="text">
            <i class="el-icon-sort"></i>：{{ sortText }}
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="relevance_asc">
              <i class="el-icon-sort-up"></i> 按相关度升序
            </el-dropdown-item>
            <el-dropdown-item command="relevance_desc">
              <i class="el-icon-sort-down"></i> 按相关度降序
            </el-dropdown-item>
            <el-dropdown-item divided command="time_asc">
              <i class="el-icon-sort-up"></i> 修改时间升序
            </el-dropdown-item>
            <el-dropdown-item command="time_desc">
              <i class="el-icon-sort-down"></i> 修改时间降序
            </el-dropdown-item>
            <el-dropdown-item divided command="size_asc">
              <i class="el-icon-sort-up"></i> 文件大小升序
            </el-dropdown-item>
            <el-dropdown-item command="size_desc">
              <i class="el-icon-sort-down"></i> 文件大小降序
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <el-input
          ref="searchKeyword"
          v-model="searchKeyword"
          placeholder="请输入搜索关键词"
          prefix-icon="el-icon-search"
          class="modern-input"
          :clearable="true"
          @keydown.native="handleKeyDown"
          @keyup.enter.native="handleSearch"
          @focus="handleSearch"
          @input="handleSearch"
          @clear="handleSearch">
        </el-input>
        <div class="search-filters">
          <el-dropdown @command="handleFileType" trigger="click" class="filter-dropdown">
            <el-button type="text" class="filter-btn">
              <i class="el-icon-document"></i>
              <span>文件类型</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="modern-dropdown">
              <el-dropdown-item command="document">
                <i class="el-icon-document"></i> 文档
              </el-dropdown-item>
              <el-dropdown-item command="image">
                <i class="el-icon-picture"></i> 图片
              </el-dropdown-item>
              <el-dropdown-item command="video">
                <i class="el-icon-video-camera"></i> 视频
              </el-dropdown-item>
              <el-dropdown-item command="audio">
                <i class="el-icon-headset"></i> 音频
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" class="filter-dropdown">
            <el-button type="text" class="filter-btn">
              <i class="el-icon-coin"></i>
              <span>文件大小</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="modern-dropdown size-filter-dropdown">
              <div class="size-slider-container">
                <div class="size-slider-labels">
                  <span>{{ formatFileSize(sizeRange[0]) }}</span>
                  <span>{{ formatFileSize(sizeRange[1]) }}</span>
                </div>
                <el-slider
                  v-model="sizeRange"
                  range
                  :min="sliderConfig.min"
                  :max="sliderConfig.max"
                  :step="sliderConfig.step"
                  @change="handleSizeRangeChange">
                </el-slider>
                <div class="size-slider-presets">
                  <el-button size="mini" @click="setSizePreset([0, 1048576])">≤ 1MB</el-button>
                  <el-button size="mini" @click="setSizePreset([1048576, 10485760])">1-10MB</el-button>
                  <el-button size="mini" @click="setSizePreset([10485760, 104857600])">10-100MB</el-button>
                  <el-button size="mini" @click="setSizePreset([104857600, 1073741824])">100MB-1GB</el-button>
                  <el-button size="mini" @click="setSizePresetLarge()">≥ 1GB</el-button>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" class="filter-dropdown">
            <el-button type="text" class="filter-btn">
              <i class="el-icon-date"></i>
              <span>修改时间</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="modern-dropdown time-filter-dropdown">
              <div class="time-picker-container">
                <div class="time-presets">
                  <el-button size="mini" @click="setTimePreset('today')">今天</el-button>
                  <el-button size="mini" @click="setTimePreset('yesterday')">昨天</el-button>
                  <el-button size="mini" @click="setTimePreset('thisWeek')">本周</el-button>
                  <el-button size="mini" @click="setTimePreset('lastWeek')">上周</el-button>
                  <el-button size="mini" @click="setTimePreset('thisMonth')">本月</el-button>
                  <el-button size="mini" @click="setTimePreset('lastMonth')">上个月</el-button>
                </div>
                <div class="custom-date-range">
                  <p class="date-range-title">自定义时间范围</p>
                  <el-date-picker
                    v-model="timeRange"
                    type="daterange"
                    size="small"
                    class="modern-date-picker"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleTimeChange">
                  </el-date-picker>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 搜索条件标签 -->
    <div class="search-tags" v-if="hasSearchConditions">
      <el-tag
        v-if="fileTypeText !== '全部文件'"
        closable
        @close="resetFileType">
        文件类型: {{ fileTypeText }}
      </el-tag>
      <el-tag
        v-if="sizeRange[0] > 0 || sizeRange[1] < sliderConfig.max"
        closable
        @close="resetSizeRange">
        文件大小: {{ formatSizeRange }}
      </el-tag>
      <el-tag
        v-if="timeRange"
        closable
        @close="resetTimeRange">
        时间范围: {{ formatTimeRange }}
      </el-tag>
    </div>

    <!-- 搜索结果列表 -->
    <div class="search-results">
      <el-table
        :data="searchResults"
        style="width: 100%"
        @row-click="handleRowClick">
        <el-table-column
          prop="name"
          label="文件名"
          width="300">
          <template slot-scope="scope">
            <i :class="getFileIcon(scope.row.type)"></i>
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="size"
          label="大小"
          width="120">
          <template slot-scope="scope">
            {{ formatFileSize(scope.row.size) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 查看所有结果按钮 -->
    <div class="view-all">
      <el-button type="text" @click="handleViewAll">
        查看"{{ searchKeyword }}"的所有搜索结果 (Shift + Enter)
      </el-button>
    </div>

    <!-- 快捷键说明 -->
    <div slot="footer" class="dialog-footer">
      <div class="shortcuts-info">
        <p>快捷键说明：</p>
        <ul>
          <li>上一页：← 或 PageUp</li>
          <li>下一页：→ 或 PageDown</li>
          <li>Cmd + 点击：跳转至文件位置</li>
          <li>Shift + Enter：查看所有搜索结果</li>
        </ul>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import api from '@/api/file-api'
import Icon from '@/components/Icon/Icon.vue'
import _ from 'lodash'

export default {
  name: 'SearchDialog',
  components: { Icon },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defaultPath: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      dialogVisible: false,
      currentPath: '',
      searchKeyword: '',
      sortType: 'relevance_desc',
      sortOrder: 'desc',
      fileType: 'all',
      timeRange: null,
      sizeRange: [0, 1073741824], // 默认范围：0 到 1GB
      searchResults: [],
      sortText: '按相关度降序',
      fileTypeText: '全部文件',
      debounceSearch: null,// 搜索防抖
      pagination: {
        pageIndex: 1,
        pageSize: 50,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50],
      },
    }
  },
  computed: {
    hasSearchConditions() {
      return this.fileType !== 'all' || this.timeRange ||
             (this.sizeRange[0] > 0 || this.sizeRange[1] < 1073741824)
    },
    formatTimeRange() {
      if (!this.timeRange) return ''
      return `${this.formatDate(this.timeRange[0])} 至 ${this.formatDate(this.timeRange[1])}`
    },
    formatSizeRange() {
      return `${this.formatFileSize(this.sizeRange[0])} - ${this.formatFileSize(this.sizeRange[1])}`
    },
    sliderConfig() {
      // 根据当前范围动态计算滑块配置
      if (this.sizeRange[0] >= 1073741824) {
        // 大文件模式 (1GB - 10GB)
        return {
          min: 1073741824,
          max: 10737418240,
          step: 1073741824 / 100 // 约10MB的步长
        }
      } else {
        // 普通模式 (0 - 1GB)
        return {
          min: 0,
          max: 1073741824,
          step: 1024
        }
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.$nextTick(() => {
          this.$refs.searchKeyword.focus()
        })
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  created() {
    this.debounceSearch = _.debounce((key) => {
      this.searchFile(key)
    }, 200)
  },
  methods: {
    handleDialogOpen() {
      this.currentPath = this.defaultPath
      window.addEventListener('keydown', this.handleKeydown)
    },
    handleDialogClose() {
      window.removeEventListener('keydown', this.handleKeydown)
    },
    handleKeydown(e) {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.previousPage()
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        this.nextPage()
      }
    },
    selectPath() {
      // 实现选择路径的逻辑
    },
    handleSort(command) {
      this.sortType = command
      const [type, order] = command.split('_')
      this.sortOrder = order

      switch (type) {
        case 'relevance':
          this.sortText = `相关度${order === 'asc' ? '升序' : '降序'}`
          break
        case 'time':
          this.sortText = `修改时间${order === 'asc' ? '升序' : '降序'}`
          break
        case 'size':
          this.sortText = `文件大小${order === 'asc' ? '升序' : '降序'}`
          break
      }
      this.handleSearch()
    },
    handleFileType(command) {
      this.fileType = command
      switch (command) {
        case 'document':
          this.fileTypeText = '文档'
          break
        case 'image':
          this.fileTypeText = '图片'
          break
        case 'video':
          this.fileTypeText = '视频'
          break
        case 'audio':
          this.fileTypeText = '音频'
          break
      }
      this.handleSearch()
    },
    handleTimeChange() {
      this.handleSearch()
    },
    handleSearch() {
      // 实现搜索逻辑
      console.log('搜索条件发生变化，重新搜索')
      this.debounceSearch(this.searchKeyword)
    },
    searchFile(key) {

    },
    handleKeyDown(event) {
      const { ctrlKey, metaKey, keyCode } = event
      console.log(ctrlKey, metaKey, keyCode)
      if (event.metaKey && event.key === 'Enter') {
        console.log('Cmd + Enter 被触发');
      }
    },
    handleViewAll() {
      console.log('查看所有搜索结果')
      // 实现查看所有结果的逻辑
    },
    handleRowClick(row, column, event) {
      if (event.metaKey) { // Cmd 键点击
        this.navigateToFile(row)
      }
    },
    navigateToFile(file) {
      // 实现跳转到文件位置的逻辑
    },
    resetFileType() {
      this.handleFileType('all')
    },
    resetTimeRange() {
      this.timeRange = null
      this.handleSearch()
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    formatFileSize(size) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB']
      let index = 0
      while (size >= 1024 && index < units.length - 1) {
        size /= 1024
        index++
      }
      return `${size.toFixed(2)} ${units[index]}`
    },
    getFileIcon(type) {
      const iconMap = {
        folder: 'el-icon-folder',
        document: 'el-icon-document',
        image: 'el-icon-picture',
        video: 'el-icon-video-camera',
        audio: 'el-icon-headset'
      }
      return iconMap[type] || 'el-icon-document'
    },
    previousPage() {
      // 实现上一页逻辑
    },
    nextPage() {
      // 实现下一页逻辑
    },
    handleSizeRangeChange() {
      this.handleSearch()
    },
    setSizePreset(range) {
      this.sizeRange = range
      this.handleSearch()
    },
    setSizePresetLarge() {
      this.sizeRange = [1073741824, 10737418240]
      this.handleSearch()
    },
    resetSizeRange() {
      this.sizeRange = [0, 1073741824]
      this.handleSearch()
    },
    setTimePreset(preset) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      let start, end

      switch (preset) {
        case 'today':
          start = today
          end = new Date(today)
          end.setDate(today.getDate() + 1)
          end.setMilliseconds(-1)
          break
        case 'yesterday':
          start = new Date(today)
          start.setDate(today.getDate() - 1)
          end = new Date(today)
          end.setMilliseconds(-1)
          break
        case 'thisWeek':
          start = new Date(today)
          start.setDate(today.getDate() - today.getDay()) // 周日为一周第一天
          end = new Date(start)
          end.setDate(start.getDate() + 7)
          end.setMilliseconds(-1)
          break
        case 'lastWeek':
          start = new Date(today)
          start.setDate(today.getDate() - today.getDay() - 7)
          end = new Date(start)
          end.setDate(start.getDate() + 7)
          end.setMilliseconds(-1)
          break
        case 'thisMonth':
          start = new Date(today.getFullYear(), today.getMonth(), 1)
          end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
          break
        case 'lastMonth':
          start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999)
          break
      }

      this.timeRange = [start, end]
      this.handleTimeChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.file-search-dialog {
  >>> .el-dialog {
    margin-top: 6vh !important;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  >>> .el-dialog__header {
    padding: 0;
    height: 0;
  }

  >>> .el-dialog__body {
    padding: 20px 24px;
  }

  .dialog-close-btn {
    position: absolute;
    right: -44px;
    top: 0;
    z-index: 100;

    .el-button {
      color: #fff;
      font-size: 20px;
      padding: 10px;
      border-radius: 50%;
      transition: all 0.3s ease;

      &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
    }
  }

  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 4px;

    .path-selector {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #606266;
      font-size: 14px;

      .el-button {
        padding: 8px;
        border-radius: 6px;
        transition: all 0.3s ease;

        &:hover {
          background-color: #f5f7fa;
        }
      }
    }

    .sort-options {
      .el-button {
        font-size: 14px;
        padding: 8px 12px;
        border-radius: 6px;
        transition: all 0.3s ease;

        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }

  .search-input-wrapper {
    display: flex;

    .modern-input {
      margin-right: 10px;
    }

    >>> .el-input {
      .el-input__inner {
        height: 44px;
        line-height: 44px;
        border-radius: 10px;
        border: 1px solid #dcdfe6;
        padding-left: 40px;
        transition: all 0.3s ease;
        font-size: 14px;

        &:focus {
          border-color: #409EFF;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }
      }

      .el-input__prefix {
        left: 12px;
        color: #909399;
      }

      .el-input__icon {
        line-height: 44px;
      }

      .el-input-group__append {
        background: transparent;
        border: none;
        padding: 0 8px;
      }
    }
  }

  .search-filters {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-divider--vertical {
      height: 24px;
      margin: 0;
    }

    .filter-dropdown {
      .filter-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #606266;
        font-size: 14px;
        padding: 8px 12px;
        border-radius: 6px;
        transition: all 0.3s ease;

        &:hover {
          background-color: #f5f7fa;
        }

        i {
          font-size: 16px;
        }
      }
    }

    >>> .modern-date-picker {
      .el-range-editor {
        border: none;
        background: transparent;

        .el-range-input {
          background: transparent;
          color: #606266;
        }

        .el-range-separator {
          color: #909399;
        }
      }
    }
  }

  >>> .modern-dropdown {
    border-radius: 8px;
    padding: 6px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    .el-dropdown-menu__item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 6px;
      margin: 2px 0;
      font-size: 14px;

      i {
        font-size: 16px;
      }

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }

  .search-tags {
    margin: 16px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    >>> .el-tag {
      border-radius: 6px;
      padding: 0 10px;
      margin: 0;
      background-color: #f5f7fa;
      border-color: transparent;
      color: #606266;

      .el-tag__close {
        background-color: transparent;
        color: #909399;

        &:hover {
          background-color: #909399;
          color: #fff;
        }
      }
    }
  }

  .search-results {
    margin: 20px 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    >>> .el-table {
      border: none;

      &::before {
        display: none;
      }

      th {
        background-color: #f5f7fa;
        border: none;
        padding: 12px 0;
        font-weight: 600;
        color: #606266;
      }

      td {
        border: none;
        padding: 12px 0;
        color: #606266;
      }

      tr {
        transition: all 0.3s ease;

        &:hover > td {
          background-color: #f5f7fa;
        }
      }
    }
  }

  .view-all {
    text-align: center;
    margin: 20px 0;

    .el-button {
      font-size: 14px;
      color: #409EFF;
      padding: 10px 20px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #ecf5ff;
      }
    }
  }

  .shortcuts-info {
    text-align: left;
    color: #909399;
    font-size: 13px;
    padding: 16px 0;
    border-top: 1px solid #ebeef5;

    ul {
      list-style: none;
      padding: 0;
      margin: 8px 0 0;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;

      li {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }


}
</style>
