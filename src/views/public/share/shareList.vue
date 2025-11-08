<template>
  <div class="dashboard-container" v-resize="containerResize">
    <transition name="fade">
      <al-loading v-if="isLoading"></al-loading>
    </transition>
    <div class="share-h">
      <div class="share-header">
        <div class="share-header-content logo">
          <Logo v-model="netdiskLogo" width="35"></Logo>
          <span>{{ netdiskName }}</span>
        </div>
        <div class="share-header-content sharer" v-if="sharer && !showShareCode">
          <el-button round v-if="loginTitle.length > 0" type="primary" size="small" @click="loginOrMount"> {{ loginTitle }} </el-button>
          <span class="user">{{ sharer.showName }}的分享</span>
          <el-avatar :src="sharerAvatarUrl"></el-avatar>
        </div>
      </div>
      <el-divider class="header-location"></el-divider>
      <el-breadcrumb class="app-breadcrumb" separator="" v-if="!linkFailed">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item,index) in pathList" :key="item.index">
            <span v-if="index===0">当前位置:</span>
            <breadcrumb-file-path :pathList="pathList" :item="item" :index="index"
                                  @clickLink="handleLink"></breadcrumb-file-path>
          </el-breadcrumb-item>
        </transition-group>
        <div class="search-content">
          <div v-if="allowUpload">
            <el-button round size="mini" @click="refresh">刷新</el-button>
            <el-button round size="mini" type="primary" @click="upload">上传文件</el-button>
          </div>
          <div class="search-class">
            <el-button round v-if="indexList.length > 0" type="text" @click="downloadFile(false)" class="sort" title="下载">
              <svg-icon icon-class="menu-download"/>
            </el-button>
          </div>
        </div>
      </el-breadcrumb>
    </div>

    <el-dialog :title="'挂载到：' + selectTreeNode.showName" :visible.sync="mountToVisible">
      <file-tree v-if="mountToVisible" :localFileMode="false" ref="fileTreeMount" @treeNodeClick="onTreeNodeClick"></file-tree>
      <div slot="footer" class="dialog-footer">
        <el-button round size="small" @click="fileTreeAndNewFolder" :disabled="fileTreeAndNewFolderDisabled"><i class="el-icon-folder-add"></i>&nbsp;&nbsp;新建文件夹</el-button>
        <el-button round size="small" type="primary" @click="mountFolder">挂载</el-button>
      </div>
    </el-dialog>

    <!--右键菜单-->
    <e-vue-contextmenu ref="contextShow" class="newFileMenu" @ctx-show="show" @ctx-hide="hide">
      <div class="popper-arrow"></div>
      <ul v-for="item in menus" :key="item.label">
        <li class="menu-option" @click="menusOperations(item.operation)">
          <label class="menuitem">
            <svg-icon :icon-class="item.iconClass"/>
            <span class="menuitem text">{{ item.label }}</span>
          </label>

        </li>
      </ul>
    </e-vue-contextmenu>

    <!--list布局-->
    <div>
      <el-table
        v-show="!linkFailed && !showShareCode"
        ref="fileListTable"
        v-loading="tableLoading"
        style="width: 100%;"
        empty-text="无文件"
        :data="fileList"
        stripe
        :height="clientHeight"
        :summary-method="getSummaries"
        show-summary
        :cell-style="rowRed"
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
              <icon-file v-if="sharer" :item="scope.row" :image-url="imageUrl" :audio-cover-url="audioUrl" :public="true"></icon-file>
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
            :sortable="item.sortable"
            @click.stop="fileClick(scope.row)"
          >
            <template slot-scope="scope">
              <span class="table-file-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="index === 3  && showUpdateDateItem" :key="index" width="50" :index="index" align="center"
                           header-align="center">
          </el-table-column>

          <el-table-column v-if="index === 4 && showUpdateDateItem" :key="index" width="50" :prop="item.name"
                           :label="item.label" :index="index" class="el-icon-more" align="center" header-align="center">
            <!-- 使用组件, 并传值到组件中 -->
            <template slot="header">
              <svg-icon v-if="item.name !== ''" class="button-class" icon-class="more" @click="moreOperation($event)"/>
            </template>
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.index === cellMouseIndex" class="button-class" icon-class="more"
                        @click="moreClick(scope.row,$event)"/>
            </template>
          </el-table-column>

          <el-table-column
            v-if="index === 5 && showSizeItem"
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
              <span>{{ formatSize(scope.row.size) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="index === 6 && showUpdateDateItem"
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
              <span>{{ scope.row.updateDate }}</span>
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
    </div>

    <div v-if="linkFailed && !showShareCode" class="share-header-prompt">
      <p v-if="prompt !== ''">温馨提示：</p>
      <p>{{ prompt }}</p>
    </div>

    <div v-if="showShareCode" class="share-content">
      <div class="share-icon">
        <icon-file v-if="sharer" class="share-icon-font" :item="shareData" :grid="true" :details="true"
                   :image-url="imageUrl" :audio-cover-url="audioUrl"></icon-file>
      </div>
      <div class="share-filename">
        <span>{{ shareData.fileName }}</span>
      </div>
      <div class="share-code">
        <el-input v-model="extractionCode" placeholder="请输入提取码" clearable
                  @keyup.enter.native="validShareCode(extractionCode)"></el-input>
      </div>
      <div class="share-code-valid">
        <el-button round type="primary" :disabled="extractionCode.length === 0" @click="validShareCode(extractionCode)">
          查看文件
        </el-button>
      </div>
      <div class="share-expire-date">
        <span>{{shareData.expireDate ? "到期时间：" + shareData.expireDate : "永久有效"}}</span>
      </div>
    </div>

    <sim-text-preview :file.sync="textPreviewRow" :shareId="shareId"
                      :status.sync="textPreviewVisible"></sim-text-preview>
    <image-viewer :fileList="fileList" :shareId="shareId" :file="imagePreviewRow"
                  :status.sync="imagePreviewVisible"></image-viewer>
    <video-preview :file="videoPreviewRow" :shareId="shareId" :status.sync="videoPreviewVisible"></video-preview>
    <iframe-preview
      :file="iframePreviewRow"
      :fileHandler="fileHandler"
      :shareId="shareId"
      :sharer="sharerUsername"
      :status.sync="iframePreviewVisible"
    ></iframe-preview>

    <div v-if="!linkFailed && !showShareCode" class="file-summaries">
      <div>
        <i class="el-icon-folder-opened"></i>&nbsp;{{ summaries }}
      </div>
    </div>

    <message-dialog
      title="提示"
      content="此文件不支持预览, 是否下载该文件?"
      :show.sync="notPreviewDialogVisible"
      button-size="mini"
      operatButtonText="取消"
      confirmButtonText="下载"
      @operating="notPreviewDialogVisible = false"
      @confirm="determineDownload(openingFile)"
    >
    </message-dialog>

    <global-uploader v-if="allowUpload" public-api></global-uploader>

  </div>

</template>

<script>
import MessageDialog from '@/components/message/MessageDialog.vue'
import GlobalUploader from '@/components/SimpleUploader/globalUploader.vue'
import {mapGetters,mapState} from 'vuex'
import {formatTime, formatSize} from '@/utils/number'
import api from '@/api/file-api'
import BreadcrumbFilePath from "@/components/Breadcrumb/BreadcrumbFilePath";
import IconFile from "@/components/Icon/IconFile";
import AlLoading from "@/components/loading/AlLoading";

import {suffix} from '@/utils/file-type'

import SimTextPreview from "@/components/preview/SimTextPreview";
import ImageViewer from "@/components/preview/ImageViewer";
import VideoPreview from "@/components/preview/VideoPreview";
import AudioPreview from "@/components/preview/AudioPreview";
import fileConfig from "@/utils/file-config";
import Clipboard from "clipboard";
import IframePreview from "@/components/preview/IframePreview.vue";
import Logo from "@/components/Logo";
import store from "@/store";
import FileTree from "@/components/FileTree";

export default {
  components: {
    MessageDialog,
    GlobalUploader,
    FileTree,
    Logo,
    IframePreview, IconFile, BreadcrumbFilePath, AlLoading,
    AudioPreview, VideoPreview, ImageViewer, SimTextPreview
  },
  data() {
    return {
      prompt: '文件分享已被撤销',// 文件分享已被撤销
      isLoading: true,
      path: this.$route.query.path,
      showNewFolder: false,
      isShowNewFolder: false,
      newFolderName: '新建文件夹',
      renameFileName: '',
      searchFileName: '',
      pathList: [],
      fileList: [],
      pagination: {
        fileId: false,
        pageIndex: 1,
        pageSize: 128,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50]
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
        {iconClass: 'menu-open', label: '打开', operation: 'open'},
        {iconClass: 'menu-download', label: '下载', operation: 'download'},
        {iconClass: 'menu-fuzhi', label: '复制下载链接', operation: 'copyDownloadUrl'},
      ],
      singleMenusEdit: [
        {iconClass: 'menu-open', label: '打开', operation: 'open'},
        {iconClass: 'menu-download', label: '下载', operation: 'download'},
        {iconClass: 'menu-fuzhi', label: '复制下载链接', operation: 'copyDownloadUrl'},
      ],
      multipleMenus: [
        {iconClass: 'menu-download', label: '下载', operation: 'download'},
      ],
      multipleRightMenus: [
        {iconClass: 'menu-download', label: '下载', operation: 'download'},
      ],
      rowContextData: {},
      selectRowData: [],
      tableLoading: false,
      cellMouseIndex: -1,
      selectTreeNode: {},
      fileTreeAndNewFolderDisabled: false,
      summaries: '',
      shareId: '',
      shortId: this.$route.params.id,
      currentDirName: '',
      linkFailed: true,
      textPreviewVisible: false,
      textPreviewRow: {},
      imagePreviewRow: {},
      imagePreviewVisible: false,
      videoPreviewRow: {},
      videoPreviewVisible: false,
      iframePreviewRow: {},
      iframePreviewVisible: false,
      fileHandler: {},
      showUpdateDateItem: this.$pc,// 列表模式下是否显示修改时间
      showSizeItem: this.$pc,// 列表模式下是否显示文件大小
      sharer: undefined,//分享者信息,
      sharerUsername: undefined,
      loginTitle: '',
      sharerAvatarUrl: '',
      netdiskName: 'JmalCloud',
      netdiskLogo: '',
      iframePreviewConfig: '',
      showShareCode: false,
      shareData: {},
      extractionCode: '',
      mountToVisible: false,
      mountFileData: [],
      notPreviewDialogVisible: false,
      openingFile: null,
      allowUpload: false
    }
  },
  computed: {
    ...mapState(['message']),
    ...mapGetters([
      'name'
    ]),
    netdiskLogo() {
      if (this.$store.state.user.netdiskLogo) {
        return this.$store.state.user.netdiskLogo
      }
      return ''
    },
    imageUrl() {
      return this.$store.getters.shareToken === undefined ?
        `${process.env.VUE_APP_BASE_API}/public/s/view/thumbnail?id=` :
        `${process.env.VUE_APP_BASE_API}/public/s/view/thumbnail?share-token=${this.$store.getters.shareToken}&id=`
    },
    audioUrl() {
      return this.$store.getters.shareToken === undefined ?
        `${process.env.VUE_APP_BASE_API}/public/s/view/cover?name=${this.sharer.username}&id=` :
        `${process.env.VUE_APP_BASE_API}/public/s/view/cover?name=${this.sharer.username}&share-token=${this.$store.getters.shareToken}&id=`
    }
  },
  watch: {
    message(msg) {
      switch (msg.event) {
        case 'fileSuccess':
          this.refresh();
          break;
        case 'clickMore':
          this.selectRowData = msg.data;
          this.preliminaryRowData();
          break;
        case 'getUploadParams':
          // 接收到 getUploadParams 事件，分发 onUploadParams 事件，携带上传参数
          this.$store.dispatch('updateMessage', {
            event: 'onUploadParams',
            data: this.getUploadParams(),
          });
          break;
        default:
          break;
      }
    }
  },
  created() {
    this.getFileList()
    this.getSharer();
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
    const that = this
    window.onresize = function temp() {
      that.loadClientHeight()
    }
    // 加载提取码
    if (this.$route.query.code) {
      this.extractionCode = this.$route.query.code
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false)
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
    getUploadParams() {
      return {
        publicApi: true,
        fileId: this.pagination.fileId ? this.pagination.fileId : '',
      }
    },
    loadClientHeight() {
      this.clientHeight = document.documentElement.clientHeight - 220
    },
    containerResize() {
      this.loadClientHeight()
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
    goBack() {
      const linkIndex = this.pathList.length - 3
      this.handleLink(this.pathList[linkIndex], linkIndex)
    },
    /**
     * 处理面包屑导航点击
     */
    handleLink(item, index) {
      if (index === 0) {
        // 点击根目录
        this.pathList.splice(1)
        this.pagination.pageIndex = 1
        this.getFileList(true) // 保持路径
        this.pushRouter()
      } else if (item && item.fileId) {
        // 点击其他层级
        this.pathList.splice(index + 1)
        this.pagination.pageIndex = 1
        this.accessShareOpenDir(item.fileId)
      }
    },
    /**
     * 刷新当前目录
     */
    refresh() {
      this.$refs.fileListTable.clearSelection()
      this.$refs.fileListTable.doLayout()

      // 根据当前是否在子目录决定调用哪个方法
      if (this.pagination.fileId) {
        this.loadFileList(this.pagination.fileId, false)
      } else {
        this.loadFileList(null, false)
      }
    },
    upload() {
      // 打开文件选择框
      this.$store.dispatch('updateMessage', {event: 'openUploader'})
    },
    /**
     * 统一的文件列表加载方法
     * @param {String} fileId - 文件夹ID，null表示根目录
     * @param {Boolean} resetPath - 是否重置路径
     */
    loadFileList(fileId = null, resetPath = false) {
      this.tableLoading = true

      const apiCall = fileId
        ? api.accessShareOpenDir({
          share: this.shareId,
          fileId: fileId,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
        })
        : api.accessShare({
          share: this.shortId,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
        })

      apiCall.then(res => {
        this.isLoading = false

        // 处理错误情况
        if (Object.getPrototypeOf(res.data) === String.prototype) {
          this.prompt = '该链接已失效'
          this.linkFailed = true
          return
        }

        // 处理加密分享
        if (res.data.isPrivacy) {
          this.showShareCode = true
          this.shareData = res.data
          return
        }

        // 设置文件列表
        this.fileList = res.data
        this.fileList.forEach((item, index) => {
          item.index = index
        })

        // 更新分页信息
        this.pagination.total = res.count
        this.pagination.fileId = fileId

        const isPrivacy = this.fileList.length > 0 ? this.fileList[0].isPrivacy : false
        this.allowUpload = isPrivacy && this.fileList[0].operationPermissionList.includes('UPLOAD')

        // 重置 share token（仅在非加密分享时）
        if (this.fileList.length > 0 && !isPrivacy) {
          return store.dispatch('user/resetShareToken')
        }
      }).then(() => {
        // 初始化路径列表
        if (resetPath && this.fileList.length > 0) {
          const pathList = this.fileList[0].path.split('/')
          this.currentDirName = pathList[pathList.length - 2]
          this.pathList = [{
            folder: this.currentDirName,
            index: 0
          }]
        }

        // 更新UI
        this.loadClientHeight()
        this.$nextTick(() => {
          if (this.$refs.fileListTable) {
            this.$refs.fileListTable.doLayout()
          }
          this.containerResize()
          this.tableLoading = false
          this.linkFailed = false
        })
      }).catch(() => {
        this.tableLoading = false
        this.linkFailed = true
        this.isLoading = false
      })
    },
    /**
     * 获取根目录文件列表
     */
    getFileList(keepPath = false) {
      // keepPath 为 true 时保持当前路径不变
      this.loadFileList(null, !keepPath)
    },
    /**
     * 打开指定文件夹
     */
    accessShareOpenDir(fileId) {
      this.loadFileList(fileId, false)
    },
    getSharer() {
      api.getSharer({shareId: this.shortId}).then(res => {
        this.sharer = res.data
        this.setLoginTitle()
        if (res.data) {
          this.shareId = res.data.shareId
          this.sharerAvatarUrl = window.location.origin + this.imageUrl + res.data.avatar
          if (this.sharer.netdiskName) {
            this.netdiskName = this.sharer.netdiskName
          }
          if (this.sharer.iframe) {
            this.iframePreviewConfig = JSON.parse(this.sharer.iframe)
          }
          this.sharerUsername = this.sharer.username
          if (this.sharer.netdiskLogo) {
            this.netdiskLogo = this.sharer.netdiskLogo
          }

          this.audioUrl = `${process.env.VUE_APP_BASE_API}/public/s/view/cover?name=${this.sharer.username}&id=`

          this.$store.dispatch('user/setLogo', {netdiskName: this.netdiskName, netdiskLogo: this.netdiskLogo})
        }
      })
    },
    setLoginTitle() {
      if (this.$store.getters.token) {
        if (this.sharer.userId === this.$store.getters.userId) {
          this.loginTitle = ''
        } else {
          this.loginTitle = '挂载到我的云盘'
        }
      } else {
        this.loginTitle = '登录'
      }
    },
    /**
     * 分页切换
     */
    currentChange(pageIndex) {
      this.pagination.pageIndex = pageIndex
      if (this.pagination.fileId) {
        this.loadFileList(this.pagination.fileId, false)
      } else {
        this.loadFileList(null, false)
      }
    },
    getSummaries() {
      // 合计
      const sums = []
      sums[2] = this.getShowSumFileAndFolder(this.fileList)
      this.summaries = sums[2]
      return sums
    },
    // 统计文件和文件夹大小
    getShowSumFileAndFolder(fileList) {
      let folderSize = 0
      let fileSize = 0
      let totalSize = 0
      fileList.forEach((fileInfo) => {
        if (fileInfo.isFolder) {
          folderSize += 1
        } else {
          fileSize += 1
        }
        totalSize += fileInfo.size
      })
      let folderSum = ''
      if (folderSize > 0) {
        folderSum = folderSize + '个文件夹'
      }
      let fileSum = ''
      if (fileSize > 0) {
        fileSum = fileSize + '个文件'
      }
      return folderSum + ' ' + fileSum + this.getShowSumSize(totalSize)
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
        this.$refs.fileListTable.toggleRowSelection(r, true)
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
        this.rowContextData = row[0]
      } else {
        item_name.label = '名称'
        item_name.sortable = true
        item_more.name = ''
        item_size.label = '大小'
        item_size.sortable = true
        item_date.label = '修改日期'
        item_date.sortable = true
      }
    },
    // cell-style 通过返回值可以实现样式变换利用传递过来的数组index循环改变样式
    rowRed({row, column, rowIndex, columnIndex}) {
      if (this.indexList.length < 1 && columnIndex === 2 && this.cellMouseIndex === rowIndex) {
        return {cursor: 'pointer', color: "#19ACF9"}
      }
      for (let i = 0; i < this.indexList.length; i++) {
        if (rowIndex === this.indexList[i]) {
          return {backgroundColor: '#baebff91', cursor: 'default'}
        }
      }
    },
    // 选择某行预备数据
    preliminaryRowData(row) {
      if (row) {
        this.rowContextData = row
      }
    },
    // 单元格hover进入时时间
    cellMouseEnter(row) {
      if (this.indexList.length < 1) {
        this.cellMouseIndex = row.index
      }
    },
    // 单元格hover退出时时间
    cellMouseLeave() {
      this.cellMouseIndex = -1
    },
    // 单元格点击事件
    cellClick(row, column) {
      clearTimeout(this.Loop);
      const columnIndex = column.index
      if (columnIndex === 0) {
        // 点击选中
        this.$refs.fileListTable.toggleRowSelection(row)
      }
      if (columnIndex === 2) {
        if (this.indexList.length < 1) {
          this.fileClick(row)
        }
      }
      if (columnIndex === 4) {
        // // 单个操作
      }
      if (this.indexList.length > 0 && columnIndex > 0) {
        this.$refs.fileListTable.toggleRowSelection(row)
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
      if (row.contentType && row.contentType.includes("text")) {
        this.menus = this.singleMenusEdit
      } else {
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
        if (row.contentType && row.contentType.includes("text")) {
          this.menus = this.singleMenusEdit
        } else {
          this.menus = this.singleMenus
        }
        this.preliminaryRowData(row)
      }
      event.preventDefault()
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
      if (event.clientY < 400) {
        e.pageX = event.pageX - 78
        e.pageY = event.pageY + 20
        e.clientX = event.clientX + 78
        e.clientY = event.clientY + 20
      } else {
        e.pageX = event.pageX - 78
        e.pageY = event.pageY - 140
        e.clientX = event.clientX + 78
        e.clientY = event.clientY - 140
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
      setTimeout(function () {
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
        case 'copyDownloadUrl':
          this.downloadFile(true)
          break
      }
      this.$refs.contextShow.hideMenu()
    },
    /**
     * 登录或挂载
     */
    loginOrMount() {
      if (this.$store.getters.token) {
        // 挂载
        this.mountToVisible = true
      } else {
        // 登录
        this.$router.push({path: '/login', query: {redirect: this.$route.fullPath}})
      }
    },
    /**
     * 挂载操作
     */
    mountFolder() {
      api.mountFolder({
        userId: this.$store.getters.userId,
        shareId: this.shareId,
        fileId: this.selectTreeNode.id
      }).then(() => {
        this.$message.success("挂载成功")
        this.mountToVisible = false
      })
    },
    fileTreeAndNewFolder() {
      this.$refs.fileTreeMount.fileTreeAndNewFolder(this.selectTreeNode)
    },
    onTreeNodeClick(row) {
      this.fileTreeAndNewFolderDisabled = row.hasOwnProperty('newFolder');
      this.selectTreeNode = row
      this.selectTreeNode.showName = ' "' + row.name + '"'
    },
    determineDownload(file) {
      fileConfig.publicDownload(this.shareId, file, this.$store.getters.shareToken)
      this.notPreviewDialogVisible = false
    },
    downloadFile(copy) {
      let fileIds = [];
      if (this.menusIsMultiple) {
        this.selectRowData.forEach(value => {
          fileIds.push(value.id)
        })
      } else {
        fileIds.push(this.rowContextData.id)
      }
      if (fileIds.length > 1 || this.rowContextData.isFolder) {
        if (copy) {
          this.copyDownloadLink(fileConfig.publicPackageDownloadUrl(this.shareId, fileIds, this.$store.getters.shareToken))
        } else {
          fileConfig.publicPackageDownload(this.shareId, fileIds, this.$store.getters.shareToken)
        }
        return
      }
      if (copy) {
        if (this.rowContextData.isShare) {
          this.copyDownloadLink(window.location.origin + fileConfig.previewUrl(this.sharer.username, this.rowContextData, undefined, this.$store.getters.shareToken))
        } else {
          this.copyDownloadLink(fileConfig.publicPackageDownloadUrl(this.shareId, fileIds, this.$store.getters.shareToken))
        }
      } else {
        fileConfig.publicDownload(this.shareId, this.rowContextData, this.$store.getters.shareToken)
      }
    },
    // 复制下载链接
    copyDownloadLink(url) {
      let clipboard = new Clipboard('.menu-option', {
        text: function () {
          return url
        }
      })
      clipboard.on('success', e => {
        this.$message({message: '复制成功', type: 'success', duration: 1000});
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({message: '该浏览器不支持自动复制', type: 'warning', duration: 1000});
        clipboard.destroy()
      })
    },
    pushRouter() {
      this.$router.push(`/s/${this.shortId}`)
    },
    // 点击文件或文件夹
    fileClick(row) {
      window.shareId = this.shareId
      this.openingFile = row

      if (row.isFolder) {
        // 打开文件夹
        const item = {
          folder: row.name,
          fileId: row.id,
          index: this.pathList.length
        }
        this.pathList.push(item)
        this.pagination.pageIndex = 1
        this.pushRouter()
        this.accessShareOpenDir(row.id)
        return
      }
      const fileHandler = fileConfig.hasIframePreview(row.suffix, this.iframePreviewConfig)
      if (fileHandler !== null) {
        // iframe 预览
        this.iframePreviewVisible = true
        this.iframePreviewRow = row
        this.fileHandler = fileHandler
        return
      }
      if (row.contentType.startsWith('image')) {
        // 图片
        this.imagePreviewVisible = true
        this.imagePreviewRow = row
        return
      }
      if (suffix.simText.includes(row.suffix)) {
        // 文本文件
        this.textPreviewRow = row
        this.textPreviewVisible = true
        return
      }
      if (row.contentType.indexOf('video') > -1) {
        // 视频文件
        this.videoPreviewVisible = true
        this.videoPreviewRow = row
        return
      }
      // 音频文件
      if (row.contentType.indexOf('audio') > -1) {
        this.$store.dispatch('updateMessage', { event: 'onAddAudio', data: { row: row, audioCoverUrl: this.audioCoverUrl } })
        return
      }
      // office文件
      if (row.contentType.indexOf('office') > -1 || suffix.iframePreviewFile.includes(row.suffix)) {
        // office文件
        this.iframePreviewVisible = true
        this.iframePreviewRow = row
        return
      }
      this.notPreviewDialogVisible = true
    },
    /**
     * 验证提取码
     */
    validShareCode(shareCode) {
      this.$store.dispatch('user/validShareCode', {
        shareId: this.shareId,
        shareCode: shareCode
      }).then(() => {
        this.showShareCode = false
        this.getFileList(false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/index';
@import 'src/styles/home-index';

@import "src/styles/element-ui";

>>> .ctx-menu-container {
  background-color: var(--vcontextmenu-bg-color);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  backdrop-filter: blur(16px) saturate(180%);
  min-width: unset !important;
  border-radius: $dialogBorderRadius !important;

  border: 1px solid var(--vcontextmenu-border-color);
  box-shadow: var(--v-contextmenu-box-shadow);

  color: var(--text-color);

  .menu-option {
    margin: 0 5px;
    padding: 0 10px;
  }

  li {
    &:hover {
      background-color: var(--vcontextmenu-hover-bg-color);
      color: var(--text-color-hover);
    }
  }

}

.search-content {
  display: flex;
  justify-content: space-between;
}

/*.el-breadcrumb {*/
/*margin: 50px;*/
.dashboard-container {
  margin: 0;
  padding: 1rem 1rem;
}

.header-location {
  display: block;
  height: 1px;
  width: 100%;
  margin: 0;
}

.search-class {
  padding: 3px;
}

.share-h {
  height: 100px;
}

.share-header-prompt {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}

.share-header {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-content: space-between;

  .logo {
    font-size: 20px;
  }

  .share-header-content {
    display: flex;
    align-items: center;

    svg {
      font-size: 2rem;
    }

    span {
      margin-left: 10px;
    }
  }

  .sharer {
    font-size: 14px;
    float: right;
    top: 10px;

    >>> .el-avatar {
      margin: 0 0 0 10px;
    }

    .user {
      font-weight: 600;
    }
  }
}

>>> .el-table {
  &::before {
    width: auto;
  }

  .el-table__footer-wrapper {
    display: none;
  }
}

>>> .el-pagination {
  margin: 0;
  float: right;
}

.file-summaries {
  color: var(--text-color);
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.share-content {
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-align: center;
  align-items: center;
}

.share-icon {
  margin: 20px 0 20px 0;
  position: relative;

  >>> .icon-favorite {
    display: none;
  }

  >>> .icon-share {
    display: none;
  }

  .share-icon-font >>> .svg-icon {
    font-size: 7.6rem;
  }
}

.share-filename {
  margin: 25px 0 50px 0;
}

.share-code {
  text-align: center;
  >>>.el-input {
    width: 200px;
    .el-input__inner {
      text-align: center;
    }
    ::placeholder {
      text-align: center;
    }
    input:-moz-placeholder {
      text-align: center;
    }
    input::-webkit-input-placeholder {
      text-align: center;
    }
  }

}

.share-code-valid {
  margin-top: 20px;

  >>> .el-button {
    width: 200px;
  }
}

.share-expire-date {
  color: var(--text-color);
  font-size: 12px;
  margin-top: 10px;
}

>>> .el-input-tree {
  width: 50% !important;
}

>>> .el-input-tree-button {
  margin-left: 5px !important;
}

</style>

