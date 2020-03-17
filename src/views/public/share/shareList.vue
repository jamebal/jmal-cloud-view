<template>
  <div class="dashboard-container" v-resize="containerResize">
    <el-breadcrumb class="app-breadcrumb" separator="">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in pathList" :key="item.index">
          <a v-if="index===0" @click.prevent="handleLink(item,index)"><svg-icon icon-class="home" style="font-size: 24px;"/></a>
          <breadcrumb-file-path :pathList="pathList" :item="item" :index="index" @clickLink="handleLink"></breadcrumb-file-path>
        </el-breadcrumb-item>
      </transition-group>
      <div class="search-content">
        <div class="searchClass">
<!--          <el-input placeholder="搜索您的文件"  v-model="searchFileName" :clearable="true" @keyup.enter.native="searchFile(searchFileName)">-->
<!--            <el-button slot="prepend" @click="searchFile(searchFileName)">-->
<!--              <svg-icon icon-class="search" />-->
<!--            </el-button>-->
<!--          </el-input>-->
          <el-button class="vmode" @click="changeVmode">
            <svg-icon :icon-class="grid ? 'menu-list' : 'menu-grid'" />
          </el-button>
        </div>
      </div>
    </el-breadcrumb>

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
      v-show="!grid"
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
            <icon-file :item="scope.row" :image-url="imageUrl"></icon-file>
          </template>
        </el-table-column>

        <el-table-column v-if="index === 2" :key="index" :show-overflow-tooltip="true" max-width="200" :index="index" :prop="item.name" :label="item.label" :sortable="item.sortable" @click.stop="fileClick(scope.row)">
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
          width="200"
          :prop="item.name"
          :index="index"
          :label="item.label"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
          align="left"
          header-align="left"
        >
          <template slot-scope="scope">
            <span>{{formatSize(scope.row.size)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="index === 6"
          :key="index"
          width="300"
          :prop="item.name"
          :index="index"
          :label="item.label"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
          align="left"
          header-align="left"
        >
          <template slot-scope="scope">
            <span>&nbsp;&nbsp;&nbsp;{{formatTime(scope.row.agoTime)}}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!--grid布局-->
    <div v-show="grid" v-loading="tableLoading"
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
              <div class="grid-item-icon"><icon-file :item="item" :image-url="imageUrl" :grid="true"></icon-file></div>
              <span class="grid-item-text">{{item.name}}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </van-checkbox-group>
      <el-divider class="grid-divider" content-position="center"><i class="el-icon-folder-opened"></i>&nbsp;{{summaries}}</el-divider>
    </div>
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
  /* eslint-disable */
  import { mapGetters } from 'vuex'
  // import defaultSettings from '@/settings'
  import { getPath, getPathList, setPath, removePath } from '@/utils/path'
  import { strlen, substring10, formatTime, formatSize } from '@/utils/number'
  import Bus from '@/assets/js/bus'
  import api from '@/api/upload-api'
  import BreadcrumbFilePath from "@/components/Breadcrumb/BreadcrumbFilePath";
  import IconFile from "@/components/Icon/IconFile";
  import Clipboard from 'clipboard';

  export default {
    components: { IconFile, BreadcrumbFilePath,
    },
    data() {
      return {
        imageUrl: process.env.VUE_APP_BASE_API + '/view/thumbnail?jmal-token=' + this.$store.state.user.token + '&id=',
        // imageUrl: 'http://localhost:8088/view?username=' + this.$store.state.user.name + '&id=',
        fileMenuActive: '',
        path: this.$route.query.path,
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
        pagination: {
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
          { iconClass: 'menu-deselect', label: '取消选定', operation: 'deselect' },
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
        grid: true,
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
        shareId: this.$route.query.s
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

      // 加载路径
      // const pathList = getPathList()
      // if (pathList && pathList !== 'undefined') {
      //   const res = JSON.parse(pathList)
      //   const list = []
      //   res.forEach(function(element) {
      //     const item0 = {}
      //     item0['folder'] = element.folder + ''
      //     item0['index'] = element.index
      //     list.push(item0)
      //   })
      //   this.pathList = list
      // }

      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }


      const that = this
      window.onresize = function temp() {
        that.clientHeight = document.documentElement.clientHeight - 165
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

      // 加载url上的path
      if(this.$route.query.path){
        const path = decodeURI(this.$route.query.path)
        this.pathList.splice(1,1)
        path.split('/').forEach((pathName,index)=>{
          if(index > 0){
            const item = {}
            item['folder'] = pathName
            item['index'] = index
            this.pathList.push(item)
          }
        })
        const item = {}
        item['folder'] = '+'
        item['index'] = this.pathList.length
        this.pathList.push(item)
      }
    },
    destroyed() {
      removePath()
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
      upload() {
        console.log('user', this.$store.state.user);
        // 打开文件选择框
        Bus.$emit('openUploader', {
          // 传入的参数
          currentDirectory: this.path,
          username: this.$store.state.user.name,
          userId: this.$store.state.user.userId
        })
      },
      uploadFolder() {
        if(window.uploader.supportDirectory){
          // 打开文件夹选择框
          console.log('selectFolder')
          Bus.$emit('uploadFolder', {
            // 传入的参数
            currentDirectory: this.path,
            username: this.$store.state.user.name,
            userId: this.$store.state.user.userId
          })
        }else{
          this.$message({
            message: '该浏览器不支持上传文件夹',
            type: 'warning'
          });
        }
      },
      // 浏览器的返回事件
      goBack(){
        const linkIndex = this.pathList.length-3
        this.handleLink(this.pathList[linkIndex],linkIndex)
      },
      handleLink(item, index, unPushLink) {
        if(item && item.search){
          if(item.searchKey){
            this.searchFileByKeyWord(item.searchKey)
          } else if(item.row){
            this.accessShareOpenDir(item.row)
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
          if(!unPushLink){
            if (!this.$route.query.path){
              this.$router.push(`/_m`)
            } else {
              // this.$router.push(`?path=${encodeURIComponent(this.path)}`)
              this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}&path=${encodeURIComponent(this.path)}`)
            }
          }
          setPath(this.path, this.pathList)
          this.pagination.pageIndex = 1
          this.getFileList()
        }
        console.log("this.pathList:", this.pathList)
      },
      // 新建文档
      newDocument() {
        this.$router.push(`/markdown/editor`)
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
        console.log('user', this.$store.state.user);
        if(this.newFolderName){
          if(/[\/\\"<>\?\*]/gi.test(this.newFolderName)){
            this.$message({
              message: '文件名不能包含以下字字符:<,>,|,*,?,,/',
              type: 'warning'
            });
            return;
          }
          this.newFolderLoading = true
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
              if (this.listModeSearch) {
                this.getFileListBySearchMode()
              } else {
                this.getFileList()
              }
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
      // 切换布局
      changeVmode(){
        this.grid = !this.grid
        console.log(this.$route.fullPath)
        this.vmode = 'list'
        if(this.grid){
          this.vmode = 'grid'
        }
        if(!this.path){
          this.path = ''
        }
        this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}&path=${this.path}`)
        // 改变拖拽目标
        this.rowDrop()
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
          // this.$router.push(`?search-file=${key}`)
          this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}&search-file=${key}`)
          this.tableLoading = true
          api.searchFile({
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            keyword: key,
            currentDirectory: this.$route.query.path,
            pageIndex: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          }).then(res => {
            this.fileList = res.data
            this.tableLoading = false
            this.clientHeight = document.documentElement.clientHeight - 165
            this.listModeSearch = true
            this.path = ''
            this.pagination['total'] = res.count
          }).catch(e => {})
        }else{
          this.handleLink('',0)
        }
      },
      accessShareOpenDir(row) {
        this.tableLoading = true
        api.accessShareOpenDir({
          share: this.shareId,
          fileId: row.id,
        }).then(res => {
          this.fileList = res.data
          this.clientHeight = document.documentElement.clientHeight - 165
          this.listModeSearch = true
          this.pagination['total'] = res.count
          this.$nextTick(()=>{
            this.tableLoading = false
          })
        }).catch(e => {})
        this.path = row.path + row.name
      },
      getFileList() {
        this.tableLoading = true
        api.accessShare({
          share:this.shareId
        }).then(res => {
          this.fileList = res.data
          this.fileList.map((item,index) => {
            item.index = index
          })
          this.clientHeight = document.documentElement.clientHeight - 165
          this.listModeSearch = false
          this.pagination['total'] = res.count
          this.$nextTick(()=>{
            this.containerResize()
            this.tableLoading = false
          })
        }).catch(e => {})
      },
      getFileListBySearchMode() {
        this.tableLoading = true
        api.fileList({
          userId: this.$store.state.user.userId,
          currentDirectory: this.path,
          pageIndex: this.pagination.pageIndex,
          pageSize: 30
        }).then(res => {
          this.fileList = res.data
          this.clientHeight = document.documentElement.clientHeight - 165
          this.listModeSearch = true
          this.pagination['total'] = res.count
          this.$nextTick(()=>{
            this.tableLoading = false
          })
        }).catch(e => {})
      },
      currentChange(pageIndex) {
        this.pagination.pageIndex = pageIndex
        if (this.listModeSearch) {
          this.searchFile(this.searchFileName)
        } else {
          this.getFileList()
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
        } else {
          item_name.label = '名称'
          item_name.sortable = true
          item_more.name = ''
          item_size.label = '大小'
          item_size.sortable = true
          item_date.label = '修改日期'
          item_date.sortable = true
        }
        if(this.indexList.length == this.fileList.length){
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
      // 重命名
      rowRename(newFileName, row) {
        if (newFileName) {
          console.log('newFileName', newFileName)
          if(/[\/\\"<>\?\*]/gi.test(newFileName)){
            this.$message({
              message: '文件名不能包含以下字字符:<,>,|,*,?,,/',
              type: 'warning'
            });
            return;
          }
          if (!row.isFolder) {
            const ext = '.' + row.suffix
            if (!newFileName.endsWith(ext)) {
              newFileName += ext
            }
          }
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
          case 'share':
            break
          case 'favorite':
            break
          case 'edit':
            break
          case 'open':d
            console.log('open', '打开')
            this.fileClick(this.rowContextData)
            break
          case 'deselect':
            console.log('deselect', '取消选定')
            this.$refs.fileListTable.toggleRowSelection(this.rowContextData)
            break
          case 'unFavorite':
            break
          case 'details':
            this.$notify.info({
              title: this.rowContextData.name,
              duration: 2000
            })
            console.log('详情', this.rowContextData)
            break
          case 'rename':
            break
          case 'copy':
            break
          case 'download':
            console.log('下载')
            this.downloadFile()
            break
          case 'remove':
            break
        }
        this.$refs.contextShow.hideMenu()
      },
      downloadFile() {
        let totalSize = 0
        if(this.indexList > 0){
          this.selectRowData.forEach(item => {
            totalSize += item.size
          })
        }else{
          totalSize = this.rowContextData.size
        }
        if (totalSize > 0) {
          var fileIds = [];
          if (this.menusIsMultiple) {
            this.selectRowData.forEach(value => {
              fileIds.push(value.id)
            })
          } else {
            fileIds.push(this.rowContextData.id)
          }
          window.open(process.env.VUE_APP_BASE_FILE_API + `/public/s/download?&share=${this.shareId}&fileIds=${fileIds}`, '_self')
        } else {
          this.$message({
            message: '所选文件为空',
            type: 'warning'
          });
        }
      },
      // 点击文件或文件夹
      fileClick(row) {
        console.log(row)
        if (row.isFolder) {
          // 打开文件夹
          const item1 = {}
          item1['folder'] = row.name
          item1['search'] = true
          item1['row'] = row
          item1['index'] = this.pathList.length - 1
          const item2 = {}
          item2['folder'] = '+'
          item2['index'] = this.pathList.length
          this.pathList[this.pathList.length - 1] = item1
          this.pathList.push(item2)
          this.pagination.pageIndex = 1
          // this.$router.push(`?search-file=${row.id}`)
          this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}&search-file=${row.id}`)
          this.accessShareOpenDir(row)
        } else {
          if(row.contentType.includes('text')){
            // let routeData = this.$router.resolve({path: '/public/articles/article',query: {mark: row.id}})
            // window.open(routeData.href, '_blank');
            this.$router.push(`/public/articles/article?mark=${row.id}`)
          }else{
            // 打开文件
            const fileIds = [row.id]
            const url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
            window.open(url, '_blank')
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/home-index";
  .el-breadcrumb {
    margin: 50px;
  }
</style>

