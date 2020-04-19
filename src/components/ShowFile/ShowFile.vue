<template>
  <div class="dashboard-container" v-resize="containerResize">
    <el-breadcrumb class="app-breadcrumb" separator="">
      <transition-group name="breadcrumb" v-if="showNavigation">
        <el-breadcrumb-item v-for="(item,index) in pathList" :key="index">
          <el-tooltip v-if="index===0 && pathList.length > 1" class="item" effect="dark" content="返回上一级" placement="top">
            <a @click.prevent="lastLink()"><svg-icon icon-class="back" style="font-size: 24px;"/>&nbsp;</a>
          </el-tooltip>
          <el-tooltip v-if="index===0 && pathList.length > 2" class="item" effect="dark" content="根目录" placement="top">
            <a class="home-link" @click.prevent="handleLink(item,index)"><svg-icon icon-class="home" style="font-size: 24px;"/></a>
          </el-tooltip>
          <breadcrumb-file-path :pathList="pathList" :item="item" :index="index" @clickLink="handleLink"></breadcrumb-file-path>
        </el-breadcrumb-item>
      </transition-group>
      <div class="search-content">
        <div class="searchClass">
          <el-popover
            v-model="isShowNewFolder"
            placement="bottom"
            trigger="hover"
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
            <!--<el-button slot="reference" icon="el-icon-plus add-file-button" circle />-->
            <button-upload slot="reference" :name="''" @click.native="upload" style="margin-right: 5px"></button-upload>
          </el-popover>

          <el-input placeholder="搜索您的文件"  v-model="searchFileName" :clearable="true" @keyup.enter.native="searchFile(searchFileName)">
            <el-button slot="prepend" @click="searchFile(searchFileName)">
              <svg-icon icon-class="search" style="font-size: 22px"/>
            </el-button>
          </el-input>
          <el-button class="vmode" @click="changeVmode">
            <svg-icon :icon-class="grid ? 'menu-list' : 'menu-grid'" />
          </el-button>
        </div>
      </div>
    </el-breadcrumb>
    <div>
      <!--统计信息-->
      <div class="info-statistics">
        <span v-if="tableLoading">获取更多数据...</span>
        <span v-if="!tableLoading">{{!finished?'已加载 '+getSummaries3:'已全部加载 '+getSummaries3}}</span>
      </div>
    </div>

    <!--右键菜单-->
    <e-vue-contextmenu ref="contextShow" class="newFileMenu" :class="menuTriangle" @ctx-show="show" @ctx-hide="hide">
      <div class="popper-arrow"></div>
      <ul v-for="(item,index) in menus" :key="item.label">
        <li
          v-if="item.operation === 'unFavorite' || item.operation === 'favorite'"
          @click="menusOperations(item.operation)"
          @mouseover.prevent.stop="menuFavoriteOver(index,rowContextData.isFavorite)"
          @mouseleave.prevent.stop="menuFavoriteLeave(index,rowContextData.isFavorite)"
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
    <!--<div v-show="!grid && fileList.length > 0" :style="{'width':'100%','height': clientHeight+'px'}">-->
    <div v-show="fileList.length > 0" id="v-draw-rectangle" :style="{'width':'100%','height': clientHeight+'px'}">
      <pl-table
        ref="fileListTable"
        v-show="!grid"
        v-loading="tableLoading"
        :max-height="clientHeight"
        :default-sort="sortable"
        :highlight-current-row="false"
        empty-text="无文件"
        :datas="fileList"
        :use-virtual="true"
        :border="false"
        :excess-rows="3"
        :pagination-show="false"
        style="width: 100%;margin: 20px 0 0 0;"
        :row-style="rowStyle"
        :height-change="false"
        :summary-method="getSummaries"
        :row-class-name="tableRowClassName"
        element-loading-text="文件加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#f6f7fa88"
        @selection-change="handleSelectionChange"
        @row-contextmenu="rowContextmenu"
        @cell-click="cellClick"
        @row-dblclick="dblclick"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        @sort-change="sortChange"
        @table-body-scroll="tableBodyScroll"
        @select="pinSelect"
      >
        <template v-for="(item,index) in tableHead">
          <!--索引-->
          <pl-table-column
            v-if="index === 0"
            :key="index"
            :index="index"
            type="selection"
            min-width="50"
          >
          </pl-table-column>
          <!--图标-->
          <pl-table-column
            v-if="index === 1"
            :key="index"
            :index="index"
            width="50"
          >
            <template slot-scope="scope">
              <icon-file :item="scope.row" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></icon-file>
            </template>
          </pl-table-column>
          <!--名称-->
          <pl-table-column
            v-if="index === 2"
            :key="index"
            :show-overflow-tooltip="true"
            max-width="200"
            :index="index"
            :prop="item.name"
            :label="item.label"
            :sort-orders="['ascending', 'descending']"
            :sortable="item.sortable ? (orderCustom ?'custom':true) : false"
          >
            <template slot-scope="scope">
              <el-col v-if="scope.row.index === editingIndex" :span="10">
                <el-input v-focus v-model="renameFileName" placeholder="" size="small" :clearable="true" @focus="renameInputFocus($event,scope.row)" @keyup.enter.native="rowRename(renameFileName, scope.row)">
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
              <a v-else @click.stop="fileClick(scope.row)" class="table-file-name"><span>{{ scope.row.name }}</span></a>
            </template>
          </pl-table-column>
          <!--分享-->
          <pl-table-column v-if="index === 3" :key="index" width="50" :index="index" align="center" header-align="center" tooltip-effect="dark">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.index === cellMouseIndex" class="item" effect="light" content="分享" placement="top">
                <svg-icon title="分享" class="button-class" icon-class="share" @click.stop="share(scope.row)"/>
              </el-tooltip>
            </template>
          </pl-table-column>
          <!--更多-->
          <pl-table-column v-if="index === 4" :key="index" width="50" :prop="item.name" :label="item.label" :index="index" class="el-icon-more" align="center" header-align="center">
            <!-- 使用组件, 并传值到组件中 -->
            <template slot="header">
              <svg-icon v-if="item.name !== ''" class="button-class" icon-class="more" @click.stop="moreOperation($event)" />
            </template>
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.index === cellMouseIndex" class="button-class" icon-class="more" @click.stop="moreClick(scope.row,$event)" />
            </template>
          </pl-table-column>
          <!--文件大小-->
          <pl-table-column
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
          </pl-table-column>
          <!--修改时间-->
          <pl-table-column
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
          </pl-table-column>
        </template>
      </pl-table>


      <!--grid布局-->
      <div v-show="grid" v-loading="tableLoading"
           element-loading-text="文件加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="#f6f7fa88">
        <div class="checkbox-group-header">
          <div class="select-operation">
            <van-checkbox class="grid-all-checkbox" @click="clickGridAllCheckBox" v-model="allChecked">{{selectRowData.length>0 ? '已选择 '+this.tableHead[2].label : "选择"}}</van-checkbox>
            <div>
              <el-button class="select-operation-button" icon="el-icon-download" v-if="selectRowData.length > 0" @click="downloadFile">
                下载
              </el-button>
              <el-button class="select-operation-button" icon="el-icon-share" v-if="selectRowData.length === 1" @click="share">
                分享
              </el-button>
              <el-button class="select-operation-button" icon="el-icon-document-copy" v-if="selectRowData.length > 0" @click="moveOrCopy">
                移动或复制
              </el-button>
              <el-button class="select-operation-button" icon="el-icon-delete" v-if="selectRowData.length > 0" type="danger" @click="deleteFile">
              </el-button>
            </div>
          </div>
          <el-divider style="transform: scaleY(0.5);"></el-divider>
        </div>

        <van-checkbox-group v-model="selectRowData" @change="handleSelectionChange" ref="checkboxGroup">
          <van-grid square :center="true" :column-num="gridColumnNum" :gutter="10" :border="false" :style="{'width':'100%','max-height': clientHeight-45+'px','overflow':'auto'}">
            <van-grid-item v-for="(item,index) in fileList" ref="gridItem"  :key="item.id"
            >
              <div class="grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                   :style="{'background': selectRowData.includes(item)?'#caeaf991':'','border': selectRowData.includes(item)?'solid 1px #7bd7ff':''}"
                   @mouseover="gridItemHover(item,index)"
                   @mouseout="gridItemOut(item,index)"
                   @click="gridItemClick(item)"
                   @contextmenu.prevent="rowContextmenu(item)"
              >
                <van-checkbox v-if="gridHoverItemIndex === index || selectRowData.includes(item)" class="grid-item-checkbox" :name="item" @click.stop="clickGridItemCheckBox(item,index)"/>
                <div class="grid-item-icon"><icon-file :item="item" :image-url="imageUrl" :audio-cover-url="audioCoverUrl" :grid="true"></icon-file></div>
                <!--<el-tooltip effect="light" :content="item.name" placement="top">-->
                  <span :title="item.name" class="grid-item-text">{{item.name}}</span>
                <!--</el-tooltip>-->
              </div>
            </van-grid-item>
          </van-grid>
        </van-checkbox-group>
        <!--<el-divider class="grid-divider" content-position="center"><i class="el-icon-folder-opened"></i>&nbsp;{{summaries}}</el-divider>-->
      </div>


    </div>

    <empty-file
      v-if="fileList.length < 1 && !tableLoading"
      :emptyStatus="emptyStatus"
    >
    </empty-file>
    <sim-text-preview :file="textPreviewRow" :status.sync="textPreviewVisible"></sim-text-preview>
    <image-viewer :fileList="fileList" :file="imagePreviewRow" :status.sync="imagePreviewVisible"></image-viewer>
    <video-preview :file="videoPreviewRow" :status.sync="videoPreviewVisible"></video-preview>
    <!-- <audio-preview :file="audioPreviewRow" :status.sync="audioPreviewVisible"></audio-preview> -->

    <!--文件详细信息-->
    <el-drawer
      :title="rowContextData.name"
      :visible.sync="drawer">
      <div class="drawer-icon">
        <icon-file class="drawer-icon-font" :grid="true" :details="true" :item="rowContextData" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></icon-file>
      </div>
      <el-form class="details-form">
        <el-form-item label="名称:">
          <span>{{rowContextData.name}}</span>
        </el-form-item>
        <el-form-item label="类型:" class="details-name">
          <span >{{rowContextData.isFolder ? '文件夹': rowContextData.contentType}}</span>
        </el-form-item>
        <el-form-item label="大小:">
          <span> {{rowContextData.size}}字节 {{rowContextData.size >0 ? '('+formatSize(rowContextData.size)+')': ''}}</span>
        </el-form-item>
        <el-form-item label="位置:" class="details-position">
          <a :href="'?path='+rowContextData.path">{{rowContextData.path}}</a>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span>{{rowContextData.uploadDate}}</span>
        </el-form-item>
        <el-form-item label="修改时间:">
          <span>{{rowContextData.updateDate}}</span>
        </el-form-item>
      </el-form>
    </el-drawer>
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
  // import { getPath, getPathList, setPath, removePath } from '@/utils/path'
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
  import ButtonUpload from "@/components/button/ButtonUpload";
  import '@/utils/directives.js'

  import 'pl-table/themes/index.css';
  // import 'pl-table/themes/plTableStyle.css';
  import { PlTable, PlTableColumn } from 'pl-table';
  var rowStyleExecuting = false
  export default {
    name: 'ShowFile',
    components: {AudioPreview, VideoPreview, ImageViewer, SimTextPreview, IconFile, BreadcrumbFilePath, EmptyFile,
      PlTable,
      PlTableColumn,
      ButtonUpload
    },
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
        audioCoverUrl: process.env.VUE_APP_BASE_API + '/view/cover?jmal-token=' + this.$store.state.user.token + '&id=',
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
          { 'folder': ''},
        ],
        fileList: [],
        pagination: {
          pageIndex: 1,
          pageSize: 50,
          total: 0,
          pageSizes: [10,20,30,40,50]
        },
        isIndeterminate: false,
        isSelectAll: false,
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
        tableLoading: true,
        finished: false,
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
        drawer: false,
        rowStyleExecuting: false,
        selectRowData: [],
        selectOrgin: -1,// 选择起点(主要用于按住shift键多选)
        selectEnd: -1,// 选择终点
        selectPin: false,// 默认false,不按住
        dragElementList: [],
        drawFlag: false,
        fileListScrollTop: 0,
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ]),
      getSummaries2() {
        let totalSize = 0
        this.fileList.forEach(file => {
          totalSize += file.size
        })
        const sumFileAndFolder = this.getShowSumFileAndFolder(this.fileList)
        const sizeSum = this.getShowSumSize(totalSize)
        this.summaries = sumFileAndFolder + sizeSum
        return totalSize > 0 ? sumFileAndFolder + sizeSum : ''
      },
      getSummaries3() {
        let totalSize = 0
        this.fileList.forEach(file => {
          totalSize += file.size
        })
        return totalSize > 0 ? this.fileList.length+'项 '+this.getShowSumSize(totalSize) : ''
      },
    },
    created() {
      this.getFileList()
    },
    mounted() {

      Bus.$on('fileSuccess', () => {
        this.getFileList()
      })
      Bus.$on('clickMore', (rows) => {
        this.$refs.fileListTable.tableSelectData = rows
        this.preliminaryRowData()
      })

      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }

      // 获取键盘事件
      window.addEventListener('keydown',code => {
        // 按住shift建
        if(code.keyCode === 16 && code.shiftKey){
          this.selectPin = true
        }
      })
      window.addEventListener('keyup',code => {
        // 松开shift建
        if(code.keyCode === 16 ){
          this.selectPin = false
        }
      })

      const that = this
      window.onresize = function temp() {
        that.clientHeight = document.documentElement.clientHeight - 136
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
      if(this.$route.query.path !== '/'){
        const path = decodeURI(this.$route.query.path)
        this.pathList.splice(1,1)
        path.split('/').forEach((pathName,index)=>{
          if(index > 0){
            const item = {}
            item['folder'] = pathName
            this.pathList.push(item)
          }
        })
      }

      // 画矩形选区
      this.darwRectangle()
    },
    destroyed() {
      window.removeEventListener('popstate', this.goBack, false);
    },
    // watch: {
    //   fileList: function (newValue,oldValue) {
    //     console.log(newValue,oldValue)
    //   }
    // },
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
      load () {
        this.getFileList(true)
      },
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
      clickGridItemCheckBox(row,index) {
        // 同步列表的checkbox
        if(this.selectRowData.includes(row)){
          this.$refs.fileListTable.toggleRowSelection([{row:row,selected:false}])
        }else{
          this.$refs.fileListTable.toggleRowSelection([{row:row,selected:true}])
        }
        this.pinSelect(null,row)
      },
      clickGridAllCheckBox() {
        if(this.selectRowData.length !== this.fileList.length){
          this.$refs.fileListTable.toggleAllSelection()
        }else{
          this.$refs.fileListTable.clearSelection();
        }
      },
      gridItemClick(row) {
        if(!this.drawFlag){
          this.fileClick(row)
        }
      },
      containerResize() {
        let clientWidth = document.querySelector(".dashboard-container").clientWidth
        this.gridColumnNum = clientWidth/120 -2
        this.rowDrop()
      },
      // 画矩形选区
      darwRectangle(){
        const _this = this
        let $$ = function(id){
          return document.getElementById(id)
        }
        let draw = $$("v-draw-rectangle")
        let wId = "rectangle1"
        let startX = 0, startY = 0
        let retcLeft = 0, retcTop = 0, retcHeight = 0, retcWidth = 0
        _this.drawFlag = false
        let itemClassName = 'el-table__row'
        draw.onmousedown = function(e){
          if(_this.fileListScrollTop > 0){
            return
          }
          let evt = window.event || e
          if(_this.grid){
            itemClassName = 'van-grid-item van-grid-item--square'
          }
          let throughRow = e.path.find(path => {
            if(path.className === itemClassName){
              return path
            }
          })
          if(throughRow && _this.selectRowData.includes(_this.fileList[throughRow.rowIndex])){
            return
          }
          if(evt.button !== 0){
            return
          }
          let scrollTop = draw.scrollTop || draw.scrollTop
          let scrollLeft = draw.scrollLeft || draw.scrollLeft
          startX = evt.clientX + scrollLeft
          startY = evt.clientY + scrollTop
          let div = document.createElement("div")
          div.id = wId
          div.className = "draw-rectangle"
          div.style.left = startX + "px"
          div.style.top = startY + "px"
          div.style.position = 'fixed'
          div.style.border = '1px dashed #2898ff'
          div.style.width = '0px'
          div.style.height = '0px'
          div.style.left = '0px'
          div.style.top = '0px'
          div.style.overflow = 'hidden'
          draw.appendChild(div)
          document.onmousemove = function(e){
            let evt = window.event || e
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
            let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft
            retcLeft = (startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX)
            retcTop = (startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY)
            retcHeight = Math.abs(startY - evt.clientY - scrollTop)
            retcWidth = Math.abs(startX - evt.clientX - scrollLeft)
            const drawRectangle = $$(wId)
            if(drawRectangle){
              noScroll()
              _this.drawFlag = true
              drawRectangle.style.left = retcLeft + 'px'
              drawRectangle.style.top = retcTop + 'px'
              drawRectangle.style.width = retcWidth + 'px'
              drawRectangle.style.height = retcHeight + 'px'
              drawRectangle.style.backgroundColor = '#f2f5fa55'
            }
            if(_this.drawFlag && (retcHeight + retcWidth) > 4){
              if(!drawSelecting){
                drawSelect({x:retcLeft,y:retcTop,w:retcWidth,h:retcHeight})
              }
            }
          }
          document.onmouseup = function(e){
            document.onmousemove = null;
            document.onmouseup = null;
            setTimeout(function (){
              restoreScroll()
              _this.drawFlag = false
            },50)
            if($$(wId)){
              draw.removeChild($$(wId))
            }
          }
        }

        // 添加grid视图的scroll事件
        document.querySelector('.van-grid').onscroll = function (e) {
          _this.tableBodyScroll(null,e)
        }

        let scrollDiv = document.querySelector('.ant-table-scroll')
        if(_this.grid){
          scrollDiv = document.querySelector('.van-grid')
        }
        // 禁止滚动
        let noScroll = function(){
          scrollDiv.onmousewheel = function (evt){
            evt = evt || window.event
            if (evt.preventDefault) {
              // Firefox
              evt.preventDefault()
              evt.stopPropagation()
            } else {
              // IE
              evt.cancelBubble = true
              evt.returnValue = false
            }
            return false
          }
        }
        // 恢复滚动
        let restoreScroll = function(){
          scrollDiv.onmousewheel = function (evt) {
            return true
          }
        }

        let drawSelecting = false
        let drawSelect = function(drawNode){
          drawSelecting = true
          _this.dragElementList.forEach(element => {
            if(checkTouch(element,drawNode)){
              _this.$refs.fileListTable.toggleRowSelection([{row:_this.fileList[element.rowIndex],selected: true}])
            }else{
              _this.$refs.fileListTable.toggleRowSelection([{row:_this.fileList[element.rowIndex],selected: false}])
            }
          })
          setTimeout(function () {
            drawSelecting = false
          },150)
        }
        //检查两个DIV是否有接触
        let checkTouch = function(item,draw){
          //得到左上角的绝对坐标
          let x1=item.x
          let y1=item.y
          let x2=draw.x
          let y2=draw.y
          let w1=item.w;
          let h1=item.h;
          let w2=draw.w;
          let h2=draw.h;
          return ((x1-x2<=0)&&(x2-x1<w1)||(x1-x2>=0)&&(x1-x2<w2))&&((y1-y2<=0)&&(y2-y1<h1)||(y1-y2>=0)&&(y1-y2<h2))
        };
      },
      // 行拖拽
      rowDrop() {
        if(this.fileListScrollTop > 0){
          return
        }
        // 目标元素的背景颜色
        let dragEnterBackCorlor = null
        // 被拖拽元素的背景色
        let dragBackCorlor = null
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
          _this.dragElementList = []
          for (let i = 0; i < target.childElementCount; i++) {
            let child = target.children[i]
            // 设置索引,表格自带rowIndex,这里我们设置grid的
            if(_this.grid){
              child.rowIndex = i
              child.children[0].children[0].rowIndex = i
              child = child.children[0].children[0]
            }
            // 为画矩形选取准备数据
            let pos = getObjPos(child)
            pos.w = child.offsetWidth
            pos.h = child.offsetHeight
            pos.rowIndex = child.rowIndex
            _this.dragElementList.push(pos)

            // 使元素可拖动
            child.draggable = true

            child.ondragstart = function(e){
              // 避免和画矩形选取冲突
              _this.drawFlag = false
              let rectangle = document.getElementById('rectangle1')
              if(rectangle){
                document.getElementById('v-draw-rectangle').removeChild(rectangle)
              }

              dragged = e.path[0]
              draggedIndex = e.path[0].rowIndex
              // console.log('child'+i+'开始拖拽');
              // 只有选中的才能拖拽
              _this.cellMouseIndex = -1
              dragged.style.cursor = 'grabbing'
              dragged.style.borderRadius = '10px'
              dragBackCorlor = dragged.style.backgroundColor

              let dragImage = document.createElement('img')
              dragImage.src = require('@/assets/img/File.png')
              e.dataTransfer.setDragImage(dragImage, 10, 10);
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
              if(draggedIndex !== throughRow.rowIndex && _this.fileList[throughRow.rowIndex].isFolder && _this.selectRowData.findIndex(item => item.index === throughRow.rowIndex) === -1){
                // 改变本次进入的容器的状态
                dragged.style.cursor = 'copy'
                dragEnterBackCorlor = throughRow.style.backgroundColor
                // throughRow.style.backgroundColor = '#e9fdcf'
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
                  if(leaveIndex > -1) {
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
          if(form && to && form.id !== to.id && to.isFolder && !_this.selectRowData.includes(to)){
            // 移动文件/文件夹
            let forms = []
            _this.selectRowData.forEach(row => {
              forms.push(row.id)
            })
            _this.$confirm(`是否将选中的${_this.selectRowData.length}项移动到 ${to.name}?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              _this.copyOrMoveApi('move', forms, to.id)
            }).catch()
          }
        }
        let clearClass = function (node) {
          if(node){
            if(_this.grid){
              node = node.children[0].children[0]
              node.style.height = null
              node.style.width = null
              // node.style.backgroundColor = dragEnterBackCorlor
              dragged.style.cursor = 'grabbing'
            }else{
              node.style.height = 'unset'
            }
          }
          dragged.style.backgroundColor = dragBackCorlor
        }
        function getObjPos(obj) {
          let pos = {x:0,y:0}
          while(obj){
            pos.x += obj.offsetLeft
            pos.y += obj.offsetTop
            obj = obj.offsetParent
          }
          return pos
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
      lastLink(){
        this.handleLink(this.pathList[this.pathList.length-2],this.pathList.length-2)
      },
      handleLink(item, index, unPushLink, unRefresh) {
        if(item && item.search){
          if(item.searchKey){
            this.searchFileByKeyWord(item.searchKey)
          } else if(item.row){
            this.searchFileAndOpenDir(item.row)
          }
          this.pathList.splice(this.pathList.findIndex((v,i) => i === index + 1), this.pathList.length - (index + 1))
        } else {
          this.pathList.splice(this.pathList.findIndex((v,i) => i === index + 1), this.pathList.length - (index + 1))
          this.pathList.forEach((p, number) => {
            if (number === 0) {
              this.path = ''
            } else if (number === this.pathList.length) {
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
        this.vmode = 'list'
        if(this.grid){
          this.vmode = 'grid'
        }else{
          this.$refs.fileListTable.setHeight()
        }
        if(!this.path){
          this.path = ''
        }
        this.$router.push(`?vmode=${this.vmode}&path=${this.path}`)
        // 改变拖拽目标
        this.rowDrop()
        // 画矩形选取
        this.darwRectangle()
      },
      // 请求之前的准备
      beforeLoadData(onLoad){
        if (onLoad) {
          this.pagination.pageIndex++
        } else {
          this.pagination.pageIndex = 1
        }
        this.tableLoading = true
        this.finished = false
      },
      // 填充数据
      loadData(res,onLoad){
        if(onLoad){
          res.data.forEach((file,number) => {
            file['index'] = (this.pagination.pageIndex - 1) * this.pagination.pageSize + number
            this.fileList.push(file)
          });
        }else{
          this.fileList = res.data
          this.fileList.map((item,index) => {
            item.index = index
          })
        }
        // 数据全部加载完成
        if (this.fileList.length >= res.count) {
          this.finished = true;
        }
        this.tableLoading = false
        this.clientHeight = document.documentElement.clientHeight - 136
        this.listModeSearch = false
        this.pagination['total'] = res.count
        this.$nextTick(()=>{
          this.containerResize()
          this.tableLoading = false
        })
        // 使列表可拖拽
        this.rowDrop()
        this.fileListScrollTop = 0
        // 是列表会到顶部
        if(!onLoad){
          this.$refs.fileListTable.pagingScrollTopLeft()
        }
      },
      searchFile(key,onLoad) {
        if(key){
          this.beforeLoadData(onLoad)
          this.pathList = [{ 'folder': ''}]
          const item1 = {}
          item1['folder'] = '搜索: ' + '"'+ key +'"'
          item1['search'] = true
          item1['searchKey'] = key
          this.pathList.push(item1)
          this.$router.push(`?vmode=${this.vmode}&search-file=${key}`)
          api.searchFile({
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            keyword: key,
            currentDirectory: this.$route.query.path,
            pageIndex: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          }).then(res => {
            this.loadData(res,onLoad)
            this.path = ''
            this.listModeSearch = true
            this.listModeSearchOpenDir = false
          })
        }
      },
      searchFileAndOpenDir(row,onLoad) {
        this.beforeLoadData(onLoad)
        api.searchFileAndOpenDir({
          userId: this.$store.state.user.userId,
          id: row.id,
          currentDirectory: this.$route.query.path,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.loadData(res,onLoad)
          this.listModeSearch = true
          this.listModeSearchOpenDir = row
        })
        this.path = row.path + row.name
      },
      openDir(row,onLoad) {
        this.beforeLoadData(onLoad)
        api.searchFileAndOpenDir({
          userId: this.$store.state.user.userId,
          id: row.id,
          currentDirectory: this.$route.query.path,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.loadData(res,onLoad)
        })
        this.path = row.path + row.name
      },
      getFileList(onLoad) {
        this.beforeLoadData(onLoad)
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
          this.loadData(res,onLoad)
        })
      },
      getFileListBySearchMode(onLoad) {
        this.beforeLoadData(onLoad)
        api.fileList({
          userId: this.$store.state.user.userId,
          currentDirectory: this.path,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.loadData(res,onLoad)
        })
      },
      tableBodyScroll(table, e) {
        this.fileListScrollTop = e.target.scrollTop
        let scrollBottom = e.target.scrollHeight-e.target.clientHeight-e.target.scrollTop;
        if(scrollBottom < 200){
          if(!this.finished){
            if (this.listModeSearch) {
              if(this.listModeSearchOpenDir){
                this.searchFileAndOpenDir(this.listModeSearchOpenDir,true)
              }else{
                this.searchFile(this.searchFileName,true)
              }
            } else {
              this.getFileList(true)
            }
          }
        }
      },
      pinSelect(rows,row){
        if(this.selectPin && this.selectOrgin > -1){
          const orgin = this.selectOrgin
          this.selectEnd = row.index
          let diff = this.selectEnd - orgin
          // 先清除选中
          this.$refs.fileListTable.clearSelection()
          if(diff === 0){
            this.selectOrgin = -1
          }
          if(diff > 0){
            for(let i = orgin;i <= this.selectEnd;i++){
              this.$refs.fileListTable.toggleRowSelection([{row:this.fileList[i],selected: true}])
              this.$refs.fileListTable.tableSelectData.push(this.fileList[i])
            }
          }
          if(diff < 0){
            for(let i = this.selectEnd;i <= orgin;i++){
              this.$refs.fileListTable.toggleRowSelection([{row:this.fileList[i],selected: true}])
              this.$refs.fileListTable.tableSelectData.push(this.fileList[i])
            }
          }
        }
        this.changeSelectedStyle(this.$refs.fileListTable.tableSelectData)
      },
      sortChange(column) {
        this.rowDrop()
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
      selectAll(checked) {
        this.isSelectAll = checked
        if(checked){
          this.fileList.forEach(row => {
            this.selectRowData.push(row)
          })
        }else{
          this.isIndeterminate = false
        }
      },
      // 收集选中的index值作为数组 传递给rowRed判断变换样式
      handleSelectionChange(rows) {
        // 起点
        if(rows.length > 0){
          if(!this.selectPin){
            this.selectOrgin = rows[0].index
          }
          if(this.selectPin){
            return
          }
        }
        this.$refs.fileListTable.tableSelectData = rows
        this.selectRowData = rows
        this.changeSelectedStyle(rows)
      },
      changeSelectedStyle(rows){
        let selectTotalSize = 0
        rows.forEach(item => {
          selectTotalSize += item.size
        })
        const item_name = this.tableHead[2]
        const item_more = this.tableHead[4]
        const item_size = this.tableHead[5]
        const item_date = this.tableHead[6]
        if (rows.length > 0) {
          const sumFileAndFolder = this.getShowSumFileAndFolder(rows)
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
        if(this.selectRowData.length === this.fileList.length){
          this.allChecked = true
        }else{
          this.allChecked = false
        }
      },
      // cell-style 通过返回值可以实现样式变换利用传递过来的数组index循环改变样式
      rowStyle({ row, rowIndex}) {
        if(this.$refs.fileListTable.tableSelectData.findIndex(item => item.index === row.index) > -1){
          return { backgroundColor: '#F5F7FA' }
        }
      },
      // 动态添加index到row里面去
      tableRowClassName({ row, rowIndex }) {
        // row.index = rowIndex
      },
      // 选择某行预备数据
      preliminaryRowData(row) {
        if (row) {
          // this.$refs.fileListTable.tableSelectData[0] = row
          this.rowContextData = row
        }
        const isFavorite = this.rowContextData.isFavorite
        this.highlightFavorite(isFavorite, false)
      },
      // 单元格hover进入时事件
      cellMouseEnter(row) {
        if(this.$refs.contextShow.locals.menuType === 'moreClick' && this.$refs.contextShow.locals.rowIndex !== row.index) {
          this.$refs.contextShow.hideMenu()
        }
        if(this.editingIndex === -1 && !this.$refs.contextShow.ctxVisible) {
          if (this.selectRowData.length <= 1) {
            this.cellMouseIndex = row.index
          }
        }
      },
      // 单元格hover退出时事件
      cellMouseLeave(row) {
        if(this.$refs.contextShow.locals.menuType === 'moreClick' && this.$refs.contextShow.locals.rowIndex !== row.index) {
          this.$refs.contextShow.hideMenu()
          this.$refs.contextShow.locals = {}
          return
        }
        if(this.$refs.contextShow.ctxVisible && this.$refs.contextShow.locals.menuType === 'moreClick' && this.$refs.contextShow.locals.rowIndex === row.index) {
          return
        }
        this.cellMouseIndex = -1
      },
      //双击
      dblclick(row){
        // this.fileClick(row)
      },
      // 单元格点击事件
      cellClick(row, column) {
        clearTimeout(this.Loop);
        if(this.editingIndex === -1) {
          const columnIndex = column.index
          if (columnIndex === 2) {
            if (this.selectRowData.length < 1) {
              if (row.index !== this.editingIndex) {
                // this.fileClick(row)
                this.editingIndex = -1
              }
            }
          }
          if (columnIndex === 4) {
            // // 单个操作
          }
          if(columnIndex === 0 ){
            this.pinSelect(null,row)
            this.$refs.fileListTable.toggleRowSelection([{row:row}])
          } else {
            this.$refs.fileListTable.clearSelection()
            this.$refs.fileListTable.toggleRowSelection([{row:row}])
            this.pinSelect(null,row)
          }
        }
      },
      // 选取输入框部分内容
      renameInputFocus(event,row) {
        event.currentTarget.selectionStart = 0
        event.currentTarget.selectionEnd = event.currentTarget.value.length - row.suffix.length - 1
      },
      // 重命名
      rowRename(newFileName, row) {
        if (newFileName) {
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
          }).then(()=>{
            this.$refs.fileListTable.clearSelection()
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
        this.preliminaryRowData(row)
        this.showOperationMenus(event,{'menuType':'moreClick',rowIndex: row.index})
      },
      // 鼠标右击
      rowContextmenu(row) {
        if (this.$refs.fileListTable.tableSelectData.length > 1 && this.$refs.fileListTable.tableSelectData.findIndex(item => item.index === row.index) > -1) {
          this.menusIsMultiple = true
          this.menus = this.multipleRightMenus
        } else {
          this.$refs.fileListTable.clearSelection()
          this.$refs.fileListTable.toggleRowSelection([{row:row}])
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
        this.$refs.contextShow.showMenu(e)
        this.cellMouseIndex = -1
      },
      // 显示操作菜单
      showOperationMenus(event, menuData) {
        let offsetY = event.pageY
        if(event.target.clientHeight > 0){
          offsetY += event.target.clientHeight/2-event.offsetY
        }
        const e = {}
        if (document.body.scrollHeight - offsetY > 400) {
          this.menuTriangle = 'menu-triangle-top'
          e.pageX = event.pageX - 78
          e.pageY = offsetY + 25
        } else {
          this.menuTriangle = 'menu-triangle-bottom'
          e.pageX = event.pageX - 78
          e.pageY = offsetY - (this.menus.length * 38) - 36
        }
        if (!this.isJustHideMenus) {
          this.$refs.contextShow.showMenu(e,menuData)
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
            item_menu.iconClass = 'menu-unfavorite-hover'
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
      },
      hide() {
        const that = this
        this.isJustHideMenus = true
        setTimeout(function() {
          that.isJustHideMenus = false
        }, 100)
        this.cellMouseIndex = -1
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
            this.$refs.fileListTable.clearSelection()
            break
          case 'unFavorite':
            // 取消收藏
            this.favoriteOperating(false)
            break
          case 'details':
            console.log(this.rowContextData)
            this.drawer = true
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
        if (this.menusIsMultiple || this.selectRowData.length > 1) {
          const exits = this.$refs.fileListTable.tableSelectData.some(value => {
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
            if (this.$refs.fileListTable.tableSelectData.length === 1) {
              this.fileList.splice(this.$refs.fileListTable.tableSelectData[0].index, 1)
            } else {
              this.getFileList()
            }
            this.$refs.fileListTable.clearSelection()// 删除后清空之前选择的数据
            this.$refs.fileListTable.tableSelectData = []
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
            row = this.$refs.fileListTable.tableSelectData[0]
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
        this.$refs.fileListTable.tableSelectData.forEach(item => {
          totalSize += item.size
        })
        if (totalSize > 0) {
          var fileIds = [];
          if (this.$refs.fileListTable.tableSelectData.length > 0) {
            this.$refs.fileListTable.tableSelectData.forEach(value => {
              fileIds.push(value.id)
            })
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
        this.$refs.fileListTable.tableSelectData[0].isFavorite = isFavorite
        this.highlightFavorite(isFavorite, true)
        api.favoriteUrl({
          token: this.$store.state.user.token,
          id: this.$refs.fileListTable.tableSelectData[0].id,
          isFavorite: isFavorite
        }).then(res => {
        })
      },
      // 删除
      deleteFile() {
        let fileList = []
        const fileIds = []
        if (this.menusIsMultiple || this.selectRowData.length > 1) {
          fileList = this.$refs.fileListTable.tableSelectData
          this.$refs.fileListTable.tableSelectData.forEach(value => {
            fileIds.push(value.id)
          })
        } else {
          fileIds.push(this.$refs.fileListTable.tableSelectData[0].id)
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
            if(this.$refs.fileListTable.tableSelectData.length > 0){
              this.$refs.fileListTable.tableSelectData.forEach(item => {
                let fileIndex = this.fileList.findIndex(file => file.id === item.id)
                if(fileIndex > -1){
                  this.fileList.splice(fileIndex,1)
                }
              })
            }
            this.$refs.fileListTable.doLayout()
            this.$refs.fileListTable.clearSelection()// 删除后清空之前选择的数据
            this.$refs.fileListTable.tableSelectData = []
          }).then(()=>{
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 1000
            })
          })
        })
      },
      // 点击文件或文件夹
      fileClick(row) {
        if (row.isFolder) {
          this.editingIndex = -1
          // 打开文件夹
          if (this.listModeSearch) {
            const item = {}
            item['folder'] = row.name
            item['search'] = true
            item['row'] = row
            this.pathList.push(item)
            this.pagination.pageIndex = 1
            this.$router.push(`?vmode=${this.vmode}&search-file=${row.id}`)
            this.searchFileAndOpenDir(row)
          } else {
            if(this.path){
              this.path += '/' + row.name
            } else {
              this.path = '/' + row.name
            }
            const item = {'folder':row.name}
            this.pathList.push(item)
            this.pagination.pageIndex = 1
            const path = encodeURIComponent(this.path);
            this.$router.push(`?vmode=${this.vmode}&path=${path}`)
            this.openDir(row)
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
            Bus.$emit('onAddAudio',row, this.audioCoverUrl)
            return
          }
          if(row.contentType.includes('text')){
            // let routeData = this.$router.resolve({path: '/public/articles/article',query: {mark: row.id}})
            // window.open(routeData.href, '_blank');
            this.$router.push(`/public/articles/article?mark=${row.id}`)
            return
          }
          // 打开文件
          let fileIds = [row.id]

          this.$confirm('此文件不支持预览, 是否下载该文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
            window.open(url, '_self')
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/index";
  @import "src/styles/home-index";
  /*overflow: hidden;*/
  /*white-space: nowrap;*/
  /*text-overflow: ellipsis;*/
  /deep/.app-wrapper {
    overflow-y: hidden;
  }
  /deep/:focus {
    outline:0;
  }
  /deep/.el-drawer__header {
    color: #000000;
    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .details-form {
    margin: 20px 10px 0 20px;
    /deep/.el-form-item__content {
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
    }
    /deep/.el-form-item {
      margin-bottom: 0;
    }
    /deep/.details-position{
      margin: 10px 0;
      .el-form-item__content {
        line-height: 20px;
      }
      .el-form-item__label {
        line-height: 20px;
      }
    }
    a:hover {
      color: #409EFF;
    }
  }
  .drawer-icon {
    text-align: center;
  }
  .drawer-icon-font /deep/.svg-icon {
    font-size: 8rem;
  }
  .list-item {
    height: 50px;
  }
  .table-file-name:hover {
    color: #19ACF9;
  }
  /deep/.plTableBox .el-table .el-table__header th {
    background-color: #FFFFFF;
  }
  /deep/.el-table td {
    height: 50px!important;
  }
  .home-link:hover {
    corlor: #409EFF;
  }
  .info-statistics{
    padding: 5px 0;
    float: right;
    width: 30%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    span{
      font-size: 12px;
      line-height: 16px;
      color: #666;
    }
  }
</style>

