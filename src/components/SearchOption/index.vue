<template>

  <div class="search-option-wrapper">
    <div class="search-option-result">
      <div>
        <span>
          搜索
          <span class="search-scope" v-if="searchScope">
            <el-tooltip class="item" effect="dark" :content="searchScope" placement="top">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </span>:
        </span>
        <span>{{ keyword }}</span>
      </div>
      <div>
        <span>{{searchResultCount}}</span>
        <span>个结果</span>
      </div>
    </div>

    <div class="search-option-scope">
      <div class="search-option-scope-title">
        查找范围:
      </div>
      <div class="content-scope">
        <div>
          <el-checkbox
            v-model="includeTagName"
            class="search-option-checkbox"
            @change="handleCommonChange"
          >标签名称
          </el-checkbox>
        </div>
        <div>
          <el-checkbox
            v-model="includeFileName"
            class="search-option-checkbox"
            @change="handleCommonChange"
          >文件名称
          </el-checkbox>
        </div>
        <div>
          <el-checkbox
            v-model="includeFileContent"
            class="search-option-checkbox"
            @change="handleCommonChange"
          >文件内容
          </el-checkbox>
        </div>
      </div>
    </div>

    <div class="file-search-option">
      <div class="search-bar">
        <div class="search-input-wrapper">
          <div class="search-filters">
            <div>
              <el-checkbox
                v-if="showExactSearch"
                v-model="exactSearch"
                class="search-option-checkbox"
                @change="handleCommonChange"
              >精准搜索
              </el-checkbox>
            </div>
            <div>
              <el-checkbox
                v-model="searchOverall"
                class="search-option-checkbox"
                @change="handleCommonChange"
              >全盘搜索
              </el-checkbox>
            </div>
            <div>
              <el-checkbox
                v-model="searchMount"
                class="search-option-checkbox"
                @change="handleCommonChange"
              >挂载目录
              </el-checkbox>
            </div>
            <el-dropdown @command="handleFileType" trigger="click" class="filter-dropdown">
              <el-button round type="text" class="filter-btn">
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
              <el-button round type="text" class="filter-btn">
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
                    <el-button round size="mini" @click="setSizePreset([0, 1048576])">≤ 1MB</el-button>
                    <el-button round size="mini" @click="setSizePreset([1048576, 10485760])">1-10MB</el-button>
                    <el-button round size="mini" @click="setSizePreset([10485760, 104857600])">10-100MB</el-button>
                    <el-button round size="mini" @click="setSizePreset([104857600, 1073741824])">100MB-1GB</el-button>
                    <el-button round size="mini" @click="setSizePresetLarge()">≥ 1GB</el-button>
                  </div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" class="filter-dropdown">
              <el-button round type="text" class="filter-btn">
                <i class="el-icon-date"></i>
                <span>修改时间</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="modern-dropdown time-filter-dropdown">
                <div class="time-picker-container">
                  <div class="time-presets">
                    <el-button round size="mini" @click="setTimePreset('today')">今天</el-button>
                    <el-button round size="mini" @click="setTimePreset('yesterday')">昨天</el-button>
                    <el-button round size="mini" @click="setTimePreset('thisWeek')">本周</el-button>
                    <el-button round size="mini" @click="setTimePreset('lastWeek')">上周</el-button>
                    <el-button round size="mini" @click="setTimePreset('thisMonth')">本月</el-button>
                    <el-button round size="mini" @click="setTimePreset('lastMonth')">上个月</el-button>
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
      <div class="search-tags">
        <div v-if="searchPath !== 'undefined' && searchPath.length > 1 && !searchOverall">
          <el-tag
            @close="resetSearchPath">
            路径: {{ searchPath }}
          </el-tag>
        </div>
        <div v-if="searchOverall">
          <el-tag
            closable
            @close="resetSearchOverall">
            全盘搜索
          </el-tag>
        </div>
        <div v-if="exactSearch">
          <el-tag
            closable
            @close="resetExactSearch">
            精准搜索
          </el-tag>
        </div>
        <div v-if="searchMount">
          <el-tag
            closable
            @close="resetSearchMount">
            包含挂载目录
          </el-tag>
        </div>
        <div v-if="fileTypeText !== '全部文件'">
          <el-tag
            closable
            @close="resetFileType">
            文件类型: {{ fileTypeText }}
          </el-tag>
        </div>
        <div v-if="hasSizeRange">
          <el-tag
            closable
            @close="resetSizeRange">
            文件大小: {{ formatSizeRange }}
          </el-tag>
        </div>
        <div v-if="timeRange">
          <el-tag
            closable
            @close="resetTimeRange">
            时间范围: {{ formatTimeRange }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'SearchOption',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    keyword: {
      type: String,
      default: ''
    },
    hasSearchConditionsParam: {
      type: Boolean,
      default: false
    },
    filterOptionParam: {
      type: Object,
      default: function() {}
    },
    queryCondition: {
      type: Object,
      default: function() {}
    },
    searchPath: {
      type: String,
      default: '/'
    },
    searchResultCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      fileType: 'all',
      timeRange: null,
      sizeRange: [0, -1], // 默认范围：0 到 1GB
      fileTypeText: '全部文件',
      searchMount: false,
      searchOverall: false,
      exactSearch: false,
      filterOption: this.emptyFilterOption,
      checkList: ['标签名称', '文件名称', '文件内容'],
      includeTagName: true,
      includeFileName: true,
      includeFileContent: true,
    }
  },
  computed: {
    showExactSearch() {
      return this.$store.getters.exactSearch
    },
    searchScope() {
      const queryTagId = this.$route.query.tagId
      const isRootPath = this.$route.query.path === '/';
      if (queryTagId && isRootPath) {
        return '搜索范围: 仅包含标签文件, 不含子文件'
      }
      if (this.queryCondition.isMount && isRootPath) {
        return '搜索范围: 仅包含挂载目录里的所有文件, 不含挂载目录本身'
      }
      if (this.queryCondition.isFavorite && isRootPath) {
        return '搜索范围: 仅包含收藏文件, 不含子文件'
      }
      if (this.queryCondition.audio && isRootPath) {
        return '搜索范围: 仅包含音频文件'
      }
      if (this.queryCondition.video && isRootPath) {
        return '搜索范围: 仅包含视频文件'
      }
      if (this.queryCondition.document && isRootPath) {
        return '搜索范围: 仅包含文档文件'
      }
      if (this.queryCondition.image && isRootPath) {
        return '搜索范围: 仅包含图片文件'
      }
      if (this.queryCondition.recently && isRootPath) {
        return '搜索范围: 仅包含文件, 不含目录'
      }
      return ''
    },
    hasSearchConditions() {
      return this.fileType !== 'all' || this.timeRange || this.hasSizeRange || this.searchMount || this.searchOverall || this.exactSearch
    },
    emptyFilterOption() {
      return {
        type: null,
        modifyStart: null,
        modifyEnd: null,
        sizeMin: null,
        sizeMax: null,
        searchMount: null,
        searchOverall: null,
        exactSearch: null,
        includeTagName: true,
        includeFileName: true,
        includeFileContent: true
      }
    },
    hasSizeRange () {
      return this.sizeRange[0] >= 0 && this.sizeRange[1] > 0
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
          step: 20971520 // 20MB
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
    filterOption(newValue) {
    }
  },
  methods: {
    // 更新筛选条件并通知父组件
    updateFilterOption() {
      this.filterOption = {
        type: this.fileType === 'all' ? null : this.fileType,
        modifyStart: this.timeRange ? new Date(this.timeRange[0]).getTime() : null,
        modifyEnd: this.timeRange ? new Date(this.timeRange[1]).getTime() : null,
        sizeMin: this.hasSizeRange ? this.sizeRange[0] : null,
        sizeMax: this.hasSizeRange ? this.sizeRange[1] : null,
        searchMount: this.searchMount ?  true : null,
        searchOverall: this.searchOverall ?  true : null,
        exactSearch: this.exactSearch ?  true : null,
        includeTagName: this.includeTagName,
        includeFileName: this.includeFileName,
        includeFileContent: this.includeFileContent,
      }

      this.$emit('filter-change')
      this.$emit('update:filter-option-param', this.filterOption)
      this.$emit('update:has-search-conditions-param', this.hasSearchConditions)

      localStorage.setItem('searchFilterOption', JSON.stringify(this.filterOption))
    },

    clearFilterOption() {
      this.filterOption = this.emptyFilterOption
      this.setFilterOption(this.filterOption)
    },

    setFilterOption(filterOption) {
      if (!filterOption) return

      // 设置文件类型
      this.handleFileType(filterOption.type || 'all')

      // 设置时间范围
      if (filterOption.modifyStart && filterOption.modifyEnd) {
        this.timeRange = [
          new Date(filterOption.modifyStart),
          new Date(filterOption.modifyEnd)
        ]
      } else {
        this.timeRange = null
      }

      // 设置文件大小范围
      if (filterOption.sizeMin !== null && filterOption.sizeMax !== null) {
        this.sizeRange = [filterOption.sizeMin, filterOption.sizeMax]
      } else {
        this.sizeRange = [-1, -1]
      }

      // 设置搜索选项
      this.searchMount = !!filterOption.searchMount
      this.searchOverall = !!filterOption.searchOverall
      this.exactSearch = !!filterOption.exactSearch
      this.includeTagName = filterOption.includeTagName === undefined ? true : filterOption.includeTagName
      this.includeFileName = filterOption.includeFileName === undefined ? true : filterOption.includeFileName
      this.includeFileContent = filterOption.includeFileContent === undefined ? true : filterOption.includeFileContent

      // 更新过滤条件
      this.updateFilterOption()
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

    resetSearchPath() {
      this.updateFilterOption()
    },

    resetSearchMount() {
      this.searchMount = false
      this.updateFilterOption()
    },

    resetSearchOverall() {
      this.searchOverall = false
      this.updateFilterOption()
    },

    resetExactSearch() {
      this.exactSearch = false
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
      this.sizeRange = [-1, -1]
      this.updateFilterOption()
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    formatFileSize(size) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      if (size === 0) return '0 B';
      const i = Math.floor(Math.log(size) / Math.log(1024));
      return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
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
    },
    handleCommonChange() {
      this.updateFilterOption()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/custom-ui.scss";
.search-option-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .search-option-result {
    padding: 12px 24px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f2f5;

    div {
      display: flex;
      align-items: center;
      gap: 8px;

      span:first-child {
        color: #909399;
        font-size: 14px;
      }

      span:last-child {
        color: #303133;
        font-weight: 500;
        font-size: 14px;
      }

      &:last-child {
        span:first-child {
          color: #409EFF;
          font-weight: 600;
          font-size: 16px;
        }
      }
    }
  }
}

.search-option-scope {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;

  .search-option-scope-title {
    flex: 1 1;
    padding: 0 25px;
    color: #303133;
    font-weight: 500;
  }

  .content-scope {
    flex: 1 1;
    display: flex;
    align-items: center;
    width: 100%;
    .search-option-checkbox {
      padding: 8px 12px;
      cursor: pointer;
    }
  }

}

.file-search-option {

  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 12px 10px;

  .search-bar {
    display: flex;
    align-content: center;
    align-items: center;
  }

  .search-filters {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
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

    .search-option-checkbox {
      padding: 8px 12px;
      cursor: pointer;
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
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    min-width: 250px;

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
