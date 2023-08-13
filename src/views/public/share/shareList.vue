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
          <el-button v-if="loginTitle.length > 0" type="primary" size="small" @click="loginOrMount"> {{ loginTitle }} </el-button>
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
          <div class="search-class">
            <el-button v-if="indexList.length > 0" type="text" @click="downloadFile(false)" class="sort" title="下载">
              <svg-icon icon-class="menu-download"/>
            </el-button>
            <el-button type="text" class="vmode" @click="changeVmode">
              <svg-icon :icon-class="grid ? 'list' : 'grid'"/>
            </el-button>
          </div>
        </div>
      </el-breadcrumb>
    </div>

    <el-dialog :title="'挂载到：' + selectTreeNode.showName" :visible.sync="mountToVisible">
      <file-tree v-if="mountToVisible" :localFileMode="false" ref="fileTreeMount" @treeNodeClick="onTreeNodeClick"></file-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="fileTreeAndNewFolder" :disabled="fileTreeAndNewFolderDisabled"><i class="el-icon-folder-add"></i>&nbsp;&nbsp;新建文件夹</el-button>
        <el-button size="small" type="primary" @click="mountFolder">挂载</el-button>
      </div>
    </el-dialog>

    <!--右键菜单-->
    <e-vue-contextmenu ref="contextShow" class="newFileMenu" :class="menuTriangle" @ctx-show="show" @ctx-hide="hide">
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
    <el-table
      v-show="!grid && !linkFailed && !showShareCode"
      ref="fileListTable"
      v-loading="tableLoading"
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
            <el-col v-if="scope.row.index === editingIndex" :span="10">
              <el-input v-focus v-model="renameFileName" placeholder="" size="small" :clearable="true"
                        @keyup.enter.native="rowRename(renameFileName, scope.row)">
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

    <!--grid布局-->
    <div v-show="grid && !linkFailed && !showShareCode" v-loading="tableLoading"
         element-loading-text="文件加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="#f6f7fa88">
      <div class="checkbox-group-header">
        <van-checkbox class="grid-all-checkbox" @click="clickGridAllCheckBox()" v-model="allChecked">
          {{ indexList.length > 0 ? '已选择 ' + this.tableHead[2].label : "选择" }}
        </van-checkbox>
        <el-divider></el-divider>
      </div>

      <van-checkbox-group v-model="selectRowData" @change="handleSelectionChange" ref="checkboxGroup">
        <van-grid square :column-num="gridColumnNum" :gutter="10" :border="false">
          <van-grid-item v-for="(item,index) in fileList" ref="gridItem" :key="item.id"
          >
            <div class="grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                 :style="{'background': indexList.includes(index)?'#baebff91':'','cursor':indexList.length>0?'default':'pointer'}"
                 @mouseover="gridItemHover(item,index)"
                 @mouseout="gridItemOut(item,index)"
                 @click="gridItemClick(item,$event)"
                 @contextmenu.prevent="rowContextmenu(item)"
            >
              <van-checkbox v-show="gridHoverItemIndex === index || indexList.includes(index)"
                            class="grid-item-checkbox" :name="item" @click.stop="clickGridItemCheckBox(item,index)"/>
              <div class="grid-item-icon">
                <icon-file v-if="sharer" :item="item" :image-url="imageUrl" :audio-cover-url="audioUrl" :grid="true" :grid-width="gridColumnWidth"
                           :public="true"></icon-file>
              </div>
              <span class="grid-item-text">{{ item.name }}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </van-checkbox-group>
    </div>
    <div v-if="linkFailed && !showShareCode" class="share-header">
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
        <el-button type="primary" :disabled="extractionCode.length === 0" @click="validShareCode(extractionCode)">
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
    <office-preview :file="officePreviewRow" :shareId="shareId" :status.sync="officePreviewVisible"></office-preview>
    <el-divider v-if="!linkFailed && !showShareCode" class="grid-divider" content-position="center"><i
      class="el-icon-folder-opened"></i>&nbsp;{{ summaries }}
    </el-divider>
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
import {mapGetters} from 'vuex'
import {formatTime, formatSize} from '@/utils/number'
import Bus from '@/assets/js/bus'
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
import OfficePreview from "@/components/preview/OfficePreview";
import Logo from "@/components/Logo";
import store from "@/store";
import FileTree from "@/components/FileTree";

