<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :show-close="false"
    custom-class="no-header-dialog"
    class="file-search-dialog">

    <!-- 关闭按钮 -->
    <div class="dialog-close-btn">
      <el-button type="text" icon="el-icon-close" @click="dialogVisible = false"></el-button>
    </div>

    <div class="search-bar">
      <div class="search-input-wrapper">
        <div class="search-filters">
          <el-dropdown @command="handleFileType" trigger="click" class="filter-dropdown">
            <el-button type="text" class="filter-btn">
              <i class="el-icon-document"></i>
              <span>文件类型</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="modern-dropdown">
              <el-dropdown-item command="all">
                <i class="el-icon-document"></i> 全部文件
              </el-dropdown-item>
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

  </el-dialog>
</template>

<script>
export default {
  name: 'SearchDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      dialogVisible: false,
      fileType: 'all',
      timeRange: null,
      sizeRange: [0, 1073741824], // 默认范围：0 到 1GB
      fileTypeText: '全部文件',
      filterOption: {
        type: null,
        modifyStart: null,
        modifyEnd: null,
        sizeMin: null,
        sizeMax: null
      }
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
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    // 更新筛选条件并通知父组件
    updateFilterOption() {
      this.filterOption = {
        type: this.fileType === 'all' ? null : this.fileType,
        modifyStart: this.timeRange ? this.timeRange[0] : null,
        modifyEnd: this.timeRange ? this.timeRange[1] : null,
        sizeMin: this.sizeRange[0],
        sizeMax: this.sizeRange[1]
      }

      this.$emit('filter-change', this.filterOption)
    },

    handleFileType(command) {
      this.fileType = command
      switch (command) {
        case 'all':
          this.fileTypeText = '全部文件'
          break
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
      this.updateFilterOption()
    },

    handleTimeChange() {
      this.updateFilterOption()
    },

    handleSizeRangeChange() {
      this.updateFilterOption()
    },

    setSizePreset(range) {
      this.sizeRange = range
      this.updateFilterOption()
    },

    setSizePresetLarge() {
      this.sizeRange = [1073741824, 10737418240]
      this.updateFilterOption()
    },

    resetFileType() {
      this.handleFileType('all')
    },

    resetTimeRange() {
      this.timeRange = null
      this.updateFilterOption()
    },

    resetSizeRange() {
      this.sizeRange = [0, 1073741824]
      this.updateFilterOption()
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
      this.updateFilterOption()
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
    margin-right: 160px;
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

  .search-input-wrapper {
    display: flex;
    justify-content: center;
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
    justify-content: center;
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
}
</style>
