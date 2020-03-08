<template>
  <div class="dashboard-container">
    <el-breadcrumb class="app-breadcrumb" separator="">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in pathList" :key="item.index">
          <a v-if="index===0" @click.prevent="handleLink(item,index)"><svg-icon icon-class="home" style="font-size: 24px;"/></a>
          <breadcrumb-file-path :pathList="pathList" :item="item" :index="index" @clickLink="handleLink"></breadcrumb-file-path>
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
                <li @click.prevent="newDocument">
                  <a href="#" class="menuitem"><svg-icon icon-class="md" /><span class="menuitem text">新建文档</span>
                  </a>
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

    <!--右键菜单-->
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

    <!--移动或复制弹出框-->
    <el-dialog
      :title="'移动或复制到'+selectTreeNode.showName"
      :visible.sync="dialogMoveOrCopyVisible"
    >
        <el-tree
          ref="directoryTree"
          :data="directoryTreeData"
          node-key="id"
          :props="directoryTreeProps"
          :load="directoryTreeLoadNode"
          :highlight-current="true"
          :default-expanded-keys="['0']"
          :render-content="renderContent"
          hight="100"
          lazy
          @node-click="treeNodeClick"
          @node-expand="treeNodeExpand"
        >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveOrCopyVisible = false"><i class="el-icon-folder-add"></i>&nbsp;&nbsp;新建文件夹</el-button>
        <el-button type="primary" @click="moveFileTree">移 动</el-button>
        <el-button type="primary" @click="copyFileTree">复制</el-button>
        <el-button @click="dialogMoveOrCopyVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--<div class="dashboard-text">path: {{ path }}</div>-->

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
                <icon-file :item="scope.row" :image-url="imageUrl"></icon-file>
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
                <span>{{formatSize(scope.row.size)}}</span>
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
                <span>&nbsp;&nbsp;&nbsp;{{formatTime(scope.row.agoTime)}}</span>
              </template>
            </el-table-column>
          </template>
    </el-table>
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

    <div class="drag-parent-class">
      <table id="drag-table" class="el-table" draggable="true">
        <tr class="el-table__row">
          <td rowspan="1" colspan="1" class="el-table_1_column_1  el-table-column--selection"><div class="cell"><label class="el-checkbox"><span class="el-checkbox__input"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="false" class="el-checkbox__original" value=""></span><!----></label></div></td>
          <td rowspan="1" colspan="1" class="el-table_1_column_2  "><div class="cell"><span data-v-038dedea="" data-v-5954443c=""><!----> <!----> <svg data-v-c8a70580="" data-v-038dedea="" aria-hidden="true" class="svg-icon"><use data-v-c8a70580="" href="#icon-folder"></use></svg></span></div></td>
          <td rowspan="1" colspan="1" class="el-table_1_column_3  " style=""><div class="cell el-tooltip" style="width: 397px;"><span data-v-5954443c="">超长名称7yuhqjadsyvguhqb3jfjivdycgzuhbjknldsafsbghyejhntcszvfhncszxzxcvsbfd</span></div></td>
          <td rowspan="1" colspan="1" class="el-table_1_column_4 is-center "><div class="cell"></div></td>
          <td rowspan="1" colspan="1" class="el-table_1_column_5 is-center "><div class="cell"></div></td>
          <td rowspan="1" colspan="1" class="el-table_1_column_6 is-center "><div class="cell el-tooltip"><span data-v-5954443c="">306.54M</span></div></td>
          <td rowspan="1" colspan="1" class="el-table_1_column_7 is-left "><div class="cell el-tooltip"><span data-v-5954443c="">&nbsp;&nbsp;&nbsp;15天前</span></div></td>
        </tr>
      </table>
    </div>

  </div>

</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
// import defaultSettings from '@/settings'
import { getPath, getPathList, setPath, removePath } from '@/utils/path'
import { strlen, substring10, formatTime, formatSize } from '@/utils/number'
import Bus from '@/assets/js/bus'
import api from '@/api/upload-api'
import BreadcrumbFilePath from "../../components/Breadcrumb/BreadcrumbFilePath";
import IconFile from "../../components/Icon/IconFile";
import vuedraggable from 'vuedraggable';

