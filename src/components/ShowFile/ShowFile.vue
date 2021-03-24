<template>
  <div>
    <div class="dashboard-container" v-resize="containerResize">
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
                <svg-icon icon-class="back" style="font-size: 24px;"/>&nbsp;</a>
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
                              @keyup.enter.native="newFolderNameClickEnter">
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
              <button-upload slot="reference" :name="''" @click.native="upload"
                             style="margin-right: 5px"></button-upload>
            </el-popover>

            <el-input v-show="showSearchButton" placeholder="搜索" v-model="searchFileName" :clearable="true"
                      @keyup.enter.native="searchFile(searchFileName)">
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
                    <i :class="{'al-file-sort-item-icon': true, 'el-icon-top': sortable.order === 'ascending', 'el-icon-bottom': sortable.order === 'descending'}"></i>
                    <span>名称</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="orderSize">
                  <span :class="{'al-file-sort-item': true, 'active': sortable.prop === 'size'}">
                    <i :class="{'al-file-sort-item-icon': true, 'el-icon-top': sortable.order === 'ascending', 'el-icon-bottom': sortable.order === 'descending'}"></i>
                    <span>大小</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="orderUpdateDate">
                  <span :class="{'al-file-sort-item': true, 'active': sortable.prop === 'updateDate'}">
                    <i :class="{'al-file-sort-item-icon': true, 'el-icon-top': sortable.order === 'ascending', 'el-icon-bottom': sortable.order === 'descending'}"></i>
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

      <!--<div class="dashboard-text">path: {{ path }}</div>-->

      <!--list布局-->
      <!--<div v-show="!grid && fileList.length > 0" :style="{'width':'100%','height': clientHeight+'px'}">-->
      <div v-show="fileList.length > 0" id="v-draw-rectangle" :style="{'width':'100%','height': clientHeight + 8 +'px'}">
        <pl-table
          ref="fileListTable"
          v-show="!grid"
          v-loading="tableLoading"
          :max-height="clientHeight"
          :default-sort="sortable"
          :highlight-current-row="false"
          empty-text="无文件"
          :use-virtual="true"
          :row-height="50"
          :border="false"
          :excess-rows="10"
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
              v-if="index === 0 && !selectFile"
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
                  <el-input v-focus v-model="renameFileName" placeholder="" size="small" :clearable="true"
                            @focus="renameInputFocus($event,scope.row.suffix)"
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
                <a v-else @click.stop="fileClick(scope.row)" class="table-file-name"><span>{{
                    scope.row.name
                  }}</span></a>
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
            <pl-table-column v-if="index === 4 && showMoreItem" :key="index" width="50" :prop="item.name" :label="item.label"
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
          <div class="checkbox-group-header" v-show="!selectFile">
            <div class="select-operation">
              <van-checkbox class="grid-all-checkbox" @click="clickGridAllCheckBox" v-model="allChecked">
                {{ selectRowData.length > 0 ? '已选择 ' + this.tableHead[2].label : "选择" }}
              </van-checkbox>
              <div>
                <el-button class="select-operation-button" icon="el-icon-download" v-if="selectRowData.length > 0"
                           @click="downloadFile">
                  下载
                </el-button>
                <el-button class="select-operation-button" icon="el-icon-share" v-if="selectRowData.length === 1"
                           @click="share">
                  分享
                </el-button>
                <el-button class="select-operation-button" icon="el-icon-document-copy" v-if="selectRowData.length > 0"
                           @click="moveOrCopy">
                  移动或复制
                </el-button>
                <el-button class="select-operation-button" icon="el-icon-delete" v-if="selectRowData.length > 0"
                           type="danger" @click="deleteFile">
                </el-button>
              </div>
            </div>
            <el-divider style="transform: scaleY(0.5);"></el-divider>
          </div>

          <van-checkbox-group v-model="selectRowData" @change="handleSelectionChange" ref="checkboxGroup">
            <van-grid square :center="true" :column-num="gridColumnNum" :gutter="10" :border="false"
                      :style="{'width':'100%','max-height': clientHeight-45+'px','overflow':'auto'}">
              <van-grid-item v-for="(item,index) in fileList" ref="gridItem" :key="item.id"
              >
                <div
                  class="grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                  :style="{
                  'background': queryFileType === 'image' ? 'url('+imageUrl+item.id+')' : selectRowData.includes(item)?'#caeaf991':'',
                  'background-size': 'cover',
                  'background-position': 'center',
                  'border': selectRowData.includes(item)?'solid 1px #409eff':'',
                  }"
                  @mouseover="gridItemHover(item,index)"
                  @mouseout="gridItemOut(item,index)"
                  @click="gridItemClick(item)"
                  @contextmenu.prevent="rowContextmenu(item)"
                >
                  <van-checkbox v-show="!selectFile" v-if="gridHoverItemIndex === index || selectRowData.includes(item)"
                                class="grid-item-checkbox" :name="item"
                                @click.stop="clickGridItemCheckBox(item,index)"/>
                  <div :class="{'grid-item-icon':true, 'grid-item-icon-image': queryFileType === 'image' ? gridHoverItemIndex === index || selectRowData.includes(item) : false}">
                    <icon-file v-show="queryFileType !== 'image'" :item="item" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"
                               :grid="true"></icon-file>
                  </div>
                  <!--<el-tooltip effect="light" :content="item.name" placement="top">-->
                    <div v-show="item.w && item.h && queryFileType === 'image' ? gridHoverItemIndex === index || selectRowData.includes(item) : false"
                    :class="{'grid-item-text': true, 'grid-item-text-image-size': queryFileType === 'image'}">
                      {{ item.w + ' x ' + item.h }}
                    </div>
                    <div
                      :title="item.name"
                      v-show="queryFileType === 'image' ? gridHoverItemIndex === index || selectRowData.includes(item) : true"
                      :class="{'grid-item-text': true, 'grid-item-text-image': queryFileType === 'image'}">
                      {{ item.name }}
                    </div>
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
      <img id="dragImage" draggable="false" style="position: fixed;top: -100px;z-index: 99999"
           src="~@/assets/img/move-file.png">
    </div>
    <!--为了不受右键区域的影响, 把弹窗之类的提取出来-->
    <sim-text-preview :file.sync="textPreviewRow" :status.sync="textPreviewVisible"></sim-text-preview>
    <image-viewer :fileList="fileList" :file="imagePreviewRow" :status.sync="imagePreviewVisible"></image-viewer>
    <video-preview :file="videoPreviewRow" :status.sync="videoPreviewVisible"></video-preview>
    <!-- <audio-preview :file="audioPreviewRow" :status.sync="audioPreviewVisible"></audio-preview> -->
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
            <span>{{ '《'+rowContextData.music.album+'》' }}</span>
          </el-form-item>
          <el-form-item label="🎵 歌名:">
            <span>{{ '《'+rowContextData.music.songName+'》' }}</span>
          </el-form-item>
        </div>
        <el-form-item v-show="rowContextData.w && rowContextData.h" label="分辨率:" class="details-resolution">
          <span>{{ rowContextData.w + ' x ' + rowContextData.h }}</span>
        </el-form-item>
        <el-form-item label="大小:">
          <span> {{ rowContextData.size }}字节 {{ rowContextData.size > 0 ? '(' + formatSize(rowContextData.size) + ')' : '' }}</span>
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
        <el-input readonly="readonly" v-model="shareLink"></el-input>
        <div slot="footer" class="dialog-footer share-dialog-footer">
          <el-button type="primary" class="tag-share-link" @click="copyShareLink" :data-clipboard-text="shareLink">
            复制链接
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      class="new-text-file-dialog"
      title="新建文本文件"
      :close-on-click-modal="false"
      :visible.sync="newTextFileDialog">
      <el-input
        ref="newTextFileName" size="small"
        v-model="newTextFileName"
        class="dialog-msg"
        @focus="renameInputFocus($event,'')" :clearable="true"
        @keyup.enter.native="createTextFile(newTextFileName)"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="newTextFileDialog=false">取消</el-button>
        <el-button size="small" type="primary" @click="createTextFile(newTextFileName)"
                   v-loading="createTextFileLoading">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {formatSize, formatTime} from '@/utils/number'
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

