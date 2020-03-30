<template>
  <div class="dashboard-container" v-resize="containerResize">
    <el-breadcrumb class="app-breadcrumb" separator="">
      <transition-group name="breadcrumb" v-if="showNavigation">
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
                    <svg-icon icon-class="file-upload" /><span class="menuitem text">{{singleFileType !==''?singleFileType:'上传文件'}}</span>
                  </label>
                </li>
                <li v-if="singleFileType === ''" @click="uploadFolder">
                  <label class="menuitem">
                    <svg-icon icon-class="folder-upload" /><span class="menuitem text">上传文件夹</span>
                  </label>
                </li>
                <li v-if="singleFileType === ''" @click.prevent="newDocument">
                  <a href="#" class="menuitem"><svg-icon icon-class="md" /><span class="menuitem text">新建文档</span>
                  </a>
                </li>
                <li v-if="singleFileType === ''" @click.prevent="newFolder">
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
        <div class="searchClass">
          <el-input placeholder="搜索您的文件"  v-model="searchFileName" :clearable="true" @keyup.enter.native="searchFile(searchFileName)">
            <el-button slot="prepend" @click="searchFile(searchFileName)">
              <svg-icon icon-class="search" />
            </el-button>
          </el-input>
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

    <!--分享-->
    <el-dialog :title="'分享:'+shareFileName" :visible.sync="shareDialog" center>
      <div v-loading="generateShareLinkLoading">
        <el-input readonly="readonly" v-model="shareLink"></el-input>
        <div slot="footer" class="dialog-footer share-dialog-footer">
          <el-button type="primary" class="tag-share-link" @click="copyShareLink" :data-clipboard-text="shareLink">复制链接</el-button>
        </div>
      </div>
    </el-dialog>

    <!--<div class="dashboard-text">path: {{ path }}</div>-->

    <!--list布局-->
    <el-table
      v-show="!grid && this.fileList.length > 0"
      ref="fileListTable"
      v-loading="tableLoading"
      :max-height="clientHeight"
      :default-sort="sortable"
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
      @sort-change="sortChange"
    >
      <template v-for="(item,index) in tableHead">
        <!--索引-->
        <el-table-column
          v-if="index === 0"
          :key="index"
          :index="index"
          type="selection"
          min-width="50"
        >
        </el-table-column>
        <!--图标-->
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
        <!--名称-->
        <el-table-column
          v-if="index === 2"
          :key="index"
          :show-overflow-tooltip="true"
          max-width="200"
          :index="index"
          :prop="item.name"
          :label="item.label"
          :sort-orders="['ascending', 'descending']"
          :sortable="item.sortable ? (orderCustom ?'custom':true) : false"
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
        <!--分享-->
        <el-table-column v-if="index === 3" :key="index" width="50" :index="index" align="center" header-align="center" tooltip-effect="dark">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="分享" placement="top">
                <svg-icon title="分享" v-if="scope.row.index === cellMouseIndex" class="button-class" icon-class="share" @click="share(scope.row)"/>
              </el-tooltip>
            </template>
        </el-table-column>
        <!--更多-->
        <el-table-column v-if="index === 4" :key="index" width="50" :prop="item.name" :label="item.label" :index="index" class="el-icon-more" align="center" header-align="center">
          <!-- 使用组件, 并传值到组件中 -->
          <template slot="header">
            <svg-icon v-if="item.name !== ''" class="button-class" icon-class="more" @click="moreOperation($event)" />
          </template>
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.index === cellMouseIndex" class="button-class" icon-class="more" @click="moreClick(scope.row,$event)" />
          </template>
        </el-table-column>
        <!--文件大小-->
        <el-table-column
          v-if="index === 5"
          :key="index"
          width="200"
          :prop="item.name"
          :index="index"
          :label="item.label"
          :sort-orders="['ascending', 'descending']"
          :sortable="item.sortable ? (orderCustom ?'custom':true) : false"
          :show-overflow-tooltip="true"
          align="left"
          header-align="left"
        >
          <template slot-scope="scope">
            <span>{{formatSize(scope.row.size)}}</span>
          </template>
        </el-table-column>
        <!--修改时间-->
        <el-table-column
          v-if="index === 6"
          :key="index"
          width="250"
          :prop="item.name"
          :index="index"
          :label="item.label"
          :sort-orders="['ascending', 'descending']"
          :sortable="item.sortable ? (orderCustom ?'custom':true) : false"
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
    <div v-show="grid && this.fileList.length > 0" v-loading="tableLoading"
         element-loading-text="文件加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="#f6f7fa88">
      <div class="checkbox-group-header">
        <div class="select-operation">
          <van-checkbox class="grid-all-checkbox" @click="clickGridAllCheckBox()" v-model="allChecked">{{indexList.length>0 ? '已选择 '+this.tableHead[2].label : "选择"}}</van-checkbox>
          <div>
            <el-button class="select-operation-button" icon="el-icon-download" v-if="indexList.length > 0" @click="downloadFile">
              下载
            </el-button>
            <el-button class="select-operation-button" icon="el-icon-share" v-if="indexList.length === 1" @click="share">
              分享
            </el-button>
            <el-button class="select-operation-button" icon="el-icon-document-copy" v-if="indexList.length > 0" @click="moveOrCopy">
              移动或复制
            </el-button>
            <el-button class="select-operation-button" icon="el-icon-delete" v-if="indexList.length > 0" type="danger" @click="deleteFile">
            </el-button>

          </div>
        </div>
        <el-divider></el-divider>
      </div>

      <van-checkbox-group v-model="selectRowData" @change="handleSelectionChange" ref="checkboxGroup">
        <van-grid square :center="true" :column-num="gridColumnNum" :gutter="20" :border="false">
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
    <empty-file
      v-if="this.fileList.length < 1 && !tableLoading"
      :emptyStatus="emptyStatus"
    >
    </empty-file>
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
    <sim-text-preview :file="textPreviewRow" :status.sync="textPreviewVisible"></sim-text-preview>
    <image-viewer :fileList="fileList" :file="imagePreviewRow" :status.sync="imagePreviewVisible"></image-viewer>
    <video-preview :file="videoPreviewRow" :status.sync="videoPreviewVisible"></video-preview>
    <!-- <audio-preview :file="audioPreviewRow" :status.sync="audioPreviewVisible"></audio-preview> -->
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
  import { suffix } from '@/utils/file-type'
  import Bus from '@/assets/js/bus'
  import api from '@/api/file-api'
  import BreadcrumbFilePath from "@/components/Breadcrumb/BreadcrumbFilePath";
  import IconFile from "@/components/Icon/IconFile";
  import EmptyFile from "@/components/EmptyFile";
  import Clipboard from 'clipboard';
  import SimTextPreview from "@/components/preview/SimTextPreview";
  import ImageViewer from "@/components/preview/ImageViewer";
  import VideoPreview from "@/components/preview/VideoPreview";
  import AudioPreview from "@/components/preview/AudioPreview";

  export default {
    name: 'ShowFile',
    components: {AudioPreview, VideoPreview, ImageViewer, SimTextPreview, IconFile, BreadcrumbFilePath, EmptyFile},
    props: {
      emptyStatus: {
        'type': String,
        'default': '空空如也~',
      },
      singleFileType: {
        'type': String,
        'default': '',
      },
      showNavigation: {
        'type': Boolean,
        'default': true,
      },
      queryFileType: {
        'type': String,
        'default': null
      },
      defaultGrid: {
        'type': Boolean,
        'default': true
      },
      orderCustom: {
        'type': Boolean,
        'default': false
      },
      // defaultSort: {
      //   'type': Object,
      //   'default': function () {
      //     return { prop: '', order: null }
      //   }
      // },
      sortable: {
        'type': Object,
        'default': function () {
          return { prop: '', order: null}
        }
      },
      queryCondition: {
        'type': Object,
        'default': function () {
          return {isFolder:null}
        }
      },
      singleMenus: {
        'type': Array,
        'default': function () {
          return [
            { iconClass: 'menu-open', label: '打开', operation: 'open' },
            { iconClass: 'share', label: '分享', operation: 'share' },
            { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
            { iconClass: 'menu-details', label: '详细信息', operation: 'details' },
            { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
            { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
            { iconClass: 'menu-download', label: '下载', operation: 'download' },
            { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
          ]
        }
      },
      singleMenusEdit: {
        'type': Array,
        'default': function () {
          return [
            { iconClass: 'menu-open', label: '打开', operation: 'open' },
            { iconClass: 'share', label: '分享', operation: 'share' },
            { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
            { iconClass: 'menu-edit1', label: '编辑', operation: 'edit' },
            { iconClass: 'menu-details', label: '详细信息', operation: 'details' },
            { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
            { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
            { iconClass: 'menu-download', label: '下载', operation: 'download' },
            { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
          ]
        }
      },
      multipleMenus: {
        'type': Array,
        'default': function () {
          return [
            { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
            { iconClass: 'menu-download', label: '下载', operation: 'download' },
            { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
          ]
        }
      },
      multipleRightMenus: {
        'type': Array,
        'default': function () {
          return [
            { iconClass: 'menu-deselect', label: '取消选定', operation: 'deselect' },
            { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
            { iconClass: 'menu-download', label: '下载', operation: 'download' },
            { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
          ]
        }
      }
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
        listModeSearchOpenDir: false,
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
        grid: this.defaultGrid,
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
        if(this.indexList.length === 0){
          this.selectRowData = []
        }
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
      containerResize() {
        let clientWidth = document.querySelector(".dashboard-container").clientWidth
        this.gridColumnNum = clientWidth/120 -2
      },
      // 行拖拽
      rowDrop() {
        const _this = this
        // 被拖动的元素的索引
        let dragged = null;
        // 被拖动的元素的索引
        let draggedIndex = -1;

        let parentClassName = 'van-grid'
        let gridItemClassName = 'van-grid-item van-grid-item--square'
        let gridItemChildenClassName = 'grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square'

        // 目标元素
        let target = document.querySelector('.el-table__body-wrapper tbody');

        if(this.grid){
          target = document.querySelector('.van-checkbox-group .van-grid')
        }

        let rows = 0;//行数
        setTimeout(function () {
          rows = target.childElementCount
          for (let i = 0; i < target.childElementCount; i++) {
            let child = target.children[i]
            // 设置索引,表格自带rowIndex,这里我们设置grid的
            if(_this.grid){
              child.rowIndex = i
              child.children[0].children[0].rowIndex = i
              child = child.children[0].children[0]
            }
            child.draggable = true
            // child.style.cursor = 'copy'
            child.ondragstart = function(e){
              dragged = e.path[0]
              draggedIndex = e.path[0].rowIndex
              // console.log('child'+i+'开始拖拽');
              _this.cellMouseIndex = -1
              dragged.style.cursor = 'grabbing'
            }
            child.ondragend = function(){
              // console.log('child'+i+'拖拽结束');
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex];
              clearClass(last)
              if(_this.grid){
                dragged.style.cursor = 'pointer'
              }else{
                dragged.style.cursor = 'default'
              }
            }
          }
        },0)

        // 被拖动的元素正在那个容器里
        let dragIndex = -1

        // 判断经过了那个元素
        let judgThroughDom = function (e,d) {
          let throughRow = null
          if(_this.grid){
            if(e.path[0].className === gridItemChildenClassName){
              // throughRow 表示被拖动的元素正在哪一行上
              return throughRow
            }else{
              throughRow = e.path.find(path => {
                if(path.className === gridItemChildenClassName){
                  return path
                }
              })
            }
            if(d === 'enter'){
              let node = null
              if(e.toElement.className === gridItemClassName){
                node = e.toElement
              }
              if(e.toElement.className === parentClassName){
                node = e.fromElement
              }
              if(node){
                // console.log(d,e,node,node.rowIndex)
                leaveIndex =node.rowIndex
                if(dragIndex > -1){
                  // 清除上次进入的容器的状态
                  const last = target.children[dragIndex];
                  clearClass(last)
                }
                // console.log("离开了",leaveIndex,"dragIndex:",dragIndex)
                const leave = target.children[leaveIndex];
                clearClass(leave)
                dragIndex = -1
              }
            }
            return throughRow
          } else {
            if(e.path[0].tagName === 'TD'){
              // throughRow 表示被拖动的元素正在哪一行上
              throughRow = e.path.find(path => {
                if(path.className === 'el-table__row'){
                  return path
                }
              })
            }
            return throughRow
          }
        }

        target.ondragenter = function(e){
          // console.log(e,e.toElement)
          clearTimeout(loop)
          // 由于被拖动的元素 经过tbody中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
          let throughRow = judgThroughDom(e,'enter')
          if(throughRow){
            if(dragIndex !== throughRow.rowIndex){
              if(dragIndex > -1){
                // 清除上次进入的容器的状态
                const last = target.children[dragIndex];
                clearClass(last)
              }
              // console.log('拖动进入目标元素'+throughRow.rowIndex,'dragIndex:',dragIndex);
              // 不是自己或未文件夹时才改变状态
              if(draggedIndex !== throughRow.rowIndex && _this.fileList[throughRow.rowIndex].isFolder){
                // 改变本次进入的容器的状态
                dragged.style.cursor = 'copy'
                throughRow.style.backgroundColor = '#e9fdcf'
                if(_this.grid){
                  throughRow.style.height = throughRow.clientWidth + 15 +'px'
                  throughRow.style.width = throughRow.clientWidth + 15 +'px'
                }else{
                  throughRow.style.height = 60+'px'
                }
              }
              dragIndex = throughRow.rowIndex
            }
            leaveIndex = -1
          }
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
          let throughRow = judgThroughDom(e,'leave')
          if(throughRow){
            if(!_this.grid){
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
              }
            }
          }
        }
        target.ondrop = function(){
          // console.log('放下了'+draggedIndex);
          const form = _this.fileList[draggedIndex]
          const to = _this.fileList[dragIndex]
          if(form && to && form.id !== to.id && to.isFolder){
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
            if(_this.grid){
              node = node.children[0].children[0]
              node.style.height = null
              node.style.width = null
              node.style.backgroundColor = null
              dragged.style.cursor = 'grabbing'
            }else{
              node.style.height = 'unset'
              node.style.backgroundColor = '#fff'
              dragged.style.cursor = 'grabbing'
            }
          }
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
        if (this.pathList.length === 2){
          this.$router.push(`/?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}`)
          return
        }
        const linkIndex = this.pathList.length-3
        this.handleLink(this.pathList[linkIndex],linkIndex)
      },
      handleLink(item, index, unPushLink, unRefresh) {
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
              this.$router.push(`?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}`)
            } else {
              this.$router.push(`?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}`)
            }
          }
          if(!unRefresh){
            this.pagination.pageIndex = 1
            this.getFileList()
          }
          // setPath(this.path, this.pathList)
        }
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
        this.$router.push(`?vmode=${this.vmode}&path=${this.path}`)
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
          this.$router.push(`?vmode=${this.vmode}&search-file=${key}`)
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
            this.listModeSearchOpenDir = false
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
          this.clientHeight = document.documentElement.clientHeight - 165
          this.listModeSearch = true
          this.listModeSearchOpenDir = row
          this.pagination['total'] = res.count
          this.$nextTick(()=>{
            this.tableLoading = false
          })
        }).catch(e => {})
        this.path = row.path + row.name
      },
      openDir(row) {
        this.tableLoading = true
        api.searchFileAndOpenDir({
          userId: this.$store.state.user.userId,
          id: row.id,
          currentDirectory: this.$route.query.path,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.fileList = res.data
          this.fileList.map((item,index) => {
            item.index = index
          })
          this.clientHeight = document.documentElement.clientHeight - 165
          this.listModeSearch = false
          this.listModeSearchOpenDir = false
          this.pagination['total'] = res.count
          this.$nextTick(()=>{
            this.containerResize()
            this.tableLoading = false
          })
          // 使列表可拖拽
          this.rowDrop()
        }).catch(e => {})
        this.path = row.path + row.name
      },
      getFileList() {
        this.tableLoading = true
        api.fileList({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          currentDirectory: this.$route.query.path,
          queryFileType: this.queryFileType,
          sortableProp: this.sortable.prop,
          order: this.sortable.order,
          isFolder: this.queryCondition.isFolder,
          isFavorite: this.queryCondition.isFavorite,
          queryCondition: this.queryCondition,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.fileList = res.data
          this.fileList.map((item,index) => {
            item.index = index
          })
          this.clientHeight = document.documentElement.clientHeight - 165
          this.listModeSearch = false
          this.listModeSearchOpenDir = false
          this.pagination['total'] = res.count
          this.$nextTick(()=>{
            this.containerResize()
            this.tableLoading = false
          })
          // 使列表可拖拽
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
          if(this.listModeSearchOpenDir){
            this.searchFileAndOpenDir(this.listModeSearchOpenDir)
          }else{
            this.searchFile(this.searchFileName)
          }
        } else {
          this.getFileList()
        }
      },
      sortChange(column) {
        if(this.orderCustom || this.listModeSearch){
          this.sortable.prop = column.prop
          this.sortable.order = column.order

          this.pagination.pageIndex = 1

          if(this.listModeSearch){
            this.searchFile(this.searchFileName)
          }else{
            this.getFileList();
          }
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
          // sizeSum = '  共'
          sizeSum = '  '
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
          this.selectRowData[0] = row
          this.rowContextData = row
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
          e.pageY = event.pageY - 350
          e.clientX = event.clientX + 78
          e.clientY = event.clientY - 350
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
          case 'share':
            // 分享
            this.share()
            break
          case 'favorite':
            // 收藏
            this.favoriteOperating(true)
            break
          case 'edit':
            // 编辑
            this.$router.push(`/markdown/editor?id=${this.rowContextData.id}`)
            break
          case 'open':
            // 打开
            this.fileClick(this.rowContextData)
            break
          case 'deselect':
            // 取消选定
            this.$refs.fileListTable.toggleRowSelection(this.rowContextData)
            break
          case 'unFavorite':
            // 取消收藏
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
            // 重命名
            this.renameFileName = this.rowContextData.name
            this.editingIndex = this.rowContextData.index
            break
          case 'copy':
            // 移动或复制
            this.moveOrCopy()
            break
          case 'download':
            // 下载
            this.downloadFile()
            break
          case 'remove':
            // 删除
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
      moveOrCopy(){
        this.dialogMoveOrCopyVisible = true
        const that = this
        setTimeout(function () {
          that.selectTreeNode = that.$refs.directoryTree.getCurrentNode()
          that.selectTreeNode.showName = ' "' + that.selectTreeNode.name + '"'
        },100)
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
        if (this.menusIsMultiple || this.indexList.length > 1) {
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
          if(this.rowContextData.id){
            fileIds.push(this.rowContextData.id)
          }else{
            fileIds.push(this.rowContextData[0].id)
          }
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
      share(row) {
        if(!row || !row.id){
          if(this.rowContextData.id){
            row = this.rowContextData
          } else {
            row = this.selectRowData[0]
          }
        }
        this.shareDialog = true
        this.shareFileName = row.name
        api.generate({
          userId: row.userId,
          fileId: row.id,
          isFolder: row.isFolder
        }).then(res => {
          if (res.data) {
            this.shareLink = 'http://'+window.location.host+'/s?s='+res.data
            this.generateShareLinkLoading = false
            console.log(window.location.host, this.$route)
          }
        })
      },
      // 复制分享链接
      copyShareLink() {
        var clipboard = new Clipboard('.tag-share-link')
        clipboard.on('success', e => {
          this.$message({
            message: '复制成功',
            type: 'success',
            duration: 1000
          });
          this.shareDialog = false
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          this.$message({
            message: '该浏览器不支持自动复制',
            type: 'warning',
            duration: 1000
          });
          // 释放内存
          clipboard.destroy()
        })
      },
      downloadFile() {
        let totalSize = 0
        this.selectRowData.forEach(item => {
          totalSize += item.size
        })
        if (totalSize > 0) {
          var fileIds = [];
          if (this.indexList.length > 1) {
            this.selectRowData.forEach(value => {
              fileIds.push(value.id)
            })
          } else {
            if (this.rowContextData.id) {
              fileIds.push(this.rowContextData.id)
            } else {
              fileIds.push(this.selectRowData[0].id)
            }
          }
          window.open(process.env.VUE_APP_BASE_FILE_API + 'download?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds, '_self')
        } else {
          this.$message({
            message: '所选文件为空',
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
        if (this.menusIsMultiple || this.indexList.length > 1) {
          fileList = this.selectRowData
          this.selectRowData.forEach(value => {
            fileIds.push(value.id)
          })
        } else {
          fileIds.push(this.selectRowData[0].id)
        }
        console.log(fileIds)
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
            // this.$router.push(`?search-file=${row.id}`)
            this.$router.push(`?vmode=${this.vmode}&search-file=${row.id}`)
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
            this.$router.push(`?vmode=${this.vmode}&path=${path}`)
            this.openDir(row)
            // this.getFileList()
          }
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
            Bus.$emit('onAddAudio',row)
            return
          }
          if(row.contentType.includes('text')){
            // let routeData = this.$router.resolve({path: '/public/articles/article',query: {mark: row.id}})
            // window.open(routeData.href, '_blank');
            this.$router.push(`/public/articles/article?mark=${row.id}`)
            return
          }
          // 打开文件
          const fileIds = [row.id]
          let url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
          window.open(url, '_blank')
          // const fileIds = [row.id]
          // let url = 'http://localhost:10010/preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
          // url = process.env.VUE_APP_BASE_PRIVIEW_API+'/onlinePreview?url='+encodeURIComponent(url);
          // console.log("url",url)
          // window.open(url);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/index";
  @import "src/styles/home-index";
  /*/deep/.el-table__body-wrapper::-webkit-scrollbar {*/
    /*!*滚动条整体样式*!*/
    /*width : 10px;  !*高宽分别对应横竖滚动条的尺寸*!*/
    /*height: 1px;*/
  /*}*/
  /*/deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {*/
    /*!*滚动条里面小方块*!*/
    /*border-radius   : 10px;*/
    /*background-color: skyblue;*/
    /*background-image: -webkit-linear-gradient(*/
        /*45deg,*/
        /*rgba(255, 255, 255, 0.2) 25%,*/
        /*transparent 25%,*/
        /*transparent 50%,*/
        /*rgba(255, 255, 255, 0.2) 50%,*/
        /*rgba(255, 255, 255, 0.2) 75%,*/
        /*transparent 75%,*/
        /*transparent*/
    /*);*/
  /*}*/
  /*/deep/.el-table__body-wrapper::-webkit-scrollbar-track {*/
    /*!*滚动条里面轨道*!*/
    /*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*/
    /*background   : #ededed;*/
    /*border-radius: 10px;*/
  /*}*/
</style>