export default {
  components: { IconFile, BreadcrumbFilePath, vuedraggable},
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
        { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
        { iconClass: 'menu-details', label: '详细信息', operation: 'details' },
        { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
        { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
        { iconClass: 'menu-download', label: '下载', operation: 'download' },
        { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
      ],
      singleMenusEdit: [
        { iconClass: 'menu-open', label: '打开', operation: 'open' },
        { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
        { iconClass: 'menu-edit1', label: '编辑', operation: 'edit' },
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

    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
    const that = this
    window.onresize = function temp() {
      that.clientHeight = document.documentElement.clientHeight - 165
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
    }
  },
  methods: {
    // 行拖拽
    rowDrop() {
      const _this = this
      // 被拖动的元素的索引
      let dragged = null;
      // 被拖动的元素的索引
      let draggedIndex = -1;

      // 目标元素
      let target = document.querySelector('.el-table__body-wrapper tbody');
      let rows = 0;//行数
      setTimeout(function () {
        rows = target.childElementCount
        for (let i = 0; i < target.childElementCount; i++) {
          const child = target.children[i]
          child.draggable = true
          // child.style.cursor = 'copy'
          child.ondragstart = function(e){
            dragged = e.path[0]
            draggedIndex = e.path[0].rowIndex
            console.log('child'+i+'开始拖拽');
            _this.cellMouseIndex = -1
            dragged.style.cursor = 'grabbing'
          }
          child.ondragend = function(){
            console.log('child'+i+'拖拽结束');
          }
        }
      },0)

      // 被拖动的元素正在那个容器里
      let dragIndex = -1

      target.ondragenter = function(e){
        clearTimeout(loop)

        // 由于被拖动的元素 经过tbody中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
        if(e.path[0].tagName === 'TD'){
          // throughRow 表示被拖动的元素正在哪一行上
          const throughRow = e.path.find(path => {
            if(path.className === 'el-table__row'){
              return path
            }
          })
          if(dragIndex !== throughRow.rowIndex){
            if(dragIndex > -1){
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex];
              clearClass(last)
            }
            // console.log('拖动进入目标元素'+selectRow.rowIndex);
            // 不是自己或未文件夹时才改变状态
            if(draggedIndex !== throughRow.rowIndex && _this.fileList[throughRow.rowIndex].isFolder){
              // 改变本次进入的容器的状态
              dragged.style.cursor = 'copy'
              throughRow.style.height = 60+'px'
              throughRow.style.backgroundColor = '#e9fdcf'
            }
            dragIndex = throughRow.rowIndex
          }
        }
        leaveIndex = -1
      }

      target.ondragover = function(e){
        // console.log('目标元素中拖拽...');
        e.preventDefault();
        leaveIndex = -1
      }

      let loop = null
      let leaveIndex = -1 // 是否拖出了整个table, -1表示还在table内

      target.ondragleave = function(e){
        clearTimeout(loop)
        if(e.path[0].tagName === 'TD'){
          const throughRow = e.path.find(path => {
            if(path.className === 'el-table__row'){
              return path
            }
          })
          if(dragIndex !== throughRow.rowIndex){
            // console.log('拖动离开目标元素'+selectRow.rowIndex);
            // selectRow.style.height = 'unset'
            // selectRow.style.backgroundColor = '#fff'
            // dragIndex = selectRow.rowIndex
          }
          if(throughRow.rowIndex === 0 || throughRow.rowIndex === rows-1){
            // 离开第一行或最后一行
            leaveIndex = throughRow.rowIndex
            loop = setTimeout(function () {
              if(leaveIndex > -1){
                console.log("离开了",leaveIndex)
                const leave = target.children[leaveIndex];
                clearClass(leave)
                dragIndex = -1
              }
            },100)
          }``
        }
      }
      target.ondrop = function(){
        console.log('放下了'+draggedIndex);
        // 清除上次进入的容器的状态
        const last = target.children[dragIndex];
        clearClass(last)
        dragged.style.cursor = 'default'

        const form = _this.fileList[draggedIndex]
        const to = _this.fileList[dragIndex]
        if(last && form.id !== to.id && to.isFolder){
          // 移动文件/文件夹
          // _this.copyOrMoveApi('move', form.id, to.id)
          let fileType = '文件'
          if(form.isFolder){
            fileType = '文件夹'
          }
          _this.$confirm('是否将'+fileType+'否移动到 "' + to.name + '"?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            _this.copyOrMoveApi('move', form.id, to.id)
          }).catch()
        }
      }

      let clearClass = function (node) {
        if(node){
          node.style.height = 'unset'
          node.style.backgroundColor = '#fff'
        }
        dragged.style.cursor = 'grabbing'
      }

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
          this.searchFileAndOpenDir(item.row)
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
            this.$router.push(`?path=${encodeURIComponent(this.path)}`)
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
        this.$router.push(`?search-file=${key}`)
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
    searchFileAndOpenDir(row) {
      this.tableLoading = true
      api.searchFileAndOpenDir({
        userId: this.$store.state.user.userId,
        id: row.id,
        currentDirectory: this.$route.query.path,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.fileList = res.data
        this.tableLoading = false
        this.clientHeight = document.documentElement.clientHeight - 165
        this.listModeSearch = true
        this.pagination['total'] = res.count
      }).catch(e => {})
      this.path = row.path + row.name
    },
    getFileList() {
      this.tableLoading = true
      api.fileList({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        currentDirectory: this.$route.query.path,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.fileList = res.data
        this.tableLoading = false
        this.clientHeight = document.documentElement.clientHeight - 165
        this.listModeSearch = false
        this.pagination['total'] = res.count
        // 是列表可拖拽
        this.rowDrop()
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
        this.tableLoading = false
        this.clientHeight = document.documentElement.clientHeight - 165
        this.listModeSearch = true
        this.pagination['total'] = res.count
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
      clearTimeout(this.Loop);
      console.log(column.index)
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
      if(row.contentType && row.contentType.includes("text")){
        this.menus = this.singleMenusEdit
      }else{
        this.menus = this.singleMenus
      }
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
        if(row.contentType && row.contentType.includes("text")){
          this.menus = this.singleMenusEdit
        }else{
          this.menus = this.singleMenus
        }
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
        case 'edit':
          console.log('edit', '编辑')
          this.$router.push(`/markdown/editor?id=${this.rowContextData.id}`)
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
          this.dialogMoveOrCopyVisible = true
          const that = this
          setTimeout(function () {
            that.selectTreeNode = that.$refs.directoryTree.getCurrentNode()
            that.selectTreeNode.showName = ' "' + that.selectTreeNode.name + '"'
          },100)
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
    // 加载下一级文件树
    directoryTreeLoadNode(node, resolve) {
      console.log(node)
      let fileId = null
      if (node.level === 0) {
        const that = this
        setTimeout(function () {
          that.$refs.directoryTree.setCurrentKey('0')
        },0)
        return resolve([{'id':"0",'name':'全部文件'}])
      }
      if (node.level > 1){
        fileId = node.data.id
      }

      api.queryFileTree({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        fileId: fileId,
      }).then(res => {
        const nextNodes = res.data
        return resolve(nextNodes)
      })
    },
    // 点击文件树
    treeNodeClick(row,node,event) {
      this.selectTreeNode = row
      this.selectTreeNode.showName = ' "' + row.name + '"'
    },
    // 节点被展开时触发
    treeNodeExpand(row,node,event) {
    },
    // 移动文件
    moveFileTree() {
      this.copyOrMove('move');
    },
    // 复制文件
    copyFileTree() {
      this.copyOrMove('copy');
    },
    copyOrMove(operating){
      let operation = '复制'
      if(operating === 'move'){
        operation = '移动'
      }
      let selectNodePath = '/'
      if(this.selectTreeNode.path){
        selectNodePath = this.selectTreeNode.path + this.selectTreeNode.name + "/"
      }

      let fileIds = [];
      if (this.menusIsMultiple) {
        const exits = this.selectRowData.some(value => {
          fileIds.push(value.id)
          const thisParentPath = value.path
          if(thisParentPath === selectNodePath){
            this.$message({
              message: '不能将文件'+operation+'到自身或其子目录下',
              type: 'warning'
            });
            return true;
          }
        })
        if(exits){
          return
        }
      } else {
        fileIds.push(this.rowContextData.id)
      }
      this.copyOrMoveApi(operating,fileIds,this.selectTreeNode.id)
    },
    copyOrMoveApi(operating,froms,to) {
      let operation = '复制'
      if(operating === 'move'){
        operation = '移动'
      }
      let copying = this.$message({
        iconClass: 'el-icon-loading',
        type: 'info',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<span>&nbsp;&nbsp;正在'+operation+'</span>'
      });
      this.dialogMoveOrCopyVisible = false
      api[operating]({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        froms: froms,
        to: to
      }).then(() => {
        copying.iconClass = null
        copying.type = 'success'
        copying.message = operation+'成功'
        if(this.rowContextData.isFolder){
          this.$refs.directoryTree.append(this.rowContextData,to)
        }

        if(operating === 'move'){
          // 移除列表
          if (this.selectRowData.length === 1) {
            this.fileList.splice(this.selectRowData[0].index, 1)
          } else {
            this.getFileList()
          }
          this.$refs.fileListTable.clearSelection()// 删除后清空之前选择的数据
          this.selectRowData = []
        }

        setTimeout(function () {
          copying.close()
        },1000)
      }).catch(() => {
        copying.close()
      })
    },
    renderContent(h, { node, data, store }) {
      if(node.expanded){
        return (
          <span class="custom-tree-node">
          <svg-icon icon-class="open-folder" />
          <span style="margin-left: 5px;">{node.label}</span>
          <span>
          </span>
          </span>);
      }else{
        return (
          <span class="custom-tree-node">
          <svg-icon icon-class="folder" />
          <span style="margin-left: 5px;">{node.label}</span>
          <span>
          </span>
          </span>);
      }
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
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 1000
          })
          // 移除列表
          if (this.selectRowData.length === 1) {
            this.fileList.splice(this.selectRowData[0].index, 1)
          } else {
            this.getFileList()
          }
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
          item1['row'] = row
          item1['index'] = this.pathList.length - 1
          const item2 = {}
          item2['folder'] = '+'
          item2['index'] = this.pathList.length
          this.pathList[this.pathList.length - 1] = item1
          this.pathList.push(item2)
          this.pagination.pageIndex = 1
          this.$router.push(`?search-file=${row.id}`)
          this.searchFileAndOpenDir(row)
        } else {
          if(this.path){
            this.path += '/' + row.name
          } else {
            this.path = '/' + row.name
          }
          const item1 = {}
          item1['folder'] = row.name
          item1['index'] = this.pathList.length - 1
          const item2 = {}
          item2['folder'] = '+'
          item2['index'] = this.pathList.length
          this.pathList[this.pathList.length - 1] = item1
          this.pathList.push(item2)
          setPath(this.path, this.pathList)
          this.pagination.pageIndex = 1
          const path = encodeURIComponent(this.path);
          this.$router.push(`?path=${path}`)
          this.getFileList()
        }
      } else {
        if(row.contentType.includes('text')){
          // let routeData = this.$router.resolve({path: '/public/p',query: {mark: row.id}})
          // window.open(routeData.href, '_blank');
          this.$router.push(`/public/article?mark=${row.id}`)
        }else{
          // 打开文件
          const fileIds = [row.id]
          const url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
          window.open(url, '_self')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      min-width: 500px;
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

  .el-breadcrumb {
    font-size: 1rem;
    line-height: 46px;
  }

  .button-class {
    cursor: pointer;
  }

  .button-class:hover {
    border-radius: 5px;
    background-color: #409eff14;
  }

  .newFileMenu ul {
    list-style: none;
    padding-inline-start: 0px;
    margin-top: 0;
    margin-bottom: 0;
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

  .el-pagination {
    float: right;
    margin-top: 50px;
  }

  /deep/ .el-dialog__header {
    padding: 20px 20px 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .el-dialog__title {
    font-size: 16px;
  }
  /deep/ .el-dialog__body {
    padding: 0 20px 0 20px;
  }
  /deep/ .el-tree-node__content {
    height: 35px;
    /*border-bottom: 1px solid #ccc;*/
    position: relative;
  }

  /deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
  }

  /deep/ .el-tree-node.is-expanded>.el-tree-node__children {
    max-height: 500px;
    overflow: auto;
  }

  /deep/ .drag-parent-class {
    z-index: 999;
    position: fixed;
    right: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    display: none;
    /*-webkit-transition: all .1s ease-in-out 0s;*/
    /*transition: all .1s ease-in-out 0s;*/
  }

  /deep/ .drag-parent-class .el-table {
    background-color: #66cc66;
  }

  /deep/ .drag-parent-class .el-table tr {
    background-color: #66cc66;
  }

</style>