export default {
  components: {
    FileTree,
    Logo,
    OfficePreview, IconFile, BreadcrumbFilePath, AlLoading,
    AudioPreview, VideoPreview, ImageViewer, SimTextPreview
  },
  data() {
    return {
      prompt: '文件分享已被撤销',// 文件分享已被撤销
      isLoading: true,
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
        pageSize: 256,
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
        {iconClass: 'menu-fuzhi', label: '复制下载连接', operation: 'copyDownloadUrl'},
      ],
      singleMenusEdit: [
        {iconClass: 'menu-open', label: '打开', operation: 'open'},
        {iconClass: 'menu-download', label: '下载', operation: 'download'},
        {iconClass: 'menu-fuzhi', label: '复制下载连接', operation: 'copyDownloadUrl'},
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
      newFolderLoading: false,
      renameLoading: false,
      menuTriangle: '', // 三角菜单
      cellMouseIndex: -1,
      editingIndex: -1,
      dialogMoveOrCopyVisible: false,
      directoryTreeData: [],
      selectTreeNode: {},
      fileTreeAndNewFolderDisabled: false,
      directoryTreeProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf'
      },

      dragLoop: null,
      positionX: 0,
      positionY: 0,
      grid: false,
      vmode: 'list',
      gridColumnNum: -1,
      gridColumnWidth: 120,
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
      textPreviewVisible: false,
      textPreviewRow: {},
      imagePreviewRow: {},
      imagePreviewVisible: false,
      videoPreviewRow: {},
      videoPreviewVisible: false,
      officePreviewRow: {},
      officePreviewVisible: false,
      audioPreviewRow: {},
      audioPreviewVisible: false,
      showUpdateDateItem: this.$pc,// 列表模式下是否显示修改时间
      showSizeItem: this.$pc,// 列表模式下是否显示文件大小
      sharer: undefined,//分享者信息,
      loginTitle: '',
      sharerAvatarUrl: '',
      netdiskName: 'JmalCloud',
      netdiskLogo: '',
      showShareCode: false,
      shareData: {},
      extractionCode: '',
      mountToVisible: false,
      mountFileData: [],
    }
  },
  computed: {
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
  created() {
    this.getFileList()
    this.getSharer();
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
      that.loadClientHeight()
    }

    // 加载布局
    if (this.$route.query.vmode) {
      this.vmode = this.$route.query.vmode
      this.grid = this.vmode !== 'list';
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
    loadClientHeight() {
      this.clientHeight = document.documentElement.clientHeight - 200
    },
    gridItemHover(item, index) {
      this.gridHoverItemIndex = index;
      this.gridHoverIntermediate = index;
    },
    gridItemOut(item, index) {
      this.gridHoverIntermediate = -1
      const _this = this
      setTimeout(function () {
        if (_this.gridHoverIntermediate !== _this.gridHoverItemIndex) {
          _this.gridHoverItemIndex = -1;
        }
      }, 10)
    },
    clickGridItemCheckBox(item, index) {
      // 同步列表的checkbox
      if (this.indexList.includes(index)) {
        this.$refs.fileListTable.toggleRowSelection(item, true)
      }
    },
    clickGridAllCheckBox() {
      if (this.indexList.length !== this.fileList.length) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        this.$refs.checkboxGroup.toggleAll();
        this.$refs.fileListTable.clearSelection();
      }
    },
    gridItemClick(row, e) {
      const elPath = e.path || (e.composedPath && e.composedPath())
      let findIndex = elPath.findIndex(el => el.className === 'grid-item-checkbox van-checkbox')
      if (findIndex > -1) {
        return
      }
      if (this.indexList.length < 1) {
        if (row.index !== this.editingIndex) {
          this.fileClick(row)
          this.editingIndex = -1
        }
      } else {
        if (this.indexList.includes(row.index)) {
          this.$refs.fileListTable.toggleRowSelection(row, false)
        } else {
          this.$refs.fileListTable.toggleRowSelection(row, true)
        }
      }
    },
    containerResize() {
      let clientWidth = document.querySelector(".dashboard-container").clientWidth
      this.gridColumnNum = Math.round((clientWidth - 10) / 135)
      this.gridColumnWidth = (clientWidth - 11 * this.gridColumnNum) / this.gridColumnNum - 4.5
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
    handleLink(item, index) {
      if (index === 0) {
        this.pathList.splice(this.pathList.findIndex((v, i) => i === index + 1), this.pathList.length - (index + 1))
        this.getFileList(null, true);
        this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}`)
      }
      if (item && item.fileId) {
        this.accessShareOpenDir(item.fileId)
        this.pathList.splice(this.pathList.findIndex((v, i) => i === index + 1), this.pathList.length - (index + 1))
      }
    },
    // 切换布局
    changeVmode() {
      this.grid = !this.grid
      this.vmode = 'list'
      if (this.grid) {
        this.vmode = 'grid'
      }
      let f = ''
      this.$router.push(`/s?s=${this.shareId}&vmode=${this.vmode}`)
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
        this.loadClientHeight()
        this.listModeSearch = true
        this.pagination.fileId = fileId
        this.pagination['total'] = res.count
        this.$nextTick(() => {
          this.containerResize()
          this.tableLoading = false
          this.linkFailed = false
        })
      }).catch(e => {
      })
    },
    getFileList(pagination, overload) {
      this.tableLoading = true
      api.accessShare({
        share: this.shareId,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.isLoading = false
        if (Object.getPrototypeOf(res.data) === String.prototype) {
          this.prompt = '该链接已失效'
        } else {
          if (res.data.isPrivacy) {
            this.showShareCode = true
            this.shareData = res.data
          } else {
            this.fileList = res.data
            this.fileList.map((item, index) => {
              item.index = index
            })
          }
          if (this.fileList.length > 0 && !this.fileList[0].isPrivacy) {
            store.dispatch('user/resetShareToken').then(() => {
              this.loadShareFileList(pagination, overload, res.count)
            })
          } else {
            this.loadShareFileList(pagination, overload, res.count)
          }
        }
      }).catch(() => {
        this.tableLoading = false
        this.linkFailed = true
        this.isLoading = false
      })
    },
    loadShareFileList(pagination, overload, resCount) {
      this.loadClientHeight()
      this.listModeSearch = false
      this.listModeSearchOpenDir = false
      this.pagination['total'] = resCount
      this.$nextTick(() => {
        this.containerResize()
        this.tableLoading = false
        this.linkFailed = false
      })
      if (!pagination) {
        const pathList = this.fileList[0].path.split('/');
        this.currentDirName = pathList[pathList.length - 2]
      }
      this.$nextTick(() => {
        this.containerResize()
        this.tableLoading = false
        this.linkFailed = false
        if (!pagination) {
          // 打开文件夹
          const item = {}
          item['folder'] = this.currentDirName
          item['index'] = this.pathList.length
          if (!overload) {
            this.pathList.push(item)
          }
        }
      })
    },
    getSharer() {
      api.getSharer({shareId: this.shareId}).then(res => {
        this.sharer = res.data
        this.setLoginTitle()
        if (res.data) {
          this.sharerAvatarUrl = window.location.origin + this.imageUrl + res.data.avatar
          if (this.sharer.netdiskName) {
            this.netdiskName = this.sharer.netdiskName
          }
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
    currentChange(pageIndex) {
      this.pagination.pageIndex = pageIndex
      if (this.pagination.fileId) {
        this.accessShareOpenDir(this.pagination.fileId)
      } else {
        this.getFileList(true)
      }
    },
    getSummaries(param) {
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
      if (this.indexList.length === this.fileList.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
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
    // 动态添加index到row里面去
    tableRowClassName({row, rowIndex}) {
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
      if (this.editingIndex === -1) {
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
      if (this.editingIndex === -1) {
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
        const that = this
        // setTimeout(function () {
        //   that.selectTreeNode = that.$refs.directoryTree.getCurrentNode()
        //   that.selectTreeNode.showName = ' "' + that.selectTreeNode.name + '"'
        // }, 100)
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
    downloadFile(copy) {
      let totalSize = 0
      if (this.indexList.length > 0) {
        this.selectRowData.forEach(item => {
          totalSize += item.size
        })
      } else {
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
      } else {
        this.$message({
          message: '所选文件为空',
          type: 'warning'
        });
      }
    },
    // 复制下载连接
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
    // 点击文件或文件夹
    fileClick(row) {
      window.shareId = this.shareId
      if (row.isFolder) {
        // 打开文件夹
        const item = {}
        item['folder'] = row.name
        item['fileId'] = row.id
        item['index'] = this.pathList.length
        this.pathList.push(item)
        this.pagination.pageIndex = 1
        this.$router.push(`?s=${this.shareId}&vmode=${this.vmode}`)
        this.accessShareOpenDir(row.id)
      } else {
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
          Bus.$emit('onAddAudio', row, this.audioCoverUrl)
          return
        }
        // office文件
        if (row.contentType.indexOf('office') > -1 || ['pdf', 'csv', 'drawio', 'mind'].includes(row.suffix)) {
          // office文件
          this.officePreviewVisible = true
          this.officePreviewRow = row
          return
        }
        // 打开文件
        fileConfig.publicPreview(row, this.shareId, this.$store.getters.shareToken)
      }
    },
    /**
     * 验证提取码
     * @param shareCode 提取码
     */
    validShareCode(shareCode) {
      this.$store.dispatch('user/validShareCode', {shareId: this.shareId, shareCode: shareCode}).then(() => {
        this.showShareCode = false
        // 验证成功
        this.getFileList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/home-index";
/*.el-breadcrumb {*/
/*margin: 50px;*/
.dashboard-container {
  min-width: 1024px;
  margin: 10px 0;
}

.header-location {
  display: block;
  height: 1px;
  width: 100%;
  margin: 0px 0;
}

.search-class {
  padding: 3px;
}

.share-h {
  padding: 0 15px;
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

    > > > .el-avatar {
      margin: 0 0 0 10px;
    }

    .user {
      font-weight: 600;
    }
  }
}

> > > .el-table {
  &::before {
    width: auto;
  }

  .el-table__footer-wrapper {
    display: none;
  }
}

.grid-divider {
  height: 0;
  text-align: center;
  width: auto;

  > > > .el-divider__text {
  }

  > > > .el-divider__text.is-center {
    position: relative;
  }
}

.newFileMenu li > .menuitem > .text {
  margin-left: 10px;
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

  > > > .icon-favorite {
    display: none;
  }

  > > > .icon-share {
    display: none;
  }

  .share-icon-font > > > .svg-icon {
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

  > > > .el-button {
    width: 200px;
  }
}

.share-expire-date {
  color: #25262b5c;
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

