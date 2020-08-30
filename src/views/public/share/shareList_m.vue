<template>
  <div class="dashboard-container" v-resize="containerResize">
    <transition name="fade">
      <al-loading v-if="isLoading"></al-loading>
    </transition>
    <div class="share-h">
      <div class="share-header">
        <a href="">
          <div class="share-header-content">
            <svg-icon icon-class="jmal-cloud"/><span>jmal Cloud</span>
          </div>
        </a>
      </div>
      <el-divider class="header-location"></el-divider>
      <el-breadcrumb class="app-breadcrumb" separator="" v-if="!linkFailed">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item,index) in pathList" :key="item.index">
            <span v-if="index===0">当前位置:</span>
            <breadcrumb-file-path :pathList="pathList" :item="item" :index="index" @clickLink="handleLink"></breadcrumb-file-path>
          </el-breadcrumb-item>
        </transition-group>
        <div class="search-content">
          <div class="searchClass">
            <el-button v-if="indexList.length > 0" type="primary" @click="downloadFile">
            下载
            </el-button>
          </div>
        </div>
      </el-breadcrumb>
    </div>
    <!--<el-divider class="header-location"></el-divider>-->

    <!--右键菜单-->
    <e-vue-contextmenu ref="contextShow" class="newFileMenu" :class="menuTriangle" @ctx-show="show" @ctx-hide="hide">
      <div class="popper-arrow"></div>
      <ul v-for="(item,index) in menus" :key="item.label">
        <li
          v-if="item.operation === 'unFavorite' || item.operation === 'favorite'"
          @click="menusOperations(item.operation)"
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

    <!--<div class="dashboard-text">path: {{ path }}</div>-->

    <!--list布局-->
    <el-table
      v-show="!grid && !linkFailed"
      ref="fileListTable"
      v-loading="tableLoading"
      empty-text="无文件"
      :data="fileList"
      row-key="id"
      :cell-style="rowRed"
      :show-header="false"
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
          v-if="index === 1"
          :key="index"
          :index="index"
          width="50"
        >
          <template slot-scope="scope">
            <icon-file :item="scope.row" :image-url="imageUrl" :public="true"></icon-file>
          </template>
        </el-table-column>

        <el-table-column
          v-if="index === 2"
          :key="index"
          :show-overflow-tooltip="true"
          max-width="200"
          :index="index"
          :prop="item.name"
          :label="item.label"
          align="left"
          header-align="left"
          @click.stop="fileClick(scope.row)">
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
            <span v-else class="table-file-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="index === 5"
          :key="index"
          width="80"
          :prop="item.name"
          :index="index"
          :label="item.label"
          :show-overflow-tooltip="true"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{formatSize(scope.row.size)}}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!--grid布局-->
    <div v-show="grid && !linkFailed" v-loading="tableLoading"
         element-loading-text="文件加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="#f6f7fa88">
      <div class="checkbox-group-header">
        <van-checkbox class="grid-all-checkbox" @click="clickGridAllCheckBox()" v-model="allChecked">{{indexList.length>0 ? '已选择 '+this.tableHead[2].label : "选择"}}</van-checkbox>
        <el-divider></el-divider>
      </div>

      <van-checkbox-group v-model="selectRowData" @change="handleSelectionChange" ref="checkboxGroup">
        <van-grid square :column-num="gridColumnNum" :gutter="20" :border="false">
          <van-grid-item v-for="(item,index) in fileList" ref="gridItem"  :key="item.id"
          >
            <div class="grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                 :style="{'background': indexList.includes(index)?'#baebff91':'','cursor':indexList.length>0?'default':'pointer'}"
                 @mouseover="gridItemHover(item,index)"
                 @mouseout="gridItemOut(item,index)"
                 @click="gridItemClick(item)"
                 @contextmenu.prevent="rowContextmenu(item)"
            >
              <van-checkbox v-show="gridHoverItemIndex === index || indexList.includes(index)" class="grid-item-checkbox" :name="item" @click.stop="clickGridItemCheckBox(item,index)"/>
              <div class="grid-item-icon"><icon-file :item="item" :image-url="imageUrl" :grid="true" :public="true"></icon-file></div>
              <span class="grid-item-text">{{item.name}}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </van-checkbox-group>
      <el-divider class="grid-divider" content-position="center"><i class="el-icon-folder-opened"></i>&nbsp;{{summaries}}</el-divider>
    </div>
    <div v-if="linkFailed" class="share-header">
      <p v-if="prompt !== ''">温馨提示：</p>
      <p>{{prompt}}</p>
    </div>

    <sim-text-preview :file.sync="textPreviewRow" :shareId="shareId" :status.sync="textPreviewVisible"></sim-text-preview>
    <image-viewer :fileList="fileList" :shareId="shareId" :file="imagePreviewRow" :status.sync="imagePreviewVisible"></image-viewer>
    <video-preview :file="videoPreviewRow" :shareId="shareId" :status.sync="videoPreviewVisible"></video-preview>

    <el-pagination
      background
      layout="prev, pager, next"
      :hide-on-single-page="true"
      :current-page.sync="pagination.pageIndex"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @current-change="currentChange">
    </el-pagination>

  </div>