var rowStyleExecuting = false
export default {
  name: 'ShowFile',
  components: {
    MessageDialog, AudioPreview, VideoPreview, ImageViewer, SimTextPreview, IconFile, BreadcrumbFilePath, EmptyFile,
    ButtonUpload,
    FileTree
  },
  props: {
    selectFile: {
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
      vmode:  this.defaultGrid ? 'grid' : 'list',
      gridColumnNum: -1,
      gridHoverItemIndex: -1,
      gridHoverIntermediate: -1,
      allChecked: false,
      summaries: '',
      shareDialog: false,
      newTextFileDialog: false,
      newTextFileName: '',
      createTextFileLoading: false,
      shareLink: '',
      shareFileName: '',
      generateShareLinkLoading: true,
      textPreviewVisible: false,
      textPreviewRow: {},
      imagePreviewRow: {},
      imagePreviewVisible: false,
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
      isCmd: false,// 是否按住了command键
      dragElementList: [],
      drawFlag: false,
      fileListScrollTop: 0,
      notPreviewDialogVisible: false,
      openingFile: '',
      openCompressionVisible: false,
      stompClient: undefined,//websocket订阅集合
      showUpdateDateItem: true,// 列表模式下是否显示修改时间
      showSizeItem: true,// 列表模式下是否显示文件大小
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
    Bus.$on('fileSuccess', () => {

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
    window.addEventListener('keydown', event => {
      const isMac = navigator.platform.startsWith('Mac');
      const {key, c, keyCode, ctrlKey, metaKey} = event;
      this.isCmd = isMac && metaKey || !isMac && ctrlKey;
      // 按住shift建
      if (event.keyCode === 16 && event.shiftKey) {
        this.selectPin = true
      }
    })

    window.addEventListener('keyup', event => {

      const isMac = navigator.platform.startsWith('Mac');
      const {key, c, keyCode, ctrlKey, metaKey} = event;
      this.isCmd = isMac && metaKey || !isMac && ctrlKey;

      // 松开shift建
      if (event.keyCode === 16) {
        this.selectPin = false
      }
    })

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
    window.onresize = function (){
      that.clientHeight = document.documentElement.clientHeight - that.lessClientHeight
    }

    // 画矩形选区
    this.darwRectangle()

    Bus.$on('msg/file/change', (msg) => this.onmessage(msg))
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false);
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
    onmessage(msg) {
      let fileDoc = JSON.parse(msg.body)
      const url = msg.headers.url
      let index = this.fileList.findIndex(file => file.id === fileDoc.id)
      if ('updateFile' === url) {
        if (index > -1) {
          this.fileList[index].size = fileDoc.size
          this.fileList[index].agoTime = 1
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
    clickGridItemCheckBox(row, index) {
      // 同步列表的checkbox
      if (this.selectRowData.includes(row)) {
        this.$refs.fileListTable.toggleRowSelection([{row: row, selected: false}])
      } else {
        this.$refs.fileListTable.toggleRowSelection([{row: row, selected: true}])
      }
      this.pinSelect(null, row)
    },
    clickGridAllCheckBox() {
      if (this.selectRowData.length !== this.fileList.length) {
        this.$refs.fileListTable.toggleAllSelection()
      } else {
        this.$refs.fileListTable.clearSelection();
      }
    },
    gridItemClick(row) {
      if (this.isCmd) {
        this.pinSelect(null, row)
        this.$refs.fileListTable.toggleRowSelection([{row: row}])
        return
      }
      if (!this.drawFlag) {
        this.fileClick(row)
      }
    },
    containerResize(ddd) {
      const container = document.querySelector(".dashboard-container")
      let clientWidth = container.clientWidth
      this.clientHeight = document.documentElement.clientHeight - this.lessClientHeight
      if(clientWidth > 1024){
        this.gridColumnNum = this.queryFileType === 'image' ? Math.round(clientWidth / 100 - 5) : Math.round(clientWidth / 100 - 4)
      } else {
        this.gridColumnNum = this.queryFileType === 'image' ? Math.round(clientWidth / 100 - 3) : Math.round(clientWidth / 100 - 2)
        if(clientWidth < 768){
          this.gridColumnNum = 3
        }
        if(clientWidth < 450){
          this.gridColumnNum = 2
        }
      }
      if(clientWidth < 900){
        this.showUpdateDateItem = false
      } else {
        this.showUpdateDateItem = true
      }
      if(clientWidth < 500){
        this.showSizeItem = false
      } else {
        this.showSizeItem = true
      }
      this.rowDrop()
    },
    // 画矩形选区
    darwRectangle() {
      if(this.selectFile){
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
      draw.onmousedown = function (e) {
        if (_this.fileListScrollTop > 0) {
          return
        }
        let evt = window.event || e
        if (_this.grid) {
          itemClassName = 'van-grid-item van-grid-item--square'
        }
        let throughRow = e.path.find(path => {
          if (path.className === itemClassName) {
            return path
          }
        })
        if (throughRow && _this.selectRowData.includes(_this.fileList[throughRow.rowIndex])) {
          return
        }
        if (evt.button !== 0) {
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
        document.onmousemove = function (e) {
          let evt = window.event || e
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
          let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft
          retcLeft = (startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX)
          retcTop = (startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY)
          retcHeight = Math.abs(startY - evt.clientY - scrollTop)
          retcWidth = Math.abs(startX - evt.clientX - scrollLeft)
          const drawRectangle = $$(wId)
          if (drawRectangle) {
            noScroll()
            _this.drawFlag = true
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
          setTimeout(function () {
            restoreScroll()
            _this.drawFlag = false
          }, 50)
          if ($$(wId)) {
            draw.removeChild($$(wId))
          }
        }
      }

      let scrollDiv = document.querySelector('.el-table__body-wrapper')
      if (_this.grid) {
        // 添加grid视图的scroll事件
        document.querySelector('.van-grid').onscroll = function (e) {
          _this.tableBodyScroll(null, e)
        }
        scrollDiv = document.querySelector('.van-grid')
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
        setTimeout(function () {
          drawSelecting = false
        }, 150)
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
      if(this.selectFile){
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
      // 被拖动的元素的索引
      let dragged = null;
      // 被拖动的元素的索引
      let draggedIndex = -1;

      let parentClassName = 'van-grid'
      let gridItemClassName = 'van-grid-item van-grid-item--square'
      let gridItemChildenClassName = 'grid-time van-grid-item__content van-grid-item__content--center van-grid-item__content--square'

      // 目标元素
      let target = document.querySelector('.el-table__body-wrapper tbody')

      if (this.grid) {
        target = document.querySelector('.van-checkbox-group .van-grid')
      }

      let rows = 0;//行数

      // let images = {}
      // for (let i = 1; i <= 9; i++) {
      //   let img = new Image()
      //   img.src = require(`@/assets/img/move-file${i}.png`)
      //   images[i] = img
      // }
      setTimeout(function () {
        rows = target.childElementCount
        _this.dragElementList = []
        for (let i = 0; i < target.childElementCount; i++) {
          let child = target.children[i]
          // 设置索引,表格自带rowIndex,这里我们设置grid的
          if (_this.grid) {
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
          // 给能拖动的元素加上标识,只有加上此标识才能被拖动,否则即使draggable = true,也无法拖动(在全局的ondragstart里拦截)
          child.slot = 'jmal'

          let childOfImg = child.querySelector('.el-avatar > img')
          if (_this.grid) {
            childOfImg = child.querySelector('.el-image > img')
          }
          if (childOfImg) {
            childOfImg.draggable = false
          }

          child.ondragstart = function (e) {
            if (_this.fileListScrollTop === 0) {
              let count = _this.selectRowData.length
              if (_this.selectRowData.length >= 99) {
                count = 99
              }
              let dragImage = document.getElementById('dragImage');
              dragImage.src = require(`@/assets/img/move-file/move-file${count}.png`)

              e.dataTransfer.setDragImage(dragImage, 10, 10);

              Bus.$emit('onDragStart', true)
              // 避免和画矩形选区冲突
              _this.drawFlag = false
              let rectangle = document.getElementById('rectangle1')
              if (rectangle) {
                document.getElementById('v-draw-rectangle').removeChild(rectangle)
              }

              dragged = e.path[0]
              draggedIndex = e.path[0].rowIndex
              // 只有选中的才能拖拽
              _this.cellMouseIndex = -1
              // dragged.style.cursor = 'grabbing'
              dragged.style.borderRadius = '10px'
              dragBackCorlor = dragged.style.backgroundColor
            }
          }
          child.ondragend = function () {
            Bus.$emit('onDragStart', false)
            // console.log('child'+i+'拖拽结束');
            // 清除上次进入的容器的状态
            const last = target.children[dragIndex];
            clearClass(last)
            if (_this.grid) {
              dragged.style.cursor = 'pointer'
            } else {
              dragged.style.cursor = 'default'
            }
          }
        }
      }, 0)

      // 被拖动的元素正在那个容器里
      let dragIndex = -1

      // 判断经过了那个元素
      let judgThroughDom = function (e, d) {
        let throughRow = null
        if (_this.grid) {
          if (e.path[0].className === gridItemChildenClassName) {
            // throughRow 表示被拖动的元素正在哪一行上
            return throughRow
          } else {
            throughRow = e.path.find(path => {
              if (path.className === gridItemChildenClassName) {
                return path
              }
            })
          }
          if (d === 'enter') {
            let node = null
            if (e.toElement.className === gridItemClassName) {
              node = e.toElement
            }
            if (e.toElement.className === parentClassName) {
              node = e.fromElement
            }
            if (node) {
              // console.log(d,e,node,node.rowIndex)
              leaveIndex = node.rowIndex
              if (dragIndex > -1) {
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
          if (e.path[0].tagName === 'TD') {
            // throughRow 表示被拖动的元素正在哪一行上
            throughRow = e.path.find(path => {
              if (path.className === 'el-table__row') {
                return path
              }
            })
          }
          return throughRow
        }
      }

      target.ondragenter = function (e) {
        // console.log(e,e.toElement)
        clearTimeout(loop)
        // 由于被拖动的元素 经过tbody中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
        let throughRow = judgThroughDom(e, 'enter')
        if (throughRow) {
          if (dragIndex !== throughRow.rowIndex) {
            if (dragIndex > -1) {
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex];
              clearClass(last)
            }
            // console.log('拖动进入目标元素'+throughRow.rowIndex,'dragIndex:',dragIndex);
            // 不是自己或未文件夹时才改变状态
            if (draggedIndex !== throughRow.rowIndex && _this.fileList[throughRow.rowIndex].isFolder && _this.selectRowData.findIndex(item => item.index === throughRow.rowIndex) === -1) {
              // 改变本次进入的容器的状态
              dragged.style.cursor = 'copy'
              dragEnterBackCorlor = throughRow.style.backgroundColor
              throughRow.style.backgroundColor = '#9fcdfc99'
            }
            dragIndex = throughRow.rowIndex
          }
          leaveIndex = -1
        }
      }

      target.ondragover = function (e) {
        // console.log('目标元素中拖拽...');
        e.preventDefault();
        leaveIndex = -1
      }

      let loop = null
      let leaveIndex = -1 // 是否拖出了整个table, -1表示还在table内

      target.ondragleave = function (e) {
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
      target.ondrop = function () {
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
          }).catch()
        }
      }
      let clearClass = function (node) {
        if(!dragged) {
          return
        }
        if (node) {
          if (_this.grid) {
            node = node.children[0].children[0]
            if (node.style.backgroundColor !== 'rgba(202, 234, 249, 0.57)') {
              node.style.backgroundColor = null
            }
          } else {
            node.style.height = 'unset'
            //#F5F7FA
            if (node.style.backgroundColor !== 'rgb(245, 247, 250)') {
              node.style.backgroundColor = null
            }
          }
          dragged.style.cursor = 'grabbing'
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
      if (this.pathList.length === 2) {
        this.$router.push(`/?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}`)
        return
      }
      const linkIndex = this.pathList.length - 3
      this.handleLink(this.pathList[linkIndex], linkIndex)
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
            this.$router.push(`?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}`)
          } else {
            this.$router.push(`?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}`)
          }
        }
        if (!unRefresh) {
          this.pagination.pageIndex = 1
          this.getFileList()
        }
        // setPath(this.path, this.pathList)
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
    getNewFileName(fileList, newFolderName) {
      let append = 0
      let filenameList = []
      fileList.forEach(file => {
        filenameList.push(file.name || file.label)
      })
      const newName = newFolderName
      while (filenameList.includes(newFolderName)) {
        append += 1
        newFolderName = newName + append
      }
      return newFolderName
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
      if (this.newFolderName) {
        if (/[\/\\"<>\?\*]/gi.test(this.newFolderName)) {
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
    // 新建文本文件
    createTextFile(newFileName) {
      if (newFileName) {
        if (/[\/\\"<>\?\*]/gi.test(newFileName)) {
          this.$message({
            message: '文件名不能包含以下字字符:<,>,|,*,?,,/',
            type: 'warning'
          })
          return
        }
        this.createTextFileLoading = true
        let parentPath = "/"
        if (this.path) {
          if (this.path.length > 0) {
            parentPath = this.path
          }
        }
        api.addFile({
          fileName: newFileName,
          isFolder: false,
          username: this.$store.state.user.name,
          parentPath: parentPath
        }).then((res) => {
          this.createTextFileLoading = false

          // 打开编辑器
          // let path = res.data.path
          // path = '/' +  path.substring(0,path.length - res.data.name.length)
          this.textPreviewRow = res.data
          this.textPreviewVisible = true

          this.$message.success(`新建文件成功`)
          const that = this
          setTimeout(function () {
            that.newTextFileDialog = false
          }, 200)
        }).catch(() => {
          this.createTextFileLoading = false
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
      // 使列表可拖拽
      this.rowDrop()
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
          currentDirectory: this.$route.query.path,
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
        currentDirectory: this.$route.query.path,
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
        currentDirectory: this.$route.query.path,
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
        this.loadData(res, onLoad)
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
      this.rowDrop()
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
      if(el){
        const str = el.className
        el.className = el.className + " " + className
      }
    },
    getSummaries(param) {
      // 合计
      const {columns, data} = param
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
    rowStyle({row, rowIndex}) {
      if (this.$refs.fileListTable.tableSelectData.findIndex(item => item.index === row.index) > -1) {
        return {backgroundColor: '#F5F7FA'}
      }
    },
    // 动态添加index到row里面去
    tableRowClassName({row, rowIndex}) {
      // row.index = rowIndex
    },
    // 选择某行预备数据
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
      // this.fileClick(row)
    },
    // 单元格点击事件
    cellClick(row, column) {
      if(this.selectFile){
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
        if (columnIndex === 0) {
          this.pinSelect(null, row)
          this.$refs.fileListTable.toggleRowSelection([{row: row}])
        } else {
          this.$refs.fileListTable.clearSelection()
          this.$refs.fileListTable.toggleRowSelection([{row: row}])
          this.pinSelect(null, row)
        }
      }
    },
    // 选取输入框部分内容
    renameInputFocus(event, suffix) {
      event.currentTarget.selectionStart = 0
      event.currentTarget.selectionEnd = event.currentTarget.value.length - suffix.length === 0 ? 0 : suffix.length - 1
    },
    // 重命名
    rowRename(newFileName, row) {
      if (newFileName) {
        if (/[\/\\"<>\?\*]/gi.test(newFileName)) {
          this.$message({
            message: '文件名不能包含以下字字符:<,>,|,*,?,,/',
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
        newFileName: newFileName,
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
      if(this.selectFile){
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
          this.newTextFileName = this.getNewFileName(this.fileList, '未命名文件')
          this.newTextFileDialog = true
          this.$nextTick(() => {
            this.$refs.newTextFileName.focus()
            this.$refs.newTextFileName.select()
          })
          break
        case 'createMarkdownFile':
          this.newDocument()
          break
      }
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
                filename: data.name,
                currentDirectory: path,
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
        if (fileIds.length > 1 || this.rowContextData.isFolder){
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
      }).catch(()=>{
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
      const that = this
      setTimeout(function () {
        // 再执行移除
        for (let i = 0; i < removeFileIndexList.length; i++) {
          that.fileList.splice(removeFileIndexList[i], 1)
        }
        // 改变拖拽目标
        that.rowDrop()
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
          const path = encodeURIComponent(this.path);
          this.$router.push(`?vmode=${this.vmode}&path=${path}`)
          this.openDir(row)
        }
      } else {
        if (this.selectFile){
          let selectFile = row
          const selectData = this.$refs.fileListTable.tableSelectData
          if(selectData.length < 1 || selectData[0].id !== row.id){
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
        if (row.suffix === 'pdf') {
          // pdf文件
          let host = window.location.host
          if (window.location.port.length > 0) {
            host = window.location.host.substring(0, window.location.host.length - window.location.port.length - 1)
          }
          fileConfig.preview(this.$store.state.user.name, row, this.$store.getters.token)
          return
        }
        if (suffix.compressedFile.includes(row.suffix)) {
          // 压缩文件
          this.openCompressionVisible = true
          return
        }
        // 其他文件
        let fileIds = [row.id]
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

/deep/ .app-wrapper {
  overflow-y: hidden;
}

/deep/ :focus {
  outline: 0;
}

/deep/ .el-drawer__header {
  color: #000000;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.details-form {
  margin: 20px 10px 0 20px;

  /deep/ .el-form-item__content {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }

  /deep/ .el-form-item {
    margin-bottom: 0;
  }

  /deep/ .details-position {
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

.drawer-icon-font /deep/ .svg-icon {
  font-size: 8rem;
}

.list-item {
  height: 50px;
}

.table-file-name:hover {
  color: #19ACF9;
}

/deep/ .plTableBox .el-table .el-table__header {
  th {
    background-color: #FFFFFF;
  }

  .is-sortable:hover {
    background-color: #f5f7fa;
  }
}

/deep/ .el-table td {
  padding: 0;
  height: 50px !important;
}

.home-link:hover {
  color: #409EFF;
}

.info-statistics {
  padding: 5px 0;
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

/deep/ .el-input-tree {
  width: 50% !important;
}

/deep/ .el-input-tree-button {
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
>>> .van-grid-item__content {
  background-size: cover;
  background-position: center;
}
.vmode{
  padding: 5px 10px;
  margin-left: -5px;
}
</style>

