<template>
  <div class="container" v-resize="containerResize">
    <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
    <!--左侧菜单-->
    <van-popup v-model="leftMenuShow" get-container="body" position="left" :style="{ height: '100%', width: '35%'}">
      <div class="left-menu">
        <div class="avatar">
          <van-image
            round
            width="5rem"
            height="5rem"
            fit="cover"
            :src="imageUrl+avatar"
          />
        </div>
        <span>{{ name }}</span>

        <div class="classification">
          <van-cell :title="$t('route.home')" icon="wap-home-o" @click="clickFileType(null,{})"/>
          <van-cell :title="$t('route.favorite')" icon="star-o" @click="clickFileType(null,{isFavorite: true})"/>
          <van-cell :title="$t('route.image')" icon="photo-o" @click="clickFileType('image',{isFolder: false})"/>
          <van-cell :title="$t('route.video')" icon="video-o" @click="clickFileType('video',{isFolder: false})"/>
          <van-cell :title="$t('route.audio')" icon="music-o" @click="clickFileType('audio',{isFolder: false})"/>
          <van-cell :title="$t('route.fileTransfer')" icon="upgrade" @click="uploadList"/>
        </div>

        <div class="logout">
          <van-button round type="danger" @click.native="logout">{{ $t('login.logout') }}</van-button>
        </div>
      </div>
    </van-popup>

    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="statistics()"
      @load="getFileList(true)"
    >
      <van-checkbox-group v-model="selectRowData" @change="checkboxChange" ref="checkboxGroup">
        <van-cell-group>
          <van-sticky :offset-top="-1">
            <!-- <div>{{test}} {{diffTabbarTop}} {{lastTabbarOffsetTop}}</div> -->
            <van-nav-bar
              :style="vanNavBarClass"
              v-if="pathList.length < 2 && !selectStatus"
              :title="$t('app.browse')"
              right-arrow
              @click-right="checkboxAll"
              :right-text="this.selectRowData.length !== this.fileList.length ? $t('common.select') : $t('common.cancel')"
              @click-left="leftMenu"
              left-arrow>

              <hamburger class="header-button" slot="left"/>

            </van-nav-bar>
            <van-nav-bar
              :style="vanNavBarClass"
              v-if="selectStatus"
              :title="selectRowData.length === 0 ? $t('app.selectItem') : selectRowData.length + $t('common.item')"
              right-arrow
              :left-text="this.selectRowData.length !== this.fileList.length ? $t('app.selectAll') : $t('app.cancelSelectAll')"
              @click-left="checkboxAll"
              @click-right="cancelSelect"
              right-text="完成"
            >
            </van-nav-bar>
            <van-nav-bar
              :style="vanNavBarClass"
              v-if="pathList.length >= 2 && !selectStatus"
              :title="pathList[pathList.length-1].folder"
              :right-text="this.selectRowData.length !== this.fileList.length ? $t('common.select') : $t('common.cancel')"
              left-arrow
              @click-right="checkboxAll"
              @click-left="clickBack">
              <div class="header-button" slot="left">
                <van-icon name="arrow-left"/>
              </div>
            </van-nav-bar>
            <div class="searchbar" :style="searchBarClass">
              <van-search
                ref="search"
                v-model="searchValue"
                :show-action="searchStatus"
                shape="round"
                :placeholder="$t('common.search')"
                @focus="startSearch"
                @search="onSearch"
                @input="onSearch"
              >
                <div slot="action" @click="endSearch">{{ $t('common.cancel') }}</div>
              </van-search>
            </div>
          </van-sticky>

          <!--操作-->
          <van-cell :center="true" style="padding: 0 0 10px 0;">
            <div class="operating-header">
              <van-row>
                <van-col class="operating-header-col" span="4" align="center" type="flex" @click="moreOperations">
                  <van-icon name="more-o"/>
                </van-col>
                <van-col class="operating-header-col" span="16" align="center" @click="showSortSheet">
                  已按{{ actionsSortName }}排序
                  <van-icon class="sortable" :name="'arrow-'+sortOrder"/>
                </van-col>
                <van-col class="operating-header-col" span="4" align="center" @click="changeVmode">
                  <van-icon name="bars"
                            :style="!grid?{background:'#1989fa',color:'#ffffff',padding:'0 5px',borderRadius: '5px'}:{}"/>
                </van-col>
              </van-row>
            </div>
          </van-cell>

          <!--搜索结果-->
          <van-cell v-if="searchStatus && searchValue.length > 0 && fileList.length > 0"
                    style="background-color:var(--setting-bg);">
            <div class="search-result">{{ resultCount }}个结果</div>
          </van-cell>
          <van-cell v-if="searchStatus && searchValue.length > 0 && fileList.length === 0">
            <div class="search-result-no">无结果</div>
          </van-cell>

          <!--空状态-->
          <van-empty v-if="!loading && fileList.length === 0" description="空空如也"/>

          <van-cell v-if="!grid" class="list-item"
                    :style="{'background': selectIndexList.includes(index) ? '#90c2fcb5' : ''}" center
                    v-for="(item,index) in fileList" :key="item.id" @click="fileClick(item,index)"
                    :is-link="item.isFolder">
            <div class="list-item-div" @touchstart="touchStart(item)" @touchend="touchEnd" @touchmove="touchMove">
              <van-row class="row-file">
                <van-col span="4" align="center" class="list-cell-icon">
                  <icon-file :item="item" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></icon-file>
                </van-col>
                <van-col span="16" class="list-item-content">
                  <van-col span="24">
                    {{ item.name }}
                  </van-col>
                  <van-col span="24" class="file-description" justify="space-between">
                    <van-col span="24">
                      {{ formatTime(item.agoTime) }}&nbsp;&nbsp;&nbsp;{{ formatSize(item.size) }}
                    </van-col>
                  </van-col>
                </van-col>
                <van-col span="4">

                </van-col>
              </van-row>
            </div>
            <van-checkbox class="file-item-checkbox" v-if="!grid && selectStatus" slot="right-icon" :name="item" ref="checkboxes"></van-checkbox>
          </van-cell>

          <van-grid v-if="grid" square :center="true" :column-num="gridColumnNum" :gutter="10" :border="false"
                    :style="{'width':'100%','overflow':'auto'}">
            <van-grid-item class="parent-grid-item" v-for="(item,index) in fileList" ref="gridItem" :key="item.id"
                           @click="fileClick(item,index)">
              <div
                class="grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                :style="{'background': selectIndexList.includes(index) ? '#90c2fcb5' : '', 'border-radius': '15px'}"
                @touchstart="touchStart(item)" @touchend="touchEnd" @touchmove="touchMove">
                <van-checkbox  class="file-item-checkbox" v-if="grid && selectStatus" slot="right-icon" :name="item" ref="checkboxes"></van-checkbox>
                <div class="grid-item-icon">
                  <icon-file :item="item" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"
                             :grid="true"></icon-file>
                </div>
                <span :title="item.name" class="grid-item-text">{{ item.name }}</span>
              </div>
            </van-grid-item>
          </van-grid>

        </van-cell-group>
      </van-checkbox-group>

    </van-list>
    <!-- </van-pull-refresh> -->

    <!--选择上传文件菜单-->
    <van-action-sheet
      v-model="actionSheetShow"
      :actions="actionsMenus"
      cancel-text="取消"
      @cancel="onCancel"
      @select="selectActionsMenus">
    </van-action-sheet>

    <!--排序菜单-->
    <van-action-sheet
      v-model="actionSortSheetShow"
      :actions="actionsSortMenus"
      cancel-text="取消"
      description="排序方式"
      @cancel="onCancel"
      @select="selectSortActionsMenus">
    </van-action-sheet>

    <van-dialog v-model="showNewFolder" show-cancel-button @confirm="newFolderNameClick">
      <van-field class="new-folder-input" v-model="newFolderName" placeholder="请输入文件夹名称" :border="true"
                 :clearable="true" ref="newFolderInput" :autofocus="true">
      </van-field>
    </van-dialog>

    <van-dialog v-model="showRename" show-cancel-button @confirm="rowRename()">
      <van-field class="rename-input" v-model="renameFileName" placeholder="请输入文件名称" :border="true" :clearable="true"
                 ref="renameInput" :autofocus="true">
      </van-field>
    </van-dialog>

    <e-vue-contextmenu ref="contextShow" class="newFileMenu" @ctx-show="show" @ctx-hide="hide">
      <ul v-for="(item,index) in menus" :key="item.label" class="menu-list">
        <div v-if="index !== 0" style="border-bottom:1px solid var(--menu-hover)"></div>
        <li :class="{'remove':item.operation==='remove'}" @click="menusOperations(item.operation)">
          <div class="menuitem">
            <svg-icon :icon-class="item.iconClass"/>
            <span class="menuitem text">{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </e-vue-contextmenu>

    <van-overlay ref="overlayShow" :show="overlayShow" duration="0.3" @click="overlayClick">
      <van-cell v-if="rowContextData.name!=null && !grid" :style="overlayContentClass"
                class="list-item overlay-content-class" center :is-link="rowContextData.isFolder">
        <div>
          <van-row class="row-file">
            <van-col span="4" align="center" class="list-cell-icon">
              <icon-file :item="rowContextData" :image-url="imageUrl"></icon-file>
            </van-col>
            <van-col span="16" class="list-item-content">
              <van-col span="24">
                {{ rowContextData.name }}
              </van-col>
              <van-col span="24" class="file-description" justify="space-between">
                <van-col span="24">
                  {{ formatTime(rowContextData.agoTime) }}&nbsp;&nbsp;&nbsp;{{ formatSize(rowContextData.size) }}
                </van-col>
              </van-col>
            </van-col>
            <van-col span="4"></van-col>
          </van-row>
        </div>
        <van-checkbox class="file-item-checkbox" v-if="selectStatus" v-model="isShowCheckContext" slot="right-icon"
                      :name="rowContextData"></van-checkbox>
      </van-cell>

      <div v-if="rowContextData.name!=null && grid" :style="overlayContentClass"
           class="grid-time overlay-content-class van-grid-item__content van-grid-item__content--center van-grid-item__content--square">
        <van-checkbox class="file-item-checkbox" v-if="selectStatus" v-model="isShowCheckContext" slot="right-icon"
                      :name="rowContextData"></van-checkbox>
        <div class="grid-item-icon">
          <icon-file :item="rowContextData" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"
                     :grid="true"></icon-file>
        </div>
        <span :title="rowContextData.name" class="grid-item-text">{{ rowContextData.name }}</span>
      </div>

    </van-overlay>
    <!--为了不受右键区域的影响, 把弹窗之类的提取出来-->
    <sim-text-preview :file.sync="textPreviewRow" :status.sync="textPreviewVisible"></sim-text-preview>
    <image-viewer :fileList="fileList" :file="imagePreviewRow" :status.sync="imagePreviewVisible"></image-viewer>
    <video-preview :file="videoPreviewRow" :status.sync="videoPreviewVisible"></video-preview>
    <iframe-preview :file="officePreviewRow" :status.sync="officePreviewVisible"></iframe-preview>
  </div>
</template>
<script>

import Hamburger from '@/components/Hamburger/index.vue'
import { fileOperations } from '@/utils/file-operations'
import { mapGetters, mapState } from 'vuex'
import {formatSize, formatTime} from '@/utils/number'
import {getElementToPageLeft, getElementToPageTop} from '@/utils/dom'
import api from '@/api/file-api'
import IconFile from "../../../components/Icon/IconFile";
import fileConfig from "@/utils/file-config";
import ImageViewer from "@/components/preview/ImageViewer";
import VideoPreview from "@/components/preview/VideoPreview";
import SimTextPreview from "@/components/preview/SimTextPreview";
import {suffix} from "@/utils/file-type";
import IframePreview from "@/components/preview/IframePreview.vue";
import Clipboard from "clipboard";

export default {
  components: {
    Hamburger,
    IframePreview,
    SimTextPreview,
    VideoPreview,
    ImageViewer, IconFile,
  },
  computed: {
    ...mapState(['message']),
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  data() {
    return {
      shareToken: undefined,
      test: 0,
      lastTabbarOffsetTop: 0,// 底部tabbar与上边框 上次的距离
      diffTabbarTop: 0,// 底部tabbar与上边框的变化距离
      isiPhoneX: 0,
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?id=`,
      audioCoverUrl: `${process.env.VUE_APP_BASE_API}/view/cover?id=`,
      tabActive: 0,
      path: this.$route.query.path,
      fileList: [],
      pathList: [
        {'folder': '', index: 0},
        {'folder': '+', index: 1}
      ],
      pagination: {
        pageIndex: 0,
        pageSize: 50,
        total: 0,
      },
      queryFileType: null,
      queryCondition: {isFolder: null},
      loading: false,
      finished: false,
      refreshing: false,
      actionSheetShow: false, // 下拉菜单
      actionsMenus: [
        {name: '新建文件夹'},
      ],
      actionSortSheetShow: false,
      actionsSortMenus: [
        {name: '名称'},
        {name: '日期'},
        {name: '大小'},
      ],
      actionsSortName: '名称',
      showNewFolder: false,
      showRename: false,
      newFolderName: '新建文件夹',
      Loop: null,
      isJustHideMenus: false,
      singleMenus: [
        {iconClass: 'duigou', label: '选择', operation: 'select'},
        {iconClass: 'menu-favorite', label: '收藏', operation: 'favorite'},
        {iconClass: 'menu-rename', label: '重命名', operation: 'rename'},
        {iconClass: 'menu-download', label: '下载', operation: 'download'},
        {iconClass: 'menu-remove', label: '删除', operation: 'remove'}
      ],
      menus: [],
      rowContextData: {},
      selectRowData: [],
      checkboxGroup: [],
      newFolderLoading: false,
      renameLoading: false,
      renameFileName: '',
      selectIndexList: [],
      selectStatus: false,
      isShowCheckContext: false,
      overlayShow: false,
      overlayContentClass: {},
      vanNavBarClass: {},
      searchBarClass: {},
      leftMenuShow: false,
      searchValue: '',
      searchStatus: true,
      resultCount: 0,
      sortOrder: 'up',
      sortableProp: null,
      order: null,
      grid: false,
      vmode: 'list',
      gridColumnNum: -1,
      imagePreviewRow: {},
      imagePreviewVisible: false,
      videoPreviewRow: {},
      videoPreviewVisible: false,
      officePreviewRow: {},
      officePreviewVisible: false,
      textPreviewVisible: false,
      textPreviewRow: {},
    };
  },
  directives: {
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
  watch: {
    message(msg) {
      switch (msg.event) {
        case 'getUploadParams':
          this.$store.dispatch('updateMessage', {
            event: 'onUploadParams',
            data: this.getUploadParams(),
          })
          break
      }
    }
  },
  mounted() {
    // 加载布局
    if (this.$route.query.vmode) {
      this.vmode = this.$route.query.vmode
      this.grid = this.vmode !== 'list';
    }
    // 加载url上的path
    if (this.$route.query.path !== '/') {
      const path = decodeURI(this.$route.query.path)
      this.pathList.splice(1, 1)
      path.split('/').forEach((pathName, index) => {
        if (index > 0) {
          const item = {}
          item['folder'] = pathName
          item['index'] = index
          this.pathList.push(item)
        }
      })
    }
    if (this.$route.query.folder && this.path) {
      localStorage.setItem(this.path, this.$route.query.folder)
    }
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false);
  },
  methods: {
    // 是否高亮收藏图标
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
    // 显示操作菜单
    show() {
    },
    hide() {
      const that = this
      this.isJustHideMenus = true
      setTimeout(function () {
        that.isJustHideMenus = false
      }, 100)
    },
    showCheckContext() {
      return this.selectIndexList.includes(this.rowContextData.index)
    },
    // 长按事件
    rowContextmenu(row, target, touchClientX) {
      this.menus = JSON.parse(JSON.stringify(this.singleMenus));
      // 改变菜单
      if (this.selectStatus && this.selectIndexList.includes(row.index)) {
        if (this.selectIndexList.includes(row.index)) {
          const item = {iconClass: 'menu-unselect', label: '取消选择', operation: 'unselect'}
          this.menus.splice(0, 1, item)
        }
      } else {
        const item = {iconClass: 'duigou', label: '选择', operation: 'select'}
        this.menus.splice(0, 1, item)
      }

      this.setMenus(row)

      this.preliminaryRowData(row)
      // 长按选择的数据
      const offsetTop = getElementToPageTop(target) - row.scrollY
      const e = {}
      if ((offsetTop + (target.offsetHeight / 2)) > document.body.offsetHeight / 2) {
        e.pageX = touchClientX
        e.pageY = getElementToPageTop(target) - this.menus.length * 47 + 5
      } else {
        e.pageX = touchClientX
        e.pageY = getElementToPageTop(target) + target.offsetHeight + 5
      }
      this.$refs.contextShow.showMenu(e)
    },
    setMenus(row) {
      // 挂载的文件
      const owner = localStorage.getItem('mountFileOwner')
      const notSelf = row.userId && row.userId !== this.$store.getters.userId
      if ((this.$route.query.folder && owner) || notSelf) {
        // 根据权限设置菜单
        this.setMenusByPermission(row)
      } else {
        if (row.isFolder && row.mountFileId) {
          const reservations = ['open', 'tag', 'favorite', 'remove']
          // 删除this.menus中不要的菜单, 仅保留reservations中的菜单
          this.menus = this.menus.filter(item =>
            reservations.includes(item.operation)
          )
        }
        if (!row.isFolder && this.queryFileType !== 'trash') {
          // 创建副本
          const copyIndex = this.getIndexOfFileContextMenus(fileOperations.copy.operation)
          if (copyIndex > -1) {
            this.menus.splice(copyIndex, 0, fileOperations.duplicate)
          }
        }
        if (row.ossFolder) {
          const reservations = ['open', 'tag']
          // 删除this.menus中不要的菜单, 仅保留reservations中的菜单
          this.menus = this.menus.filter(item =>
            reservations.includes(item.operation)
          )
        }
        this.setMenusCopyDownLoadLinks(row)
      }
    },
    getIndexOfFileContextMenus(operation) {
      return this.menus.findIndex(item => item.operation === operation)
    },
    setMenusCopyDownLoadLinks(row) {
      if (row.isShare) {
        // 获取this.menus中download的索引
        const downloadIndex = this.menus.findIndex(
          item => item.operation === 'download'
        )
        this.shareToken = undefined
        // 在download之前添加复制下载链接选项
        this.addMenusCopyDownLoadLinks(downloadIndex)
        if (row.isPrivacy) {
          // 如果是私密分享需要先获取shareToken
          api.generateShareToken({fileId: row.id}).then(res => {
            this.shareToken = res.data
          }).catch(() => {
            this.menus.splice(downloadIndex, 1)
          })
        }
      }
    },
    addMenusCopyDownLoadLinks(index) {
      this.menus.splice(index, 0, {
        iconClass: 'menu-fuzhi',
        label: '复制下载链接',
        operation: 'copyDownloadLink',
      })
    },
    setMenusByPermission(file) {
      const reservations = ['select', 'download']
      // 删除this.menus中不要的菜单, 仅保留reservations中的菜单
      this.menus = this.menus.filter(item =>
        reservations.includes(item.operation)
      )
      if (file.operationPermissionList && file.operationPermissionList.length > 0) {
        if (file.operationPermissionList.indexOf('PUT') > -1) {
          this.menus.splice(this.menus.length, 0, fileOperations.rename)
        }
        if (file.operationPermissionList.indexOf('DELETE') > -1) {
          this.menus.splice(this.menus.length, 0, fileOperations.remove)
        }
      }
      this.setMenusCopyDownLoadLinks(file)
    },
    // 选择某行预备数据
    preliminaryRowData(row) {
      this.rowContextData = row
      this.isShowCheckContext = this.selectIndexList.includes(row.index)
      const isFavorite = this.rowContextData.isFavorite
      this.highlightFavorite(isFavorite, false)
    },
    // 菜单操作
    menusOperations(operation) {
      const that = this
      switch (operation) {
        case 'favorite':
          this.favoriteOperating(true)
          break
        case 'open':
          this.fileClick(this.rowContextData, this.rowContextData.index)
          break
        case 'unselect':
          const index = this.rowContextData.index
          this.$refs.checkboxes[index].toggle();
          break
        case 'unFavorite':
          this.favoriteOperating(false)
          break
        case 'select':
          this.selectStatus = true
          this.selectIndexList.push(this.rowContextData.index)
          setTimeout(() => {
            this.$refs.checkboxes[that.rowContextData.index].toggle()
          }, 0)
          break
        case 'rename':
          this.renameFileName = this.rowContextData.name
          this.showRename = true
          setTimeout(function () {
            that.$refs.renameInput.focus()
          }, 0)
          break
        case 'download':
          this.downloadFile()
          break
        case "copyDownloadLink":
          // 复制下载链接
          this.copyDownloadLink(this.rowContextData)
          break;
        case 'remove':
          this.deleteFile()
          break
      }
      this.overlayShow = false
      document.documentElement.style.overflow = null;
      this.$refs.contextShow.hideMenu()
    },
    // 重命名
    rowRename() {
      const row = this.rowContextData
      let newFileName = this.renameFileName
      if (newFileName) {
        if (!row.isFolder) {
          const ext = '.' + row.suffix
          if (!newFileName.endsWith(ext)) {
            newFileName += ext
          }
        }
        this.renameLoading = true
        const findIndex = this.fileList.findIndex(item => {
          if (newFileName === item.name) {
            return item;
          }
        })
        if (findIndex > -1) {
          let msg = '该文件已存在'
          if (row.isFolder) {
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
          newFileName: encodeURIComponent(newFileName),
          username: this.$store.state.user.name,
          folder: this.$route.query.folder,
          id: row.id
        }).then(() => {
          this.renameLoading = false
          row.name = newFileName
          this.fileList[row.index] = row
          this.editingIndex = -1
        })
      } else {
        this.editingIndex = -1
      }
    },
    downloadFile() {
      let fileIds = [];
      if (this.selectRowData.length > 0) {
        this.selectRowData.forEach(value => {
          fileIds.push(value.id)
        })
      } else {
        fileIds.push(this.rowContextData.id)
      }
      if (fileIds.length > 1 || this.rowContextData.isFolder) {
        fileConfig.packageDownload(fileIds)
        return
      }
      fileConfig.download(this.$store.state.user.name, this.rowContextData, this.$store.state.user.token)
    },
    // 复制下载链接
    copyDownloadLink(row) {
      let url = window.location.origin + fileConfig.previewUrl(this.$store.getters.name, row, undefined, this.shareToken)
      if (row.isFolder) {
        url = fileConfig.packageDownloadUrl(row.id, row.name + '.zip', this.shareToken)
      }
      let clipboard = new Clipboard('.newFileMenu', {
        text: function() {
          return url
        },
      })
      clipboard.on('success', () => {
        this.$message({ message: '复制成功', type: 'success', duration: 1000 })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        // 不支持复制
        this.$message({
          message: '该浏览器不支持自动复制',
          type: 'warning',
          duration: 1000,
        })
        clipboard.destroy()
      })
    },
    // 收藏/取消收藏
    favoriteOperating(isFavorite) {
      this.rowContextData.isFavorite = isFavorite
      this.highlightFavorite(isFavorite, true)
      api.favoriteUrl({
        fileIds: this.rowContextData.id,
        isFavorite: isFavorite
      }).then(res => {
      })
    },
    // 删除
    deleteFile() {
      let fileList = []
      const fileIds = []
      if (this.selectRowData.length > 0) {
        fileList = this.selectRowData
        this.selectRowData.forEach(value => {
          fileIds.push(value.id)
        })
      } else {
        fileList = this.selectRowData
        fileIds.push(this.rowContextData.id)
      }
      const str = this.getShowSumFileAndFolder(fileList)

      vant.Dialog.confirm({
        title: '提示',
        message: '此操作将永久删除' + str + ', 是否继续?'
      }).then(() => {
        api.delete({
          currentDirectory: this.rowContextData.path,
          username: this.$store.state.user.name,
          fileIds: fileIds,
          sweep: true
        }).then(() => {
          // 刷新列表
          this.getFileList()
          vant.Toast.setDefaultOptions({duration: 800});
          vant.Toast.success('删除成功');
          if (this.selectRowData.length > 1) {
            this.selectRowData = []
          }
        })
      })
    },
    touchMove() {
      // // 避免和长按事件冲突
      clearTimeout(this.Loop);
      // e.preventDefault();
    },
    touchStart(item) {
      // e.preventDefault();
      // Toast.setDefaultOptions({ duration: 500 });
      //手指触摸
      clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
      const e = window.event
      this.Loop = setTimeout(() => {
        item.scrollY = e.targetTouches[0].pageY - e.targetTouches[0].clientY
        if (this.findListItem(item, e.targetTouches[0].target, e.targetTouches[0].clientX)) {
          this.overlayShow = true
          document.documentElement.style.overflow = 'hidden';
        }
      }, 500);
    },
    touchEnd() {
      //手指离开
      clearTimeout(this.Loop);
    },
    // 点击遮罩层
    overlayClick() {
      this.overlayShow = false
      document.documentElement.style.overflow = null;
    },
    findListItem(item, target, touchClientX) {
      if (target === null) {
        return false
      }
      const offsetParent = target.offsetParent
      const parentElement = target.parentElement
      if (!offsetParent && parentElement || offsetParent === null) {
        return this.findListItem(item, target.parentElement, touchClientX)
      } else {
        if (offsetParent.className.indexOf('list-item') > -1) {
          // list
          this.longPressDisplayLayer(item, offsetParent, touchClientX)
        } else if (offsetParent.className.indexOf('grid-time') > -1) {
          // grid
          this.longPressDisplayLayer(item, offsetParent, touchClientX)
        } else {
          return this.findListItem(item, target.offsetParent, touchClientX)
        }
      }
      return true
    },
    // 长按显示层
    longPressDisplayLayer(item, offsetParent, touchClientX) {
      const background = this.selectIndexList.includes(this.rowContextData.index) ? '#90c2fcb5' : ''
      this.overlayContentClass = {
        'top': (getElementToPageTop(offsetParent) - item.scrollY) + 'px',
        'height': offsetParent.offsetHeight + 'px',
        'width': offsetParent.offsetWidth + 'px',
        'left': getElementToPageLeft(offsetParent) + 'px',
        'border-radius': '0px',
        'background': background
      }
      setTimeout(() => {
        this.overlayContentClass = {
          'top': (getElementToPageTop(offsetParent) - item.scrollY) + 'px',
          'height': offsetParent.offsetHeight + 'px',
          'width': (offsetParent.offsetWidth - (this.grid ? 0 : 10)) + 'px',
          'left': (getElementToPageLeft(offsetParent) + (this.grid ? 0 : 5)) + 'px',
          'border-radius': '20px',
          'background': background
        }
      }, 0)
      this.rowContextmenu(item, offsetParent, touchClientX)
    },
    // 浏览器的返回事件
    goBack() {
      if (this.pathList.length <= 1) {
        this.$router.push(`/_m?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}`)
        return
      }
      this.clickBack()
    },
    // 点击返回按钮(标题), 返回上一级
    clickBack() {
      this.handleLink(this.pathList[this.pathList.length - 2], this.pathList.length - 2)
    },
    //菜单键
    leftMenu() {
      this.leftMenuShow = true
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    startSearch() {
      // this.searchStatus = true
      this.vanNavBarClass = {
        visibility: 'hidden'
      }
      this.searchBarClass = {
        marginTop: '-30px'
      }
      let searchAction = document.querySelector('.van-search__action')
      searchAction.style.marginRight = '0px'
      searchAction.style.visibility = 'visible'
      searchAction.style.color = '#1989fa'
    },
    endSearch() {
      const that = this
      setTimeout(function () {
        that.vanNavBarClass = {
          visibility: 'visible'
        }
      }, 150)
      this.searchBarClass = {
        marginTop: '0px'
      }
      let searchAction = document.querySelector('.van-search__action')
      searchAction.style.marginRight = '-44px'
      searchAction.style.visibility = 'hidden'
      this.searchValue = ''
      this.pathList.splice(1, this.pathList.length - 1)
      this.$router.push(`?vmode=${this.vmode}`)
      this.getFileList()
    },
    onSearch() {
      if (this.searchValue.length < 1) {
        this.$router.push(`?vmode=${this.vmode}`)
        this.getFileList()
      } else {
        this.searchFile(this.searchValue)
      }
    },
    // 切换布局
    changeVmode() {
      this.grid = !this.grid
      this.vmode = 'list'
      if (this.grid) {
        this.vmode = 'grid'
      }
      if (!this.path) {
        this.path = ''
      }
      this.$router.push(`?vmode=${this.vmode}&path=${this.path}${this.$route.query.folder ? '&folder='+this.$route.query.folder : ''}`)
    },
    showSortSheet() {
      this.actionSortSheetShow = true
    },
    // 更多操作
    moreOperations() {
      // Toast("提示").setDefaultOptions({ duration: 200 });
      this.actionSheetShow = true
      this.actionsMenus = [
        {name: '新建文件夹'},
      ]
      if (window.uploader.support) {
        const menuItem = {}
        menuItem['name'] = '上传文件'
        this.actionsMenus.push(menuItem)
      }
      if (window.uploader.supportDirectory) {
        const menuItem = {}
        menuItem['name'] = '上传文件夹'
        this.actionsMenus.push(menuItem)
      }
    },
    handleLink(item, index, unPushLink, unRefresh) {
      if (item && item.search) {
        if (item.searchKey) {
          this.searchFileByKeyWord(item.searchKey)
        } else if (item.row) {
          this.searchFileAndOpenDir(item.row)
        }
        this.pathList.splice(this.pathList.findIndex((v, i) => i === index + 1), this.pathList.length - (index + 1))
      } else {
        this.pathList.splice(this.pathList.findIndex((v, i) => i === index + 1), this.pathList.length - (index + 1))
        this.pathList.forEach((p, number) => {
          if (number === 0) {
            this.path = ''
          } else if (number === this.pathList.length) {
          } else {
            this.path += '/' + this.pathList[number].folder
          }
        })
        let queryFolder = localStorage.getItem(this.path)
        if (!unPushLink) {
          if (!this.$route.query.path) {
            this.$router.push(`/_m?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}${queryFolder ? '&folder='+queryFolder : ''}`)
          } else {
            this.$router.push(`/_m?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}${queryFolder ? '&folder='+queryFolder : ''}`)
          }
        }
        if (!unRefresh) {
          this.pagination.pageIndex = 1
          this.getFileList()
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
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getFileList();
    },
    searchFileAndOpenDir(fileId, onLoad) {
      this.beforeLoadData(onLoad);
      api.searchFileAndOpenDir({
        userId: this.$store.state.user.userId,
        username: this.$store.getters.name,
        id: fileId,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        folder: this.$route.query.folder,
      }).then(res => {
          this.loadData(res, onLoad)
          this.listModeSearch = true
        })
    },
    getFileList(onLoad) {
      this.beforeLoadData(onLoad)
      if (this.$route.query.keyword) {
        if (this.$route.query.keyword !== "undefined") {
          this.searchValue = this.$route.query.keyword
        }
        const searchPathIndex = this.pathList.findIndex(item => item.search)
        if (this.$route.query.folder && searchPathIndex > -1) {
          this.searchFileAndOpenDir(this.$route.query.folder, false)
        } else {
          this.searchFile(this.searchValue, onLoad)
        }
      } else {
        api.fileList({
          username: this.$store.state.user.name,
          userId: this.$store.state.user.userId,
          currentDirectory: encodeURIComponent(this.$route.query.path),
          folder: this.$route.query.folder,
          queryFileType: this.queryFileType,
          sortableProp: this.sortableProp,
          order: this.order,
          isFolder: this.queryCondition.isFolder,
          isFavorite: this.queryCondition.isFavorite,
          queryCondition: this.queryCondition,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
        }).then(res => {
          this.loadData(res, onLoad)
        }).catch(e => {
        })
      }
    },
    searchFile(key, onLoad) {
      if (key) {
        this.beforeLoadData(onLoad)
        this.$router.push(`?vmode=${this.vmode}&keyword=${key}`)
        api.searchFile({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          keyword: key,
          currentDirectory: encodeURIComponent(this.$route.query.path),
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.loadData(res, onLoad)
          this.path = ''
          this.listModeSearch = true
        })
      }
    },
    // 请求之前的准备
    beforeLoadData(onLoad) {
      if (onLoad) {
        this.pagination.pageIndex++
      } else {
        this.pagination.pageIndex = 1
        this.fileList = []
      }
      this.finished = false;
    },
    // 填充数据
    loadData(res, onLoad) {
      if (onLoad) {
        res.data.forEach((file, index) => {
          file['index'] = (this.pagination.pageIndex - 1) * this.pagination.pageSize + index
          this.fileList.push(file)
        })
      } else {
        this.fileList = res.data
        this.fileList.map((file, index) => {
          file['index'] = index
        })
      }
      this.refreshing = false
      this.resultCount = res.count
      // 数据全部加载完成
      if (this.fileList.length >= res.count) {
        this.finished = true;
      }
      // 排序
      this.fileList.sort(this.compare(this.sortableProp))
      this.$nextTick(() => {
        this.containerResize()
        // 加载状态结束
        this.loading = false
      })
    },
    containerResize() {
      const container = document.querySelector(".container")
      let clientWidth = container.clientWidth
      if (clientWidth > 1024) {
        this.gridColumnNum = Math.round(clientWidth / 100 - 4)
      } else {
        this.gridColumnNum = Math.round(clientWidth / 100 - 2)
        if (clientWidth <= 550) {
          this.gridColumnNum = 4
        }
        if (clientWidth <= 375) {
          this.gridColumnNum = 3
        }
      }
    },
    clickFileType(queryFileType, queryCondition) {
      this.queryCondition = queryCondition
      this.queryFileType = queryFileType
      this.getFileList()
      this.leftMenuShow = false
    },
    uploadList() {
      this.$router.push(`/upload/index_m`)
    },
    // 统计
    statistics() {
      let totalSize = 0
      this.fileList.forEach(file => {
        if (file.size) {
          totalSize += file.size;
        }
      })
      return this.getShowSumFileAndFolder(this.fileList) + ' ' + this.getShowSumSize(totalSize)
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
      if (totalSize === 0) {
        return sizeSum
      } else if (totalSize < 1024) {
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
    // 全选或反选
    checkboxAll() {
      if (this.selectRowData.length !== this.fileList.length) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        this.$refs.checkboxGroup.toggleAll();
      }
    },
    // 取消选择状态
    cancelSelect() {
      this.$refs.checkboxGroup.toggleAll(false)
      const that = this
      setTimeout(function () {
        that.selectStatus = false
      })
    },
    // 选择状态改变时触发
    checkboxChange(any) {
      this.selectRowData = any
      this.selectIndexList = []
      for (const item of any) {
        this.selectIndexList.push(item.index)
      }
      this.selectStatus = true
    },
    // 点击文件或文件夹
    fileClick(row, index) {
      if (this.selectStatus) {
        this.$refs.checkboxes[index].toggle();
      } else {
        if (row.isFolder) {
          // 打开文件夹
          if (this.path) {
            this.path += '/' + row.name
          } else {
            this.path = '/' + row.name
          }
          const item = {}
          item['folder'] = row.name
          item['index'] = this.pathList.length - 1
          this.pathList.push(item)
          const keyword = this.$route.query.keyword ? `&keyword=${this.$route.query.keyword}` : ''
          if (this.listModeSearch) {
            const item = {};
            item["folder"] = row.name;
            item["search"] = true;
            item["row"] = row;
            this.pathList.push(item);
            this.pagination.pageIndex = 1;
            const folder = row.id ? `&folder=${row.id}` : ''
            const path = this.$route.query.path ? `&path=${this.$route.query.path}` : ''
            this.$router.push(`?vmode=${this.vmode}${path}${keyword}${folder}`);
            this.getFileList()
          } else {
            const path = encodeURIComponent(this.path);
            if (this.$store.getters.userId !== row.userId) {
              row.mountFileId = row.id
            }
            if (row.mountFileId) {
              localStorage.setItem(this.path, row.mountFileId)
            }
            this.$router.push(`/_m?vmode=${this.vmode}&path=${path}${keyword}${row.mountFileId ? '&folder='+row.mountFileId : ''}`)
            this.getFileList()
          }
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
          if (row.contentType.indexOf('audio') > -1) {
            // 音频文件
            this.$store.dispatch('updateMessage', { event: 'onAddAudio', data: { row: row, audioCoverUrl: this.audioCoverUrl } })
            return
          }
          if (row.contentType.indexOf('office') > -1 || row.suffix === 'csv') {
            // office文件
            this.officePreviewVisible = true
            this.officePreviewRow = row
            return
          }
          if (row.suffix === 'pdf') {
            // pdf文件
            fileConfig.preview(this.$store.state.user.name, row, this.$store.getters.token)
            return
          }
          vant.Dialog.confirm({
            title: '标题',
            message: '此文件不支持预览，是否下载',
            confirmButtonText: '下载'
          }).then(() => {
            // 通用下载文件的方法
            setTimeout(() => {
              fileConfig.download(this.$store.state.user.name, row, this.$store.state.user.token)
            }, 0)
          }).catch(() => {
              // on cancel
          });
        }
      }
    },
    onCancel() {
      this.actionSheetShow = false
      this.actionSortSheetShow = false
    },
    compare(property) {
      return (a, b) => {
        let value1 = a[property]
        let value2 = b[property]
        if (this.order === 'ascending') {
          return value1 - value2
        } else {
          return value2 - value1
        }
      }
    },
    selectSortActionsMenus(action) {
      const that = this
      setTimeout(function () {
        that.actionSortSheetShow = false
      }, 100)
      if (this.sortOrder === 'up') {
        this.sortOrder = 'down'
        this.order = 'descending'
      } else {
        this.sortOrder = 'up'
        this.order = 'ascending'
      }
      this.actionsSortName = action.name
      if (action.name === '名称') {
        this.sortableProp = 'name'
        if (this.sortOrder === 'up') {
          this.order = null
        }
        this.getFileList()
      }
      if (action.name === '大小') {
        this.sortableProp = 'size'
        this.fileList.sort(this.compare(this.sortableProp))
      }
      if (action.name === '日期') {
        this.sortableProp = 'updateDate'
        this.getFileList()
        // this.fileList.sort(this.compare('agoTime'))
      }
    },
    // 选择上传文件菜单
    selectActionsMenus(action) {
      const that = this
      setTimeout(function () {
        that.actionSheetShow = false
      }, 100)
      // 新建文件夹
      if (action.name === '新建文件夹') {
        this.newFolderName = '新建文件夹'
        let append = 0
        let filenameList = []
        this.fileList.forEach(file => {
          filenameList.push(file.name)
        })
        while (filenameList.includes(this.newFolderName)) {
          append += 1
          this.newFolderName = '新建文件夹' + append
        }
        this.showNewFolder = true
        const that = this
        setTimeout(function () {
          that.$refs.newFolderInput.focus()
        }, 0)
      }
      // 上传文件
      if (action.name === '上传文件') {
        // 打开文件选择框
        this.$store.dispatch('updateMessage', { event: 'openUploader'})
      }
      // 上传文件夹
      if (action.name === '上传文件夹') {
        // 打开文件夹选择框
        this.$store.dispatch('updateMessage', { event: 'uploadFolder'})
      }
    },
    getUploadParams() {
      return {
        // 传入的参数
        folder: this.$route.query.folder,
        currentDirectory: encodeURIComponent(this.path),
        username: this.$store.state.user.name,
        userId: this.$store.state.user.userId
      }
    },
    // 新建文件夹
    newFolderNameClick() {
      this.newFolderLoading = true
      if (this.newFolderName) {
        api.uploadFolder({
          isFolder: true,
          filename: encodeURIComponent(this.newFolderName),
          folder: this.$route.query.folder,
          currentDirectory: encodeURIComponent(this.path),
          username: this.$store.state.user.name,
          userId: this.$store.state.user.userId
        }).then((res) => {
          if (res.data === 1) {
            this.newFolderLoading = false
            this.$message({
              message: '该文件夹已存在',
              type: 'warning'
            });
          } else {
            this.newFolderLoading = false
            this.showNewFolder = false
            this.isShowNewFolder = false
            vant.Toast.success('操作成功');
            if (this.listModeSearch) {
              this.getFileListBySearchMode()
            } else {
              this.getFileList()
            }
          }
        })
      } else {
        this.newFolderLoading = false
        this.$message({
          message: '请输入文件夹名称',
          type: 'warning'
        });
      }
    },
    swipeUp() {
      this.test = 10
    },
    tabBottom() {
      return {padding: '0 0 20px 0'}
    }
  }
}
</script>
<style lang="scss" scoped>
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

input {
  -webkit-user-select: auto; /*webkit浏览器*/
}

.tab-bottom {
  padding: 0 0 25px 0;

  .van-tabbar-item {
    margin-top: 25px;
    animation: ordinary .4s forwards;
    -moz-animation: ordinary .4s forwards; /* Firefox */
    -webkit-animation: ordinary .4s forwards; /* Safari and Chrome */
    -o-animation: ordinary .4s forwards; /* Opera */
  }
}

@keyframes iphoneX {
  from {
    margin-top: 25px;
  }
  to {
    margin-top: -5px;
  }
}

@keyframes ordinary {
  from {
    margin-top: -5px;
  }
  to {
    margin-top: 25px;
  }
}

.tab-bottom-iphoneX {
  padding: 0 0 25px 0;

  .van-tabbar-item {
    animation: iphoneX .4s forwards;
    -moz-animation: iphoneX .4s forwards; /* Firefox */
    -webkit-animation: iphoneX .4s forwards; /* Safari and Chrome */
    -o-animation: iphoneX .5s forwards; /* Opera */
  }
}

.tab-bottom-iphoneXS {
  padding: 0 0 25px 0;

  .van-tabbar-item {
    animation: iphoneX .4s forwards;
    -moz-animation: iphoneX .4s forwards; /* Firefox */
    -webkit-animation: iphoneX .4s forwards; /* Safari and Chrome */
    -o-animation: iphoneX .4s forwards; /* Opera */
  }
}

.van-tabbar-item {
  color: #646566;
  text-align: center;
  margin-top: 20px;
  font-size: 10px;

  .tab-text {
    margin-top: 2px;
  }
}

.container {
  font-size: 14px;

  .classification {
    padding: 1rem 0 1rem 0;
    background: wheat;
  }

}

>>> .block {
  .audio-player-close {
    width: 1em;
    height: 1em;
  }
}

/*.van-divider {*/
/*margin: 5px 15px 0px 15px;*/
/*}*/
.file-description {
  color: var(--text-secondary-color);
  font-size: 12px;
}

.van-col {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.list-item {
  padding: 5px 10px;

  .list-cell-icon {
    font-size: 18px;
  }

  .list-item-content {
    margin-left: 5px;
  }

  >>> .svg-icon {
    width: 2.5em;
    height: 2.5em;
    z-index: unset;
  }
}

.overlay-content-class {
  -webkit-transition: all .1s ease-in-out 0s;
  transition: all .1s ease-in-out 0s;
  box-shadow: 2px 3px 3px var(--navbar-box-shadow);

}

>>> .van-sticky {
  background: inherit;
  background-color: var(--tippy-box-bg-color);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  backdrop-filter: blur(16px) saturate(180%);
  box-shadow: 2px 0 2px var(--navbar-box-shadow);
}

[class*=van-hairline]::after {
  border: 0 solid var(--tippy-box-bg-color);
}

>>> .van-sticky--fixed {
  z-index: 1;
}

.van-nav-bar {
  background-color: unset;
  -webkit-transition: all .15s ease-in-out 0s;
  transition: all .15s ease-in-out 0s;
}

.van-nav-bar__content {
  background-color: var(--bg-color);
  >>> .van-nav-bar__title {
    color: var(--text-color);
  }
}

.van-overlay {
  -webkit-backdrop-filter: saturate(180%) blur(1.5px);
  backdrop-filter: saturate(180%) blur(1.5px);
  background-color: var(--tippy-box-bg-color);
}

>>> .van-nav-bar__title {
  width: 30%;
  position: absolute;
  margin-left: 35%;
  z-index: 11;
  color: var(--text-color);
}

.van-nav-bar__left {
  z-index: 11;

  .van-icon-arrow-left {
    font-size: 24px;
  }
}

.van-nav-bar__right {
  z-index: 11;
}

.van-nav-bar__arrow + .van-nav-bar__text {
  max-width: 7.5rem;
  min-width: 5.5rem;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.new-folder-input >>> .van-field__body {
  height: 40px;
}

.newFileMenu ul {
  list-style: none;
  padding-inline-start: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0 0.3em;
}

.newFileMenu {
  background-color: var(--bg-color);
  color: var(--text-color);
  border-radius: 1rem;
}

>>> .menu-background::after {
  background: inherit;
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--tippy-box-bg-color);
}

.newFileMenu li {
  cursor: pointer;
  margin: 0.3em 0;
  padding: 0;
  font-size: 1em;
  min-width: 136px;
  height: 2.6em;
}

.newFileMenu .remove {
  color: rgba(255, 0, 0, 0.8);
}

.newFileMenu .menu-list li:active {
  border-radius: 1rem;
  background-color: var(--menu-hover)
}

//.newFileMenu .menu-list li:active {
//  background-color: var(--menu-hover)
//}
//
//.newFileMenu .menu-list-last li:active {
//  border-bottom-right-radius: 1rem;
//  border-bottom-left-radius: 1rem;
//  background-color: var(--menu-hover)
//}

.newFileMenu li .menuitem {
  cursor: pointer;
  line-height: 2.6em;
  margin-left: 10%;
}

.newFileMenu li .menuitem .text {
  cursor: pointer;
  margin-left: 10%;
  font-weight: normal;
}

.newFileMenu li .menuitem .svg-icon {
  width: 1rem;
  height: 1rem;
}

>>> .ctx-menu-container {
  top: unset;
  padding: 0;
  border: 1px solid var(--vcontextmenu-border-color);
  -webkit-box-shadow: 0 0 0 var(--navbar-box-shadow);
  box-shadow: 0 0 0 var(--navbar-box-shadow);
}

.header-button {
  margin: 0 -16px;
  padding: 0 16px;
}

.header-button-icon {
  width: 1.5rem;
  height: 1.5rem;
  vertical-align: middle;
  color: var(--text-color);
}

>>>.van-nav-bar__left:active {
  background-color: var(--menu-hover)
}
>>>.van-nav-bar__right:active {
  background-color: var(--menu-hover)
}

.left-menu {
  padding: 1rem 0 0 0;
  height: 100%;
  width: 100%;
  text-align: center;
  color: var(--text-color);
  background: var(--bg-color);
}

.logout {
  padding: 1rem 0 0 0;
}

.van-cell,.van-empty,.van-dialog {
  color: var(--text-color);
  background: var(--bg-color);
}
.van-search .van-cell {
  padding: 5px 8px 5px 12px;
  background: unset;
  border-radius: 2em;
}

>>> .van-dialog {
  color: var(--text-color);
  background: var(--bg-color);
  border: 1px solid var(--vcontextmenu-border-color);

  >>> .van-dialog__header {
    color:  var(--text-color-hover);
  }

  >>> .van-dialog__footer {
    &:after {
      border-top: 1px solid var(--vcontextmenu-border-color);
    }
  }
}
>>>.van-button--default {
  color: var(--text-color);
  background: var(--bg-color);
  &:active {
    background-color: var(--menu-hover);
  }
  &:after {
    border-left: 1px solid var(--vcontextmenu-border-color);
  }
}
.van-cell__value--alone {
  color: var(--text-color);
}

>>> .van-cell:after {
  border-bottom-color: var(--vcontextmenu-border-color);
}

>>> .van-cell:active {
  color: var(--text-color-hover);
  background-color: var(--menu-hover);
}

.list-item:active {
  color: var(--text-color-hover);
  background-color: var(--menu-hover);
}

.classification {
  padding: 1rem 0 0 0;
}

.searchbar {
  height: 48px;
  -webkit-transition: all .3s ease-in-out 0s;
  transition: all .3s ease-in-out 0s;
  color: var(--text-color);
}

.van-cell-group {
  background: var(--bg-color);
}

.van-search {
  padding: 0 12px;
  color: var(--text-color);
  background: unset;
}

.van-search__content {
  color: var(--text-color);
  background: unset;
  padding-left: 0;
  border: 1px solid var(--menu-hover);
}

>>> .van-field__control {
  color: var(--text-color);
}

.van-search__action {
  -webkit-transition: all .3s ease-in-out 0s;
  transition: all .3s ease-in-out 0s;
  margin-right: -44px;
  visibility: hidden;
}

.search-result {
  font-weight: 600;
  font-size: 20px;
  height: unset;
  margin-top: unset;
  background-color: var(--setting-bg);
}

.search-result-no {
  height: 80px;
  line-height: 80px;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
}

.operating-header {
  .operating-header-col {
    height: 28px;
    color: #1989fa;

    .sortable {
      font-size: 14px !important;
    }

    .van-icon {
      line-height: 28px;
      font-size: 20px;
      color: #1989fa;
    }
  }

  .operating-header-col:active {
    color: #C2CCD1;

    .van-icon {
      color: #C2CCD1;
    }
  }
}

>>> .grid-item-text {
  text-align: center;
  color: var(--text-color);
  word-wrap: break-word;
  width: -webkit-fill-available;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

>>> .van-grid-item__content {
  padding: 0;
  background-color: var(--bg-color);

  .grid-item-icon {
    svg {
      width: 4rem;
      height: 4rem;
    }

    .favorite.svg-icon {
      width: 1.5rem !important;
      height: 1.5rem !important;
      margin: 15px 10px;
    }

    .el-image {
      width: 4rem !important;
      height: 4rem !important;
    }
  }
}
.file-item-checkbox {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
}

.van-popup {
  background-color: var(--bg-color);
  color: var(--text-color);
}

>>>.van-action-sheet__description {
  color: var(--text-color);
  &:after {
    border-bottom-color: var(--vcontextmenu-border-color);
  }
}

>>>.van-action-sheet__cancel {
  color: var(--text-color);
  background-color: var(--bg-color);
  &:active {
    background-color: var(--menu-hover);
  }
}

.van-action-sheet__item {
  color: var(--text-color);
  background-color: var(--bg-color);
  &:active {
    background-color: var(--menu-hover);
  }
}
>>> .van-action-sheet__gap {
  background-color: var(--setting-bg);
}

</style>