</template>

<script>
  import 'vant/lib/grid/style';
  import 'vant/lib/grid-item/style';
  import 'vant/lib/checkbox/style';
  import 'vant/lib/checkbox-group/style';
  import { mapGetters } from 'vuex'
  import { strlen, substring10, formatTime, formatSize } from '@/utils/number'
  import Bus from '@/assets/js/bus'
  import api from '@/api/file-api'
  import BreadcrumbFilePath from "@/components/Breadcrumb/BreadcrumbFilePath";
  import IconFile from "@/components/Icon/IconFile";
  import AlLoading from "@/components/loading/AlLoading";

  import { suffix } from '@/utils/file-type'

  import SimTextPreview from "@/components/preview/SimTextPreview";
  import ImageViewer from "@/components/preview/ImageViewer";
  import VideoPreview from "@/components/preview/VideoPreview";
  import AudioPreview from "@/components/preview/AudioPreview";

  export default {
    components: { IconFile, BreadcrumbFilePath,AlLoading,
      AudioPreview, VideoPreview, ImageViewer, SimTextPreview
    },
    data() {
      return {
        prompt: '文件分享已被撤销',// 文件分享已被撤销
        isLoading: true,
        imageUrl: process.env.VUE_APP_BASE_API + '/public/s/view/thumbnail?id=',
        fileMenuActive: '',
        path: this.$route.query.path,
        showNewFolder: false,
        isShowNewFolder: false,
        listModeSearch: false,
        newFolderName: '新建文件夹',
        renameFileName: '',
        searchFileName: '',
        pathList: [],
        fileList: [],
        pagination: {
          fileId: false,
          pageIndex: 1,
          pageSize: 25,
          total: 0,
          pageSizes: [10,20,30,40,50]
        },
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
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
        ],
        singleMenusEdit: [
          { iconClass: 'menu-open', label: '打开', operation: 'open' },
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
        ],
        multipleMenus: [
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
        ],
        multipleRightMenus: [
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
        ],
        rowContextData: {},
        selectRowData: [],
        tableLoading: false,
        newFolderLoading: false,
        renameLoading: false,
        menuTriangle: '', // 三角菜单
        cellMouseIndex: -1,
        editingIndex: -1,
        dialogMoveOrCopyVisible: false,
        directoryTreeData: [],
        selectTreeNode: {},
        directoryTreeProps: {
          label: 'name',
          children: 'children',
          isLeaf: 'isLeaf'
        },

        dragLoop: null,
        positionX:0,
        positionY:0,
        grid: false,
        vmode: 'list',
        gridColumnNum: -1,
        gridHoverItemIndex: -1,
        gridHoverIntermediate: -1,
        allChecked: false,
        summaries: '',
        shareDialog: false,
        shareLink: '',
        shareFileName: '',
        generateShareLinkLoading: true,
        shareId: this.$route.query.s,
        currentDirName: '',
        linkFailed: true,
        textPreviewVisible : false,
        textPreviewRow: {},
        imagePreviewRow: {},
        imagePreviewVisible : false,
        videoPreviewRow: {},
        videoPreviewVisible: false,
        audioPreviewRow: {},
        audioPreviewVisible: false,
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
      Bus.$on('fileSuccess', () => {
        this.getFileList()
      })
      Bus.$on('clickMore', (selectRowData) => {
        this.selectRowData = selectRowData
        this.preliminaryRowData()
      })

      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }


      const that = this
      window.onresize = function temp() {
        that.reHeight()
      }

      // 加载布局
      if(this.$route.query.vmode){
        this.vmode = this.$route.query.vmode
        if(this.vmode === 'list'){
          this.grid = false
        }else{
          this.grid = true
        }
      }
    },
    destroyed() {
      window.removeEventListener('popstate', this.goBack, false);
    },
    directives: {
      // 注册一个局部的自定义指令 v-focus
      focus: {
        // 指令的定义
        inserted: function (el) {
          // 聚焦元素
          el.querySelector('input').focus()
        }
      },
      resize: { // 指令的名称
        bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
          let width = '', height = '';
          function isReize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
              binding.value();  // 关键
            }
            width = style.width;
            height = style.height;
          }
          el.__vueSetInterval__ = setInterval(isReize, 300);
        },
        unbind(el) {
          clearInterval(el.__vueSetInterval__);
        }
      }
    },
    methods: {
      gridItemHover(item,index) {
        this.gridHoverItemIndex = index;
        this.gridHoverIntermediate = index;
      },
      gridItemOut(item,index) {
        this.gridHoverIntermediate = -1
        const _this = this
        setTimeout(function () {
          if(_this.gridHoverIntermediate !== _this.gridHoverItemIndex){
            _this.gridHoverItemIndex = -1;
          }
        },10)
      },
      clickGridItemCheckBox(item,index) {
        // 同步列表的checkbox
        if(this.indexList.includes(index)){
          this.$refs.fileListTable.toggleRowSelection(item,false)
        }
      },
      clickGridAllCheckBox() {
        if(this.indexList.length !== this.fileList.length){
          this.$refs.checkboxGroup.toggleAll(true);
        }else{
          this.$refs.checkboxGroup.toggleAll();
          this.$refs.fileListTable.clearSelection();
        }
      },
      gridItemClick(row) {
        if (this.indexList.length < 1) {
          if (row.index !== this.editingIndex) {
            this.fileClick(row)
            this.editingIndex = -1
          }
        } else {
          if(this.indexList.includes(row.index)){
            this.$refs.fileListTable.toggleRowSelection(row,false)
          }else{
            this.$refs.fileListTable.toggleRowSelection(row,true)
          }
        }
      },
      containerResize(f) {
        let clientWidth = document.querySelector(".dashboard-container").clientWidth
        this.gridColumnNum = clientWidth/120 -2
      },
      // 格式化最近时间
      formatTime(time) {
        return formatTime(time)
      },
      // 格式化文件大小
      formatSize(size) {
        return formatSize(size)
      },
      // 浏览器的返回事件
      goBack(){
        const linkIndex = this.pathList.length-3
        this.handleLink(this.pathList[linkIndex],linkIndex)
      },
      handleLink(item, index) {
        if(index === 0){
          this.pathList.splice(this.pathList.findIndex((v,i) => i === index + 1), this.pathList.length - (index + 1))
          this.getFileList(null,true);
          this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}`)
        }
        if(item && item.fileId){
          this.accessShareOpenDir(item.fileId)
          this.pathList.splice(this.pathList.findIndex((v,i) => i === index + 1), this.pathList.length - (index + 1))
        }
        console.log(this.pathList)
      },
      // 切换布局
      changeVmode(){
        this.grid = !this.grid
        this.vmode = 'list'
        if(this.grid){
          this.vmode = 'grid'
        }
        let f = ''
        this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}`)
      },
      reHeight(){
        this.clientHeight = document.documentElement.clientHeight - 200
      },
      accessShareOpenDir(fileId) {
        this.tableLoading = true
        api.accessShareOpenDir({
          share: this.shareId,
          fileId: fileId,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.isLoading = false
          this.fileList = res.data
          this.listModeSearch = true
          this.pagination.fileId = fileId
          this.pagination['total'] = res.count
          this.$nextTick(()=>{
            this.containerResize()
            this.tableLoading = false
            this.linkFailed = false
          })
        }).catch(e => {})
      },
      getFileList(pagination,overload) {
        this.tableLoading = true
        api.accessShare({
          share:this.shareId,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.isLoading = false
          if(Object.getPrototypeOf(res.data) === String.prototype){
            this.prompt = '该链接已失效'
          }else{
            this.fileList = res.data
            this.fileList.map((item,index) => {
              item.index = index
            })
            this.reHeight()
            this.listModeSearch = false
            this.listModeSearchOpenDir = false
            this.pagination['total'] = res.count
            this.$nextTick(()=>{
              this.containerResize()
              this.tableLoading = false
              this.linkFailed = false
            })
            if(!pagination){
              const pathList = this.fileList[0].path.split('/');
              this.currentDirName = pathList[pathList.length-2]
            }
            this.$nextTick(()=>{
              this.containerResize()
              this.tableLoading = false
              this.linkFailed = false
              if(!pagination){
                // 打开文件夹
                const item = {}
                item['folder'] = this.currentDirName
                item['index'] = this.pathList.length
                if(!overload){
                  this.pathList.push(item)
                }
              }
            })
          }
        }).catch(() => {
          this.tableLoading = false
          this.linkFailed = true
        })
      },
      currentChange(pageIndex) {
        this.pagination.pageIndex = pageIndex
        console.log(this.pagination.fileId)
        if(this.pagination.fileId){
          this.accessShareOpenDir(this.pagination.fileId)
        }else{
          this.getFileList(true)
        }
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
        this.summaries = sums[2]
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

        row.forEach(r => {
          this.$refs.fileListTable.toggleRowSelection(r,true)
        });

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
          this.menusIsMultiple = true
        } else {
          item_name.label = '名称'
          item_name.sortable = true
          item_more.name = ''
          item_size.label = '大小'
          item_size.sortable = true
          item_date.label = '修改日期'
          item_date.sortable = true
        }
        if(this.indexList.length === this.fileList.length){
          this.allChecked = true
        }else{
          this.allChecked = false
        }
      },
      // cell-style 通过返回值可以实现样式变换利用传递过来的数组index循环改变样式
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
          this.rowContextData = row
        }
        const isFavorite = this.rowContextData.isFavorite
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
        clearTimeout(this.Loop);
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
          if (this.indexList.length > 0 && columnIndex > 0) {
            this.$refs.fileListTable.toggleRowSelection(row)
          }
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
        if(row.contentType && row.contentType.includes("text")){
          this.menus = this.singleMenusEdit
        }else{
          this.menus = this.singleMenus
        }
        // this.showOperationMenus(event)
        this.preliminaryRowData(row)
        this.showOperationMenus(event)
      },
      // 鼠标右击
      rowContextmenu(row) {
        if (this.indexList.includes(row.index)) {
          this.menusIsMultiple = true
          this.menus = this.multipleRightMenus
        } else {
          this.menusIsMultiple = false
          if(row.contentType && row.contentType.includes("text")){
            this.menus = this.singleMenusEdit
          }else{
            this.menus = this.singleMenus
          }
          this.preliminaryRowData(row)
        }
        event.preventDefault()
        this.menuTriangle = ''
        const e = {}
        e.pageX = event.pageX + 5
        e.pageY = event.pageY + 2
        e.clientX = event.clientX + 5
        e.clientY = event.clientY + 2
        this.$refs.contextShow.showMenu(event)
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
          e.pageY = event.pageY - 350
          e.clientX = event.clientX + 78
          e.clientY = event.clientY - 350
        }
        if (!this.isJustHideMenus) {
          this.$refs.contextShow.showMenu(e)
        }
      },
      show() {
      },
      hide() {
        const that = this
        this.isJustHideMenus = true
        setTimeout(function() {
          that.isJustHideMenus = false
        }, 100)
      },
      // 菜单操作
      menusOperations(operation) {
        switch (operation) {
          case 'open':
            this.fileClick(this.rowContextData)
            break
          case 'download':
            this.downloadFile()
            break
        }
        this.$refs.contextShow.hideMenu()
      },
      downloadFile() {
        let totalSize = 0
        if(this.indexList.length > 0){
          this.selectRowData.forEach(item => {
            totalSize += item.size
          })
        }else{
          totalSize = this.rowContextData.size
        }
        if (totalSize > 0) {
          let fileIds = [];
          if (this.menusIsMultiple) {
            this.selectRowData.forEach(value => {
              fileIds.push(value.id)
            })
          } else {
            fileIds.push(this.rowContextData.id)
          }

          if(process.env.NODE_ENV !== 'development'){
            let host = window.location.host
            if(window.location.port.length > 0){
              host = window.location.host.substring(0,window.location.host.length - window.location.port.length - 1)
            }
            window.open(`http://${host}:10010/public/s/download?&share=${this.shareId}&fileIds=${fileIds}`,'_self')
          }else{
            window.open(process.env.VUE_APP_BASE_FILE_API + `/public/s/download?&share=${this.shareId}&fileIds=${fileIds}`, '_self')
          }
        } else {
          this.$message({
            message: '所选文件为空',
            type: 'warning'
          });
        }
      },
      // 点击文件或文件夹
      fileClick(row) {
        if (row.isFolder) {
          // 打开文件夹
          const item = {}
          item['folder'] = row.name
          item['fileId'] = row.id
          item['index'] = this.pathList.length
          this.pathList.push(item)
          this.pagination.pageIndex = 1
          this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}`)
          this.accessShareOpenDir(row.id)
        } else {
          if(row.contentType.indexOf('image') > -1){
            // 图片
            this.imagePreviewVisible = true
            this.imagePreviewRow = row
            return
          }
          if(suffix.simText.includes(row.suffix)){
            // 文本文件
            this.textPreviewRow = row
            this.textPreviewVisible = true
            return
          }
          if(row.contentType.indexOf('video') > -1){
            // 视频文件
            this.videoPreviewVisible = true
            this.videoPreviewRow = row
            return
          }
          if(row.contentType.indexOf('audio') > -1){
            // 音频文件
            // this.audioPreviewVisible = true
            // this.audioPreviewRow = row
            Bus.$emit('onAddAudio',row, this.audioCoverUrl)
            return
          }

          // 打开文件
          const fileIds = [row.id]
          const url = process.env.VUE_APP_BASE_FILE_API + '/public/s/preview/' + row.name + '?fileIds=' + fileIds
          window.open(url, '_blank')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/home-index";
  /*.el-breadcrumb {*/
    /*margin: 50px;*/

  .dashboard-container {
    min-width: unset;
    margin: 10px 5px 10px 5px;
  }

  >>>.el-table .cell {
    overflow: inherit;
  }

  >>> .el-table {
    margin: 0 0 0;
  }
  .el-pagination {
    margin: 20px 20px;
  }

  .header-location {
    display: block;
    height: 1px;
    width: 100%;
    margin: 0px 0;
  }
  .searchClass[data-v-92fa2b3e] {
    padding: 3px;
  }
  .share-h {
    //padding: 0 15px;
  }
  .share-header {
    height: 50px;
    text-align: center;
    margin-bottom: 10px;

    -webkit-display:flex;
    display:flex;
    -webkit-align-items:center;
    align-items:center;
    -webkit-justify-content:center;
    justify-content:center;

    .share-header-content {
      display: flex;
      -webkit-align-items: center;
      svg {
        font-size: 50px;
      }
      span {
        margin-left: 10px;
        font-size: 30px;
      }
    }
    .share-header-content:hover {
      cursor: pointer;
      color: #a4d0fd;
    }
  }
</style>

