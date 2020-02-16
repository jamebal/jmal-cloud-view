<template>
  <div class="dashboard-container">
    <el-breadcrumb class="app-breadcrumb" separator="">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in pathList" :key="item.index">
          <a v-if="index===0" @click.prevent="handleLink(item,index)"><svg-icon icon-class="home" /></a>
          <span v-if="index===pathList.length-2" class="no-redirect">{{ item.folder }}</span>
          <a v-if="index!==pathList.length-2 && index!==pathList.length-1" class="redirect" @click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 20px;" icon-class="breadcrumb-right" /></a>
          <el-popover
            v-if="index===pathList.length-1"
            v-model="isShowNewFolder"
            placement="bottom"
            @click="showNewFolderClick"
            @after-leave="hideNewFolderName"
          >
            <div class="newFileMenu" style="display: block;">
              <ul>
                <li @click="upload">
                  <label class="menuitem">
                    <svg-icon icon-class="file-upload" /><span class="menuitem text">上传文件</span>
                  </label>
                </li>
                <li @click="uploadFolder">
                  <label class="menuitem">
                    <svg-icon icon-class="folder-upload" /><span class="menuitem text">上传文件夹</span>
                  </label>
                </li>
                <li @click.prevent="newFolder">
                  <a href="#" class="menuitem"><svg-icon icon-class="folder-add" /><span class="menuitem text">新建文件夹</span>
                  </a>
                </li>
                <div v-show="showNewFolder" class="folder-name-form">
                  <el-input v-focus v-model="newFolderName" placeholder="请输入文件夹名称" :clearable="true" @keyup.enter.native="newFolderNameClickEnter">
                    <el-button
                      slot="append"
                      v-loading="newFolderLoading"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="#f6f7fa88"
                      class="el-icon-right"
                      @click="newFolderNameClick"
                    >
                    </el-button>
                  </el-input>
                </div>
              </ul>
            </div>
            <el-button slot="reference" icon="el-icon-plus add-file-button" circle />
          </el-popover>
        </el-breadcrumb-item>
      </transition-group>
      <div class="search-content">
        <el-input placeholder="搜索您的文件" class="searchClass" v-model="searchFileName" :clearable="true" @keyup.enter.native="searchFile(searchFileName)">
          <el-button slot="append" @click="searchFile(searchFileName)">
            <svg-icon icon-class="search" />
          </el-button>
        </el-input>
      </div>
    </el-breadcrumb>

    <e-vue-contextmenu ref="contextShow" class="newFileMenu" :class="menuTriangle" @ctx-show="show" @ctx-hide="hide">
      <div class="popper-arrow"></div>
      <ul v-for="(item,index) in menus" :key="item.label">
        <li
          v-if="item.operation === 'unFavorite' || item.operation === 'favorite'"
          @click="menusOperations(item.operation)"
          @mouseover.prevent="menuFavoriteOver(index,selectRowData[0].isFavorite)"
          @mouseleave.prevent="menuFavoriteLeave(index,selectRowData[0].isFavorite)"
        >
          <label class="menuitem"><svg-icon :icon-class="item.iconClass" /><span class="menuitem text">{{ item.label }}</span>
          </label>
        </li>
        <li
          v-else
          @click="menusOperations(item.operation)"
        >
          <label class="menuitem"><svg-icon :icon-class="item.iconClass" /><span class="menuitem text">{{ item.label }}</span>
          </label>
        </li>

      </ul>
    </e-vue-contextmenu>

    <div class="dashboard-text">path: {{ path }}</div>


    <el-table
      ref="fileListTable"
      v-loading="tableLoading"
      :max-height="clientHeight"
      style="width: 100%;margin: 20px 0 0 0;"
      empty-text="无文件"
      :data="fileList"
      row-key="id"
      :summary-method="getSummaries"
      show-summary
      :cell-style="rowRed"
      :row-class-name="tableRowClassName"
      element-loading-text="文件加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#f6f7fa88"
      @selection-change="handleSelectionChange"
      @row-contextmenu="rowContextmenu"
      @cell-click="cellClick"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
    >
      <template v-for="(item,index) in tableHead">
        <el-table-column
          v-if="index === 0"
          :key="index"
          :index="index"
          type="selection"
          min-width="50"
        >
        </el-table-column>
        <el-table-column
          v-if="index === 1"
          :key="index"
          :index="index"
          width="50"
        >
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.isFavorite" icon-class="menu-favorite-hover" style="font-size: 1rem;float: right;margin-bottom: -1rem;position: relative;" />
            <svg-icon v-if="scope.row.isFolder" icon-class="folder" />
            <svg-icon v-else-if="scope.row.contentType.indexOf('video') > -1" icon-class="video" />
            <svg-icon v-else-if="scope.row.contentType.indexOf('audio') > -1" icon-class="audio" />
            <svg-icon v-else-if="scope.row.contentType.indexOf('text') > -1" icon-class="file-txt" />
            <el-avatar v-else-if="scope.row.contentType.indexOf('image') > -1" shape="square" :src="imageUrl+scope.row.id"></el-avatar>
            <svg-icon v-else-if="scope.row.contentType.indexOf('application/pdf') > -1" icon-class="file-pdf" />
            <svg-icon v-else-if="scope.row.contentType.indexOf('word') > -1" icon-class="file-word" />
            <svg-icon v-else-if="scope.row.contentType.indexOf('excel') > -1" icon-class="file-excel" />
            <svg-icon v-else-if="scope.row.contentType.indexOf('zip') > -1" icon-class="zip" />
            <svg-icon v-else icon-class="file" />
          </template>
        </el-table-column>

        <el-table-column v-if="index === 2" :key="index" :show-overflow-tooltip="true" min-width="200" :index="index" :prop="item.name" :label="item.label" :sortable="item.sortable" @click.stop="fileClick(scope.row)">
          <template slot-scope="scope">
            <el-col v-if="scope.row.index === editingIndex" :span="10">
              <el-input v-focus v-model="renameFileName" placeholder="" size="small" :clearable="true" @keyup.enter.native="rowRename(renameFileName, scope.row)">
              </el-input>
              <el-button
                v-loading="renameLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#f6f7fa88"
                class="el-icon-check"
                @click="rowRename(renameFileName, scope.row)"
              >
              </el-button>
              <el-button
                element-loading-spinner="el-icon-loading"
                element-loading-background="#f6f7fa88"
                class="el-icon-close"
                @click="editingIndex = -1"
              >
              </el-button>
            </el-col>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="index === 3" :key="index" width="50" :index="index" align="center" header-align="center">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.index === cellMouseIndex" class="button-class" icon-class="share" />
          </template>
        </el-table-column>

        <el-table-column v-if="index === 4" :key="index" width="50" :prop="item.name" :label="item.label" :index="index" class="el-icon-more" align="center" header-align="center">
          <!-- 使用组件, 并传值到组件中 -->
          <template slot="header">
            <svg-icon v-if="item.name !== ''" class="button-class" icon-class="more" @click="moreOperation($event)" />
          </template>
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.index === cellMouseIndex" class="button-class" icon-class="more" @click="moreClick(scope.row,$event)" />
          </template>
        </el-table-column>

        <el-table-column
          v-if="index === 5"
          :key="index"
          width="90"
          :prop="item.name"
          :index="index"
          :label="item.label"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.size < 1024">{{ scope.row.size }}B</span>
            <span v-if="scope.row.size >= 1024 && scope.row.size < 1024*1024">{{ (scope.row.size/1024).toFixed(2) }}K</span>
            <span v-if="scope.row.size >= 1024*1024 && scope.row.size < 1024*1024*1024">{{ (scope.row.size/(1024*1024)).toFixed(2) }}M</span>
            <span v-if="scope.row.size >= 1024*1024*1024 && scope.row.size < 1024*1024*1024*1024">{{ (scope.row.size/(1024*1024*1024)).toFixed(2) }}G</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="index === 6"
          :key="index"
          width="150"
          :prop="item.name"
          :index="index"
          :label="item.label"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
          align="left"
          header-align="left"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.agoTime < 1000*10">&nbsp;&nbsp;&nbsp;刚刚</span>
            <span v-if="scope.row.agoTime >= 1000*10 && scope.row.agoTime < 1000*60">&nbsp;&nbsp;&nbsp;{{ (scope.row.agoTime/1000).toFixed(0) }} 秒钟前</span>
            <span v-if="scope.row.agoTime >= 1000*60 && scope.row.agoTime < 1000*60*60">&nbsp;&nbsp;&nbsp;{{ (scope.row.agoTime/(1000*60)).toFixed(0) }} 分钟前</span>
            <span v-if="scope.row.agoTime >= 1000*60*60 && scope.row.agoTime < 1000*60*60*24">&nbsp;&nbsp;&nbsp;{{ (scope.row.agoTime/(1000*60*60)).toFixed(0) }} 小时前</span>
            <span v-if="scope.row.agoTime >= 1000*60*60*24 && scope.row.agoTime < 1000*60*60*24*30">&nbsp;&nbsp;&nbsp;{{ (scope.row.agoTime/(1000*60*60*24)).toFixed(0) }} 天前</span>
            <span v-if="scope.row.agoTime >= 1000*60*60*24*30 && scope.row.agoTime < 1000*60*60*24*30*12">{{ (scope.row.agoTime/(1000*60*60*24)).toFixed(0) }} 个月前</span>
            <span v-if="scope.row.agoTime >= 1000*60*60*24*30*12">&nbsp;&nbsp;&nbsp;{{ (scope.row.agoTime/(1000*60*60*24*30*12)).toFixed(0) }} 年前</span>
          </template>
        </el-table-column>

      </template>
    </el-table>
  </div>
