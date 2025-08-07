import api from '@/api/file-api'
import _ from 'lodash'

export default {
  props: {
  },
  data() {
    return {
      showNewFolder: false,
      isShowNewFolder: false,
      listModeSearch: false,
      listModeSearchOpenDir: false,
      newFolderName: '新建文件夹',
      searchFileName: '',
      debounceSearch: null,// 搜索防抖
      filterOption: {}, // 搜索选项
      searchSuggestions: [],// 搜索历史列表
      _isSuggestionHandledBySelect: false,
      _originalSearchFileNameBeforeSelect: '',
      hasSearchFilterOption: false, // 是否有搜索选项
      fileUsername: '', // 一般用于挂载文件
      searchInputClass: 'search-input' // 搜索输入框样式
    }
  },
  computed: {
    searchOptionBtnClass() {
      return this.hasSearchFilterOption ? 'search-option-btn search-option-btn-active' : 'search-option-btn'
    },
  },
  watch: {
    searchFileName(newValue) {
      if (!newValue) {
        this.hasSearchFilterOption = false
        this.$refs.searchOption.clearFilterOption()
      }
    }
  },
  created() {
    this.debounceSearch = _.debounce((key, onLoad) => {
      this.searchFile(key, onLoad)
    }, 200)
  },
  methods: {
    hideNewFolderName() {
      this.showNewFolder = false
      this.isShowNewFolder = false
    },
    showNewFolderClick() {
      this.isShowNewFolder = true
    },
    upload() {
      // 打开文件选择框
      this.$store.dispatch('updateMessage', {event: 'openUploader'})
    },
    uploadFolder() {
      if (window.uploader.supportDirectory) {
        this.$store.dispatch('updateMessage', {event: 'uploadFolder'})
      } else {
        this.$message({
          message: '该浏览器不支持上传文件夹',
          type: 'warning',
        })
      }
    },
    getUploadParams() {
      return {
        folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
        currentDirectory: this.getQueryPath(),
        username: this.$store.state.user.name,
        userId: this.$store.state.user.userId,
      }
    },
    newFolderNameClickEnter() {
      this.newFolderNameClick()
    },
    searchFileByKeyword(key) {
      this.searchFile(key)
    },
    searchFileEnter() {
      if (this._isSuggestionHandledBySelect) {
        return
      }
      this.debounceSearch(this.searchFileName)
      this.$refs.searchInput.close()
    },
    searchFile(key, onLoad) {
      if (key) {
        this.beforeLoadData(onLoad)
        // this.pathList = [{ folder: "" }]
        // 查找this.pathList中是否已经有搜索的路径

        const item = {}
        item['folder'] = `搜索: ${key}`
        item['search'] = true
        item['searchKey'] = key

        let searchOpenFolder = this.$route.query.searchOpenFolder ? `&searchOpenFolder=${this.$route.query.searchOpenFolder}` : ''

        const searchPathIndex = this.pathList.findIndex(item => item.search)
        if (searchPathIndex < 0) {
          this.pathList.push(item)
        } else {
          this.pathList.splice(searchPathIndex,this.pathList.length - searchPathIndex)
          this.pathList.push(item)
          searchOpenFolder = ''
        }
        const queryTagId = this.$route.query.tagId ? `&tagId=${this.$route.query.tagId}` : ''
        const folder = this.$route.query.folder ? `&folder=${this.$route.query.folder}` : ''
        const basePath = this.getBasePath()
        const keyword = key ? `&keyword=${key}` : ''
        const path = this.path ? encodeURIComponent(this.path.replace(this.basePath, '/')) : '/'
        this.$router.push(`?vmode=${this.vmode}&path=${path}${keyword}${searchOpenFolder}${queryTagId}${basePath}${folder}`)

        api.searchFile({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          keyword: key,
          sortableProp: this.sortable.prop,
          order: this.sortable.order,
          currentDirectory: this.getQueryPath(),
          folder: this.$route.query.folder,
          tagId: this.$route.query.tagId,
          isFolder: this.queryCondition.isFolder,
          isFavorite: this.queryCondition.isFavorite,
          queryFileType: this.filterOption.type || this.queryFileType,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          type: this.filterOption.type,
          queryModifyStart: this.filterOption.modifyStart,
          queryModifyEnd: this.filterOption.modifyEnd,
          querySizeMin: this.filterOption.sizeMin,
          querySizeMax: this.filterOption.sizeMax,
          searchMount: this.filterOption.searchMount,
          isMount:  this.queryCondition.isMount,
          searchOverall: this.filterOption.searchOverall,
          exactSearch: this.filterOption.exactSearch,
          includeTagName: this.filterOption.includeTagName,
          includeFileName: this.filterOption.includeFileName,
          includeFileContent: this.filterOption.includeFileContent,
        }).then(res => {
          this.loadData(res, onLoad)
          this.listModeSearch = true
          this.listModeSearchOpenDir = false
        }).catch(() => {
          this.tableLoading = false
        })
      } else {
        if (this.listModeSearch) {
          this.listModeSearch = false
          this.lastLink()
        }
      }
    },
    searchFileAndOpenDir(fileId, onLoad) {
      this.beforeLoadData(onLoad)

      const queryTagId = this.$route.query.tagId ? `&tagId=${this.$route.query.tagId}` : ''
      const path = this.$route.query.path ? `&path=${this.$route.query.path}`.replace(/#/g, '%23') : ''
      const keyword = this.$route.query.keyword ? `&keyword=${this.$route.query.keyword}` : ''
      const basePath = this.getBasePath()
      const searchOpenFolder = `&searchOpenFolder=${fileId}`
      const folder = this.$route.query.folder ? `&folder=${this.$route.query.folder}` : ''
      this.$router.push(`?vmode=${this.vmode}${path}${keyword}${searchOpenFolder}${queryTagId}${basePath}${folder}`)

      api.searchFileAndOpenDir({
        userId: this.$store.state.user.userId,
        username: this.$store.getters.name,
        id: fileId,
        currentDirectory: this.getQueryPath(),
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        folder: this.$route.query.folder,
      })
        .then(res => {
          this.loadData(res, onLoad)
          this.listModeSearch = true
          this.listModeSearchOpenDir = fileId
        }).catch(() => {
        this.tableLoading = false
      })
    },
    openDir(row, onLoad) {
      this.beforeLoadData(onLoad)
      api.searchFileAndOpenDir({
          userId: this.$store.state.user.userId,
          username: this.$store.getters.name,
          id: row.mountFileId || row.id,
          currentDirectory: this.getQueryPath(),
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          folder: this.$route.query.folder,
        })
        .then(res => {
          this.loadData(res, onLoad)
        }).catch(() => {
        this.tableLoading = false
      })
    },
    searchClose() {
      this.searchFileName = ''
      this.searchInputBlur()
      this.searchFileEnter()
    },
    searchInputFocus() {
      this.searchInputClass = 'search-input search-input-focus'
      this.setInputFocus()
    },
    searchInputBlur() {
      this.searchInputClass = this.searchFileName ? 'search-input search-input-focus' : 'search-input'
      this.setInputBlur()
    },
    searchFilterChange() {
      this.debounceSearch(this.searchFileName, false)
    },
    showSearchOption() {
    },
    async fetchDynamicSuggestions(queryString, cb) {
      this._originalSearchFileNameBeforeSelect =  queryString
      this.searchSuggestions = []
      const recentlySearch =
        {
          sugType: 'clearAllHistory',
          keyword: '',
          value: `__READONLY_DIVIDER_${Date.now()}__`,
          id: 'recently_search_id'
        }
      if (!queryString) {
        this.queryRecentlySearchHistory(queryString, recentlySearch, cb)
      } else {
        const fixedActionItems = [
          {
            sugType: 'action_current_path_search',
            keyword: queryString,
            value: queryString,
            id: 'action_current_path_search_id'
          },
          {
            sugType: 'action_global_search',
            keyword: queryString,
            value: queryString,
            id: 'action_global_search_id'
          },
        ]
        this.searchSuggestions.push(...fixedActionItems)
        this.queryRecentlySearchHistory(queryString, recentlySearch, cb)
      }
    },
    queryRecentlySearchHistory(queryString = '', recentlySearch, cb) {
      api.getRecentlySearchHistory({keyword: queryString}).then(res => {
        const historyItems = res.data.map(item => ({
          ...item,
          value: item.keyword,
          sugType: 'history'
        }))
        if (historyItems.length > 0) {
          this.searchSuggestions.push(recentlySearch)
        }
        this.searchSuggestions.push(...historyItems)
        cb(this.searchSuggestions)
      }).catch(error => {
        console.error("Error fetching search history:", error)
        cb(this.searchSuggestions.length > 0 ? this.searchSuggestions : [])
      })
    },
    handleSelectSuggestion(item) {
      this._isSuggestionHandledBySelect = true
      if (item.id === "recently_search_id") {
        this.$nextTick(() => {
          if (this.searchFileName !== this._originalSearchFileNameBeforeSelect) {
            this.searchFileName = this._originalSearchFileNameBeforeSelect
          }
          this._isSuggestionHandledBySelect = false
        })
        return
      }
      if ( item.sugType === 'history') {
        this.searchFileName = item.keyword
      }
      if ( item.sugType === 'action_global_search') {
        item.searchOverall = true
      }
      if ( item.sugType === 'action_current_path_search') {
        item.searchOverall = false
      }
      this.debounceSearch(this.searchFileName, false)
      this.$refs.searchOption.setFilterOption(item)
      this.$nextTick(() => {
        this._isSuggestionHandledBySelect = false
      })
    },
    clearSearchHistoryForItem(itemToDelete, event) {
      event.stopPropagation();
      event.preventDefault();
      const idToDelete = itemToDelete.id
      api.removeSearchHistory({id: idToDelete}).then(() => {
        const index = this.searchSuggestions.findIndex(item => item.id === idToDelete)
        this.searchSuggestions.splice(index, 1)
      })
    },
    clearAllSearchHistory(event) {
      event.stopPropagation();
      event.preventDefault();
      this.$confirm('确定要清除所有搜索记录吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.removeAllSearchHistory({userId: this.$store.getters.userId}).then(() => {
          this.searchSuggestions = this.searchSuggestions.filter(
            item => item.sugType === 'action_current_path_search' || item.sugType === 'action_global_search'
          );
        })
      }).catch(() => {
      })
    },
  }
}
