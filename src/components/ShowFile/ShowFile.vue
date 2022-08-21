<template>
  <div>
    <div class="dashboard-container" v-resize="containerResize" onselectstart="return false">
      <v-contextmenu ref="homeContextmenu" :disabled="contextmenuDisabled">
        <div v-for="item of contextMenus" :key="item.operation">
          <!-- 一级菜单 -->
          <v-contextmenu-item v-if="!item.child" :divider="item.divider?true:false"
                              @click="contextmenuClick(item.operation)">
            <svg-icon v-if="item.iconClass" :icon-class="item.iconClass"></svg-icon>
            {{ item.label }}
          </v-contextmenu-item>
          <v-contextmenu-submenu v-if="item.child" :title="item.label">
            <!-- 二级菜单 -->
            <div v-for="itemSecond of item.child" :key="itemSecond.operation">
              <v-contextmenu-item v-if="!itemSecond.child" :divider="itemSecond.divider?true:false"
                                  @click="contextmenuClick(itemSecond.operation)">
                <svg-icon v-if="itemSecond.iconClass" :icon-class="itemSecond.iconClass"></svg-icon>
                {{ itemSecond.label }}
              </v-contextmenu-item>
              <v-contextmenu-submenu v-if="itemSecond.child" :title="itemSecond.label">
              </v-contextmenu-submenu>
            </div>
          </v-contextmenu-submenu>
        </div>
      </v-contextmenu>

      <el-breadcrumb class="app-breadcrumb" separator="">
        <transition-group name="breadcrumb" v-if="showNavigation">
          <el-breadcrumb-item v-for="(item,index) in pathList" :key="item.folder+index">
            <el-tooltip v-if="index===0 && pathList.length > 1" class="item" effect="dark" content="返回上一级"
                        placement="top">
              <a @click.prevent="lastLink()">
                <svg-icon icon-class="back" style="font-size: 24px;margin-left: 20px;"/>&nbsp;</a>
            </el-tooltip>
            <el-tooltip v-if="index===0 && pathList.length > 2" class="item" effect="dark" content="根目录"
                        placement="top">
              <a class="home-link" @click.prevent="handleLink(item,index)">
                <svg-icon icon-class="home" style="font-size: 24px;"/>
              </a>
            </el-tooltip>
            <breadcrumb-file-path :pathList="pathList" :item="item" :index="index"
                                  @clickLink="handleLink"></breadcrumb-file-path>
          </el-breadcrumb-item>
        </transition-group>
        <div class="search-content">
          <div class="search-class">
            <el-popover
              v-show="showUploadButton"
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
                      <svg-icon icon-class="file-upload"/>
                      <span class="menuitem text">{{ singleFileType !== '' ? singleFileType : '上传文件' }}</span>
                    </label>
                  </li>
                  <li v-if="singleFileType === ''" @click="uploadFolder">
                    <label class="menuitem">
                      <svg-icon icon-class="folder-upload"/>
                      <span class="menuitem text">上传文件夹</span>
                    </label>
                  </li>
                  <li v-if="singleFileType === ''" @click.prevent="newDocument">
                    <a href="#" class="menuitem">
                      <svg-icon icon-class="md"/>
                      <span class="menuitem text">写文章</span>
                    </a>
                  </li>
                  <li v-if="singleFileType === ''" @click.prevent="newFolder">
                    <a href="#" class="menuitem">
                      <svg-icon icon-class="folder-add"/>
                      <span class="menuitem text">新建文件夹</span>
                    </a>
                  </li>
                  <div v-show="showNewFolder" class="folder-name-form">
                    <el-input ref="newFolderName" v-model="newFolderName" placeholder="请输入文件夹名称" :clearable="true"
                              @keyup.enter.native="newFolderNameClickEnter" @focus="setInputFocus" @blur="setInputBlur()">
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
              <button-upload slot="reference" :name="''" @click.native="upload"
                             style="margin-right: 5px"></button-upload>
            </el-popover>

            <el-input v-show="showSearchButton" placeholder="搜索" v-model="searchFileName" :clearable="true"
                      @keyup.enter.native="searchFile(searchFileName)" @focus="setInputFocus" @blur="setInputBlur()">
              <el-button slot="prepend" @click="searchFile(searchFileName)">
                <svg-icon icon-class="search" style="font-size: 22px"/>
              </el-button>
            </el-input>
            <el-dropdown size="medium" style="height: 40px;" @command="contextmenuClick">
              <el-button type="text" class="sort">
                <svg-icon icon-class="sort"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="orderName">
                  <span :class="{'al-file-sort-item': true, 'active': sortable.prop === 'name'}">
                    <i
                      :class="{'al-file-sort-item-icon': true, 'el-icon-top': sortable.order === 'ascending', 'el-icon-bottom': sortable.order === 'descending'}"></i>
                    <span>名称</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="orderSize">
                  <span :class="{'al-file-sort-item': true, 'active': sortable.prop === 'size'}">
                    <i
                      :class="{'al-file-sort-item-icon': true, 'el-icon-top': sortable.order === 'ascending', 'el-icon-bottom': sortable.order === 'descending'}"></i>
                    <span>大小</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="orderUpdateDate">
                  <span :class="{'al-file-sort-item': true, 'active': sortable.prop === 'updateDate'}">
                    <i
                      :class="{'al-file-sort-item-icon': true, 'el-icon-top': sortable.order === 'ascending', 'el-icon-bottom': sortable.order === 'descending'}"></i>
                    <span>日期</span>
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="text" class="vmode" @click="changeVmode">
              <svg-icon :icon-class="grid ? 'list' : 'grid'"/>
            </el-button>
          </div>
        </div>
      </el-breadcrumb>
      <div>
        <!--统计信息-->
        <div class="info-statistics">
          <span v-if="tableLoading">获取更多数据...</span>
          <span v-if="!tableLoading">{{ !finished ? '已加载 ' + getSummaries3 : '已全部加载 ' + getSummaries3 }}</span>
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
            <label class="menuitem">
              <svg-icon :icon-class="item.iconClass"/>
              <span class="menuitem text">{{ item.label }}</span>
            </label>
          </li>
          <li
            v-else
            @click="menusOperations(item.operation)"
          >
            <label class="menuitem">
              <svg-icon :icon-class="item.iconClass"/>
              <span class="menuitem text">{{ item.label }}</span>
            </label>
          </li>
        </ul>
      </e-vue-contextmenu>
      <!--list布局-->
      <div v-show="fileList.length > 0" id="v-draw-rectangle" :style="{'width':'100%','height': clientHeight +'px'}">
        <pl-table
          ref="fileListTable"
          v-show="!grid"
          v-loading="tableLoading"
          :max-height="clientHeight"
          :default-sort="sortable"
          :highlight-current-row="false"
          empty-text="无文件"
          :use-virtual="true"
          :row-height="51.5"
          :border="false"
          :excess-rows="10"
          :pagination-show="false"
          style="width: 100%;margin: 20px 0 0 0;"
          stripe
          :cell-style="rowStyle"
          :height-change="false"
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
            <pl-table-column
              v-if="index === 1"
              :key="index"
              :index="index"
              align="center"
              header-align="center"
              width="80"
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
                <el-input v-if="scope.row.index === editingIndex" :span="10"
                          v-focus v-model="renameFileName" placeholder="" size="small"
                          @focus="renameInputFocus($event.currentTarget,scope.row.suffix)"
                          @blur="setInputBlur()"
                          @keyup.enter.native="rowRename(renameFileName, scope.row)">
                </el-input>
                <span v-else class="table-file-name">{{ scope.row.name }}</span>
              </template>
            </pl-table-column>
            <!--分享-->
            <pl-table-column v-if="index === 3 && showShareItem" :key="index" width="50" :index="index" align="center"
                             header-align="center" tooltip-effect="dark">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.index === cellMouseIndex" class="item" effect="light" content="分享"
                            placement="top">
                  <svg-icon title="分享" class="button-class" icon-class="share" @click.stop="share(scope.row)"/>
                </el-tooltip>
              </template>
            </pl-table-column>
            <!--更多-->
            <pl-table-column v-if="index === 4 && showMoreItem" :key="index" width="50" :prop="item.name"
                             :label="item.label"
                             :index="index" class="el-icon-more" align="center" header-align="center">
              <!-- 使用组件, 并传值到组件中 -->
              <template slot="header">
                <svg-icon v-if="item.name !== ''" class="button-class" icon-class="more"
                          @click.stop="moreOperation($event)"/>
              </template>
              <template slot-scope="scope">
                <svg-icon v-if="scope.row.index === cellMouseIndex" class="button-class" icon-class="more"
                          @click.stop="moreClick(scope.row,$event)"/>
              </template>
            </pl-table-column>
            <!--文件大小-->
            <pl-table-column
              v-if="index === 5 && showSizeItem"
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
                <span>{{ formatSize(scope.row.size) }}</span>
              </template>
            </pl-table-column>
            <!--修改时间-->
            <pl-table-column
              v-if="index === 6 && showUpdateDateItem"
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

                <el-tooltip class="item" effect="light" :content="scope.row.updateDate" placement="top">
                  <span>&nbsp;&nbsp;&nbsp;{{ formatTime(scope.row.agoTime) }}</span>
                </el-tooltip>
              </template>
            </pl-table-column>
          </template>
        </pl-table>


        <!--grid布局-->
        <div v-show="grid" v-loading="tableLoading"
             element-loading-text="文件加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="#f6f7fa88">

          <van-checkbox-group v-model="selectRowData" @change="handleSelectionChange" ref="checkboxGroup">
            <van-grid square :center="true" :column-num="gridColumnNum" :gutter="10" :border="false"
                      :style="{'width':'100%','max-height': clientHeight-45+'px','overflow':'auto'}">
              <van-grid-item v-for="(item,index) in fileList" ref="gridItem" :key="item.id"
                             :title="'大小：'+formatSize(item.size)+'\r\n'+(item.w && item.h ? '分辨率：'+item.w + 'x' + item.h +'\r\n' : '')+'名称：'+item.name+'\r\n'+'创建时间：'+item.uploadDate+'\r\n'+'修改时间：'+item.updateDate+'\r\n'+'路径：'+item.path"
              >
                <div
                  class="grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                  :style="{
                  'background': selectRowData.includes(item)?'#caeaf991':'',
                  'background-size': 'cover',
                  'background-position': 'center',
                  'border': selectRowData.includes(item)?'solid 1px #409eff':'',
                  }"
                  @click="gridItemClick(item)"
                  @dblclick="fileClick(item)"
                  @contextmenu.prevent="rowContextmenu(item)"
                >
                  <div class="grid-item-icon">
                    <icon-file :item="item" :image-url="imageUrl" :audio-cover-url="audioCoverUrl" :grid="true"
                               :grid-width="gridColumnWidth"></icon-file>
                  </div>
                  <el-input v-if="item.index === editingIndex"
                            v-focus
                            v-model="renameFileName"
                            class="grid-item-text"
                            placeholder=""
                            type="textarea"
                            autosize
                            size="small"
                            @focus="renameInputFocus($event.currentTarget, item.suffix)"
                            @blur="setInputBlur()"
                            @keyup.enter.native="rowRename(renameFileName, item)">
                  </el-input>
                  <div v-else class="grid-item-text">{{ item.name }}</div>
                </div>
              </van-grid-item>
            </van-grid>
          </van-checkbox-group>
        </div>
        <table class="drag-table" id="drag-table"></table>
      </div>

      <empty-file
        v-if="fileList.length < 1 && !tableLoading"
        :emptyStatus="emptyStatus"
      >
      </empty-file>
      <img id="dragImage" draggable="false" style="position: fixed;opacity: 0" src="~@/assets/img/hide.png">
      <div id="numberFiles" class="number-files" v-if="!selectFile">
        <img class="icon" src="~@/assets/img/arrow1_left.png" style="display: none"/>
        <div class="number" style="display: inline">1个文件</div>
        <div class="operate" style="display: none;white-space: nowrap;">
          移动到：
        </div>
        <div class="target">
          <span class="folder" style="display: none;white-space: nowrap;">document</span>
        </div>
      </div>
    </div>
    <!--为了不受右键区域的影响, 把弹窗之类的提取出来-->
    <sim-text-preview :file.sync="textPreviewRow" :status.sync="textPreviewVisible"></sim-text-preview>
    <image-viewer :fileList="fileList" :file="imagePreviewRow" :status.sync="imagePreviewVisible"></image-viewer>
    <video-preview :file="videoPreviewRow" :status.sync="videoPreviewVisible"></video-preview>
    <office-preview :file="officePreviewRow" :status.sync="officePreviewVisible"></office-preview>
    <!--文件详细信息-->
    <el-drawer
      :title="rowContextData.name"
      :visible.sync="drawer">
      <div class="drawer-icon">
        <icon-file class="drawer-icon-font" :grid="true" :details="true" :item="rowContextData" :image-url="imageUrl"
                   :audio-cover-url="audioCoverUrl"></icon-file>
      </div>
      <el-form class="details-form">
        <el-form-item label="名称:">
          <span>{{ rowContextData.name }}</span>
        </el-form-item>
        <el-form-item label="类型:" class="details-name">
          <span>{{ rowContextData.isFolder ? '文件夹' : rowContextData.contentType }}</span>
        </el-form-item>
        <div v-if="rowContextData.music">
          <el-form-item label="🎵 歌手:">
            <span>{{ rowContextData.music.singer }}</span>
          </el-form-item>
          <el-form-item label="🎵 专辑:">
            <span>{{ '《' + rowContextData.music.album + '》' }}</span>
          </el-form-item>
          <el-form-item label="🎵 歌名:">
            <span>{{ '《' + rowContextData.music.songName + '》' }}</span>
          </el-form-item>
        </div>
        <el-form-item v-show="rowContextData.w && rowContextData.h" label="分辨率:" class="details-resolution">
          <span>{{ rowContextData.w + ' x ' + rowContextData.h }}</span>
        </el-form-item>
        <el-form-item label="大小:">
          <span> {{
              rowContextData.size
            }}字节 {{ rowContextData.size > 0 ? '(' + formatSize(rowContextData.size) + ')' : '' }}</span>
        </el-form-item>
        <el-form-item label="位置:" class="details-position">
          <a :href="'/?path='+rowContextData.path">{{ rowContextData.path }}</a>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span>{{ rowContextData.uploadDate }}</span>
        </el-form-item>
        <el-form-item label="修改时间:">
          <span>{{ rowContextData.updateDate }}</span>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog
      class="open-file-dialog"
      title="提示"
      top="35vh"
      :visible.sync="openCompressionVisible">
      <svg-icon icon-class="open-folder"></svg-icon>
      <span class="dialog-msg">查看压缩文件</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="unzipTo(openingFile)">解压到...</el-button>
      <el-button size="small" @click="unzip(openingFile,openingFile.id,false)">解压到当前目录</el-button>
      <el-button size="small" type="primary" @click=compressionFilePreview(openingFile)>预览</el-button>
      </span>
    </el-dialog>

    <message-dialog
      title="提示"
      content="此文件不支持预览, 是否下载该文件?"
      :show.sync="notPreviewDialogVisible"
      operatButtonText="强行使用文本编辑器打开"
      confirmButtonText="下载"
      @operating="forciblyOpen(openingFile)"
      @confirm="determineDownload(openingFile)"
    >
    </message-dialog>

    <!--展示压缩文件-->
    <el-dialog :title="'预览:'+compressedFileName" :visible.sync="compressedFileVisible">
      <file-tree :directoryTreeData="compressedFileData" :tempDir="compressedFileTempDir"></file-tree>
    </el-dialog>

    <!--移动或复制弹出框-->
    <el-dialog
      :title="titlePrefix+selectTreeNode.showName"
      :visible.sync="dialogMoveOrCopyVisible"
      @close="clearTreeNode"
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
        <el-button size="small" @click="fileTreeAndNewFolder"><i class="el-icon-folder-add"></i>&nbsp;&nbsp;新建文件夹
        </el-button>
        <el-button v-if="!unzipOperating" size="small" type="primary" @click="moveFileTree">移 动</el-button>
        <el-button v-if="!unzipOperating" size="small" type="primary" @click="copyFileTree">复制</el-button>
        <el-button v-if="unzipOperating" size="small" type="primary" @click="confirmUnzip">解压</el-button>
        <el-button size="small" @click="dialogMoveOrCopyVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--分享-->
    <el-dialog :title="'分享:'+shareFileName" :visible.sync="shareDialog" center>
      <div v-loading="generateShareLinkLoading">
        <el-input readonly="readonly" v-model="shareLink" @focus="setInputFocus" @blur="setInputBlur()"></el-input>
        <div slot="footer" class="dialog-footer share-dialog-footer">
          <el-button type="primary" class="tag-share-link" @click="copyShareLink" :data-clipboard-text="shareLink">
            复制链接
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      class="new-text-file-dialog"
      :title="newCreateFileDialogTitle"
      :close-on-click-modal="false"
      :visible.sync="newCreateFileDialog">
      <el-input
        ref="newCreateFileName" size="small"
        v-model="newCreateFileName"
        class="dialog-msg"
        @focus="renameInputFocus($event.currentTarget,'')" :clearable="true"
        @blur="setInputBlur()"
        @keyup.enter.native="createFile(newCreateFileName)"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="newCreateFileDialog=false">取消</el-button>
        <el-button size="small" type="primary" @click="createFile(newCreateFileName)"
                   v-loading="createFileLoading">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {formatSize, formatTime} from '@/utils/number'