</template>

<script>
/* eslint-disable */
// import MenuPopover from '@/components/popover/MenuPopover'
import { mapGetters } from 'vuex'
// import defaultSettings from '@/settings'
import { getPath, getPathList, setPath, removePath } from '@/utils/path'
import Bus from '@/assets/js/bus'
import api from '@/api/upload-api'
// import Sortable from 'sortablejs'

export default {
  components: { },
  data() {
    return {
      imageUrl: process.env.VUE_APP_BASE_API + '/view/thumbnail?jmal-token=' + this.$store.state.user.token + '&id=',
      // imageUrl: 'http://localhost:8088/view?username=' + this.$store.state.user.name + '&id=',
      fileMenuActive: '',
      path: getPath(),
      showNewFolder: false,
      isShowNewFolder: false,
      listModeSearch: false,
      newFolderName: '新建文件夹',
      renameFileName: '',
      searchFileName: '',
      pathList: [
        { 'folder': '', index: 0 },
        { 'folder': '+', index: 1 }
      ],
      fileList: [],
      indexList: [],
      clientHeight: 500,
      // 表头数据
      tableHead: [
        {
          name: '', label: '', index: 0
        },
        {
          name: '', label: '', index: 1
        },
        {
          name: 'name', label: '名称', sortable: true, index: 2
        },
        {
          name: '', label: '', index: 3
        },
        {
          name: '', label: '', more: true, index: 4
        },
        {
          name: 'size', label: '大小', sortable: true, index: 5
        },
        {
          name: 'updateDate', label: '修改日期', sortable: true, index: 6
        }
      ],
      isJustHideMenus: false,
      menusIsMultiple: false,
      menus: [],
      singleMenus: [
        { iconClass: 'menu-open', label: '打开', operation: 'open' },
        { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
        { iconClass: 'menu-details', label: '详细信息', operation: 'details' },
        { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
        { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
        { iconClass: 'menu-download', label: '下载', operation: 'download' },
        { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
      ],
      multipleMenus: [
        { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
        { iconClass: 'menu-download', label: '下载', operation: 'download' },
        { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
      ],
      multipleRightMenus: [
        { iconClass: 'menu-deselect', label: '取消选定', operation: 'deselect' },
        { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
        { iconClass: 'menu-download', label: '下载', operation: 'download' },
        { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
      ],
      rowContextData: {},
      selectRowData: [],
      tableLoading: false,
      newFolderLoading: false,
      renameLoading: false,
      menuTriangle: '',
      cellMouseIndex: -1,
      editingIndex: -1
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getFileList()
  },
  mounted() {
    this.rowDrop()
    Bus.$on('fileSuccess', () => {
      this.getFileList()
    })
    Bus.$on('clickMore', (selectRowData) => {
      this.selectRowData = selectRowData
      this.preliminaryRowData()
    })

    // 加载路径
    const pathList = getPathList()
    if (pathList && pathList !== 'undefined') {
      const res = JSON.parse(pathList)
      const list = []
      res.forEach(function(element) {
        const item0 = {}
        item0['folder'] = element.folder + ''
        item0['index'] = element.index
        list.push(item0)
      })
      this.pathList = list
    }
    const that = this
    window.onresize = function temp() {
      that.clientHeight = document.documentElement.clientHeight - 150
    }
  },
  destroyed() {
    removePath()
  },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function (el) {
        // 聚焦元素
        el.querySelector('input').focus()
      }
    }
  },
  methods: {
    // 行拖拽
    rowDrop() {
      // const tbody = document.querySelector('.el-table__body-wrapper tbody')
      // const _this = this
      // Sortable.create(tbody, {
      // onMoveCallback({ newIndex, oldIndex }) {
      //   const currRow = _this.fileList.splice(oldIndex, 1)[0]
      //   _this.fileList.splice(newIndex, 0, currRow)
      // }
      // })
    },
    upload() {
      // 打开文件选择框
      Bus.$emit('openUploader', {
        // 传入的参数
        currentDirectory: this.path,
        username: this.$store.state.user.name,
        userId: this.$store.state.user.userId
      })
    },
    uploadFolder() {
      // 打开文件夹选择框
      console.log('selectFolder')
      Bus.$emit('uploadFolder', {
        // 传入的参数
        currentDirectory: this.path,
        username: this.$store.state.user.name,
        userId: this.$store.state.user.userId
      })
    },
    handleLink(item, index) {
      if(item.search){
        if(item.searchKey){
          this.searchFileByKeyWord(item.searchKey)
        } else if(item.fileId){
          this.searchFileAndOpenDir(item.fileId)
        }
        this.pathList.splice(this.pathList.findIndex(v => v.index === index + 2), this.pathList.length - (index + 2))
      } else {
        this.pathList.splice(this.pathList.findIndex(v => v.index === index + 2), this.pathList.length - (index + 2))
        this.pathList.forEach((p, number) => {
          if (number === 0) {
            this.path = ''
          } else if (number === this.pathList.length - 1) {
          } else {
            this.path += '/' + this.pathList[number].folder
          }
        })
        setPath(this.path, this.pathList)
        this.getFileList()
      }
    },
    newFolder() {
      this.newFolderName = '新建文件夹'
      let append = 0
      let filenameList = []
      this.fileList.forEach(file => {
        filenameList.push(file.name)
      })
      while(filenameList.includes(this.newFolderName)){
        append += 1
        this.newFolderName = '新建文件夹' + append
      }
      this.showNewFolder = true
    },
    hideNewFolderName() {
      this.showNewFolder = false
      this.isShowNewFolder = false
    },
    showNewFolderClick() {
      this.isShowNewFolder = true
    },
    newFolderNameClickEnter() {
      this.newFolderNameClick()
    },
    // 新建文件夹
    newFolderNameClick() {
        this.newFolderLoading = true
      if(this.newFolderName){
        api.uploadFolder({
          isFolder: true,
          filename: this.newFolderName,
          currentDirectory: this.path,
          username: this.$store.state.user.name,
          userId: this.$store.state.user.userId
        }).then((res) => {
          if(res.data === 1){
            this.newFolderLoading = false
            this.$message({
              message: '该文件夹已存在',
              type: 'warning'
            });
          } else {
            this.newFolderLoading = false
            this.showNewFolder = false
            this.isShowNewFolder = false
            this.$notify({
              title: '新建文件夹成功',
              type: 'success',
              duration: 1000
            })
            this.getFileList()
          }
        })
      }else{
        this.newFolderLoading = false
        this.$message({
          message: '请输入文件夹名称',
          type: 'warning'
        });
      }
    },
    searchFileByKeyWord(key) {
      this.searchFile(key)
    },
    searchFile(key) {
      if(key){

        this.pathList = [{ 'folder': '', index: 0 }]
        const item1 = {}
        item1['folder'] = '搜索: ' + '"'+ key +'"'
        item1['search'] = true
        item1['searchKey'] = key
        item1['index'] = 1
        const item2 = {}
        item2['folder'] = '+'
        item2['index'] = 2
        this.pathList.push(item1)
        this.pathList.push(item2)

        this.tableLoading = true
        api.searchFile({
          userId: this.$store.state.user.userId,
          keyword: key,
          currentDirectory: getPath(),
          pageIndex: 1,
          pageSize: 30
        }).then(res => {
          this.fileList = res.data
          this.tableLoading = false
          this.clientHeight = document.documentElement.clientHeight - 150
          this.listModeSearch = true
        }).catch(e => {})
      }else{
        this.handleLink('',0)
      }
    },
    searchFileAndOpenDir(fileId) {
      this.tableLoading = true
      api.searchFileAndOpenDir({
        userId: this.$store.state.user.userId,
        id: fileId,
        currentDirectory: getPath(),
        pageIndex: 1,
        pageSize: 30
      }).then(res => {
        this.fileList = res.data
        this.tableLoading = false
        this.clientHeight = document.documentElement.clientHeight - 150
        this.listModeSearch = true
      }).catch(e => {})
    },
    getFileList() {
      this.tableLoading = true
      api.fileList({
        userId: this.$store.state.user.userId,
        currentDirectory: getPath(),
        pageIndex: 1,
        pageSize: 30
      }).then(res => {
        this.fileList = res.data
        this.tableLoading = false
        this.clientHeight = document.documentElement.clientHeight - 150
        this.listModeSearch = false
      }).catch(e => {})
    },
    getSummaries(param) {
      // 合计
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]))
        if (index === 5) {
          sums[2] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      })
      const sumFileAndFolder = this.getShowSumFileAndFolder(this.fileList)
      const sizeSum = this.getShowSumSize(sums[2])
      sums[2] = sumFileAndFolder + sizeSum
      return sums
    },
    // 统计文件和文件夹
    getShowSumFileAndFolder(fileList) {
      let folderSize = 0
      let fileSize = 0
      fileList.forEach((fileInfo) => {
        if (fileInfo.isFolder) {
          folderSize += 1
        } else {
          fileSize += 1
        }
      })
      let folderSum = ''
      if (folderSize > 0) {
        folderSum = folderSize + '个文件夹'
      }
      let fileSum = ''
      if (fileSize > 0) {
        fileSum = fileSize + '个文件'
      }
      return folderSum + ' ' + fileSum
    },
    // 计算总大小
    getShowSumSize(totalSize) {
      let sizeSum = ''
      if (totalSize > 0) {
        sizeSum = '  共'
      }
      if (totalSize < 1024) {
        sizeSum += totalSize + 'B'
      } else if (totalSize >= 1024 && totalSize < 1024 * 1024) {
        sizeSum += (totalSize / 1024).toFixed(2) + 'K'
      } else if (totalSize >= 1024 * 1024 && totalSize < 1024 * 1024 * 1024) {
        sizeSum += (totalSize / (1024 * 1024)).toFixed(2) + 'M'
      } else {
        sizeSum += (totalSize / (1024 * 1024 * 1024)).toFixed(2) + 'G'
      }
      return sizeSum
    },
    // 收集选中的index值作为数组 传递给rowRed判断变换样式
    handleSelectionChange(row) {
      // 选中的值
      this.selectRowData = row
      let selectTotalSize = 0
      this.indexList = []
      for (const item of row) {
        selectTotalSize += item.size
        this.indexList.push(item.index)
      }
      const item_name = this.tableHead[2]
      const item_more = this.tableHead[4]
      const item_size = this.tableHead[5]
      const item_date = this.tableHead[6]
      if (this.selectRowData.length > 0) {
        const sumFileAndFolder = this.getShowSumFileAndFolder(row)
        const sizeSum = this.getShowSumSize(selectTotalSize)
        item_name.label = sumFileAndFolder
        item_name.sortable = false
        item_more.name = 'more'
        item_size.label = sizeSum
        item_size.sortable = false
        item_date.label = ''
        item_date.sortable = false
      } else {
        item_name.label = '名称'
        item_name.sortable = true
        item_more.name = ''
        item_size.label = '大小'
        item_size.sortable = true
        item_date.label = '修改日期'
        item_date.sortable = true
      }
      // this.$set(this.tableHead, 2, item_name)
      // this.$set(this.tableHead, 2, item_more)
      // this.$set(this.tableHead, 5, item_size)
      console.log('selectRowData', this.selectRowData)
      console.log('rowContextData', this.rowContextData)
    },
    // cell-style通过返回值可以实现样式变换利用传递过来的数组index循环改变样式
    rowRed({ row, column, rowIndex, columnIndex }) {
        if (this.indexList.length < 1 && columnIndex === 2 && this.cellMouseIndex === rowIndex) {
          return { cursor: 'pointer', color: "#19ACF9" }
        }
        for (let i = 0; i < this.indexList.length; i++) {
          if (rowIndex === this.indexList[i]) {
            return { backgroundColor: '#EBEEF5', color: '#b7b5b6', cursor: 'default' }
          }
        }
    },
    // 动态添加index到row里面去
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 选择某行预备数据
    preliminaryRowData(row) {
      if (row) {
        this.selectRowData[0] = row
      }
      const isFavorite = this.selectRowData[0].isFavorite
      this.highlightFavorite(isFavorite, false)
    },
    // 单元格hover进入时时间
    cellMouseEnter(row) {
      if(this.editingIndex === -1){
        if (this.indexList.length < 1) {
          this.cellMouseIndex = row.index
        }
      }
    },
    // 单元格hover退出时时间
    cellMouseLeave() {
      this.cellMouseIndex = -1
    },
    // 单元格点击事件
    cellClick(row, column) {
      if(this.editingIndex === -1) {
        const columnIndex = column.index
        if (columnIndex === 0) {
          // 点击选中
          this.$refs.fileListTable.toggleRowSelection(row)
        }
        if (columnIndex === 2) {
          if (this.indexList.length < 1) {
            if (row.index !== this.editingIndex) {
              this.fileClick(row)
              this.editingIndex = -1
            }
          }
        }
        if (columnIndex === 4) {
          // // 单个操作
        }
        if (this.indexList.length > 0) {
          this.$refs.fileListTable.toggleRowSelection(row)
        }
      }
    },
    // 重命名
    rowRename(newFileName, row) {
      if (newFileName) {

        if (!row.isFolder) {
          const ext = '.' + row.suffix
          if (!newFileName.endsWith(ext)) {
            newFileName += ext
          }
        }

        console.log('newFileName', newFileName)

        this.renameLoading = true
        const findIndex = this.fileList.findIndex(item => {
          if(newFileName === item.name){
            return item;
          }
        })
        console.log(findIndex)
        if(findIndex > -1){
          let msg = '该文件已存在'
          if(row.isFolder){
            msg = '该文件夹已存在'
          }
          this.$message({
            message: msg,
            type: 'warning'
          });
          this.renameLoading = false
          return
        }

        api.rename({
          newFileName: newFileName,
          username: this.$store.state.user.name,
          id: row.id
        }).then(res => {
          if (res.data) {
            this.renameLoading = false
            row.name = newFileName
            this.fileList[row.index] = row
            this.editingIndex = -1
          }
        })
      } else {
        this.editingIndex = -1
      }
    },
    // 更多操作(多选)
    moreOperation(event) {
      this.menusIsMultiple = true
      this.menus = this.multipleMenus
      this.showOperationMenus(event)
    },
    // 更多操作(单选)
    moreClick(row, event) {
      this.menusIsMultiple = false
      this.menus = this.singleMenus
      this.showOperationMenus(event)
      this.preliminaryRowData(row)
      this.showOperationMenus(event)
    },
    // 鼠标右击
    rowContextmenu(row, column, event) {
      if (this.indexList.includes(row.index)) {
        this.menusIsMultiple = true
        this.menus = this.multipleRightMenus
      } else {
        this.menusIsMultiple = false
        this.menus = this.singleMenus
        this.preliminaryRowData(row)
      }
      // 右击选择的数据
      this.rowContextData = row
      event.preventDefault()
      this.menuTriangle = ''
      const e = {}
      console.log('pageX:' + event.pageX, 'clientX:' + event.clientX)
      console.log('pageY:' + event.pageY, 'clientY:' + event.clientY)
      e.pageX = event.pageX + 5
      e.pageY = event.pageY + 2
      e.clientX = event.clientX + 5
      e.clientY = event.clientY + 2
      this.$refs.contextShow.showMenu(e)
    },
    // 显示操作菜单
    showOperationMenus(event) {
      const e = {}
      if (document.body.scrollHeight - event.pageY > 400) {
        this.menuTriangle = 'menu-triangle-top'
        e.pageX = event.pageX - 78
        e.pageY = event.pageY + 30
        e.clientX = event.clientX + 78
        e.clientY = event.clientY + 30
      } else {
        this.menuTriangle = 'menu-triangle-bottom'
        e.pageX = event.pageX - 78
        e.pageY = event.pageY - 300
        e.clientX = event.clientX + 78
        e.clientY = event.clientY - 300
      }
      if (!this.isJustHideMenus) {
        this.$refs.contextShow.showMenu(e)
      }
    },
    menuFavoriteOver(index, isFavorite) {
      this.highlightFavorite(isFavorite, true)
    },
    menuFavoriteLeave(index, isFavorite) {
      this.highlightFavorite(isFavorite, false)
    },
    // 是否高亮收图标
    highlightFavorite(isFavorite, isHover) {
      const item_menu = this.menus.find(item => {
        if (item.operation === 'favorite' || item.operation === 'unFavorite') {
          return item
        }
      })
      if (item_menu) {
        if (isFavorite) {
          item_menu.label = '取消收藏'
          item_menu.iconClass = 'menu-favorite-hover'
          item_menu.operation = 'unFavorite'
        } else {
          if (isHover) {
            item_menu.iconClass = 'menu-favorite-hover'
          } else {
            item_menu.iconClass = 'menu-favorite'
          }
          item_menu.label = '收藏'
          item_menu.operation = 'favorite'
        }
        // this.$set(this.menus, 0, item_menu)
      }
    },
    show() {
      console.log('菜单显示了')
    },
    hide() {
      const that = this
      this.isJustHideMenus = true
      setTimeout(function() {
        that.isJustHideMenus = false
      }, 100)
      console.log('菜单隐藏了')
    },
    // 菜单操作
    menusOperations(operation) {
      switch (operation) {
        case 'favorite':
          console.log('operation', '收藏')
          this.favoriteOperating(true)
          break
        case 'open':
          console.log('open', '打开')
          this.fileClick(this.rowContextData)
          break
        case 'deselect':
          console.log('deselect', '取消选定')
          this.$refs.fileListTable.toggleRowSelection(this.rowContextData)
          break
        case 'unFavorite':
          console.log('unFavorite', '取消收藏')
          this.favoriteOperating(false)
          break
        case 'details':
          this.$notify.info({
            title: this.rowContextData.name,
            duration: 2000
          })
          console.log('详情', this.rowContextData)
          break
        case 'rename':
          console.log('重命名')
          this.renameFileName = this.rowContextData.name
          this.editingIndex = this.rowContextData.index
          break
        case 'copy':
          console.log('移动或复制')
          break
        case 'download':
          console.log('下载')
          this.downloadFile()
          break
        case 'remove':
          console.log('operation', '删除')
          this.deleteFile()
          break
      }
      this.$refs.contextShow.hideMenu()
    },
    downloadFile() {
      let totalSize = 0
      this.selectRowData.forEach(item => {
        totalSize += item.size
      })
      if (totalSize > 0) {
        var fileIds = [];
        if (this.menusIsMultiple) {
          this.selectRowData.forEach(value => {
            fileIds.push(value.id)
          })
        } else {
          fileIds.push(this.rowContextData.id)
        }
        window.open(process.env.VUE_APP_BASE_FILE_API + 'download?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds, '_self')
      } else {
        this.$message({
          message: '所选文件夹为空',
          type: 'warning'
        });
      }
    },
    // 收藏/取消收藏
    favoriteOperating(isFavorite) {
      this.selectRowData[0].isFavorite = isFavorite

      this.highlightFavorite(isFavorite, true)
      api.favoriteUrl({
        token: this.$store.state.user.token,
        id: this.selectRowData[0].id,
        isFavorite: isFavorite
      }).then(res => {
      })
    },
    // 删除
    deleteFile() {
      let fileList = []
      const fileIds = []
      if (this.menusIsMultiple) {
        fileList = this.selectRowData
        this.selectRowData.forEach(value => {
          fileIds.push(value.id)
        })
      } else {
        fileIds.push(this.selectRowData[0].id)
      }
      const str = this.getShowSumFileAndFolder(fileList)

      this.$confirm('此操作将永久删除' + str + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delete({
          username: this.$store.state.user.name,
          fileIds: fileIds
        }).then(() => {
          // 移除列表
          if (this.selectRowData.length === 1) {
            this.fileList.splice(this.selectRowData[0].index, 1)
          } else {
            this.getFileList()
          }
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.$refs.fileListTable.clearSelection()// 删除后清空之前选择的数据
          this.selectRowData = []
        })
      })
    },
    // 点击文件或文件夹
    fileClick(row) {
      console.log(row)
      if (row.isFolder) {
        // 打开文件夹
        if (this.listModeSearch) {

          const item1 = {}
          item1['folder'] = row.name
          item1['search'] = true
          item1['fileId'] = row.id
          item1['index'] = this.pathList.length - 1
          const item2 = {}
          item2['folder'] = '+'
          item2['index'] = this.pathList.length
          this.pathList[this.pathList.length - 1] = item1
          this.pathList.push(item2)

          this.searchFileAndOpenDir(row.id)
        } else {
          this.path += '/' + row.name
          const item1 = {}
          item1['folder'] = row.name
          item1['index'] = this.pathList.length - 1
          const item2 = {}
          item2['folder'] = '+'
          item2['index'] = this.pathList.length
          this.pathList[this.pathList.length - 1] = item1
          this.pathList.push(item2)
          setPath(this.path, this.pathList)
          this.getFileList()
        }
      } else {
        // 打开文件
        const fileIds = [row.id]
        const url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
        window.open(url, '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      min-width:500px;
      margin: 10px 10px 10px 15px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .redirect {
    color: #97a8be;
  }
  .no-redirect {
    color: #000000;
    cursor: text;
    margin-right: 10px;
  }

  /deep/ .el-breadcrumb__separator {
    margin: 0 0;
    font-weight: 700;
    color: #C0C4CC;
  }
  /deep/ .breadcrumb-svg {
    font-size: 20px;
  }

  .el-breadcrumb {
    font-size: 20px;
    line-height: 46px;
  }
  .newFileMenu ul {
    list-style: none;
    padding-inline-start: 0px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .button-class {
    cursor: pointer;
  }

  .button-class:hover {
    border-radius: 5px;
    background-color: #409eff14;
  }

  .newFileMenu li {
    cursor: pointer;
    margin: 0;
    padding: 0;
    font-size: 16px;
    min-width: 136px;
  }
  .newFileMenu li:hover {
    cursor: pointer;
    border-radius: 5px;
    /*background-color: #409eff14;*/
    background-color: #409eff30;
  }
  .newFileMenu li > .menuitem {
    cursor: pointer;
    line-height: 38px;
    margin-left: 10%;
  }
  .newFileMenu li > .menuitem > .text {
    cursor: pointer;
    margin-left: 8%;font-weight: normal;
  }
  .newFileMenu li > .menuitem > .svg-icon {
    cursor: pointer;
    font-size: 20px;
  }
  /deep/ .el-input-group__append /deep/ .el-loading-spinner {
    top: 0;
    margin-top: 0.75rem;
  }
  /deep/ .cell /deep/ .el-loading-spinner {
    top: 0;
    margin-top: 0.54rem;
  }
  /deep/ .cell /deep/ .el-button {
    padding: 8px 16px;
    margin-left: 10px;
  }
  /deep/ .el-checkbox {
    cursor: default;
  }
  /deep/ .el-checkbox__input {
    cursor: default;
  }
  .el-button.is-circle {
    border-radius: 50%;
    padding: 9px;
  }
  /deep/.svg-icon {
    font-size: 28px;
  }
  /deep/.el-table thead {
    color: #4f4f50;
  }
  /deep/ .el-table thead .el-table-column--selection .cell {
    padding-left: 15px;
  }
  /deep/.el-table .cell {
    padding-right: 5px;
  }
  /deep/.el-table th {
    padding: 0 0;
  }
  /deep/.el-table td{
    padding: 1px 0;
    height: 50px;
  }
  /deep/.el-table__header tr, .el-table__header th {
    height: 40px;
  }
  /deep/.el-avatar>img {
    display: inherit;
    vertical-align: inherit;
  }
  /deep/.el-avatar {
    background: #ffffff;
    margin: 7px 0 0 0;
  }
  /deep/.el-avatar {
    width: 35px;
    height: 35px;
    line-height: 35px;
  }

  /deep/ .ctx-menu-container {
    border: 0 solid rgba(0, 0, 0, 0);
  }

  .menu-triangle-bottom {
    border: 0 solid rgba(0, 0, 0, 0);
  }

  .menu-triangle-bottom::after {
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    content: '';
    bottom: -6px;
    left: 74px;
    border-style: solid;
    border-width: 6px;
    border-color: #fff #fff transparent transparent;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    -webkit-box-shadow: 1px -1px 1px #cccccc73;
    box-shadow: 1px -1px 1px #cccccc73;
  }

  .menu-triangle-top {
    border: 0 solid rgba(0, 0, 0, 0);
  }

  .menu-triangle-top::after {
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    content: '';
    top: -6px;
    left: 74px;
    border-style: solid;
    border-width: 6px;
    border-color: #fff #fff #e0000000 white;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 1px -1px 1px #cccccc73;
    box-shadow: -1px -1px 1px #cccccc73;
  }
  /*解决合计不显示的问题*/
  /deep/
  .el-table__footer-wrapper{
    position: fixed;
  }

  .searchClass{
    float: right;
    width: 30%;
  }

</style>