import {getElementToPageLeft} from '@/utils/dom'
import {suffix} from '@/utils/file-type'
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
import MessageDialog from "@/components/message/MessageDialog";

import FileTree from "@/components/FileTree"

import '@/utils/directives.js'

import fileConfig from '@/utils/file-config'
import EditElement from "@/views/markdown/EditElement";
import OfficePreview from "@/components/preview/OfficePreview";

export default {
  name: 'ShowFile',
  components: {
    OfficePreview,
    EditElement,
    MessageDialog, AudioPreview, VideoPreview, ImageViewer, SimTextPreview, IconFile, BreadcrumbFilePath, EmptyFile,
    ButtonUpload,
    FileTree
  },
  props: {
    selectFile: { // 是否为选择文件模式
      type: Boolean,
      defalut: false
    },
    lessClientHeight: {
      type: Number,
      default: 150,
    },
    showUploadButton: {
      type: Boolean,
      default: true,
    },
    showSearchButton: {
      type: Boolean,
      default: true
    },
    showShareItem: {
      type: Boolean,
      default: true
    },
    showMoreItem: {
      type: Boolean,
      default: true
    },
    isCollectView: {
      type: Boolean,
      default: false
    },
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
    sortable: {
      'type': Object,
      'default': function () {
        return {prop: '', order: null}
      }
    },
    queryCondition: {
      'type': Object,
      'default': function () {
        return {isFolder: null}
      }
    },
    singleMenus: {
      'type': Array,
      'default': function () {
        return [
          {iconClass: 'menu-open', label: '打开', operation: 'open'},
          {iconClass: 'share', label: '分享', operation: 'share'},
          {iconClass: 'menu-favorite', label: '收藏', operation: 'favorite'},
          {iconClass: 'menu-details', label: '详细信息', operation: 'details'},
          {iconClass: 'menu-rename', label: '重命名', operation: 'rename'},
          {iconClass: 'menu-copy', label: '移动或复制', operation: 'copy'},
          {iconClass: 'menu-download', label: '下载', operation: 'download'},
          {iconClass: 'menu-remove', label: '删除', operation: 'remove'}
        ]
      }
    },
    singleMenusEdit: {
      'type': Array,
      'default': function () {
        return [
          {iconClass: 'menu-open', label: '打开', operation: 'open'},
          {iconClass: 'share', label: '分享', operation: 'share'},
          {iconClass: 'menu-favorite', label: '收藏', operation: 'favorite'},
          {iconClass: 'menu-edit1', label: '编辑', operation: 'edit'},
          {iconClass: 'menu-details', label: '详细信息', operation: 'details'},
          {iconClass: 'menu-rename', label: '重命名', operation: 'rename'},
          {iconClass: 'menu-copy', label: '移动或复制', operation: 'copy'},
          {iconClass: 'menu-download', label: '下载', operation: 'download'},
          {iconClass: 'menu-remove', label: '删除', operation: 'remove'}
        ]
      }
    },
    multipleMenus: {
      'type': Array,
      'default': function () {
        return [
          {iconClass: 'menu-copy', label: '移动或复制', operation: 'copy'},
          {iconClass: 'menu-download', label: '下载', operation: 'download'},
          {iconClass: 'menu-remove', label: '删除', operation: 'remove'}
        ]
      }
    },
    multipleRightMenus: {
      'type': Array,
      'default': function () {
        return [
          {iconClass: 'menu-deselect', label: '取消选定', operation: 'deselect'},
          {iconClass: 'menu-copy', label: '移动或复制', operation: 'copy'},
          {iconClass: 'menu-download', label: '下载', operation: 'download'},
          {iconClass: 'menu-remove', label: '删除', operation: 'remove'}
        ]
      }
    },
    contextMenus: {
      type: Array,
      default: () => []
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
        {'folder': ''},
      ],
      fileList: [],
      pagination: {
        pageIndex: 1,
        pageSize: 50,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50]
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
      contextmenuDisabled: false,
      rowContextData: {},
      tableLoading: true,
      finished: false,
      newFolderLoading: false,
      renameLoading: false,
      menuTriangle: '', // 三角菜单
      cellMouseIndex: -1,
      editingIndex: -1,
      titlePrefix: '',
      unzipOperating: false,
      dialogMoveOrCopyVisible: false,
      directoryTreeData: [],
      compressedFileVisible: false,
      compressedFileData: [],
      compressedFileName: '',
      compressedFileTempDir: false,
      selectTreeNode: {},
      directoryTreeProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf'
      },
      dragLoop: null,
      positionX: 0,
      positionY: 0,
      grid: this.defaultGrid,
      vmode: this.defaultGrid ? 'grid' : 'list',
      gridColumnNum: -1,
      gridColumnWidth: 120,
      allChecked: false,
      summaries: '',
      shareDialog: false,
      newCreateFileDialog: false,
      newCreateFileName: '',
      newCreateFileDialogTitle: '',
      createFileLoading: false,
      shareLink: '',
      shareFileName: '',
      generateShareLinkLoading: true,
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
      drawer: false,
      rowStyleExecuting: false,
      selectRowData: [],
      selectOrgin: -1,// 选择起点(主要用于按住shift键多选)
      selectEnd: -1,// 选择终点
      selectPin: false,// 默认false,不按住
      inputting: false, // 是否正在输入
      isCmd: false,// 是否按住了command(control)键
      dragElementList: [],
      drawFlag: false,
      fileListScrollTop: 0,
      notPreviewDialogVisible: false,
      openingFile: '',
      openCompressionVisible: false,
      stompClient: undefined,//websocket订阅集合
      showUpdateDateItem: true,// 列表模式下是否显示修改时间
      showSizeItem: true,// 列表模式下是否显示文件大小
      stopSortChange: false
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
      return totalSize > 0 ? this.fileList.length + '项 ' + this.getShowSumSize(totalSize) : ''
    },
  },
  created() {
  },
  mounted() {
    Bus.$on('fileSuccess', () => {})
    Bus.$on('loadFileFaild', () => {
      this.notPreviewDialogVisible = true
    })
    Bus.$on('clickMore', (rows) => {
      this.$refs.fileListTable.tableSelectData = rows
      this.preliminaryRowData()
    })
    Bus.$on('renameRow', (row) => {
      let index = this.fileList.findIndex((file) => file.name === row.oldName)
      if (index > -1) {
        let newRow = this.fileList[index]
        newRow.suffix = row.suffix
        newRow.name = row.name
        this.$refs.fileListTable.clearSelection()
      }
    })
    // 监听返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }

    // 获取键盘事件
    window.addEventListener('keydown',  this.keydown)
    window.addEventListener('keyup',  this.keyup)

    // 加载布局
    if (this.$route.query.vmode) {
      this.vmode = this.$route.query.vmode
      if (this.vmode === 'list') {
        this.grid = false
      } else {
        this.grid = true
      }
    }
    // 加载url上的path
    if (this.$route.query.path !== '/') {
      const path = decodeURI(this.$route.query.path)
      this.pathList.splice(1, 1)
      path.split('/').forEach((pathName, index) => {
        if (index > 0) {
          const item = {}
          item['folder'] = pathName
          this.pathList.push(item)
        }
      })
    }
    let that = this
    window.onresize = function () {
      that.clientHeight = document.documentElement.clientHeight - that.lessClientHeight
    }
    // 画矩形选区
    this.darwRectangle()

    Bus.$on('msg/file/change', (msg) => this.onmessage(msg))
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keydown, false)
    window.removeEventListener('keyup', this.keyup, false)
    window.removeEventListener('popstate', this.goBack, false)
    if (this.stompClient) {
      this.stompClient.unsubscribe()
    }
  },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function (el) {
        // 聚焦元素
        let input = el.querySelector('input')
        if (!input) {
          input = el.querySelector('textarea')
        }
        input.focus()
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
    keydown(event) {
      const isMac = navigator.platform.startsWith('Mac');
      const {key, c, keyCode, ctrlKey, metaKey} = event;
      this.isCmd = isMac && metaKey || !isMac && ctrlKey;
      // shift
      if (event.keyCode === 16 && event.shiftKey) {
        this.selectPin = true
      }
      // ctrl + A / cmd + A
      if (this.isCmd && keyCode == 65) {
        if (this.inputting) {
          event.target.select()
        } else {
          this.$nextTick(() => {
            if (this.$refs.fileListTable) {
              this.$refs.fileListTable.toggleAllSelection()
            }
          })
          event.preventDefault()
          event.stopPropagation()
        }
      }
    },
    keyup(event) {
      const isMac = navigator.platform.startsWith('Mac');
      const {key, c, keyCode, ctrlKey, metaKey} = event;
      this.isCmd = isMac && metaKey || !isMac && ctrlKey;
      // 松开shift建
      if (event.keyCode === 16) {
        this.selectPin = false
      }
    },
    onmessage(msg) {
      let fileDoc = JSON.parse(msg.body)
      const url = msg.headers.url
      let index = this.fileList.findIndex(file => file.id === fileDoc.id)
      if ('updateFile' === url) {
        if (index > -1) {
          this.fileList[index].size = fileDoc.size
          this.fileList[index].agoTime = 1
          this.fileList[index].updateDate = fileDoc.updateDate
        }
      }
      if ('deleteFile' === url) {
        if (index > -1) {
          this.fileList.splice(index, 1)
        }
      }
      if ('createFile' === url) {
        if (!this.path) {
          this.path = ''
        }
        if (this.path + '/' === fileDoc.$set.path) {
          this.getFileList()
        }
      }
    },
    load() {
      this.getFileList(true)
    },
    gridItemClick(row) {
      if (this.selectFile) {
        this.fileClick(row)
      }
      if (this.isCmd) {
        this.pinSelect(null, row)
        this.$refs.fileListTable.toggleRowSelection([{row: row}])
        return
      }
      this.pinSelect(null, row)
    },
    containerResize() {
      const container = document.querySelector(".dashboard-container")
      let clientWidth = container.clientWidth
      this.clientHeight = document.documentElement.clientHeight - this.lessClientHeight
      if (this.queryFileType === 'image') {
        this.gridColumnNum = Math.round((clientWidth - 10) / 165)
      } else {
        this.gridColumnNum = Math.round((clientWidth - 10) / 135)
      }
      this.gridColumnWidth = (clientWidth - 11 * this.gridColumnNum) / this.gridColumnNum - 4.5
      if (clientWidth < 900) {
        this.showUpdateDateItem = false
      } else {
        this.showUpdateDateItem = true
      }
      if (clientWidth < 500) {
        this.showSizeItem = false
      } else {
        this.showSizeItem = true
      }
      // 使列表可拖拽
      this.rowDrop()
    },
    // 画矩形选区
    darwRectangle() {

      let scrollDiv = document.querySelector('.el-table__body-wrapper')
      if (this.grid) {
        // 添加grid视图的scroll事件
        document.querySelector('.van-grid').onscroll = (e) => {
          this.tableBodyScroll(null, e)
        }
        scrollDiv = document.querySelector('.van-grid')
      }

      if (this.selectFile) {
        return
      }
      const _this = this
      let $$ = function (id) {
        return document.getElementById(id)
      }
      let draw = $$("v-draw-rectangle")
      let wId = "rectangle1"
      let startX = 0, startY = 0
      let retcLeft = 0, retcTop = 0, retcHeight = 0, retcWidth = 0
      _this.drawFlag = false
      let itemClassName = 'el-table__row'
      if (_this.grid) {
        itemClassName = 'grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square'
      }
      draw.onmousedown = null
      draw.onmousedown = function (e) {
        if (_this.fileListScrollTop > 0) {
          return
        }
        let evt = window.event || e
        const elPath = e.path || (e.composedPath && e.composedPath())
        // 列表模式下点击表头，阻止点击事件
        if (!_this.grid && _this.selectRowData.length > 0) {
          const findIndex = elPath.findIndex(path => {
            if (path.className === 'el-table__header-wrapper') {
              return path
            }
          })
          if (findIndex > -1) {
            _this.stopSortChange = true
          }
        }
        // 点击的区域是否为文件, throughRow 不为空就证明点到了文件
        let throughRow = elPath.find(path => {
          if (path.className === itemClassName || path.className === 'el-table__row el-table__row--striped') {
            return path
          }
        })
        if (throughRow) {
          // 鼠标按下时就选中文件
          if (!_this.selectRowData.includes(_this.fileList[throughRow.rowIndex])) {
            _this.editingIndex = -1
            if (!_this.isCmd && !_this.selectPin) {
              _this.$refs.fileListTable.clearSelection()
              _this.$refs.fileListTable.toggleRowSelection([{row: _this.fileList[throughRow.rowIndex], selected: true}])
            }
          }
          return
        } else {
          _this.editingIndex = -1
        }
        if (evt.button !== 0) {
          return
        }
        if (!_this.isCmd && !_this.selectPin) {
          const index = elPath.findIndex(el => el.className === itemClassName || el.className === 'el-table__row el-table__row--striped')
          if (index < 0) {
            _this.$refs.fileListTable.clearSelection()
          }
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
        document.onmousemove = function (e) {
          let evt = window.event || e
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
          let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft
          retcLeft = (startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX)
          retcTop = (startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY)
          retcHeight = Math.abs(startY - evt.clientY - scrollTop)
          retcWidth = Math.abs(startX - evt.clientX - scrollLeft)
          _this.drawFlag = true
          if ((retcHeight + retcWidth) < 4) {
            return
          }
          const drawRectangle = document.getElementById(wId)
          if (drawRectangle) {
            noScroll()
            drawRectangle.style.left = retcLeft + 'px'
            drawRectangle.style.top = retcTop + 'px'
            drawRectangle.style.width = retcWidth + 'px'
            drawRectangle.style.height = retcHeight + 'px'
            drawRectangle.style.backgroundColor = '#f2f5fa55'
          }
          if (_this.drawFlag && (retcHeight + retcWidth) > 4) {
            if (!drawSelecting) {
              drawSelect({x: retcLeft, y: retcTop, w: retcWidth, h: retcHeight})
            }
          }
        }
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
          if (_this.stopSortChange) {
            _this.stopSortChange = false
            setTimeout(() => {
              _this.changeSelectedStyle(_this.selectRowData)
            }, 200)
          }
          setTimeout(function () {
            restoreScroll()
            _this.drawFlag = false
          }, 50)
          const rectangle = document.getElementById(wId)
          if (rectangle) {
            draw.removeChild(rectangle)
          }
          if (!_this.grid) {
            draw = document.getElementById('drag-table')
          }
          const dragingDivs = Array.prototype.slice.call(draw.getElementsByClassName('dragingDiv'))
          dragingDivs.forEach(el => draw.removeChild(el))
        }
      }
      // 禁止滚动
      let noScroll = function () {
        scrollDiv.onmousewheel = function (evt) {
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
      let restoreScroll = function () {
        scrollDiv.onmousewheel = function (evt) {
          return true
        }
      }

      let drawSelecting = false
      let drawSelect = function (drawNode) {
        drawSelecting = true
        _this.dragElementList.forEach(element => {
          if (checkTouch(element, drawNode)) {
            _this.$refs.fileListTable.toggleRowSelection([{row: _this.fileList[element.rowIndex], selected: true}])
          } else {
            _this.$refs.fileListTable.toggleRowSelection([{row: _this.fileList[element.rowIndex], selected: false}])
          }
        })
        setTimeout(() => drawSelecting = false, 10)
      }
      //检查两个DIV是否有接触
      let checkTouch = function (item, draw) {
        //得到左上角的绝对坐标
        let x1 = item.x
        let y1 = item.y
        let x2 = draw.x
        let y2 = draw.y
        let w1 = item.w;
        let h1 = item.h;
        let w2 = draw.w;
        let h2 = draw.h;
        return ((x1 - x2 <= 0) && (x2 - x1 < w1) || (x1 - x2 >= 0) && (x1 - x2 < w2)) && ((y1 - y2 <= 0) && (y2 - y1 < h1) || (y1 - y2 >= 0) && (y1 - y2 < h2))
      };
    },
    // 行拖拽
    rowDrop() {
      if (this.selectFile) {
        return
      }
      if (this.fileListScrollTop > 0 && this.$route.path !== '/') {
        return
      }
      // 目标元素的背景颜色
      let dragEnterBackCorlor = null
      // 被拖拽元素的背景色
      let dragBackCorlor = null
      const _this = this
      // 被拖动的元素
      let dragged = null;
      // 被拖动的元素的索引
      let draggedIndex = -1;

      let parentClassName = 'van-grid'
      let itemClassName = 'van-grid-item van-grid-item--square'
      let gridItemChildenClassName = 'grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square'
      if (!_this.grid) {
        itemClassName = 'el-table__row'
        parentClassName = 'el-table__body'
      }

      // 正在拖动的元素
      let dragingDiv = null

      let container = document.querySelector('.dashboard-container')

      // 目标元素
      let target = document.querySelector('.el-table__body-wrapper tbody')
      if (this.grid) {
        target = document.querySelector('.van-checkbox-group .van-grid')
      }
      let draw = document.getElementById('v-draw-rectangle')
      if (!this.grid) {
        draw = document.getElementById('drag-table')
      }
      let rows = 0//行数

      let drawOffsetLeft = getElementToPageLeft(draw)

      let firstOver = 0 // 是否刚开始拖动
      let moveTitle = ''
      setTimeout(function () {
        rows = target.childElementCount
        _this.dragElementList = []
        for (let i = 0; i < target.childElementCount; i++) {
          let child = target.children[i]
          // 设置索引,表格自带rowIndex,这里我们设置grid的
          if (_this.grid) {
            if (child.rowIndex !== i) {
              child.rowIndex = i
            }
            child.children[0].children[0].rowIndex = i
            child = child.children[0].children[0]
          }
          // 为画矩形选取准备数据
          let pos = getObjPos(child)
          child.w = child.offsetWidth
          child.h = child.offsetHeight
          child.x = pos.x
          child.y = pos.y
          pos.rowIndex = child.rowIndex
          _this.dragElementList.push(child)

          // 使元素可拖动
          child.draggable = true
          // 给能拖动的元素加上标识,只有加上此标识才能被拖动,否则即使draggable = true,也无法拖动(在全局的ondragstart里拦截)
          child.slot = 'jmal'
          let childOfImg = child.querySelector('.el-avatar > img')
          if (_this.grid) {
            childOfImg = child.querySelector('.el-image > img')
          }
          if (childOfImg) {
            childOfImg.draggable = false
          }
        }
      }, 300)

      // 被拖动的元素正在那个容器里
      let dragIndex = -1

      // 判断经过了那个元素
      let judgThroughDom = function (e, d) {
        const elPath = e.path || (e.composedPath && e.composedPath())
        if (d === 'enter') {
          // 这里进入其他容器后 清除上次进入的容器的状态
          let node = null
          const className = e.toElement.className
          if (_this.grid) {
            if (e.toElement.className === itemClassName) {
              node = e.toElement
            }
            if (e.toElement.className === parentClassName) {
              node = e.fromElement
            }
          } else {
            // 列表模式
            if (elPath[0].id === 'v-draw-rectangle' || elPath[0].className === 'el-table__virtual-wrapper') {
              // 超出列表底部
              node = e.toElement
            } else {
              // 超出列表顶部
              node = elPath.find(path => {
                if (path.className === 'el-table__header-wrapper') {
                  return path
                }
              })
            }
          }
          if (node) {
            // console.log(d,e,node,node.rowIndex)
            if (dragIndex > -1) {
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex];
              clearClass(last)
            }
            // console.log("离开了",leaveIndex,"dragIndex:",dragIndex)
            // leaveIndex = node.rowIndex
            // const leave = target.children[leaveIndex];
            // clearClass(leave)
            dragIndex = -1
          }
        }
        let throughRow = null
        if (_this.grid) {
          if (elPath[0].className === gridItemChildenClassName) {
            // throughRow 表示被拖动的元素正在哪一行上
            return throughRow
          } else {
            throughRow = elPath.find(path => {
              if (path.className === gridItemChildenClassName) {
                return path
              }
            })
          }
          return throughRow
        } else {
          if (elPath[0].tagName === 'TD') {
            // throughRow 表示被拖动的元素正在哪一行上
            throughRow = elPath.find(path => {
              if (path.className === 'el-table__row el-table__row--striped' || path.className === 'el-table__row') {
                return path
              }
            })
          }
          return throughRow
        }
      }

      /***
       * 复原拖拽的dom
       * @param animation 是否显示动画
       */
      let recoverDragDom = function (animation) {
        if (animation) {
          _this.selectRowData.forEach(row => {
            let dragingDiv = document.getElementById('dragingDiv' + row.index)
            dragingDiv.style.transition = 'all 0.3s'
            dragingDiv.style.top = dragingDiv.original.top
            dragingDiv.style.left = dragingDiv.original.left
          })
          setTimeout(() => {
            _this.selectRowData.forEach(row => {
              draw.removeChild(document.getElementById('dragingDiv' + row.index))
            })
          }, 300)
        } else {
          _this.selectRowData.forEach(row => {
            draw.removeChild(document.getElementById('dragingDiv' + row.index))
          })
        }
      }

      container.ondragend = function (e) {
        Bus.$emit('onDragStart', false)
        e.dataTransfer.effectAllowed = 'none'
        // console.log('child'+dragIndex+'拖拽结束');
        // 清除上次进入的容器的状态
        const last = target.children[dragIndex];
        clearClass(last)
        dragged.style.cursor = 'default'
        e.target.parentNode.parentNode.title = moveTitle
      }
      // 开始拖拽
      container.ondragstart = (e) => {
        // 正在选区获取按住关键键时禁止拖拽
        if (_this.drawFlag || _this.isCmd || _this.selectPin) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        // 判断被拖拽dom是否有slot属性并且等于'jmal'
        if (!e.target.slot || e.target.slot !== 'jmal') {
          return true
        }
        // 该文件正在重命名
        if (e.target.rowIndex === _this.editingIndex) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        e.target.style.cursor = 'no-drop'
        // 当滚动条滚动后禁止拖拽
        if (_this.fileListScrollTop === 0) {
          // 复制被拖拽dom的title, 拖拽过程中移除, 拖拽完后还原
          moveTitle = e.target.parentNode.parentNode.title
          e.target.parentNode.parentNode.title = ''
          // 创建拖拽时的dom, 克隆自被拖拽dom
          _this.selectRowData.forEach((row, index) => {
            const element = _this.dragElementList[row.index]
            const rowIndex = element.rowIndex
            dragingDiv = element.cloneNode(true)
            dragingDiv.id = 'dragingDiv' + rowIndex
            dragingDiv.classList.add('dragingDiv')
            dragingDiv.classList.remove('el-table_row')
            dragingDiv.style.transition = 'all 0.3s'
            dragingDiv.style.zIndex = -1
            dragingDiv.style.position = 'absolute'
            const pos = _this.dragElementList[rowIndex]
            dragingDiv.style.width = pos.w + 'px'
            dragingDiv.style.height = pos.h + 'px'
            dragingDiv.style.left = pos.x - drawOffsetLeft + 'px'
            if (!_this.grid) {
              dragingDiv.firstChild.style.textAlign = 'center'
              let tds = Array.prototype.slice.call(dragingDiv.childNodes)
              tds.forEach((node, index) => {
                if (index === 4) {
                  node.style.borderRadius = '0 3px 3px 0'
                  node.style.borderRight = '1px solid #409eff'
                  node.firstChild.style.width = '80px'
                  return true
                }
                if (index !== 0 && index !== 1) {
                  dragingDiv.removeChild(node)
                }
              })
              dragingDiv.style.top = pos.y - 51.5 + 'px'
            } else {
              dragingDiv.style.top = pos.y - pos.h / 2 + 10 + 'px'
            }
            if (index === 0) {
              let numberFilesCopy = document.getElementById("numberFiles").cloneNode(true)
              numberFilesCopy.id = 'numberFilesCopy'
              numberFilesCopy.querySelector('.number').innerHTML = _this.selectRowData.length + '个文件'
              dragingDiv.appendChild(numberFilesCopy)
            }
            dragingDiv.original = {top: dragingDiv.style.top, left: dragingDiv.style.left}
            draw.appendChild(dragingDiv)
          })
          firstOver = 0
          let dragImage = document.getElementById('dragImage');
          e.dataTransfer.setDragImage(dragImage, 10, 10)
          Bus.$emit('onDragStart', true)
          // 避免和画矩形选区冲突
          _this.drawFlag = false
          let rectangle = document.getElementById('rectangle1')
          if (rectangle) {
            document.getElementById('v-draw-rectangle').removeChild(rectangle)
          }
          dragged = e.target
          draggedIndex = dragged.rowIndex
          // 只有选中的才能拖拽
          _this.cellMouseIndex = -1
          dragBackCorlor = dragged.style.backgroundColor
        }
      }
      container.ondragenter = function (e) {
        // console.log('ondragenter', e.target)
        clearTimeout(loop)
        // 由于被拖动的元素 经过区域内中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
        let throughRow = judgThroughDom(e, 'enter')
        if (throughRow) {
          if (dragIndex !== throughRow.rowIndex) {
            if (dragIndex > -1) {
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex];
              clearClass(last)
            }
            // console.log('拖动进入目标元素'+throughRow.rowIndex,'dragIndex:',dragIndex);
            // 不是自己或为文件夹时才改变状态
            if (draggedIndex !== throughRow.rowIndex && _this.fileList[throughRow.rowIndex].isFolder && _this.selectRowData.findIndex(item => item.index === throughRow.rowIndex) === -1) {
              // 改变本次进入的容器的状态
              dragged.style.cursor = 'copy'

              let numberFilesCopy = document.getElementById('numberFilesCopy')
              numberFilesCopy.style.backgroundColor = '#40a9ffc9'
              numberFilesCopy.querySelector('.number').style.display = 'none'
              numberFilesCopy.querySelector('.icon').style.display = 'inline'
              numberFilesCopy.querySelector('.operate').style.display = 'inline'
              let targetFolder = numberFilesCopy.querySelector('.target .folder')
              targetFolder.style.display = 'inline'
              targetFolder.innerHTML = _this.fileList[throughRow.rowIndex].name

              dragEnterBackCorlor = throughRow.style.backgroundColor
              // 当拖拽文件夹上时，文件夹当背景色
              const color = '#9fcdfc99'
              if (_this.grid) {
                throughRow.style.backgroundColor = color
              } else {
                throughRow.childNodes.forEach(node => node.style.backgroundColor = color)
              }
            }
            dragIndex = throughRow.rowIndex
          }
          leaveIndex = -1
        }
      }

      container.ondragover = function (e) {
        _this.selectRowData.forEach((row, index) => {
          const drawRectangle = document.getElementById('dragingDiv' + row.index)
          if (drawRectangle) {
            drawRectangle.style.left = e.clientX - drawOffsetLeft + index * 3 + 10 + 'px'
            drawRectangle.style.top = e.clientY - 50 + index * 3 + 10 + 'px'
            if (firstOver === 0) {
              drawRectangle.style.zIndex = 999
              setTimeout(() => {
                drawRectangle.style.transition = ''
              }, 300)
            }
          }
        })
        e.preventDefault()
        leaveIndex = -1
        firstOver++
      }

      let loop = null
      let leaveIndex = -1 // 是否拖出了整个table, -1表示还在table内

      container.ondragleave = function (e) {
        clearTimeout(loop)
        let throughRow = judgThroughDom(e, 'leave')
        if (throughRow) {
          if (!_this.grid) {
            if (throughRow.rowIndex === 0 || throughRow.rowIndex === rows - 1) {
              // 离开第一行或最后一行
              leaveIndex = throughRow.rowIndex
              loop = setTimeout(function () {
                if (leaveIndex > -1) {
                  const leave = target.children[leaveIndex];
                  clearClass(leave)
                  dragIndex = -1
                }
              }, 100)
            }
          }
        }
      }
      container.ondrop = function () {
        // console.log('放下了'+draggedIndex);
        const form = _this.fileList[draggedIndex]
        const to = _this.fileList[dragIndex]
        if (form && to && form.id !== to.id && to.isFolder && !_this.selectRowData.includes(to)) {
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
            recoverDragDom(false)
          }).catch(() => {
            recoverDragDom(true)
          })
        } else {
          recoverDragDom(true)
        }
      }
      // 清除之前的样式
      let clearClass = function (node) {
        if (!dragged) {
          return
        }
        if (node) {
          if (_this.grid) {
            node = node.children[0].children[0]
            // #9fcdfc99
            if (node.style.backgroundColor === 'rgba(159, 205, 252, 0.6)') {
              node.style.backgroundColor = null
            }
          } else {
            // #9fcdfc99
            if (node.firstChild.style.backgroundColor === 'rgba(159, 205, 252, 0.6)') {
              node.childNodes.forEach(node => {
                node.style.backgroundColor = null
              })
            }
          }
          dragged.style.cursor = 'default'

          let numberFilesCopy = document.getElementById('numberFilesCopy')
          if (numberFilesCopy) {
            numberFilesCopy.style.backgroundColor = '#d2eefa66'
            numberFilesCopy.querySelector('.number').style.display = 'inline'
            numberFilesCopy.querySelector('.icon').style.display = 'none'
            numberFilesCopy.querySelector('.operate').style.display = 'none'
            numberFilesCopy.querySelector('.target .folder').style.display = 'none'
          }
        }
        dragged.style.backgroundColor = dragBackCorlor
      }

      function getObjPos(obj) {
        let pos = {x: 0, y: 0}
        while (obj) {
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
      if (window.uploader.supportDirectory) {
        // 打开文件夹选择框
        Bus.$emit('uploadFolder', {
          // 传入的参数
          currentDirectory: this.path,
          username: this.$store.state.user.name,
          userId: this.$store.state.user.userId
        })
      } else {
        this.$message({
          message: '该浏览器不支持上传文件夹',
          type: 'warning'
        });
      }
    },
    // 浏览器的返回事件
    goBack() {
      if (this.pathList.length <= 1) {
        this.$router.push(`/?vmode=${this.vmode}&path=${encodeURI(this.path)}`)
        return
      }
      this.lastLink()
    },
    lastLink() {
      this.handleLink(this.pathList[this.pathList.length - 2], this.pathList.length - 2)
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
        if (!unPushLink) {
          if (!this.$route.query.path) {
            this.$router.push(`?vmode=${this.vmode}&path=${encodeURI(this.path)}`)
          } else {
            this.$router.push(`?vmode=${this.vmode}&path=${encodeURI(this.path)}`)
          }
        }
        if (!unRefresh) {
          this.pagination.pageIndex = 1
          this.getFileList()
        }
      }
    },
    // 新建文档
    newDocument() {
      window.open(`/setting/website/manager-articles?operation=new`, "_blank");
    },
    newFolder() {
      this.newFolderName = this.getNewFileName(this.fileList, '新建文件夹')
      this.showNewFolder = true
      this.$nextTick(() => {
        this.$refs.newFolderName.focus()
        this.$refs.newFolderName.select()
      })
    },
    getNewFileName(fileList, newFileName) {
      let append = 0
      let filenameList = []
      fileList.forEach(file => {
        let fileName = file.name || file.label
        // if (file.suffix) {
        //   fileName = fileName.substring(0, fileName.lastIndexOf(`.${file.suffix}`))
        // }
        filenameList.push(fileName)
      })
      const newName = newFileName
      while (filenameList.includes(newFileName)) {
        append += 1
        if (newName.indexOf('.') > 0) {
          const name = newName.substring(0, newName.lastIndexOf('.'))
          const suffix = newName.substring(newName.lastIndexOf('.'))
          newFileName = `${name}${append}${suffix}`
        } else {
          newFileName = `${newName}${append}`
        }
      }
      return newFileName
    },
    hideNewFolderName() {
      this.showNewFolder = false
      this.isShowNewFolder = false
    },
    showNewFolderClick() {
      this.isShowNewFolder = true
    },
    setInputFocus() {
      this.inputting = true
    },
    setInputBlur() {
      this.inputting = false
    },
    newFolderNameClickEnter() {
      this.newFolderNameClick()
    },
    // 新建文件夹
    newFolderNameClick() {
      if (this.newFolderName) {
        if (/[\[\]\/\\"<>\?\*]/gi.test(this.newFolderName)) {
          this.$message({
            message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
            type: 'warning'
          });
          return;
        }
        this.newFolderLoading = true
        api.uploadFolder({
          isFolder: true,
          filename: encodeURI(this.newFolderName),
          currentDirectory: encodeURI(this.path),
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
        }).catch(() => {
          this.newFolderLoading = false
        })
      } else {
        this.newFolderLoading = false
        this.$message({
          message: '请输入文件夹名称',
          type: 'warning'
        });
      }
    },
    // 新建文件
    createFile(newFileName) {
      if (newFileName) {
        if (/[\[\]\/\\"<>\?\*]/gi.test(newFileName)) {
          this.$message({
            message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
            type: 'warning'
          })
          return
        }
        this.createFileLoading = true
        let parentPath = "/"
        if (this.path) {
          if (this.path.length > 0) {
            parentPath = this.path
          }
        }
        let suffix = newFileName.substring(newFileName.lastIndexOf('.') + 1);
        api.addFile({
          fileName: encodeURI(newFileName),
          isFolder: false,
          username: this.$store.state.user.name,
          parentPath: encodeURI(parentPath)
        }).then((res) => {
          this.createFileLoading = false
          switch (suffix) {
            case 'txt':
              // 打开编辑器
              this.textPreviewRow = res.data
              this.textPreviewVisible = true
              break
            case 'drawio':
            case 'mind':
            case 'docx':
            case 'xlsx':
            case 'pptx':
              this.officePreviewRow = res.data
              this.officePreviewVisible = true
              break
          }
          const that = this
          setTimeout(function () {
            that.newCreateFileDialog = false
          }, 200)
        }).catch(() => {
          this.createFileLoading = false
        })

      }
    },
    searchFileByKeyWord(key) {
      this.searchFile(key)
    },
    // 切换布局
    changeVmode() {
      this.grid = !this.grid
      this.vmode = 'list'
      if (this.grid) {
        this.vmode = 'grid'
      } else {
        this.$refs.fileListTable.setHeight()
      }
      if (!this.path) {
        this.path = ''
      }
      this.editingIndex = -1
      this.$router.push(`?vmode=${this.vmode}&path=${this.path}`)
      // 改变拖拽目标
      this.rowDrop()
      // 画矩形选取
      this.darwRectangle()
      this.loadContextMenus()
    },
    // 加载菜单查看状态
    loadContextMenus() {
      if (this.contextMenus.length < 1) {
        this.contextmenuDisabled = true
        return
      }
      let container = document.querySelector('.dashboard-container')
      if (this.$refs.homeContextmenu.references.length === 0) {
        this.$refs.homeContextmenu.addRef({el: container, vnode: container})
      }
      const viewModeIndex = this.contextMenus.findIndex(item => item.operation === 'viewMode')
      const arrangementModeIndex = this.contextMenus.findIndex(item => item.operation === 'arrangement')
      if (viewModeIndex > -1) {
        const child = this.contextMenus[viewModeIndex].child
        if (this.grid) {
          child[0].iconClass = 'menu-empty'
          child[1].iconClass = 'menu-point'
        } else {
          child[0].iconClass = 'menu-point'
          child[1].iconClass = 'menu-empty'
        }
      }
      if (arrangementModeIndex > -1) {
        const child = this.contextMenus[arrangementModeIndex].child
        const prop = this.sortable.prop
        child.forEach(item => {
          const orderProp = item.orderProp
          if (orderProp === prop) {
            child.map(item => {
              if (orderProp === item.orderProp) {
                item.iconClass = 'menu-' + this.sortable.order
              } else {
                item.iconClass = 'menu-null'
              }
              return item
            })
          }
        })
      }
      // 加载顶部的排序下拉框

    },
    // 请求之前的准备
    beforeLoadData(onLoad) {
      if (onLoad) {
        this.pagination.pageIndex++
      } else {
        this.pagination.pageIndex = 1
      }
      this.tableLoading = true
      this.finished = false
    },
    // 填充数据
    loadData(res, onLoad) {
      if (!this.$refs.fileListTable) {
        return
      }
      if (onLoad) {
        res.data.forEach((file, number) => {
          file['index'] = (this.pagination.pageIndex - 1) * this.pagination.pageSize + number
          this.fileList.push(file)
        });
      } else {
        this.fileList = res.data
        this.fileList.map((item, index) => {
          item.index = index
        })
        this.$refs.fileListTable.reloadData(this.fileList)
        setTimeout(() => {
          this.$refs.fileListTable.reloadData(this.fileList)
        }, 0)
      }
      // 数据全部加载完成
      if (this.fileList.length >= res.count) {
        this.finished = true;
      }
      this.tableLoading = false
      this.clientHeight = document.documentElement.clientHeight - this.lessClientHeight
      this.listModeSearch = false
      this.pagination['total'] = res.count
      this.$nextTick(() => {
        this.containerResize()
        this.tableLoading = false
      })
      // 加载菜单状态
      this.loadContextMenus()
      // 使列表滑到顶部
      if (!onLoad && !this.grid) {
        if (this.fileListScrollTop > 0) {
          this.$refs.fileListTable.pagingScrollTopLeft()
        }
      }
      this.fileListScrollTop = 0
    },
    searchFile(key, onLoad) {
      if (key) {
        this.beforeLoadData(onLoad)
        this.pathList = [{'folder': ''}]
        const item1 = {}
        item1['folder'] = '搜索: ' + '"' + key + '"'
        item1['search'] = true
        item1['searchKey'] = key
        this.pathList.push(item1)
        this.$router.push(`?vmode=${this.vmode}&search-file=${key}`)
        api.searchFile({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          keyword: key,
          sortableProp: this.sortable.prop,
          order: this.sortable.order,
          currentDirectory: encodeURI(this.$route.query.path),
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.loadData(res, onLoad)
          this.path = ''
          this.listModeSearch = true
          this.listModeSearchOpenDir = false
        })
      }
    },
    searchFileAndOpenDir(row, onLoad) {
      this.beforeLoadData(onLoad)
      api.searchFileAndOpenDir({
        userId: this.$store.state.user.userId,
        id: row.id,
        currentDirectory: encodeURI(this.$route.query.path),
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loadData(res, onLoad)
        this.listModeSearch = true
        this.listModeSearchOpenDir = row
      })
      this.path = row.path + row.name
    },
    openDir(row, onLoad) {
      this.beforeLoadData(onLoad)
      api.searchFileAndOpenDir({
        userId: this.$store.state.user.userId,
        id: row.id,
        currentDirectory: encodeURI(this.$route.query.path),
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loadData(res, onLoad)
      })
      this.path = row.path + row.name
    },
    getFileList(onLoad) {
      this.beforeLoadData(onLoad)
      api.fileList({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        currentDirectory: encodeURI(this.$route.query.path),
        queryFileType: this.queryFileType,
        sortableProp: this.sortable.prop,
        order: this.sortable.order,
        isFolder: this.queryCondition.isFolder,
        isFavorite: this.queryCondition.isFavorite,
        queryCondition: this.queryCondition,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loadData(res, onLoad)
      })
    },
    getFileListBySearchMode(onLoad) {
      this.beforeLoadData(onLoad)
      api.fileList({
        userId: this.$store.state.user.userId,
        currentDirectory: encodeURI(this.$route.query.path),
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loadData(res, onLoad)
      })
    },
    tableBodyScroll(table, e) {
      this.fileListScrollTop = e.target.scrollTop
      Bus.$emit("fileListScrollTop", this.fileListScrollTop)
      let scrollBottom = e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop;
      if (scrollBottom < 200) {
        if (!this.finished) {
          if (this.listModeSearch) {
            if (this.listModeSearchOpenDir) {
              this.searchFileAndOpenDir(this.listModeSearchOpenDir, true)
            } else {
              this.searchFile(this.searchFileName, true)
            }
          } else {
            this.getFileList(true)
          }
        }
      }
    },
    pinSelect(rows, row) {
      if (this.selectPin && this.selectOrgin > -1) {
        const orgin = this.selectOrgin
        this.selectEnd = row.index
        let diff = this.selectEnd - orgin
        // 先清除选中
        this.$refs.fileListTable.clearSelection()
        if (diff === 0) {
          this.selectOrgin = -1
        }
        if (diff > 0) {
          for (let i = orgin; i <= this.selectEnd; i++) {
            this.$refs.fileListTable.toggleRowSelection([{row: this.fileList[i], selected: true}])
            this.$refs.fileListTable.tableSelectData.push(this.fileList[i])
          }
        }
        if (diff < 0) {
          for (let i = this.selectEnd; i <= orgin; i++) {
            this.$refs.fileListTable.toggleRowSelection([{row: this.fileList[i], selected: true}])
            this.$refs.fileListTable.tableSelectData.push(this.fileList[i])
          }
        }
      }
      this.changeSelectedStyle(this.$refs.fileListTable.tableSelectData)
    },
    sortChangeOfMenu(prop, headerIndex) {
      let tableHeader = document.querySelector('.el-table__header thead tr')
      // 去掉table-header上所有排序高亮
      tableHeader.childNodes.forEach(el => {
        if (el.className.indexOf('is-sortable') > -1) {
          this.removeClass(el, "descending")
          this.removeClass(el, "ascending")
        }
      })
      // 重新加上排序高亮
      let order = this.sortable.order === 'ascending' ? 'descending' : 'ascending'
      this.addClass(tableHeader.children[headerIndex], order)
      this.orderCustom = true
      this.sortChange({prop: prop, order: order})
    },
    sortChange(column) {
      let {prop, order} = column
      if (this.orderCustom || this.listModeSearch) {
        this.sortable.prop = prop
        this.sortable.order = order
        this.pagination.pageIndex = 1
        if (this.listModeSearch) {
          this.searchFile(this.searchFileName)
        } else {
          this.getFileList();
        }
      }
    },
    removeClass(el, className) {
      const str = el.className
      if (str.indexOf(className) > -1) {
        el.className = str.replace(className, "")
      }
    },
    addClass(el, className) {
      if (el) {
        const str = el.className
        el.className = el.className + " " + className
      }
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
      if (checked) {
        this.fileList.forEach(row => {
          this.selectRowData.push(row)
        })
      } else {
        this.isIndeterminate = false
      }
    },
    // 收集选中的index值作为数组 传递给rowRed判断变换样式
    handleSelectionChange(rows) {
      // 起点
      if (rows.length > 0) {
        if (!this.selectPin) {
          this.selectOrgin = rows[0].index
        }
        if (this.selectPin) {
          return
        }
        this.rowContextData = rows[0]
      }
      this.$refs.fileListTable.tableSelectData = rows
      this.selectRowData = rows
      this.changeSelectedStyle(rows)
    },
    changeSelectedStyle(rows) {
      if (this.stopSortChange) {
        return
      }
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
      if (this.selectRowData.length === this.fileList.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
    },
    // cell-style 通过返回值可以实现样式变换利用传递过来的数组index循环改变样式
    rowStyle({row, column, rowIndex, columnIndex}) {
      if (this.$refs.fileListTable.tableSelectData.findIndex(item => item.index === rowIndex) > -1) {
        if (columnIndex === 0) {
          return {
            backgroundColor: '#e0f3fc !important',
            borderRadius: '3px 0 0 3px',
            borderLeft: '1px solid #409eff',
            borderTop: '1px solid #409eff',
            borderBottom: '1px solid #409eff'
          }
        }
        if (columnIndex === 5) {
          return {
            backgroundColor: '#e0f3fc !important',
            borderRadius: '0 3px 3px 0',
            borderRight: '1px solid #409eff',
            borderTop: '1px solid #409eff',
            borderBottom: '1px solid #409eff'
          }
        }
        return {
          backgroundColor: '#e0f3fc !important',
          borderTop: '1px solid #409eff',
          borderBottom: '1px solid #409eff'
        }
      }
    },
    // 动态添加index到row里面去
    tableRowClassName({row, rowIndex}) {
      // row.index = rowIndex
    },
    // 选择某行预备数据#e0f3fc !important;
    preliminaryRowData(row) {
      if (row) {
        // this.$refs.fileListTable.tableSelectData[0] = row
        this.rowContextData = row
      }
      const isFavorite = this.rowContextData.isFavorite
      this.highlightFavorite(this.isCollectView ? true : isFavorite, false)
    },
    // 单元格hover进入时事件
    cellMouseEnter(row) {
      if (this.$refs.contextShow.locals.menuType === 'moreClick' && this.$refs.contextShow.locals.rowIndex !== row.index) {
        this.$refs.contextShow.hideMenu()
      }
      if (this.editingIndex === -1 && !this.$refs.contextShow.ctxVisible) {
        if (this.selectRowData.length <= 1) {
          this.cellMouseIndex = row.index
        }
      }
    },
    // 单元格hover退出时事件
    cellMouseLeave(row) {
      if (this.$refs.contextShow.locals.menuType === 'moreClick' && this.$refs.contextShow.locals.rowIndex !== row.index) {
        this.$refs.contextShow.hideMenu()
        this.$refs.contextShow.locals = {}
        return
      }
      if (this.$refs.contextShow.ctxVisible && this.$refs.contextShow.locals.menuType === 'moreClick' && this.$refs.contextShow.locals.rowIndex === row.index) {
        return
      }
      this.cellMouseIndex = -1
    },
    //双击
    dblclick(row) {
      this.fileClick(row)
    },
    // 单元格点击事件
    cellClick(row, column) {
      if (this.selectFile) {
        this.fileClick(row)
        return
      }
      clearTimeout(this.Loop);
      if (this.editingIndex === -1) {
        const columnIndex = column.index
        if (columnIndex === 2) {
          if (this.selectRowData.length < 1) {
            if (row.index !== this.editingIndex) {
              this.editingIndex = -1
            }
          }
        }
        if (this.isCmd) {
          this.pinSelect(null, row)
          this.$refs.fileListTable.toggleRowSelection([{row: row}])
          return
        }
        this.pinSelect(null, row)
      }
    },
    // 选取输入框部分内容
    renameInputFocus(doc, suffix) {
      doc.focus()
      doc.selectionStart = 0
      doc.selectionEnd = doc.value.length
      if (suffix) {
        doc.selectionEnd -= suffix.length + 1
      }
    },
    // 重命名
    rowRename(newFileName, row) {
      //去掉回车换行
      newFileName = newFileName.replace(/[\r\n]/g, "");
      if (newFileName) {
        if (/[\[\]\/\\"<>\?\*]/gi.test(newFileName)) {
          this.$message({
            message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
            type: 'warning'
          });
          return;
        }
        let strFileName = newFileName.replace(/(.*\/)*([^.]+).*/ig, "$2");
        let newExt = newFileName.replace(/.+\./, "");
        if (!row.isFolder) {
          if (row.suffix !== newExt) {
            this.$confirm(`您确定要将扩展名“.${row.suffix}”更改为“.${newExt}”吗？`, '提示', {
              type: 'warning',
              showClose: false,
              closeOnClickModal: false,
              confirmButtonText: `保持.${row.suffix}`,
              cancelButtonText: `使用.${newExt}`,
            }).then(() => {
              newFileName = strFileName + '.' + row.suffix
            }).catch(() => {
            }).then(() => {
              this.rename(row, newFileName)
            })
          } else {
            this.rename(row, newFileName)
          }
        } else {
          this.rename(row, newFileName)
        }
      } else {
        this.editingIndex = -1
      }
    },
    rename(row, newFileName) {
      if (row.name === newFileName) {
        this.editingIndex = -1
        return
      }
      this.renameLoading = true
      const findIndex = this.fileList.findIndex(item => {
        if (newFileName === item.name) {
          return item
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
        newFileName: encodeURI(newFileName),
        username: this.$store.state.user.name,
        id: row.id
      }).then(res => {
        if (res.data) {
          this.renameLoading = false
          row.name = newFileName
          row.suffix = newFileName.replace(/.+\./, "")
          this.fileList[row.index] = row
          this.editingIndex = -1
        }
      }).then(() => {
        this.$refs.fileListTable.clearSelection()
        this.$message.success("重命名成功")
      }).catch(() => {
        this.renameLoading = false
        this.editingIndex = -1
      })
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
      this.preliminaryRowData(row)
      this.showOperationMenus(event, {'menuType': 'moreClick', rowIndex: row.index})
    },
    // 鼠标右击
    rowContextmenu(row) {
      if (this.selectFile) {
        return
      }
      if (this.$refs.fileListTable.tableSelectData.length > 1 && this.$refs.fileListTable.tableSelectData.findIndex(item => item.index === row.index) > -1) {
        this.menusIsMultiple = true
        this.menus = this.multipleRightMenus
        this.highlightFavorite(this.isCollectView, false)
      } else {
        this.$refs.fileListTable.clearSelection()
        this.$refs.fileListTable.toggleRowSelection([{row: row}])
        this.menusIsMultiple = false
        if (row.suffix && row.suffix.includes("md")) {
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
      this.$refs.contextShow.showMenu(e)
      this.cellMouseIndex = -1
    },
    // 显示操作菜单
    showOperationMenus(event, menuData) {
      let offsetY = event.pageY
      if (event.target.clientHeight > 0) {
        offsetY += event.target.clientHeight / 2 - event.offsetY
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
        this.$refs.contextShow.showMenu(e, menuData)
      }
    },
    menuFavoriteOver(index, isFavorite) {
      this.highlightFavorite(this.isCollectView ? true : isFavorite, false)
    },
    menuFavoriteLeave(index, isFavorite) {
      this.highlightFavorite(this.isCollectView ? true : isFavorite, false)
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
      const that = this
      this.contextmenuDisabled = true
      setTimeout(function () {
        that.contextmenuDisabled = false
      }, 1000)
    },
    hide() {
      const that = this
      this.isJustHideMenus = true
      setTimeout(function () {
        that.isJustHideMenus = false
      }, 100)
      this.cellMouseIndex = -1
    },
    // 全局右键菜单操作
    contextmenuClick(operation) {
      switch (operation) {
        case 'vmode-list':
          this.grid = true;
          this.changeVmode()
          break
        case 'vmode-grid':
          this.grid = false;
          this.changeVmode()
          break
        case 'orderName':
          this.sortChangeOfMenu('name', 2)
          break
        case 'orderSize':
          this.sortChangeOfMenu('size', 5)
          break
        case 'orderUpdateDate':
          this.sortChangeOfMenu('updateDate', 6)
          break
        case 'refresh':
          this.getFileList()
          break
        case 'createTextFile':
          this.newCreateFileDialogTitle = "新建文本文件"
          this.createNewFile('txt')
          break
        case 'createDrawioFile':
          this.newCreateFileDialogTitle = "新建流程图"
          this.createNewFile('drawio')
          break
        case 'createMinderFile':
          this.newCreateFileDialogTitle = "新建思维导图"
          this.createNewFile('mind')
          break
        case 'createWordFile':
          this.newCreateFileDialogTitle = "新建Word文档"
          this.createNewFile('docx')
          break
        case 'createExcelFile':
          this.newCreateFileDialogTitle = "新建Excel工作表"
          this.createNewFile('xlsx')
          break
        case 'createPPTFile':
          this.newCreateFileDialogTitle = "新建PPT演示文档"
          this.createNewFile('pptx')
          break
        case 'createMarkdownFile':
          this.newDocument()
          break
      }
    },
    // 新建文件
    createNewFile(suffix) {
      this.newCreateFileName = `未命名文件.${suffix}`
      this.newCreateFileName = this.getNewFileName(this.fileList, this.newCreateFileName)
      this.newCreateFileDialog = true
      this.$nextTick(() => {
        let newFileNameInput = this.$refs.newCreateFileName.$el.querySelector('.el-input__inner')
        this.renameInputFocus(newFileNameInput, suffix)
      })
    },
    // 列表右键菜单操作
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
          window.open(`/setting/website/manager-articles?operation=editor&id=${this.rowContextData.id}`, '_blank')
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
    clearTreeNode() {
      let rootNode = this.$refs.directoryTree.getNode('0')
      rootNode.loaded = false
      rootNode.expanded = false
    },
    // 加载下一级文件树
    directoryTreeLoadNode(node, resolve) {
      let fileId = null
      if (node.level === 0) {
        const that = this
        setTimeout(function () {
          that.$refs.directoryTree.setCurrentKey('0')
        }, 0)
        return resolve([{'id': "0", 'name': '全部文件'}])
      }
      if (node.level > 1) {
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
    treeNodeClick(row, node, event) {
      this.selectTreeNode = row
      this.selectTreeNode.showName = ' "' + row.name + '"'
    },
    // 节点被展开时触发
    treeNodeExpand(row, node, event) {
    },
    // 文件树里新建文件夹
    fileTreeAndNewFolder() {
      let newNodeId = 'newFolderNodeKey'
      let node = this.$refs.directoryTree.getNode(newNodeId)
      if (node !== null) {
        this.$refs.directoryTree.remove(node)
      }

      let childNodes = this.$refs.directoryTree.store.currentNode.childNodes
      let newFolderName = this.getNewFileName(childNodes, '新建文件夹')
      let newNode = {
        id: newNodeId,
        newFolder: true,
        name: newFolderName,
        showName: newFolderName,
        isLeaf: true
      }
      this.$refs.directoryTree.append(newNode, this.selectTreeNode)
      const that = this
      setTimeout(function () {
        let treeInput = document.getElementById("treeInput")
        if (treeInput) {
          treeInput.value = newFolderName
          treeInput.focus()
          treeInput.select()
        }
      }, 100)
    },
    // 移动文件
    moveFileTree() {
      this.copyOrMove('move');
    },
    // 复制文件
    copyFileTree() {
      this.copyOrMove('copy');
    },
    // 解压文件
    confirmUnzip() {
      this.unzip(this.openingFile, this.selectTreeNode.id, false)
    },
    moveOrCopy() {
      this.dialogMoveOrCopyVisible = true
      this.titlePrefix = '移动或复制到: '
      const that = this
      setTimeout(function () {
        that.selectTreeNode = that.$refs.directoryTree.getCurrentNode()
        that.selectTreeNode.showName = ' "' + that.selectTreeNode.name + '"'
      }, 100)
    },
    copyOrMove(operating) {
      let operation = '复制'
      if (operating === 'move') {
        operation = '移动'
      }
      let selectNodePath = '/'
      if (this.selectTreeNode.path) {
        selectNodePath = this.selectTreeNode.path + this.selectTreeNode.name + "/"
      }

      let fileIds = [];
      if (this.menusIsMultiple || this.selectRowData.length > 1) {
        const exits = this.$refs.fileListTable.tableSelectData.some(value => {
          fileIds.push(value.id)
          const thisParentPath = value.path
          if (thisParentPath === selectNodePath) {
            this.$message({
              message: '不能将文件' + operation + '到自身或其子目录下',
              type: 'warning'
            });
            return true;
          }
        })
        if (exits) {
          return
        }
      } else {
        if (this.rowContextData.id) {
          fileIds.push(this.rowContextData.id)
        } else {
          fileIds.push(this.rowContextData[0].id)
        }
      }
      this.copyOrMoveApi(operating, fileIds, this.selectTreeNode.id)
    },
    copyOrMoveApi(operating, froms, to) {
      let operation = '复制'
      if (operating === 'move') {
        operation = '移动'
      }
      let copying = this.$message({
        iconClass: 'el-icon-loading',
        type: 'info',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<span>&nbsp;&nbsp;正在' + operation + '</span>'
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
        copying.message = operation + '成功'
        if (this.rowContextData.isFolder) {
          this.$refs.directoryTree.append(this.rowContextData, to)
        }
        if (operating === 'move') {
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
        }, 1000)
      }).catch(() => {
        copying.close()
      })
    },
    renderContent(h, {node, data, store}) {
      if (data.newFolder) {
        return (
          <span class="custom-tree-node">
            <span><svg-icon icon-class="folder"/></span>
            <span>
            <div class="el-input el-input--mini el-input-tree">
              <input type="text" autocomplete="on" value="新建文件夹" id="treeInput" class="el-input__inner"></input>
            </div>
            <button type="button" on-click={() => {
              let path = '/'
              let parentData = node.parent.data
              if (parentData.path) {
                path = parentData.path + parentData.name + path
              }
              api.newFolder({
                isFolder: true,
                filename: encodeURI(data.name),
                currentDirectory: encodeURI(this.$route.query.path),
                username: this.$store.state.user.name,
                userId: this.$store.state.user.userId
              }).then((res) => {
                data.newFolder = false
                data.id = res.data.id
              }).catch(() => {
                window.event.preventDefault()
                window.event.stopPropagation()
              })
            }}
                    class="el-button el-icon-check el-button--mini el-input-tree-button"
                    element-loading-spinner="el-icon-loading" element-loading-background="#f6f7fa88"></button>
            <button type="button" on-click={() => {
              this.$refs.directoryTree.remove(node)
              window.event.preventDefault()
              window.event.stopPropagation()
            }}
                    class="el-button el-icon-close el-button--mini el-input-tree-button"
                    element-loading-spinner="el-icon-loading" element-loading-background="#f6f7fa88"></button>
            </span>
            </span>);
      }
      if (node.expanded) {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="open-folder"/>
            <span style="margin-left: 5px;">{node.label}</span>
            <span>
            </span>
            </span>);
      } else {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="folder"/>
            <span style="margin-left: 5px;">{node.label}</span>
            <span>
            </span>
            </span>);
      }
    },
    share(row) {
      if (!row || !row.id) {
        if (this.rowContextData.id) {
          row = this.rowContextData
        } else {
          row = this.$refs.fileListTable.tableSelectData[0]
        }
      }
      this.shareFileName = row.name
      api.generate({
        userId: row.userId,
        fileId: row.id,
        isFolder: row.isFolder
      }).then(res => {
        this.shareDialog = true
        if (res.data) {
          this.shareLink = window.location.origin + '/s?s=' + res.data
          this.generateShareLinkLoading = false
        }
      }).catch(() => {
        this.shareDialog = false
        this.generateShareLinkLoading = false
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
      if (this.$refs.fileListTable.tableSelectData.length > 0) {
        this.$refs.fileListTable.tableSelectData.forEach(item => {
          totalSize += item.size
        })
      } else {
        totalSize += this.rowContextData.size
      }
      if (totalSize > 0) {
        var fileIds = [];
        if (this.$refs.fileListTable.tableSelectData.length > 0) {
          this.$refs.fileListTable.tableSelectData.forEach(value => {
            fileIds.push(value.id)
          })
        } else {
          fileIds.push(this.rowContextData.id)
        }
        if (fileIds.length > 1 || this.rowContextData.isFolder) {
          fileConfig.packageDownload(fileIds, this.$store.state.user.token)
          return
        }
        fileConfig.download(this.$store.state.user.name, this.rowContextData, this.$store.getters.token)
      } else {
        this.$message({
          message: '所选文件为空',
          type: 'warning'
        });
      }
    },
    // 收藏/取消收藏
    favoriteOperating(isFavorite) {
      const fileIds = this.getSelectIdList()
      this.rowContextData.isFavorite = isFavorite
      this.highlightFavorite(isFavorite, true)
      api.favoriteUrl({
        fileIds: fileIds,
        isFavorite: isFavorite
      }).then(res => {
        // 收藏页面
        if (!isFavorite && this.isCollectView) {
          // 移除列表
          this.removeSelectItme()
        }
      }).catch(() => {
        this.rowContextData.isFavorite = !isFavorite
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
        fileIds.push(this.rowContextData.id)
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
          this.removeSelectItme()
        }).then(() => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 1000
          })
        })
      })
    },
    // 获取选中项id列表
    getSelectIdList() {
      const fileIds = []
      if (this.selectRowData.length > 1 || this.menusIsMultiple) {
        this.$refs.fileListTable.tableSelectData.forEach(value => {
          fileIds.push(value.id)
        })
      } else {
        fileIds.push(this.rowContextData.id)
      }
      return fileIds
    },
    // 移除选中项
    removeSelectItme() {
      let removeFileIndexList = []
      if (this.$refs.fileListTable.tableSelectData.length > 0) {
        this.$refs.fileListTable.tableSelectData.forEach(item => {
          let fileIndex = this.fileList.findIndex(file => file.id === item.id)
          if (fileIndex > -1) {
            removeFileIndexList.push(fileIndex)
          }
        })
      }
      // 先清空之前选择的数据
      this.$refs.fileListTable.doLayout()
      this.$refs.fileListTable.clearSelection()
      this.$refs.fileListTable.tableSelectData = []
      // 倒序
      removeFileIndexList = removeFileIndexList.sort((a, b) => b - a)
      setTimeout(() => {
        // 再执行移除
        for (let i = 0; i < removeFileIndexList.length; i++) {
          this.fileList.splice(removeFileIndexList[i], 1)
        }
        // 改变拖拽目标
        this.rowDrop()
      }, 300)
    },
    // 预览压缩文件
    compressionFilePreview(file) {
      this.unzip(file, undefined, true)
    },
    unzipTo(file) {
      this.dialogMoveOrCopyVisible = true
      this.titlePrefix = '解压到: '
      this.unzipOperating = true
      const that = this
      setTimeout(function () {
        that.openCompressionVisible = false
        that.selectTreeNode = that.$refs.directoryTree.getCurrentNode()
        that.selectTreeNode.showName = ' "' + that.selectTreeNode.name + '"'
      }, 100)
    },
    // 解压文件
    unzip(file, destFileId, tempDir) {
      let status = '解压'
      let decompressing = this.$message({
        iconClass: 'el-icon-loading',
        type: 'info',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<span>&nbsp;&nbsp;正在' + status + '</span>'
      });
      api.unzip({
        fileId: file.id,
        destFileId: destFileId
      }).then((res) => {
        decompressing.iconClass = null
        decompressing.type = 'success'
        decompressing.message = status + '成功'

        if (tempDir) {
          this.compressedFileData = res.data
          this.compressedFileVisible = true
          this.compressedFileName = file.name
          this.compressedFileTempDir = tempDir
        }

        const that = this
        setTimeout(function () {
          decompressing.close()
          that.openCompressionVisible = false
          if (file.id === destFileId) {
            that.getFileList()
          }
          if (destFileId && file.id !== destFileId && !tempDir) {
            that.dialogMoveOrCopyVisible = false
          }
        }, 1000)
      }).catch(() => {
        decompressing.close()
      })
    },
    // 点击文件或文件夹
    fileClick(row) {
      if (this.editingIndex === row.index) {
        return
      }
      this.openingFile = row
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
          if (this.path) {
            this.path += '/' + row.name
          } else {
            this.path = '/' + row.name
          }
          const item = {'folder': row.name}
          this.pathList.push(item)
          this.pagination.pageIndex = 1
          const path = encodeURI(this.path);
          this.$router.push(`?vmode=${this.vmode}&path=${path}`)
          this.openDir(row)
        }
      } else {
        if (this.selectFile) {
          let selectFile = row
          const selectData = this.$refs.fileListTable.tableSelectData
          if (selectData.length < 1 || selectData[0].id !== row.id) {
            this.$refs.fileListTable.clearSelection()
            this.$refs.fileListTable.toggleRowSelection([{row: row}])
            this.pinSelect(null, row)
          } else {
            this.$refs.fileListTable.clearSelection()
            selectFile = {}
          }
          this.$emit("selectedFile", selectFile)
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
        if (row.contentType.indexOf('audio') > -1) {
          // 音频文件
          Bus.$emit('onAddAudio', row, this.audioCoverUrl)
          return
        }
        if (suffix.compressedFile.includes(row.suffix)) {
          // 压缩文件
          this.openCompressionVisible = true
          return
        }
        if (row.contentType.indexOf('office') > -1 || ['pdf','csv','drawio','mind'].includes(row.suffix)) {
          // office文件
          this.officePreviewVisible = true
          this.officePreviewRow = row
          return
        }
        this.notPreviewDialogVisible = true
      }
    },
    // 强行使用文本编辑器打开
    forciblyOpen(file) {
      this.textPreviewRow = file
      this.textPreviewVisible = true
      const that = this
      setTimeout(function () {
        that.notPreviewDialogVisible = false
      }, 100)
    },
    determineDownload(file) {
      this.downLaod(file)
      this.notPreviewDialogVisible = false
    },
    downLaod(file) {
      fileConfig.download(this.$store.state.user.name, file, this.$store.getters.token)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/index";
@import "src/styles/home-index";
/*overflow: hidden;*/
/*white-space: nowrap;*/
/*text-overflow: ellipsis;*/
.dashboard-container {
  min-width: 498px;
  height: 100%;
}

>>> .app-wrapper {
  overflow-y: hidden;
}

>>> :focus {
  outline: 0;
}

>>> .el-drawer__header {
  color: #000000;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.details-form {
  margin: 20px 10px 0 20px;

  >>> .el-form-item__content {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }

  >>> .el-form-item {
    margin-bottom: 0;
  }

  >>> .details-position {
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

.drawer-icon-font >>> .svg-icon {
  font-size: 8rem;
}

.list-item {
  height: 50px;
}

.table-file-name:hover {
  cursor: default;
}

>>> .plTableBox .el-table .el-table__header {
  th {
    background-color: #FFFFFF;
  }

  .is-sortable:hover {
    background-color: #e0f3fc;
  }
}

>>> table {
  border-collapse: separate;
  border-spacing: 0 1px;
}

>>> .el-table td {
  padding: 0;
  height: 50px !important;
  border: 0;
}

.home-link:hover {
  color: #409EFF;
}

.info-statistics {
  padding: 5px 15px;
  float: right;
  width: 30%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;

  span {
    font-size: 12px;
    line-height: 16px;
    color: #666;
  }
}

>>> .el-input-tree {
  width: 50% !important;
}

>>> .el-input-tree-button {
  margin-left: 5px !important;
}

> > > .open-file-dialog {
  .el-dialog {
    width: 420px;
  }

  .svg-icon {
    font-size: 20px;
  }

  .dialog-msg {
    margin-left: 10px;
  }
}

> > > .v-contextmenu-item {
  .svg-icon {
    font-size: 14px;
  }
}

> > > .new-text-file-dialog {
  height: 350px;
  top: calc(50% - 175px);

  .el-dialog {
    width: 420px;

    .el-dialog__header {
      padding: 15px 20px 15px;
    }

    .dialog-footer {
      .el-loading-spinner {
        margin-top: -13px;

        .circular {
          height: 26px;
          width: 26px;
        }
      }
    }
  }
}

> > > .van-grid-item__content {
  background-size: cover;
  background-position: center;
  padding: 0;
  border-radius: 5px !important;
}

.vmode {
  padding: 5px 10px;
  margin-left: -5px;
}

.number-files {
  position: absolute;
  top: -42px;
  left: 0;
  height: 40px;
  line-height: 40px;
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  background: #d2eefa66;
  border-radius: 5px;
  display: flex;

  .icon {
    padding: 5px;
    width: 40px;
  }

  span {
    font-weight: 500;
  }

  .number {
    padding: 0 15px 0 15px;
  }

  .target {
    .folder {
      background-color: #1d8cff;
      color: #ffffff;
      padding: 8px;
      border-radius: 2px;
      margin-right: 5px;
      font-weight: 600;
    }
  }
}

>>> .el-table--enable-row-hover {
  .el-table__body tr:hover > td {
    background-color: #e0f3fc !important;
  }
}

>>> .el-table::before {
  height: 0;
}

>>> .el-table {
  th.gutter {
    display: table-cell !important;
  }
}
</style>

