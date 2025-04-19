<template>
  <div>
    <div
      class="dashboard-container"
      v-resize="containerResize"
      onselectstart="return false"
    >
      <v-contextmenu ref="homeContextmenu" :disabled="contextmenuDisabled">
        <div v-for="item of contextMenus" :key="item.operation">
          <!-- 一级菜单 -->
          <v-contextmenu-item
            v-if="!item.child"
            :divider="item.divider ? true : false"
            @click="contextmenuClick(item.operation)"
          >
            <svg-icon
              v-if="item.iconClass"
              :icon-class="item.iconClass"
            ></svg-icon>
            {{ item.label }}
          </v-contextmenu-item>
          <v-contextmenu-submenu
            v-if="item.child"
            :disabled="item.homeDisable && (!path || path.length < 2)"
            :title="item.label"
          >
            <!-- 二级菜单 -->
            <div v-for="itemSecond of item.child" :key="itemSecond.operation">
              <v-contextmenu-item
                v-if="!itemSecond.child"
                :divider="itemSecond.divider ? true : false"
                @click="contextmenuClick(itemSecond.operation)"
              >
                <svg-icon
                  v-if="itemSecond.iconClass"
                  :icon-class="itemSecond.iconClass"
                ></svg-icon>
                {{ itemSecond.label }}
              </v-contextmenu-item>
              <v-contextmenu-submenu
                v-if="itemSecond.child"
                :title="itemSecond.label"
              >
              </v-contextmenu-submenu>
            </div>
          </v-contextmenu-submenu>
        </div>
      </v-contextmenu>

      <el-breadcrumb class="app-breadcrumb" separator="">
        <transition-group name="breadcrumb" v-if="showNavigation">
          <el-breadcrumb-item
            v-for="(item, index) in pathList"
            :key="item.folder + index"
          >
            <el-tooltip
              v-if="index === 0 && pathList.length > 1"
              class="item"
              effect="dark"
              content="返回上一级"
              placement="top"
            >
              <a @click.prevent="lastLink()">
                <svg-icon
                  icon-class="back"
                  style="font-size: 24px;margin-left: 20px;"
                />&nbsp;</a
              >
            </el-tooltip>
            <el-tooltip
              v-if="index === 0 && pathList.length > 2"
              class="item"
              effect="dark"
              content="根目录"
              placement="top"
            >
              <a class="home-link" @click.prevent="handleLink(item, index)">
                <svg-icon icon-class="home" style="font-size: 24px;" />
              </a>
            </el-tooltip>
            <breadcrumb-file-path
              :pathList="pathList"
              :item="item"
              :index="index"
              @clickLink="handleLink"
            ></breadcrumb-file-path>
          </el-breadcrumb-item>
        </transition-group>
        <div class="search-content">
          <div class="search-class">
            <el-popover
              v-if="showUploadButton"
              v-show="!(pathList.length < 2 && homeHidden)"
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
                      <svg-icon icon-class="file-upload" />
                      <span class="menuitem text">{{
                        singleFileType !== '' ? singleFileType : '上传文件'
                      }}</span>
                    </label>
                  </li>
                  <li v-if="singleFileType === ''" @click="uploadFolder">
                    <label class="menuitem">
                      <svg-icon icon-class="folder-upload" />
                      <span class="menuitem text">上传文件夹</span>
                    </label>
                  </li>
                  <li v-if="singleFileType === ''" @click.prevent="newDocument">
                    <a href="#" class="menuitem">
                      <svg-icon icon-class="md" />
                      <span class="menuitem text">写文章</span>
                    </a>
                  </li>
                  <li v-if="singleFileType === ''" @click.prevent="newFolder">
                    <a href="#" class="menuitem">
                      <svg-icon icon-class="folder-add" />
                      <span class="menuitem text">新建文件夹</span>
                    </a>
                  </li>
                  <div v-show="showNewFolder" class="folder-name-form">
                    <el-input
                      ref="newFolderName"
                      v-model="newFolderName"
                      placeholder="请输入文件夹名称"
                      :clearable="true"
                      @keyup.enter.native="newFolderNameClickEnter"
                      @focus="setInputFocus"
                      @blur="setInputBlur()"
                    >
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
              <button-upload
                slot="reference"
                :name="''"
                @click.native="upload"
                style="margin-right: 10px"
              ></button-upload>
            </el-popover>

            <el-input
              :class="searchInputClass"
              v-show="showSearchButton"
              ref="searchInput"
              :placeholder="`搜索 ${cmdKey} P`"
              v-model="searchFileName"
              @keyup.enter.native="searchFileEnter(searchFileName)"
              @focus="searchInputFocus"
              @input="searchFileEnter(searchFileName)"
              @blur="searchInputBlur"
              @clear="searchFileEnter(searchFileName)"
            >
              <template v-slot:suffix>
                <div>
                  <el-button v-if="searchFileName" type="text" class="search-close-btn" @click="searchClose">
                    <i class="el-icon-circle-close"></i>
                  </el-button>
                  <el-popover
                    v-if="searchFileName"
                    placement="bottom-end"
                    popper-class="search-filter-popover"
                    trigger="click">
                    <search-option
                      :has-search-conditions-param.sync="hasSearchFilterOption"
                      :keyword.sync="searchFileName"
                      :filter-option-param.sync="filterOption"
                      :search-path="currentDirectory"
                      :search-result-count="pagination['total']"
                      @filter-change="searchFilterChange" >
                    </search-option>
                    <el-button slot="reference" type="text" :class="searchOptionBtnClass">
                      <i class="el-icon-s-operation"></i>
                    </el-button>
                  </el-popover>
                </div>
              </template>
            </el-input>
            <el-dropdown
              size="medium"
              style="height: 40px;"
              @command="contextmenuClick"
            >
              <div>
                <el-button type="text" class="sort">
                  <svg-icon
                    v-if="sortable.order === 'descending'"
                    icon-class="sort-amount-down-solid"
                  />
                  <svg-icon v-else icon-class="sort-amount-up-alt-solid" />
                  <span class="sort-name">{{ sortName }}</span>
                </el-button>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="orderName">
                  <span
                    :class="{
                      'al-file-sort-item': true,
                      active: sortable.prop === 'name',
                    }"
                  >
                    <i
                      :class="{
                        'al-file-sort-item-icon': true,
                        'el-icon-top': sortable.order === 'ascending',
                        'el-icon-bottom': sortable.order === 'descending',
                      }"
                    ></i>
                    <span>名称</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="orderSize">
                  <span
                    :class="{
                      'al-file-sort-item': true,
                      active: sortable.prop === 'size',
                    }"
                  >
                    <i
                      :class="{
                        'al-file-sort-item-icon': true,
                        'el-icon-top': sortable.order === 'ascending',
                        'el-icon-bottom': sortable.order === 'descending',
                      }"
                    ></i>
                    <span>大小</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="orderUploadDate">
                  <span
                    :class="{
                      'al-file-sort-item': true,
                      active: sortable.prop === 'uploadDate',
                    }"
                  >
                    <i
                      :class="{
                        'al-file-sort-item-icon': true,
                        'el-icon-top': sortable.order === 'ascending',
                        'el-icon-bottom': sortable.order === 'descending',
                      }"
                    ></i>
                    <span>上传时间</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="orderUpdateDate">
                  <span
                    :class="{
                      'al-file-sort-item': true,
                      active: sortable.prop === 'updateDate',
                    }"
                  >
                    <i
                      :class="{
                        'al-file-sort-item-icon': true,
                        'el-icon-top': sortable.order === 'ascending',
                        'el-icon-bottom': sortable.order === 'descending',
                      }"
                    ></i>
                    <span>修改时间</span>
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="text" class="vmode" @click="changeVmode">
              <svg-icon :icon-class="grid ? 'list' : 'grid'" />
            </el-button>
          </div>
        </div>
      </el-breadcrumb>
      <div>
        <!--统计信息-->
        <div class="info-statistics">
          <span v-if="listModeSearch"
            >{{ this.pagination['total'] }}个结果:&nbsp;</span
          >
          <span v-if="tableLoading">获取更多数据...</span>
          <span v-if="!tableLoading">{{
            !finished
              ? '已加载 ' + getSummaries3
              : '已全部加载 ' + getSummaries3
          }}</span>
        </div>
      </div>

      <!--右键菜单-->
      <e-vue-contextmenu
        ref="contextShow"
        class="newFileMenu"
        :class="menuTriangle"
        @ctx-show="show"
        @ctx-hide="hide"
      >
        <div class="popper-arrow"></div>
        <ul v-for="(item, index) in menus" :key="item.label">
          <li
            v-if="
              item.operation === 'unFavorite' || item.operation === 'favorite'
            "
            class="menu-option"
            @click="menusOperations(item.operation, $event)"
            @mouseover.prevent.stop="
              menuFavoriteOver(index, rowContextData.isFavorite)
            "
            @mouseleave.prevent.stop="
              menuFavoriteLeave(index, rowContextData.isFavorite)
            "
          >
            <label class="menuitem">
              <svg-icon :icon-class="item.iconClass" />
              <span class="menuitem text">{{ item.label }}</span>
            </label>
          </li>
          <li v-else @click="menusOperations(item.operation, $event)">
            <label class="menuitem">
              <svg-icon :icon-class="item.iconClass" />
              <span class="menuitem text">{{ item.label }}</span>
              <span v-if="item.shortcut" style="position: absolute;right: 10px;">
                <kbd v-for="key in item.shortcut" :style="{fontSize: key === '⌘' ? '14px' : '12px'}">{{ key }}</kbd>
              </span>
            </label>
          </li>
        </ul>
      </e-vue-contextmenu>

      <!--list布局-->
      <div
        v-show="fileList.length > 0"
        ref="fileListTableContainer"
        id="v-draw-rectangle"
        :style="{ width: '100%', height: clientHeight + 'px' }"
      >
        <pl-table
          ref="fileListTable"
          v-show="!grid"
          v-loading="tableLoading"
          :max-height="clientHeight"
          :default-sort="sortable"
          :highlight-current-row="false"
          empty-text="无文件"
          :use-virtual="false"
          :row-height="51.5"
          :border="false"
          :excess-rows="10"
          :pagination-show="false"
          style="width: 100%;margin: 20px 0 0 0;"
          stripe
          :fit="true"
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
          @sort-change="sortChange"
          @table-body-scroll="tableBodyScroll"
        >
          <template v-for="(item, index) in tableHead">
            <pl-table-column
              v-if="index === 1"
              :key="index"
              :index="index"
              align="center"
              header-align="center"
              width="80"
            >
              <template slot-scope="scope">
                <icon-file
                  :item="scope.row"
                  :image-url="imageUrl"
                  :audio-cover-url="audioCoverUrl"
                ></icon-file>
              </template>
            </pl-table-column>
            <!--名称-->
            <pl-table-column
              v-if="index === 2"
              :key="index"
              :show-overflow-tooltip="true"
              min-width="200"
              :width="tableHeadNameWidth"
              :index="index"
              :prop="item.name"
              :label="item.label"
              :sort-orders="['ascending', 'descending']"
              :sortable="
                item.sortable ? (orderCustom ? 'custom' : true) : false
              "
            >
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.index === editingIndex"
                  :span="10"
                  v-focus
                  v-model="renameFileName"
                  placeholder=""
                  size="small"
                  @focus="
                    renameInputFocus($event.currentTarget, scope.row.suffix)
                  "
                  @blur="setInputBlur()"
                  @keyup.enter.native="rowRename(renameFileName, scope.row)"
                >
                </el-input>
                <div v-else class="table-file-name">
                  {{ scope.row.name }}
                  <el-tag
                    v-if="scope.row.ossPlatform"
                    size="small"
                    class="pc list oss-folder"
                    >{{ scope.row.ossPlatform }}
                  </el-tag>
                </div>
              </template>
            </pl-table-column>
            <!--文件大小-->
            <pl-table-column
              v-if="index === 3 && showSizeItem"
              :key="index"
              width="200"
              :prop="item.name"
              :index="index"
              :label="item.label"
              :sort-orders="['ascending', 'descending']"
              :sortable="
                item.sortable ? (orderCustom ? 'custom' : true) : false
              "
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
              v-if="index === 4 && showUpdateDateItem"
              :key="index"
              width="250"
              :prop="item.name"
              :index="index"
              :label="item.label"
              :sort-orders="['ascending', 'descending']"
              :sortable="
                item.sortable ? (orderCustom ? 'custom' : true) : false
              "
              :show-overflow-tooltip="true"
              align="left"
              header-align="left"
            >
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.updateDate"
                  placement="top"
                >
                  <span
                    >&nbsp;&nbsp;&nbsp;{{ formatTime(scope.row.agoTime) }}</span
                  >
                </el-tooltip>
              </template>
            </pl-table-column>
          </template>
        </pl-table>

        <!--grid布局-->
        <div
          v-show="grid"
          ref="gridDiv"
          v-loading="tableLoading"
          element-loading-text="文件加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#f6f7fa88"
        >
          <van-checkbox-group
            ref="checkboxGroup"
          >
            <van-grid
              :center="true"
              :column-num="gridColumnNum"
              :border="false"
              :style="{
                width: '100%',
                maxHeight: clientHeight - 25 + 'px',
                minHeight: gridMinHeight + 'px',
                rowGap: '10px',
                overflow: 'auto',
                'box-shadow':
                  fileListScrollTop > 0
                    ? '-1px -1px 4px #00152914'
                    : '-1px -1px 4px #ffffff',
              }"
            >
              <van-grid-item
                v-for="(item, index) in fileList"
                :key="item.id"
                :title="
                  '大小：' +
                    formatSize(item.size) +
                    '\r\n' +
                    (item.w && item.h
                      ? '尺寸：' + item.w + 'x' + item.h + '\r\n'
                      : '') +
                    '名称：' +
                    item.name +
                    '\r\n' +
                    '上传时间：' +
                    item.uploadDate +
                    '\r\n' +
                    '修改时间：' +
                    item.updateDate +
                    '\r\n' +
                    '路径：' +
                    item.path +
                    extendedInfo(item)
                "
                :style="{paddingTop: 100/gridColumnNum + '%'}"
              >
                <div
                  class="grid-item van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                  :style="{
                    right: gridPaddingRight + 'px',
                    bottom: '10px',
                    height: gridItemWidth + 'px',
                    background: selectRowData.includes(item) ? '#caeaf991' : '',
                    'background-size': 'cover',
                    'background-position': 'center',
                    border: selectRowData.includes(item)
                      ? 'solid 1px #409eff'
                      : '',
                  }"
                  @click="gridItemClick(item, $event)"
                  @dblclick="fileClick(item, $event)"
                  @contextmenu.prevent="rowContextmenu(item)"
                >
                  <div
                    class="grid-hover-back grid-hover van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                  >
                    <div class="grid-item-icon">
                      <icon-file
                        :item="item"
                        :image-url="imageUrl"
                        :audio-cover-url="audioCoverUrl"
                        :grid="true"
                        :grid-width="gridItemWidth"
                      ></icon-file>
                    </div>
                    <el-input
                      v-if="item.index === editingIndex"
                      v-focus
                      v-model="renameFileName"
                      class="grid-item-text-input"
                      placeholder=""
                      type="textarea"
                      autosize
                      size="small"
                      @focus="
                        renameInputFocus($event.currentTarget, item.suffix)
                      "
                      @blur="setInputBlur()"
                      @keyup.enter.prevent.native="
                        rowRename(renameFileName, item)
                      "
                    >
                    </el-input>
                    <div v-if="item.index !== editingIndex" class="grid-item-text">
                      <span>{{ gridFilename(item) }}</span>
                    </div>
                  </div>
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
      <img
        id="dragImage"
        draggable="false"
        style="position: fixed;opacity: 0"
        src="~@/assets/img/hide.png"
      />
      <div id="numberFiles" class="number-files" v-if="!selectFile">
        <img
          class="icon"
          src="~@/assets/img/arrow1_left.png"
          style="display: none"
        />
        <div class="number" style="display: inline">1个文件</div>
        <div class="operate" style="display: none;white-space: nowrap;">
          移动到：
        </div>
        <div class="target">
          <span class="folder" style="display: none;white-space: nowrap;"
            >document</span
          >
        </div>
      </div>
    </div>
    <!--为了不受右键区域的影响, 把弹窗之类的提取出来-->
    <sim-text-preview
      :file.sync="textPreviewRow"
      :status.sync="textPreviewVisible"
    ></sim-text-preview>
    <image-viewer
      :fileList="fileList"
      :file="imagePreviewRow"
      :status.sync="imagePreviewVisible"
    ></image-viewer>
    <video-preview
      :file="videoPreviewRow"
      :status.sync="videoPreviewVisible"
    ></video-preview>
    <iframe-preview
      :file="iframePreviewRow"
      :fileHandler="fileHandler"
      :status.sync="iframePreviewVisible"
      :specifyPreviewer="specifyPreviewer"
    ></iframe-preview>

    <file-details :audio-cover-url="audioCoverUrl" :image-url="imageUrl" :file="rowContextData" :file-username="fileUsername" :visible.sync="drawer" @openFile="fileClick" @openOnlyOffice="openOnlyOffice"></file-details>

    <el-dialog
      class="open-file-dialog"
      title="提示"
      top="35vh"
      :visible.sync="openCompressionVisible"
    >
      <svg-icon icon-class="open-folder"></svg-icon>
      <span class="dialog-msg">查看压缩文件</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="unzipTo(openingFile)"
          >解压到...</el-button
        >
        <el-button
          size="small"
          @click="unzip(openingFile, openingFile.id, false)"
          >解压到当前目录</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="compressionFilePreview(openingFile)"
          >预览</el-button
        >
      </span>
    </el-dialog>

    <message-dialog
      title="提示"
      :content="notPreviewDialogMsg"
      :show.sync="notPreviewDialogVisible"
      button-size="mini"
      operatButtonText="取消"
      confirmButtonText="下载"
      @operating="notPreviewDialogVisible = false"
      @confirm="determineDownload(openingFile)"
    >
    </message-dialog>

    <!--展示压缩文件-->
    <el-dialog
      :title="'预览:' + compressedFileName"
      :visible.sync="compressedFileVisible"
    >
      <file-tree
        :directoryTreeData="compressedFileData"
        :tempDir="compressedFileTempDir"
      ></file-tree>
    </el-dialog>

    <!--移动或复制弹出框-->
    <el-dialog
      :title="titlePrefix + selectTreeNode.showName"
      :visible.sync="dialogMoveOrCopyVisible"
      @close="clearTreeNode"
    >
      <el-tree
        v-if="dialogMoveOrCopyVisible"
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
        <el-button
          size="small"
          @click="fileTreeAndNewFolder"
          :disabled="fileTreeAndNewFolderDisabled"
          ><i class="el-icon-folder-add"></i>&nbsp;&nbsp;新建文件夹
        </el-button>
        <el-button
          v-if="!unzipOperating"
          size="small"
          type="primary"
          @click="moveFileTree"
          >移 动</el-button
        >
        <el-button
          v-if="!unzipOperating"
          size="small"
          type="primary"
          @click="copyFileTree"
          >复制</el-button
        >
        <el-button
          v-if="unzipOperating"
          size="small"
          type="primary"
          @click="confirmUnzip"
          >解压</el-button
        >
        <el-button size="small" @click="dialogMoveOrCopyVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
    <tag-dialog
      :fileList="tagDialogObjectList"
      :status.sync="tagDialogVisible"
      @onSuccess="allocateTagSuccess"
    />
    <share-dialog
      :file.sync="shareDialogObject"
      :status.sync="shareDialogVisible"
      @onSuccess="shareSuccess"
      @onCancelShare="onCancelShare"
    ></share-dialog>
    <el-dialog
      class="new-text-file-dialog"
      :title="newCreateFileDialogTitle"
      :close-on-click-modal="false"
      :visible.sync="newCreateFileDialog"
    >
      <el-input
        ref="newCreateFileName"
        size="small"
        v-model="newCreateFileName"
        class="dialog-msg"
        @focus="renameInputFocus($event.currentTarget, '')"
        :clearable="true"
        @blur="setInputBlur()"
        @keyup.enter.native="createFile(newCreateFileName)"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="newCreateFileDialog = false"
          >取消</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="createFile(newCreateFileName)"
          v-loading="createFileLoading"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="删除"
      :visible.sync="deleteConfirmVisible"
      width="420px">
      <el-row>
        <div class="el-message-box__container delete-attention el-alert--warning is-light">
          <div class="el-message-box__status el-icon-warning"></div>
          <div class="el-message-box__message">
            <p>确定删除所选的{{selectFileList.length}}个文件？</p>
          </div>
        </div>
<!--        <dialog-file-list class="dialog-file-list" :file-list="selectFileList" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></dialog-file-list>-->
      </el-row>
      <span slot="footer" class="dialog-footer-delete">
          <div>
            <el-button v-if="!permanentDeleteDisable" type="danger" size="small" @click="sweepDeleteFile"  :loading="deleteLoading">彻底删除</el-button>
          </div>
          <div>
            <el-button size="small" @click="deleteConfirmVisible = false">取 消</el-button>
            <el-button v-if="permanentDeleteDisable" type="danger" size="small" @click="sweepDeleteFile" :loading="deleteLoading">彻底删除</el-button>
            <el-button v-if="!permanentDeleteDisable" type="warning" size="small" @click="moveToRecycle" :loading="deleteLoading">移至回收站</el-button>
          </div>
      </span>
    </el-dialog>

    <el-dialog
      :title="copyOrMoveToName"
      :visible.sync="copyOrMoveConfirmVisible"
      width="420px">
      <el-row>
        <div class="el-message-box__container delete-attention el-alert--warning is-light">
          <div class="el-message-box__status el-icon-warning"></div>
          <div class="el-message-box__message">
            <p>所选目录已存在下列文件</p>
          </div>
        </div>
        <dialog-file-list class="dialog-file-list" :file-list="existsFileList" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></dialog-file-list>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="copyOrMoveConfirmVisible = false">取 消</el-button>
        <el-button type="warning" size="small" @click="copyOrMoveApi(copyOrMoveParams.operating, copyOrMoveParams.froms, copyOrMoveParams.to, true, copyOrMoveParams.targetPath)">覆 盖</el-button>
        <el-button type="primary" size="small" @click="copyOrMoveApi(copyOrMoveParams.operating, copyOrMoveParams.froms, copyOrMoveParams.to, false, copyOrMoveParams.targetPath)">不覆盖</el-button>
      </span>
    </el-dialog>

    <file-clipboard ref="fileClipboard" v-if="showClipboard && fileClipboard.length > 0" :file-list="fileClipboard" :image-url="imageUrl" :audio-cover-url="audioCoverUrl" :target-path="path" :target-folder="currentFolder" @onCopy="onCopy" @onMove="onMove"></file-clipboard>
  </div>
</template>

<script>
import SearchOption from '@/components/SearchOption/index.vue'
import DialogFileList from '@/components/ShowFile/DialogFileList.vue'
import FileClipboard from '@/components/ShowFile/FileClipboard.vue'
import store from '@/store'
import path from 'path'
import { fileOperations } from '@/utils/file-operations'
import { mapGetters, mapState } from 'vuex'
import { formatSize, formatTime } from '@/utils/number'
import { getElementToPageLeft } from '@/utils/dom'
import { suffix } from '@/utils/file-type'
import { formatExif,formatVideo } from '@/utils/media'
import api from '@/api/file-api'
import BreadcrumbFilePath from '@/components/Breadcrumb/BreadcrumbFilePath'
import IconFile from '@/components/Icon/IconFile'
import EmptyFile from '@/components/EmptyFile'
import SimTextPreview from '@/components/preview/SimTextPreview'
import ImageViewer from '@/components/preview/ImageViewer'
import VideoPreview from '@/components/preview/VideoPreview'
import AudioPreview from '@/components/preview/AudioPreview'
import ButtonUpload from '@/components/button/ButtonUpload'
import MessageDialog from '@/components/message/MessageDialog'

import FileTree from '@/components/FileTree'

import '@/utils/directives.js'

import _ from "lodash";

import fileConfig from '@/utils/file-config'
import EditElement from '@/views/markdown/EditElement'
import IframePreview from '@/components/preview/IframePreview.vue'
import ShareDialog from '@/components/ShareDialog/index.vue'
import Clipboard from 'clipboard'
import TagDialog from '@/components/TagDialog/index.vue'
import FileDetails from "@/components/preview/FileDetails.vue";

export default {
  name: 'ShowFile',
  components: {
    FileClipboard,
    DialogFileList,
    SearchOption,
    FileDetails,
    TagDialog,
    ShareDialog,
    IframePreview,
    EditElement,
    MessageDialog,
    AudioPreview,
    VideoPreview,
    ImageViewer,
    SimTextPreview,
    IconFile,
    BreadcrumbFilePath,
    EmptyFile,
    ButtonUpload,
    FileTree,
  },
  props: {
    selectFile: {
      // 是否为选择文件模式
      type: Boolean,
      defalut: false,
    },
    lessClientHeight: {
      type: Number,
      default: 106,
    },
    homeHidden: {
      type: Boolean,
      default: false,
    },
    showUploadButton: {
      type: Boolean,
      default: true,
    },
    showSearchButton: {
      type: Boolean,
      default: true,
    },
    isCollectView: {
      type: Boolean,
      default: false,
    },
    emptyStatus: {
      type: String,
      default: '空空如也~',
    },
    singleFileType: {
      type: String,
      default: '',
    },
    showNavigation: {
      type: Boolean,
      default: true,
    },
    queryFileType: {
      type: String,
      default: null,
    },
    defaultGrid: {
      type: Boolean,
      default: true,
    },
    orderCustom: {
      type: Boolean,
      default: false,
    },
    sortable: {
      type: Object,
      default: function() {
        return { prop: '', order: null }
      },
    },
    queryCondition: {
      type: Object,
      default: function() {
        return { isFolder: null }
      },
    },
    singleMenus: {
      type: Array,
      default: function() {
        return [
          fileOperations.open,
          { iconClass: 'share', label: '分享', operation: 'share' },
          { iconClass: 'tag', label: '标签', operation: 'tag' },
          { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
          {
            iconClass: 'menu-details',
            label: '详情',
            shortcut: ["space"],
            operation: 'details',
          },
          fileOperations.rename,
          fileOperations.copy,
          fileOperations.copyOnly,
          fileOperations.download,
          fileOperations.remove,
        ]
      },
    },
    multipleRightMenus: {
      type: Array,
      default: function() {
        return [
          {
            iconClass: 'menu-deselect',
            label: '取消选定',
            operation: 'deselect',
          },
          { iconClass: 'tag', label: '标签', operation: 'tag' },
          fileOperations.copy,
          fileOperations.copyOnly,
          fileOperations.download,
          fileOperations.remove,
        ]
      },
    },
    contextMenus: {
      type: Array,
      default: () => [],
    },
    showClipboard: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?jmal-token=${
        this.$store.state.user.token
      }&name=${this.$store.state.user.name}&id=`,
      audioCoverUrl: `${process.env.VUE_APP_BASE_API}/view/cover?jmal-token=${
        this.$store.state.user.token
      }&name=${this.$store.state.user.name}&id=`,
      fileMenuActive: '',
      path: this.$route.query.path,
      basePath: '/',
      showNewFolder: false,
      isShowNewFolder: false,
      listModeSearch: false,
      listModeSearchOpenDir: false,
      newFolderName: '新建文件夹',
      renameFileName: '',
      searchFileName: '',
      pathList: [{ folder: '' }],
      currentDirectory: '/', // 当前路径
      fileList: [],
      pageLoadCompleteList: [],
      pagination: {
        pageIndex: 1,
        pageSize: 50,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50],
      },
      isIndeterminate: false,
      isSelectAll: false,
      clientHeight: 500,
      tableHeadNameWidth: 500,
      // 表头数据
      tableHead: [
        {
          name: '',
          label: '',
          index: 0,
        },
        {
          name: '',
          label: '',
          index: 1,
        },
        {
          name: 'name',
          label: '名称',
          sortable: true,
          index: 2,
        },
        {
          name: 'size',
          label: '大小',
          sortable: true,
          index: 3,
        },
        {
          name: 'updateDate',
          label: '修改日期',
          sortable: true,
          index: 4,
        },
      ],
      isJustHideMenus: false,
      menusIsMultiple: false,
      menus: [],
      shareToken: undefined,
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
      fileTreeAndNewFolderDisabled: false,
      directoryTreeData: [],
      compressedFileVisible: false,
      compressedFileData: [],
      compressedFileName: '',
      compressedFileTempDir: false,
      selectTreeNode: {},
      directoryTreeProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
      },
      dragLoop: null,
      positionX: 0,
      positionY: 0,
      grid: this.defaultGrid,
      vmode: this.defaultGrid ? 'grid' : 'list',
      gridColumnNum: -1,
      gridPaddingRight: 0,
      gridItemWidth: 125,
      gridMinHeight: 125,
      allChecked: false,
      summaries: '',
      shareDialogVisible: false,
      shareDialogObject: {},
      tagDialogVisible: false,
      tagDialogObjectList: [],
      newCreateFileDialog: false,
      newCreateFileName: '',
      newCreateFileDialogTitle: '',
      createFileLoading: false,
      shareLink: '',
      shareFileName: '',
      textPreviewVisible: false,
      textPreviewRow: {},
      imagePreviewRow: {},
      imagePreviewVisible: false,
      videoPreviewRow: {},
      videoPreviewVisible: false,
      iframePreviewRow: {},
      fileHandler: {},
      iframePreviewVisible: false,
      specifyPreviewer: '', // 指定预览器
      audioPreviewRow: {},
      audioPreviewVisible: false,
      drawer: false,
      drawerShowTime: 0, // drawer显示的时间
      rowStyleExecuting: false,
      selectRowData: [],
      selectOrigin: -1, // 选择起点(主要用于按住shift键多选)
      selectEnd: -1, // 选择终点
      inputting: false, // 是否正在输入
      dragElementList: [],
      drawFlag: false,
      fileListScrollTop: 0,
      initFileListScrollTop: 0,
      notPreviewDialogMsg: '此文件不支持预览, 是否下载该文件?', // 非预览文件提示信息
      notPreviewDialogVisible: false,
      openingFile: '',
      openCompressionVisible: false,
      stompClient: undefined, //websocket订阅集合
      showUpdateDateItem: true, // 列表模式下是否显示修改时间
      showSizeItem: true, // 列表模式下是否显示文件大小
      stopSortChange: false,
      draging: 0, // 是否正在拖拽中，0：没有拖拽，1：拖拽中,
      getFileListed: false,
      onCreateFilename: '',
      existsFileList: [], // 移动或复制存在的文件列表
      copyOrMoveConfirmVisible: false, // 移动或复制警告弹出框
      copyOrMoveParams: {
        operating: 'copy',
        froms: [],
        to: '',
        targetPath: ''
      }, // 移动或复制要传递的参数
      copyOrMoveToName: '', // 移动或复制到的文件夹名称
      deleteConfirmVisible: false, // 删除确认弹窗
      permanentDelete: false, // 是否永久删除
      permanentDeleteDisable: false, // 是否禁用永久删除选项
      selectFileList: [], // 选中的文件
      deleteLoading: false, // 删除loading
      debounceSearch: null,// 搜索防抖
      debounceGetFileList: null,// 获取文件列表防抖
      filterOption: {}, // 搜索选项
      hasSearchFilterOption: false, // 是否有搜索选项
      fileUsername: '', // 一般用于挂载文件
      searchInputClass: 'search-input' // 搜索输入框样式
    }
  },
  computed: {
    ...mapState(['message']),
    ...mapGetters(['name']),
    sortName() {
      switch (this.sortable.prop) {
        case 'name':
          return '名称'
        case 'size':
          return '大小'
        case 'updateDate':
          return '修改时间'
        case 'uploadDate':
          return '上传时间'
        default:
          return '名称'
      }
    },
    searchOptionBtnClass() {
      return this.hasSearchFilterOption ? 'search-option-btn search-option-btn-active' : 'search-option-btn'
    },
    cmdKey() {
      return navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'
    },
    fileClipboard() {
      return store.getters.fileClipboard
    },
    getClipboardFileIdList() {
      return store.getters.fileClipboard.map(file => file.id)
    },
    currentFolder() {
      return this.$route.query.folder
    },
    gridFilename() {
      // 优化文件名，如果文件名过长，则进行截取
      return function(item) {
        let filename = item.name;
        // 如果是文件夹，直接返回文件夹名
        if (item.isFolder || !this.grid) {
          return filename;
        }
        const singleLine = (item.contentType && item.contentType.startsWith('image')) || item.showCover
        const gridFilenameLength = singleLine ? 13 : 28
        // 分离文件名和后缀
        let parts = filename.split('.');
        let suffix = parts.length > 1 ? parts.pop() : '';
        let base = parts.join('.');
        // 获取文件名的有效长度
        let effectiveLength = this.getEffectiveLength(base, suffix);
        // 如果有效长度小于或等于规定的长度，则直接返回文件名
        if (effectiveLength <= gridFilenameLength) {
          return filename;
        }
        // 根据是否有后缀来确定需要截取的长度
        let sliceLength = gridFilenameLength - (suffix ? suffix.length + 2 : 1); // +2 是为了“…”和分隔符
        let prev = '';
        let currentLength = 0;
        // 截取字符串，确保不会在中文字符中间断开
        for (let char of Array.from(base)) {
          let charLength = this.getCharLength(char);
          if (currentLength + charLength > sliceLength) {
            break;
          }
          currentLength += charLength;
          prev += char;
        }
        // 根据是否有后缀返回相应的格式
        if (suffix) {
          return prev + '…' + suffix;
        }
        return prev + '…';
      };
    },
    getSummaries3() {
      let totalSize = 0
      this.fileList.forEach(file => {
        totalSize += file.size
      })
      return totalSize > 0
        ? this.fileList.length + '项 ' + this.getShowSumSize(totalSize)
        : ''
    },
  },
  created() {
    this.debounceSearch = _.debounce((key, onLoad) => {
      this.searchFile(key, onLoad)
    }, 200)
    this.debounceGetFileList = _.debounce((onLoad) => {
      this.getFileList(onLoad)
    }, 200)
  },
  watch: {
    $route(to) {
      if (to.query.tagId && this.queryCondition.tagId !== this.$route.query.tagId) {
        this.queryCondition.tagId = this.$route.query.tagId
        this.pathList = [{ folder: "" }]
        this.getFileListEnter()
      }
    },
    message(msg) {
      switch (msg.event) {
        case 'msg/file/operation/fault':
          this.getFileListEnter()
          break
        case 'fileSuccess':
          this.setOnCreateFilename(msg.data)
          break
        case 'loadFileFailed':
          this.notPreviewDialogVisible = true
          this.notPreviewDialogMsg = msg.msg || '此文件不支持预览, 是否下载该文件?'
          break
        case 'clickMore':
          this.$refs.fileListTable.tableSelectData = msg.data
          this.preliminaryRowData()
          break
        case 'renameRow':
          let index = this.fileList.findIndex(
            file => file.name === msg.data.oldName
          )
          if (index > -1) {
            let newRow = this.fileList[index]
            newRow.suffix = msg.data.suffix
            newRow.name = msg.data.name
            this.$refs.fileListTable.clearSelection()
          }
          break
        case 'msg/file/change':
          this.onmessage(msg.data)
          break
      }
    },
    searchFileName(newValue) {
      if (!newValue) {
        this.hasSearchFilterOption = false
      }
    }
  },
  mounted() {
    // 监听返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }

    // 获取键盘事件
    window.addEventListener('keydown', this.keydown)
    window.addEventListener('keyup', this.keyup)

    // 加载布局
    if (this.$route.query.vmode) {
      this.vmode = this.$route.query.vmode
    } else {
      if (this.defaultGrid) {
        this.vmode = 'grid'
      } else {
        this.vmode = 'list'
      }
    }
    if (this.vmode === 'list') {
      this.grid = false
      if (!this.selectFile) {
        this.lessClientHeight = 140
      }
    } else {
      this.grid = true
      if (!this.selectFile) {
        this.lessClientHeight = 106
      }
      this.containerResize()
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
    if (this.$route.query.searchOpenFolder && this.path && !this.$route.query.keyword) {
      localStorage.setItem(this.path, this.$route.query.searchOpenFolder)
    }
    if (this.$route.query.highlight) {
      this.onCreateFilename = this.$route.query.highlight
      this.clearOnCreateFilename()
    }
    // remove query.basePath
    if (this.$route.query.basePath) {
      this.basePath = this.$route.query.basePath
    }

    // remove query.folder
    if (this.$route.query.searchOpenFolder && this.$route.query.keyword) {
      const query = { ...this.$route.query }
      delete query.searchOpenFolder
      this.$router.replace({ query })
    }

    let that = this
    window.onresize = function() {
      that.clientHeight =
        document.documentElement.clientHeight - that.lessClientHeight
    }

    setTimeout(() => {
      if (!this.getFileListed) {
        this.getFileListEnter()
      }
    }, 50)
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
      inserted: function(el) {
        // 聚焦元素
        let input = el.querySelector('input')
        if (!input) {
          input = el.querySelector('textarea')
        }
        input.focus()
      },
    },
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = '',
          height = ''

        function isReize() {
          const style = document.defaultView.getComputedStyle(el)
          if (width !== style.width || height !== style.height) {
            binding.value() // 关键
          }
          width = style.width
          height = style.height
        }

        el.__vueSetInterval__ = setInterval(isReize, 300)
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__)
      },
    },
  },
  methods: {
    // 判断给定的字符是否是中文
    isChineseChar(char) {
      return char.charCodeAt(0) > 255
    },
    // 获取字符的长度。中文字符长度为2，其他字符长度为1
    getCharLength(char) {
      //return this.isChineseChar(char) ? 2 : 1
      // 简单判断字符长度：中文字符和全角字符长度为2，其他为1
      if (this.isChineseChar(char)) {
        return 2;
      } else if (char === ' ') {
        return 2; // 空格作为一个字符处理
      } else {
        return 1;
      }
    },
    // 获取有效长度。如果有后缀，则包括后缀和点的长度；否则是基础名称和后7位的长度
    getEffectiveLength(base, suffix) {
      let chineseLength = Array.from(base).reduce((count, char) => count + this.getCharLength(char), 0)
      return suffix ? chineseLength + suffix.length + 1 : chineseLength
    },
    checkCmdKey(event) {
      const isMac = navigator.platform.startsWith('Mac')
      const { ctrlKey, metaKey } = event
      return (isMac && metaKey) || (!isMac && ctrlKey)
    },
    keydown(event) {
      const { keyCode } = event
      const isCmd = this.checkCmdKey(event)
      const checkPreviewVisible = this.checkPreviewVisible()
      // space
      if (keyCode === 32 && this.selectRowData.length > 0 && !checkPreviewVisible) {
        if (!this.drawer) {
          this.drawer = true
          this.drawerShowTime = Date.now()
        } else {
          this.drawer = false
        }
        event.preventDefault()
        event.stopPropagation()
      }
      // F2
      if (keyCode === 113 && this.selectRowData.length > 0 && !checkPreviewVisible) {
        this.renameFileName = this.rowContextData.name
        this.editingIndex = this.rowContextData.index
        event.preventDefault()
        event.stopPropagation()
      }
      // Del
      if (keyCode === 8 && !this.inputting && this.selectRowData.length > 0 && !checkPreviewVisible) {
        this.removeOperation()
        event.preventDefault()
        event.stopPropagation()
      }
      // ctrl + A / cmd + A
      if (isCmd && keyCode === 65 && !checkPreviewVisible) {
        if (this.inputting || this.editingIndex !== -1) {
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
      // ctrl + C / cmd + C
      if (isCmd && keyCode === 67 && !checkPreviewVisible && !this.inputting && this.selectRowData.length > 0) {
        this.copyOperation()
        event.preventDefault()
        event.stopPropagation()
      }
      // ctrl + V / cmd + V
      if (isCmd && keyCode === 86 && !checkPreviewVisible && !this.inputting && this.fileClipboard.length > 0) {
        // copy
        this.onCopy(this.getClipboardFileIdList, this.path, this.currentFolder)
        event.preventDefault()
        event.stopPropagation()
      }
      // ctrl + X / cmd + X
      if (isCmd && keyCode === 88 && !checkPreviewVisible && !this.inputting && this.fileClipboard.length > 0) {
        // move
        this.onMove(this.getClipboardFileIdList, this.path, this.currentFolder)
        event.preventDefault()
        event.stopPropagation()
      }
      // ctrl + P / cmd + P
      if (isCmd && keyCode === 80 && !checkPreviewVisible) {
        this.$refs.searchInput.focus()
        event.preventDefault()
        event.stopPropagation()
      }
    },
    keyup(event) {
      const { keyCode } = event
      // space
      if (keyCode === 32) {
        if (this.drawer && Date.now() - this.drawerShowTime >= 500) {
          this.drawer = false
        }
      }
    },
    onmessage(msg) {
      let fileDoc = msg.body
      const url = msg.url
      let index = this.fileList.findIndex(file => file.id === fileDoc.id)
      if ('updateFile' === url) {
        if (index > -1) {
          if (fileDoc.m3u8) {
            this.fileList[index].m3u8 = fileDoc.m3u8
          }
          this.fileList[index].size = fileDoc.size
          this.fileList[index].agoTime = 1
          this.fileList[index].updateDate = fileDoc.updateDate
        }
      }
      let thisPath = this.path
      if (this.listModeSearchOpenDir) {
        const row = this.pathList[this.pathList.length - 1]
        thisPath = `${row.row.path}${row.folder}`
      }
      const isCurrentPath = (thisPath + '/') === fileDoc
      if ('deleteFile' === url && (isCurrentPath || this.$route.path.startsWith('/recently'))) {
        this.getFileListEnter()
      }
      if ('createFile' === url) {
        if (fileDoc.$set) {
          this.onCreateFilename = fileDoc.$set.name
        }
        if (fileDoc && fileDoc.name) {
          this.onCreateFilename = fileDoc.name
        }
        if (!thisPath) {
          thisPath = ''
        }
        if (fileDoc) {
          if (fileDoc.$set) {
            let path = fileDoc.$set.path
            path = path.replace(/\\/g, '/')
            if (thisPath + '/' === path) {
              this.getFileListEnter()
            }
          } else {
            if (thisPath + '/' === fileDoc.path) {
              this.getFileListEnter()
            }
          }
        }
        this.clearOnCreateFilename()
      }
      if (this.$route.path.startsWith('/trash') && msg.url === 'operationTips') {
        this.getFileListEnter()
      }
    },
    // 延时清空onCreateFilename
    clearOnCreateFilename() {
      setTimeout(() => {
        this.onCreateFilename = ''
      }, 2000)
    },
    gridItemClick(row, event) {
      if (this.selectFile) {
        this.fileClick(row, event)
      }
      if (this.checkCmdKey(event)) {
        this.pinSelect(row, event)
        this.$refs.fileListTable.toggleRowSelection([{ row: row }])
        return
      }
      this.pinSelect(row, event)
    },
    containerResize() {
      // gird视图
      const container = document.querySelector('.dashboard-container')
      let clientWidth = container.clientWidth
      this.clientHeight = document.documentElement.clientHeight - this.lessClientHeight
      this.gridItemWidth = 125
      if (this.queryFileType === 'image') {
        this.gridItemWidth = 165
        this.gridColumnNum = Math.trunc((clientWidth - 10) / this.gridItemWidth)
      } else {
        this.gridColumnNum = Math.trunc((clientWidth - 10) / this.gridItemWidth)
      }
      const gridWidth = (clientWidth - 10) / this.gridColumnNum
      this.gridPaddingRight = gridWidth - this.gridItemWidth + 10
      this.showUpdateDateItem = clientWidth >= 900;
      this.showSizeItem = clientWidth >= 500;
      let gridRowNum = Math.round(
        this.clientHeight / (clientWidth / this.gridColumnNum)
      )

      if (this.finished && this.pagination.pageIndex === 1) {
        const actualRows =  Math.ceil(this.fileList.length / this.gridColumnNum)
        const gridMinHeight = actualRows * this.gridItemWidth + (actualRows - 1) * 10
        if (gridMinHeight < this.clientHeight) {
          this.gridMinHeight = gridMinHeight
        }
      }

      const lastPageSize = this.pagination.pageSize
      const thisPageSize = gridRowNum * this.gridColumnNum + this.gridColumnNum
      if (thisPageSize !== lastPageSize) {
        this.pagination.pageSize = thisPageSize
        if (this.$route.query.tagId) {
          this.queryCondition.tagId = this.$route.query.tagId
        }
        this.getFileListEnter()
      }
      this.$nextTick(() => {
        // list 视图
        const fileListTableWidth = this.$refs.fileListTableContainer.offsetWidth
        this.tableHeadNameWidth = fileListTableWidth - (80 + 200 + 250) - 90
      })

      // 使列表可拖拽
      this.rowDrop()
      this.darwRectangle()
    },
    // 画矩形选区
    darwRectangle() {
      let scrollDiv = this.$refs.fileListTableContainer.querySelector('.el-table__body-wrapper')
      if (this.grid) {
        scrollDiv = this.$refs.gridDiv.querySelector('.van-grid')
      }
      // 添加scroll事件
      scrollDiv.onscroll = e => {
        this.tableBodyScroll(null, e)
      }

      if (this.selectFile) {
        return
      }
      const _this = this
      let $$ = function(id) {
        return document.getElementById(id)
      }
      let draw = $$('v-draw-rectangle')
      let wId = 'rectangle1'
      let startX = 0,
        startY = 0
      let retcLeft = 0,
        retcTop = 0,
        retcHeight = 0,
        retcWidth = 0
      _this.drawFlag = false
      let itemClassName = 'el-table__row'
      if (_this.grid) {
        itemClassName =
          'grid-item van-grid-item__content van-grid-item__content--center van-grid-item__content--square'
      }
      draw.onmousedown = null
      draw.onmousedown = function(e) {
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
            if (!_this.checkCmdKey(e) && !e.shiftKey) {
              _this.$refs.fileListTable.clearSelection()
              _this.$refs.fileListTable.toggleRowSelection([
                { row: _this.fileList[throughRow.rowIndex], selected: true },
              ])
            }
          }
          return
        } else {
          _this.editingIndex = -1
        }
        if (evt.button !== 0) {
          return
        }
        if (!_this.checkCmdKey(e) && !e.shiftKey) {
          const index = elPath.findIndex(
            el =>
              el.className === itemClassName ||
              el.className === 'el-table__row el-table__row--striped'
          )
          if (index < 0) {
            _this.$refs.fileListTable.clearSelection()
          }
        }
        let scrollTop = draw.scrollTop || draw.scrollTop
        let scrollLeft = draw.scrollLeft || draw.scrollLeft
        startX = evt.clientX + scrollLeft
        startY = evt.clientY + scrollTop

        let div = document.createElement('div')
        div.id = wId
        div.className = 'draw-rectangle'
        div.style.left = startX + 'px'
        div.style.top = startY + 'px'
        div.style.position = 'fixed'
        div.style.border = '1px dashed #2898ff'
        div.style.width = '0px'
        div.style.height = '0px'
        div.style.left = '0px'
        div.style.top = '0px'
        div.style.overflow = 'hidden'
        draw.appendChild(div)
        document.onmousemove = function(e) {
          let evt = window.event || e
          let scrollTop =
            document.body.scrollTop || document.documentElement.scrollTop
          let scrollLeft =
            document.body.scrollLeft || document.documentElement.scrollLeft
          retcLeft =
            startX - evt.clientX - scrollLeft > 0
              ? evt.clientX + scrollLeft
              : startX
          retcTop =
            startY - evt.clientY - scrollTop > 0
              ? evt.clientY + scrollTop
              : startY
          retcHeight = Math.abs(startY - evt.clientY - scrollTop)
          retcWidth = Math.abs(startX - evt.clientX - scrollLeft)
          _this.drawFlag = true
          if (retcHeight + retcWidth < 4) {
            return
          }
          const drawRectangle = document.getElementById(wId)
          if (drawRectangle) {
            drawRectangle.style.left = retcLeft + 'px'
            drawRectangle.style.top = retcTop + 'px'
            drawRectangle.style.width = retcWidth + 'px'
            drawRectangle.style.height = retcHeight + 'px'
            drawRectangle.style.backgroundColor = '#f2f5fa55'
          }
          if (_this.drawFlag && retcHeight + retcWidth > 4) {
            if (!drawSelecting) {
              drawSelect({
                x: retcLeft,
                y: retcTop + _this.fileListScrollTop,
                w: retcWidth,
                h: retcHeight,
              })
            }
          }
        }
        document.onmouseup = function(e) {
          document.onmousemove = null
          document.onmouseup = null
          if (_this.stopSortChange) {
            _this.stopSortChange = false
            setTimeout(() => {
              _this.changeSelectedStyle(_this.selectRowData)
            }, 200)
          }
          setTimeout(function() {
            _this.drawFlag = false
          }, 50)
          const rectangle = document.getElementById(wId)
          if (rectangle) {
            draw.removeChild(rectangle)
          }
          if (!_this.grid) {
            draw = document.getElementById('drag-table')
          }
          const dragingDivs = Array.prototype.slice.call(
            draw.getElementsByClassName('dragingDiv')
          )
          dragingDivs.forEach(el => draw.removeChild(el))
        }
      }

      let drawSelecting = false
      let drawSelect = function(drawNode) {
        drawSelecting = true
        _this.dragElementList.forEach(element => {
          if (checkTouch(element, drawNode)) {
            _this.$refs.fileListTable.toggleRowSelection([
              { row: _this.fileList[element.rowIndex], selected: true },
            ])
          } else {
            _this.$refs.fileListTable.toggleRowSelection([
              { row: _this.fileList[element.rowIndex], selected: false },
            ])
          }
        })
        setTimeout(() => (drawSelecting = false), 10)
      }
      //检查两个DIV是否有接触
      let checkTouch = function(item, draw) {
        //得到左上角的绝对坐标
        let x1 = item.x
        let y1 = item.y
        let x2 = draw.x
        let y2 = draw.y
        let w1 = item.w
        let h1 = item.h
        let w2 = draw.w
        let h2 = draw.h
        return (
          ((x1 - x2 <= 0 && x2 - x1 < w1) || (x1 - x2 >= 0 && x1 - x2 < w2)) &&
          ((y1 - y2 <= 0 && y2 - y1 < h1) || (y1 - y2 >= 0 && y1 - y2 < h2))
        )
      }
    },
    // 行拖拽
    rowDrop() {
      if (this.selectFile) {
        return
      }
      // 目标元素的背景颜色
      let dragEnterBackCorlor = null
      // 被拖拽元素的背景色
      let dragBackCorlor = null
      const _this = this
      // 被拖动的元素
      let dragged = null
      // 被拖动的元素的索引
      let draggedIndex = -1

      let parentClassName = 'van-grid'
      let itemClassName = 'van-grid-item van-grid-item--square'
      let gridItemChildenClassName =
        'grid-item van-grid-item__content van-grid-item__content--center van-grid-item__content--square'
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
      let rows = 0 //行数

      let drawOffsetLeft = getElementToPageLeft(draw)

      let firstOver = 0 // 是否刚开始拖动
      let moveTitle = ''
      setTimeout(function() {
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
      let judgThroughDom = function(e, d) {
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
            if (
              elPath[0].id === 'v-draw-rectangle' ||
              elPath[0].className === 'el-table__virtual-wrapper'
            ) {
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
              const last = target.children[dragIndex]
              clearClass(last)
            }
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
              if (
                path.className === 'el-table__row el-table__row--striped' ||
                path.className === 'el-table__row'
              ) {
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
      let recoverDragDom = function(animation) {
        if (animation) {
          _this.selectRowData.forEach(row => {
            let dragingDiv = document.getElementById('dragingDiv' + row.index)
            dragingDiv.style.transition = 'all 0.3s'
            dragingDiv.style.top =
              dragingDiv.original.top -
              (_this.fileListScrollTop - _this.initFileListScrollTop) +
              'px'
            dragingDiv.style.left = dragingDiv.original.left
          })
          setTimeout(() => {
            _this.selectRowData.forEach(row => {
              draw.removeChild(
                document.getElementById('dragingDiv' + row.index)
              )
            })
          }, 300)
        } else {
          _this.selectRowData.forEach(row => {
            draw.removeChild(document.getElementById('dragingDiv' + row.index))
          })
        }
        setTimeout(() => {
          if (!_this.grid) {
            document
              .getElementsByClassName('el-table')[0]
              .classList.add('el-table--enable-row-hover')
          } else {
            target.querySelectorAll('.grid-hover-back').forEach(e => {
              e.classList.add('grid-hover')
            })
          }
        }, 350)
        _this.draging = 0
      }

      container.ondragend = function(e) {
        _this.$store.dispatch('updateMessage', {
          event: 'onDragStart',
          data: false,
        })
        e.dataTransfer.effectAllowed = 'none'
        // 清除上次进入的容器的状态
        const last = target.children[dragIndex]
        clearClass(last)
        dragged.style.cursor = 'default'
        e.target.parentNode.parentNode.title = moveTitle
      }
      // 开始拖拽
      container.ondragstart = e => {
        if (this.queryFileType === 'trash') {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
        // 正在选区获取按住关键键时禁止拖拽
        if (_this.drawFlag || _this.checkCmdKey(e) || e.shiftKey) {
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
          let dragingDivStyleTop = 0
          if (!_this.grid) {
            dragingDiv.firstChild.style.textAlign = 'center'
            let tds = Array.prototype.slice.call(dragingDiv.childNodes)
            tds.forEach((node, index) => {
              if (index === 0) {
                node.firstChild.style.margin = '0 20px'
              }
              if (index === 1) {
                node.firstChild.style.width = '280px'
                node.firstChild.style.marginRight = '20px'
              }
              if (index === 2) {
                node.style.borderRadius = '0 5px 5px 0'
                node.style.borderRight = '1px solid #409eff'
                node.firstChild.style.height = '44px'
                node.firstChild.style.lineHeight = '44px'
                node.firstChild.style.width = '80px'
                return true
              }
              if (index === 3) {
                dragingDiv.removeChild(node)
              }
            })
            dragingDivStyleTop = pos.y - _this.fileListScrollTop - 51.5
          } else {
            dragingDivStyleTop = pos.y - _this.fileListScrollTop - pos.h / 2 + 10
          }
          dragingDiv.style.top = dragingDivStyleTop + 'px'
          if (index === 0) {
            let numberFilesCopy = document
              .getElementById('numberFiles')
              .cloneNode(true)
            numberFilesCopy.id = 'numberFilesCopy'
            numberFilesCopy.querySelector('.number').innerHTML =
              _this.selectRowData.length + '个文件'
            dragingDiv.appendChild(numberFilesCopy)
          }
          dragingDiv.original = {
            top: dragingDivStyleTop,
            left: dragingDiv.style.left,
          }
          _this.initFileListScrollTop = _this.fileListScrollTop
          draw.appendChild(dragingDiv)
        })
        firstOver = 0
        let dragImage = document.getElementById('dragImage')
        e.dataTransfer.setDragImage(dragImage, 10, 10)
        _this.$store.dispatch('updateMessage', {
          event: 'onDragStart',
          data: true,
        })
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

        if (!_this.grid) {
          document
            .getElementsByClassName('el-table--enable-row-hover')[0]
            .classList.remove('el-table--enable-row-hover')
        } else {
          target.querySelectorAll('.grid-hover-back').forEach(e => {
            e.classList.remove('grid-hover')
          })
        }
        _this.draging = 1
      }
      container.ondragenter = function(e) {
        clearTimeout(loop)
        // 由于被拖动的元素 经过区域内中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
        let throughRow = judgThroughDom(e, 'enter')
        if (throughRow) {
          if (dragIndex !== throughRow.rowIndex) {
            if (dragIndex > -1) {
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex]
              clearClass(last)
            }
            // console.log('拖动进入目标元素'+throughRow.rowIndex,'dragIndex:',dragIndex);
            // 不是自己或为文件夹时才改变状态
            if (
              draggedIndex !== throughRow.rowIndex &&
              _this.fileList[throughRow.rowIndex].isFolder &&
              _this.selectRowData.findIndex(
                item => item.index === throughRow.rowIndex
              ) === -1
            ) {
              // 改变本次进入的容器的状态
              dragged.style.cursor = 'copy'

              let numberFilesCopy = document.getElementById('numberFilesCopy')
              numberFilesCopy.style.backgroundColor = '#40a9ffc9'
              numberFilesCopy.querySelector('.number').style.display = 'none'
              numberFilesCopy.querySelector('.icon').style.display = 'inline'
              numberFilesCopy.querySelector('.operate').style.display = 'inline'
              let targetFolder = numberFilesCopy.querySelector(
                '.target .folder'
              )
              targetFolder.style.display = 'inline'
              targetFolder.innerHTML = _this.fileList[throughRow.rowIndex].name

              dragEnterBackCorlor = throughRow.style.backgroundColor
              // 当拖拽文件夹上时，文件夹当背景色
              const color = '#9fcdfc99'
              if (_this.grid) {
                throughRow.style.backgroundColor = color
              } else {
                throughRow.childNodes.forEach(
                  node => (node.style.backgroundColor = color)
                )
              }
            }
            dragIndex = throughRow.rowIndex
          }
          leaveIndex = -1
        }
      }

      container.ondragover = function(e) {
        _this.selectRowData.forEach((row, index) => {
          const drawRectangle = document.getElementById(
            'dragingDiv' + row.index
          )
          if (drawRectangle) {
            drawRectangle.style.left =
              e.clientX - drawOffsetLeft + index * 3 + 10 + 'px'
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

      container.ondragleave = function(e) {
        clearTimeout(loop)
        let throughRow = judgThroughDom(e, 'leave')
        if (throughRow) {
          if (!_this.grid) {
            if (throughRow.rowIndex === 0 || throughRow.rowIndex === rows - 1) {
              // 离开第一行或最后一行
              leaveIndex = throughRow.rowIndex
              loop = setTimeout(function() {
                if (leaveIndex > -1) {
                  const leave = target.children[leaveIndex]
                  clearClass(leave)
                  dragIndex = -1
                }
              }, 100)
            }
          }
        }
      }
      container.ondrop = function() {
        const form = _this.fileList[draggedIndex]
        const to = _this.fileList[dragIndex]
        if (
          form &&
          to &&
          form.id !== to.id &&
          to.isFolder &&
          !_this.selectRowData.includes(to)
        ) {
          // 移动文件/文件夹
          let forms = []
          _this.selectRowData.forEach(row => {
            forms.push(row.id)
          })
          _this
            .$confirm(
              `是否将选中的${_this.selectRowData.length}项移动到 ${to.name}?`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
              }
            )
            .then(() => {
              _this.checkCopyOrMoveApi('move', forms, to.id, to.name)
              recoverDragDom(false)
            })
            .catch(() => {
              recoverDragDom(true)
            })
        } else {
          recoverDragDom(true)
        }
      }
      // 清除之前的样式
      let clearClass = function(node) {
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
            if (
              node.firstChild.style.backgroundColor ===
              'rgba(159, 205, 252, 0.6)'
            ) {
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
            numberFilesCopy.querySelector('.target .folder').style.display =
              'none'
          }
        }
        dragged.style.backgroundColor = dragBackCorlor
      }

      function getObjPos(obj) {
        let pos = { x: 0, y: 0 }
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
    extendedInfo(file) {
      if (!file.exif && !file.video) {
        return ''
      }
      return "\r\n" + formatExif(file.exif) + formatVideo(file.video)
    },
    upload() {
      // 打开文件选择框
      this.$store.dispatch('updateMessage', {
        event: 'openUploader',
        data: {
          // 传入的参数
          folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
          currentDirectory: this.getQueryPath(),
          username: this.$store.state.user.name,
          userId: this.$store.state.user.userId,
        },
      })
    },
    uploadFolder() {
      if (window.uploader.supportDirectory) {
        this.$store.dispatch('updateMessage', {
          event: 'uploadFolder',
          data: {
            // 传入的参数
            folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
            currentDirectory: this.getQueryPath(),
            username: this.$store.state.user.name,
            userId: this.$store.state.user.userId,
          },
        })
      } else {
        this.$message({
          message: '该浏览器不支持上传文件夹',
          type: 'warning',
        })
      }
    },
    // 浏览器的返回事件
    goBack() {
      if (this.pathList.length <= 1) {
        const queryTagId = this.$route.query.tagId
          ? `&tagId=${this.$route.query.tagId}`
          : ''
        const keyword = this.$route.query.keyword
          ? `&keyword=${this.$route.query.keyword}`
          : ''
        const basePath = this.getBasePath()
        this.$router.push(
          `/?vmode=${this.vmode}&path=${encodeURI(
            this.path
          )}${queryTagId}${basePath}${keyword}`
        )
        return
      }
      this.lastLink()
    },
    lastLink() {
      let keywordQuery = ''
      const searchPathIndex = this.pathList.findIndex(item => item.search)
      if (searchPathIndex === this.pathList.length - 1) {
        keywordQuery = '&keyword='
      }
      this.handleLink(
        this.pathList[this.pathList.length - 2],
        this.pathList.length - 2,
        undefined,
        undefined,
        keywordQuery
      )
    },
    async handleLink(item, index, unPushLink, unRefresh, keywordQuery) {
      this.pathList.splice(
        this.pathList.findIndex((v, i) => i === index + 1),
        this.pathList.length - (index + 1)
      )
      if (item && item.search) {
        if (item.searchKey) {
          this.searchFileByKeyword(item.searchKey)
        } else if (item.row) {
          this.searchFileAndOpenDir(item.row.id)
        }
      } else {
        this.pathList.forEach((p, number) => {
          if (number === 0) {
            this.path = ''
          } else if (number === this.pathList.length) {
          } else {
            this.path += '/' + this.pathList[number].folder
          }
          this.path = this.path.replace(/\\/g, '/')
        })
        let queryFolder = localStorage.getItem('mountFileOwner') ? localStorage.getItem(this.path) : this.$route.query.folder
        if (localStorage.getItem('mountFileOwner') && !queryFolder) {
          queryFolder = await this.getMountFolderId(this.$route.query.folder, localStorage.getItem('mountFileOwner'), this.path)
        }
        let searchOpenFolder = this.$route.query.searchOpenFolder ? `&searchOpenFolder=${this.$route.query.searchOpenFolder}` : ''
        if (!unPushLink) {
          const queryTagId = this.$route.query.tagId
            ? `&tagId=${this.$route.query.tagId}`
            : ''
          const basePath = this.getBasePath()
          if (keywordQuery !== '&keyword=') {
            keywordQuery = this.$route.query.keyword
              ? `&keyword=${this.$route.query.keyword}`
              : ''
          } else {
            keywordQuery = ''
          }
          const searchPathIndex = this.pathList.findIndex(item => item.search)
          if (searchPathIndex < 0) {
            keywordQuery = ''
            searchOpenFolder = ''
          }
          this.$router.push(`?vmode=${this.vmode}&path=${encodeURI(this.path).replaceAll('#', '%23')}${queryFolder ? '&folder=' + queryFolder : ''}${queryTagId}${basePath}${keywordQuery}${searchOpenFolder}`)
        }
        if (!unRefresh) {
          this.pagination.pageIndex = 1
          this.getFileListEnter()
        }
      }
    },
    getMountFolderId(currentFolder, fileUsername, path) {
      return new Promise((resolve, reject) => {
        api.getMountFolderId({
          otherFileId: currentFolder,
          fileUsername: fileUsername,
          path: path
        })
          .then(res => {
            if (res.data) {
              resolve(res.data)
            } else {
              resolve('')
            }
          })
          .catch(error => {
            reject('')
          })
      })
    },
    getBasePath() {
      let basePath = this.$route.query.basePath
        ? `&basePath=${this.$route.query.basePath}`
        : ''
      if (!this.path || this.path.length < 2) {
        this.basePath = '/'
        return ''
      }
      return basePath
    },
    // 新建文档
    newDocument() {
      window.open(`/setting/website/manager-articles?operation=new`, '_blank')
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
    getDuplicateFileName(fileList, filename) {
      let append = 0
      let filenameList = []
      fileList.forEach(file => {
        let fileName = file.name || file.label
        filenameList.push(fileName)
      })
      let newName = filename
      while (filenameList.includes(filename)) {
        append += 1
        if (newName.indexOf('.') > 0) {
          let name = newName.substring(0, newName.lastIndexOf('.'))
          if (name.indexOf(' 副本') > 0) {
            name = name.substring(0, name.lastIndexOf(' 副本'))
          }
          const suffix = newName.substring(newName.lastIndexOf('.'))
          if (append === 1) {
            filename = `${name} 副本${suffix}`
          } else {
            filename = `${name} 副本${append}${suffix}`
          }
        } else {
          if (newName.indexOf(' 副本') > 0) {
            newName = newName.substring(0, newName.lastIndexOf(' 副本'))
          }
          if (append === 1) {
            filename = `${newName} 副本`
          } else {
            filename = `${newName} 副本${append}`
          }
        }
      }
      return filename
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
            type: 'warning',
          })
          return
        }
        this.newFolderLoading = true
        this.createFileLoading = true
        api
          .uploadFolder({
            isFolder: true,
            filename: encodeURI(this.newFolderName),
            currentDirectory: this.getQueryPath(),
            folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
            username: this.$store.state.user.name,
            userId: this.$store.state.user.userId,
          })
          .then(res => {
            if (res.data === 1) {
              this.newFolderLoading = false
              this.$message({
                message: '该文件夹已存在',
                type: 'warning',
              })
            } else {
              this.createFileLoading = false
              this.newCreateFileDialog = false
              this.newFolderLoading = false
              this.showNewFolder = false
              this.isShowNewFolder = false
              this.$notify({
                title: '新建文件夹成功',
                type: 'success',
                duration: 1000,
              })
              this.getFileListEnter()
            }
          })
          .catch(() => {
            this.newFolderLoading = false
            this.createFileLoading = false
          })
      } else {
        this.newFolderLoading = false
        this.$message({
          message: '请输入文件夹名称',
          type: 'warning',
        })
      }
    },
    // 新建文件
    createFile(newFileName) {
      if (this.newCreateFileDialogTitle === '新建文件夹') {
        this.newFolderName = newFileName
        this.newFolderNameClick()
        return
      }
      if (newFileName) {
        if (/[\[\]\/\\"<>\?\*]/gi.test(newFileName)) {
          this.$message({
            message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
            type: 'warning',
          })
          return
        }
        this.createFileLoading = true
        let parentPath = '/'
        if (this.path) {
          if (this.path.length > 0) {
            parentPath = this.path
          }
        }
        let suffix = newFileName.substring(newFileName.lastIndexOf('.') + 1)
        api
          .addFile({
            fileName: encodeURI(newFileName),
            isFolder: false,
            folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
            username: this.$store.state.user.name,
            parentPath: encodeURI(parentPath),
          })
          .then(res => {
            this.createFileLoading = false
            switch (suffix && !this.$route.query.folder) {
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
                this.iframePreviewRow = res.data
                this.iframePreviewVisible = true
                break
            }
            const that = this
            this.setOnCreateFilename(newFileName)
            setTimeout(function() {
              that.newCreateFileDialog = false
            }, 200)
          })
          .catch(() => {
            this.createFileLoading = false
          })
      }
    },
    searchFileByKeyword(key) {
      this.searchFile(key)
    },
    // 切换布局
    changeVmode() {
      this.grid = !this.grid
      this.vmode = 'list'
      if (this.grid) {
        this.vmode = 'grid'
        this.lessClientHeight = 106
      } else {
        this.lessClientHeight = 140
        this.$refs.fileListTable.setHeight()
      }
      this.clientHeight =
        document.documentElement.clientHeight - this.lessClientHeight
      if (!this.path) {
        this.path = ''
      }
      this.editingIndex = -1
      const queryTagId = this.$route.query.tagId
        ? `&tagId=${this.$route.query.tagId}`
        : ''
      const basePath = this.getBasePath().replaceAll('#', '%23')
      const keyword = this.$route.query.keyword ? `&keyword=${this.$route.query.keyword}` : ''
      const folder = this.$route.query.folder ? `&folder=${this.$route.query.folder}` : ''
      const searchOpenFolder = this.$route.query.searchOpenFolder ? `&searchOpenFolder=${this.$route.query.searchOpenFolder}` : ''
      this.$router.push(`?vmode=${this.vmode}&path=${this.path.replaceAll('#', '%23')}${folder}${queryTagId}${basePath}${keyword}${searchOpenFolder}`)
      // 改变拖拽目标
      this.rowDrop()
      // 画矩形选取
      this.darwRectangle()
      this.loadContextMenus()
      // 使列表滑到顶部
      if (!this.grid) {
        if (this.fileListScrollTop > 0) {
          this.$refs.fileListTable.pagingScrollTopLeft()
        }
      }
      this.fileListScrollTop = 0
    },
    // 加载菜单查看状态
    loadContextMenus() {
      if (this.contextMenus.length < 1) {
        this.contextmenuDisabled = true
        return
      }
      let container = document.querySelector('.dashboard-container')
      if (this.$refs.homeContextmenu.references.length === 0) {
        this.$refs.homeContextmenu.addRef({ el: container, vnode: container })
      }
      const viewModeIndex = this.contextMenus.findIndex(
        item => item.operation === 'viewMode'
      )
      const arrangementModeIndex = this.contextMenus.findIndex(
        item => item.operation === 'arrangement'
      )
      if (viewModeIndex > -1) {
        const child = this.contextMenus[viewModeIndex].child
        if (this.grid) {
          child[0].iconClass = 'menu-empty'
          child[1].iconClass = 'menu-point'
        } else {
          child[0].iconClass = 'menu-point'
          child[1].iconClass = 'menu-empty'
        }
        if (child[2]) {
          if (localStorage.getItem('showFolderSize') === '1') {
            child[2].iconClass = 'duigou'
          } else {
            child[2].iconClass = 'menu-empty'
          }
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
      this.currentDirectory = decodeURIComponent(this.getQueryPath())
      this.pageLoadCompleteList[this.pagination.pageIndex] = false
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
          file['index'] =
            (this.pagination.pageIndex - 1) * this.pagination.pageSize + number
          this.fileList.push(file)
        })
      } else {
        this.fileList = res.data
        this.fileList.map((item, index) => {
          item.index = index
        })
        this.$refs.fileListTable.reloadData(this.fileList)
        setTimeout(() => {
          if (this.$refs.fileListTable) {
            this.$refs.fileListTable.reloadData(this.fileList)
          }
        }, 0)
      }
      // 数据全部加载完成
      if (this.fileList.length >= res.count) {
        this.finished = true
      }
      this.tableLoading = false
      this.clientHeight =
        document.documentElement.clientHeight - this.lessClientHeight
      this.listModeSearch = false
      this.pagination['total'] = res.count
      this.$nextTick(() => {
        this.containerResize()
        this.tableLoading = false
        this.pageLoadCompleteList[this.pagination.pageIndex] = true
      })
      // 加载菜单状态
      this.loadContextMenus()
      // 高亮新增的文件
      this.highlightNewFile()
      // 设置挂载文件的用户名(文件的所有者)
      this.fileUsername = ''
      this.setMountFileOwner(res.props)
      const path = this.$route.query.path ? this.$route.query.path : '/'
      const basePath = this.$route.query.basePath
        ? this.$route.query.basePath
        : '/'
      this.path = basePath + path
      this.path = this.path.replace(/\\/g, '/')
      this.path = this.path.replace(/\/\//g, '/')
      if (this.path === '/') {
        this.path = ''
      }
    },
    // 设置挂载文件的用户名(文件的所有者)
    setMountFileOwner(props) {
      localStorage.removeItem('mountFileOwner')
      if (this.$route.query.folder) {
        if (props && props.fileUsername && props.fileUsername !== this.$store.getters.name) {
          this.fileUsername = props.fileUsername
          localStorage.setItem('mountFileOwner', props.fileUsername)
        }
      }
    },
    // 高亮新增文件
    highlightNewFile() {
      if (this.onCreateFilename) {
        let index = this.fileList.findIndex(
          item => item.name === this.onCreateFilename
        )
        if (index > -1) {
          let row = this.fileList[index]
          setTimeout(() => {
            this.$refs.fileListTable.clearSelection()
            this.$refs.fileListTable.toggleRowSelection([
              { row: row, selected: true },
            ])
          }, 0)
        }
      }
    },
    getFileListEnter(onLoad) {
      this.debounceGetFileList(onLoad)
    },
    searchFileEnter(key, onLoad) {
      this.debounceSearch(key, onLoad)
    },
    searchFile(key, onLoad) {
      if (key) {
        this.beforeLoadData(onLoad)
        // this.pathList = [{ folder: "" }]
        // 查找this.pathList中是否已经有搜索的路径

        const item = {}
        item['folder'] = `搜索: ${key}`
        item['search'] = true
        item['searchKey'] = key

        let searchOpenFolder = this.$route.query.searchOpenFolder ? `&searchOpenFolder=${this.$route.query.searchOpenFolder}` : ''

        const searchPathIndex = this.pathList.findIndex(item => item.search)
        if (searchPathIndex < 0) {
          this.pathList.push(item)
        } else {
          this.pathList.splice(searchPathIndex,this.pathList.length - searchPathIndex)
          this.pathList.push(item)
          searchOpenFolder = ''
        }
        const queryTagId = this.$route.query.tagId
          ? `&tagId=${this.$route.query.tagId}`
          : ''
        const folder = this.$route.query.folder ? `&folder=${this.$route.query.folder}` : ''
        const basePath = this.getBasePath()
        const keyword = key ? `&keyword=${key}` : ''
        const path = this.path
          ? encodeURI(this.path.replace(this.basePath, '/'))
          : '/'
        this.$router.push(
          `?vmode=${
            this.vmode
          }&path=${path}${keyword}${searchOpenFolder}${queryTagId}${basePath}${folder}`
        )
        api.searchFile({
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            keyword: key,
            sortableProp: this.sortable.prop,
            order: this.sortable.order,
            currentDirectory: this.getQueryPath(),
            folder: this.$route.query.folder,
            tagId: this.$route.query.tagId,
            isFolder: this.queryCondition.isFolder,
            isFavorite: this.queryCondition.isFavorite,
            queryFileType: this.filterOption.type || this.queryFileType,
            pageIndex: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize,
            showFolderSize: localStorage.getItem('showFolderSize'),
            type: this.filterOption.type,
            queryModifyStart: this.filterOption.modifyStart,
            queryModifyEnd: this.filterOption.modifyEnd,
            querySizeMin: this.filterOption.sizeMin,
            querySizeMax: this.filterOption.sizeMax,
            searchMount: this.filterOption.searchMount,
          }).then(res => {
            this.loadData(res, onLoad)
            this.listModeSearch = true
            this.listModeSearchOpenDir = false
          }).catch(() => {
            this.tableLoading = false
          })
      } else {
        if (this.listModeSearch) {
          this.listModeSearch = false
          this.lastLink()
        }
      }
    },
    searchFileAndOpenDir(fileId, onLoad) {
      this.beforeLoadData(onLoad)

      const queryTagId = this.$route.query.tagId
        ? `&tagId=${this.$route.query.tagId}`
        : ''
      const path = this.$route.query.path ? `&path=${this.$route.query.path}`.replaceAll('#', '%23') : ''
      const keyword = this.$route.query.keyword
        ? `&keyword=${this.$route.query.keyword}`
        : ''
      const basePath = this.getBasePath()
      const searchOpenFolder = `&searchOpenFolder=${fileId}`
      const folder = this.$route.query.folder ? `&folder=${this.$route.query.folder}` : ''
      this.$router.push(`?vmode=${this.vmode}${path}${keyword}${searchOpenFolder}${queryTagId}${basePath}${folder}`)

      api
        .searchFileAndOpenDir({
          userId: this.$store.state.user.userId,
          username: this.$store.getters.name,
          id: fileId,
          currentDirectory: this.getQueryPath(),
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          folder: this.$route.query.folder,
          showFolderSize: localStorage.getItem('showFolderSize'),
        })
        .then(res => {
          this.loadData(res, onLoad)
          this.listModeSearch = true
          this.listModeSearchOpenDir = fileId
        }).catch(() => {
        this.tableLoading = false
      })
    },
    openDir(row, onLoad) {
      this.beforeLoadData(onLoad)
      api
        .searchFileAndOpenDir({
          userId: this.$store.state.user.userId,
          username: this.$store.getters.name,
          id: row.mountFileId || row.id,
          currentDirectory: this.getQueryPath(),
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
          folder: this.$route.query.folder,
          showFolderSize: localStorage.getItem('showFolderSize'),
        })
        .then(res => {
          this.loadData(res, onLoad)
        }).catch(() => {
          this.tableLoading = false
        })
      // this.path = row.path + row.name
      // this.path = this.path.replace(/\\/g, '/')
    },
    getFileList(onLoad) {
      if (this.$route.query.keyword) {
        if (this.$route.query.keyword !== 'undefined') {
          this.searchFileName = this.$route.query.keyword
        }
        this.searchInputBlur()
        const searchPathIndex = this.pathList.findIndex(item => item.search)
        if (this.$route.query.searchOpenFolder && searchPathIndex > -1) {
          this.searchFileAndOpenDir(this.$route.query.searchOpenFolder, onLoad)
        } else {
          this.searchFile(this.searchFileName)
        }
      } else {
        this.searchFileName = ''
        this.getFileListed = true
        this.beforeLoadData(onLoad)
        api.fileList({
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            currentDirectory: this.getQueryPath(),
            folder: this.$route.query.folder,
            queryFileType: this.queryFileType,
            sortableProp: this.sortable.prop,
            order: this.sortable.order,
            isFolder: this.queryCondition.isFolder,
            isFavorite: this.queryCondition.isFavorite,
            isTrash: this.queryCondition.isTrash,
            tagId: this.queryCondition.tagId,
            queryCondition: this.queryCondition,
            pageIndex: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize,
            showFolderSize: localStorage.getItem('showFolderSize'),
          })
          .then(res => {
            this.loadData(res, onLoad)
          }).catch(() => {
          this.tableLoading = false
        })
      }
    },
    getQueryPath() {
      // 去掉this.$route.query.basePath最后的/
      let basePath = this.$route.query.basePath
        ? this.$route.query.basePath
        : '/'
      if (basePath) {
        if (basePath.lastIndexOf('/') === basePath.length - 1) {
          basePath = basePath.substring(0, basePath.length - 1)
        }
      }
      return encodeURI(basePath + this.$route.query.path)
    },
    tableBodyScroll(table, e) {
      this.fileListScrollTop = e.target.scrollTop
      let scrollBottom =
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      if (scrollBottom < 200) {
        if (!this.finished) {
          if (!this.pageLoadCompleteList[this.pagination.pageIndex]) {
            return
          }
          if (this.listModeSearch) {
            if (this.listModeSearchOpenDir) {
              this.searchFileAndOpenDir(this.listModeSearchOpenDir, true)
            } else {
              this.searchFile(this.searchFileName, true)
            }
          } else {
            this.getFileListEnter(true)
          }
        }
      }
      // // 改变拖拽目标
      // this.rowDrop()
      // // 画矩形选取
      // this.darwRectangle()
    },
    pinSelect(row, event) {
      if (event.shiftKey && this.selectOrigin > -1) {
        const origin = this.selectOrigin
        this.selectEnd = row.index
        let diff = this.selectEnd - origin
        // 先清除选中
        this.$refs.fileListTable.clearSelection()
        if (diff === 0) {
          this.selectOrigin = -1
        }
        if (diff > 0) {
          for (let i = origin; i <= this.selectEnd; i++) {
            this.$refs.fileListTable.toggleRowSelection([{ row: this.fileList[i], selected: true }])
          }
        }
        if (diff < 0) {
          for (let i = this.selectEnd; i <= origin; i++) {
            this.$refs.fileListTable.toggleRowSelection([{ row: this.fileList[i], selected: true }])
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
          this.removeClass(el, 'descending')
          this.removeClass(el, 'ascending')
        }
      })
      // 重新加上排序高亮
      let order = this.sortable.order === 'ascending' ? 'descending' : 'ascending'
      if (headerIndex > -1) {
        this.addClass(tableHeader.children[headerIndex], order)
      }
      this.orderCustom = true
      this.sortChange({ prop: prop, order: order })
    },
    sortChange(column) {
      let { prop, order } = column
      if (this.orderCustom || this.listModeSearch) {
        this.sortable.prop = prop
        this.sortable.order = order
        this.pagination.pageIndex = 1
        if (this.listModeSearch) {
          this.searchFile(this.searchFileName)
        } else {
          this.getFileListEnter()
        }
      }
    },
    removeClass(el, className) {
      const str = el.className
      if (str.indexOf(className) > -1) {
        el.className = str.replace(className, '')
      }
    },
    addClass(el, className) {
      if (el) {
        const str = el.className
        el.className = el.className + ' ' + className
      }
    },
    // 统计文件和文件夹
    getShowSumFileAndFolder(fileList) {
      let folderSize = 0
      let fileSize = 0
      fileList.forEach(fileInfo => {
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
      const stand = folderSize > 0 && fileSize > 0 ? '、' : ''
      return folderSum + stand + fileSum
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
    // 收集选中的index值作为数组 传递给rowRed判断变换样式
    handleSelectionChange(rows) {
      // 起点
      if (rows.length > 0) {
        this.selectOrigin = rows[0].index
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
      const item_size = this.tableHead[3]
      const item_date = this.tableHead[4]
      if (rows.length > 0) {
        const sumFileAndFolder = this.getShowSumFileAndFolder(rows)
        const sizeSum = this.getShowSumSize(selectTotalSize)
        item_name.label = sumFileAndFolder
        item_name.sortable = false
        item_size.label = sizeSum
        item_size.sortable = false
        item_date.label = ''
        item_date.sortable = false
      } else {
        item_name.label = '名称'
        item_name.sortable = true
        item_size.label = '大小'
        item_size.sortable = true
        item_date.label = '修改日期'
        item_date.sortable = true
      }
      this.allChecked = this.selectRowData.length === this.fileList.length;
    },
    // cell-style 通过返回值可以实现样式变换利用传递过来的数组index循环改变样式
    rowStyle({ row, column, rowIndex, columnIndex }) {
      if (
        this.$refs.fileListTable.tableSelectData.findIndex(
          item => item.index === rowIndex
        ) > -1
      ) {
        if (columnIndex === 0) {
          return {
            backgroundColor: '#e0f3fc !important',
            borderRadius: '5px 0 0 5px',
            borderLeft: '1px solid #409eff',
            borderTop: '1px solid #409eff',
            borderBottom: '1px solid #409eff',
          }
        }
        if (columnIndex === 3) {
          return {
            backgroundColor: '#e0f3fc !important',
            borderRadius: '0 5px 5px 0',
            borderRight: '1px solid #409eff',
            borderTop: '1px solid #409eff',
            borderBottom: '1px solid #409eff',
          }
        }
        return {
          backgroundColor: '#e0f3fc !important',
          borderTop: '1px solid #409eff',
          borderBottom: '1px solid #409eff',
        }
      }
    },
    // 动态添加index到row里面去
    tableRowClassName({ row, rowIndex }) {
      // row.index = rowIndex
    },
    // 选择某行预备数据#e0f3fc !important;
    preliminaryRowData(row) {
      if (row) {
        // this.$refs.fileListTable.tableSelectData[0] = row
        this.rowContextData = row
      }
      const isFavorite = this.rowContextData.isFavorite
      this.highlightFavorite(isFavorite, false)
    },
    //双击
    dblclick(row, column, cell, event) {
      this.fileClick(row, event)
    },
    // 单元格点击事件
    cellClick(row, column, cell, event) {
      if (this.selectFile) {
        this.fileClick(row, event)
        return
      }
      clearTimeout(this.Loop)
      if (this.editingIndex === -1) {
        const columnIndex = column.index
        if (columnIndex === 2) {
          if (this.selectRowData.length < 1) {
            if (row.index !== this.editingIndex) {
              this.editingIndex = -1
            }
          }
        }
        if (this.checkCmdKey(event)) {
          this.pinSelect(row, event)
          this.$refs.fileListTable.toggleRowSelection([{ row: row }])
          return
        }
        this.pinSelect(row, event)
      }
    },
    // 选取输入框部分内容
    renameInputFocus(doc, suffix) {
      this.setInputFocus()
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
      newFileName = newFileName.replace(/[\r\n]/g, '')
      if (newFileName) {
        if (/[\[\]\/\\"<>\?\*]/gi.test(newFileName)) {
          this.$message({
            message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
            type: 'warning',
          })
          return
        }
        let strFileName = newFileName.replace(/(.*\/)*([^.]+).*/gi, '$2')
        let newExt = newFileName.replace(/.+\./, '')
        if (!row.isFolder) {
          if (row.suffix !== newExt) {
            this.$confirm(
              `您确定要将扩展名“.${row.suffix}”更改为“.${newExt}”吗？`,
              '提示',
              {
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                confirmButtonText: `保持.${row.suffix}`,
                cancelButtonText: `使用.${newExt}`,
              }
            )
              .then(() => {
                newFileName = strFileName + '.' + row.suffix
              })
              .catch(() => {})
              .then(() => {
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
          type: 'warning',
        })
        this.renameLoading = false
        return
      }
      api
        .rename({
          newFileName: encodeURI(newFileName),
          username: this.$store.state.user.name,
          folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
          id: row.id,
        })
        .then(res => {
          this.renameLoading = false
          row.name = newFileName
          row.suffix = newFileName.replace(/.+\./, '')
          this.fileList[row.index] = row
          this.editingIndex = -1
        })
        .then(() => {
          this.$refs.fileListTable.clearSelection()
          this.setOnCreateFilename(newFileName)
        })
        .catch(() => {
          this.renameLoading = false
          this.editingIndex = -1
        })
    },
    setOnCreateFilename(newFileName) {
      if (this.$route.query.folder) {
        this.onCreateFilename = newFileName
        this.getFileListEnter()
        this.clearOnCreateFilename()
      }
    },
    setMenus(row) {
      this.menus = JSON.parse(JSON.stringify(this.singleMenus))
      // 挂载的文件
      const owner = localStorage.getItem('mountFileOwner')
      const notSelf = row.userId && row.userId !== this.$store.getters.userId
      if ((this.$route.query.folder && owner) || notSelf) {
        // 根据权限设置菜单
        this.setMenusByPermission(row)
      } else {
        if (row.suffix && row.suffix === 'md' && this.queryFileType !== 'trash') {
          this.menus.splice(2, 0, {
            iconClass: 'menu-edit1',
            label: '编辑',
            operation: 'edit',
          })
        }
        if (row.isFolder && row.mountFileId) {
          const reservations = ['open', 'tag', 'favorite', 'remove']
          // 删除this.menus中不要的菜单, 仅保留reservations中的菜单
          this.menus = this.menus.filter(item =>
            reservations.includes(item.operation)
          )
        }
        if (!row.isFolder && this.queryFileType !== 'trash') {
          this.menus.splice(-2, 0, fileOperations.duplicate)
        }
        if (row.ossFolder) {
          // 删除分享选项
          let index = this.menus.findIndex(item => item.operation === 'share')
          if (index > -1) {
            this.menus.splice(index, 1)
          }
        }
        this.setMenusCopyDownLoadLinks(row)
      }
      this.preliminaryRowData(row)
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
      const reservations = ['open', 'download']
      // 删除this.menus中不要的菜单, 仅保留reservations中的菜单
      this.menus = this.menus.filter(item =>
        reservations.includes(item.operation)
      )
      if (file.operationPermissionList && file.operationPermissionList.length > 0) {
        if (file.operationPermissionList.indexOf('PUT') > -1) {
          this.menus.splice(this.menus.length - 1, 0, fileOperations.rename)
        }
        if (file.operationPermissionList.indexOf('UPLOAD') > -1) {
          if (file.operationPermissionList.indexOf('DELETE') > -1) {
            this.menus.splice(this.menus.length - 1, 0, fileOperations.copy)
            this.menus.splice(this.menus.length - 1, 0, fileOperations.copyOnly)
          }
          if (!file.isFolder) {
            this.menus.splice(this.menus.length - 1, 0, fileOperations.duplicate)
          }
        }
        if (file.operationPermissionList.indexOf('DELETE') > -1) {
          this.menus.splice(this.menus.length, 0, fileOperations.remove)
        }
      }
      this.setMenusCopyDownLoadLinks(file)
    },
    // 鼠标右击
    rowContextmenu(row) {
      console.log('rowContextmenu', row, row.userId, this.$store.getters.userId)
      if (this.selectFile) {
        return
      }
      if (
        this.$refs.fileListTable.tableSelectData.length > 1 &&
        this.$refs.fileListTable.tableSelectData.findIndex(
          item => item.index === row.index
        ) > -1
      ) {
        this.menusIsMultiple = true
        this.menus = this.multipleRightMenus
        this.highlightFavorite(false, false)
      } else {
        this.$refs.fileListTable.clearSelection()
        this.$refs.fileListTable.toggleRowSelection([{ row: row }])
        this.menusIsMultiple = false
        this.setMenus(row)
      }
      event.preventDefault()
      this.menuTriangle = ''
      const e = {}
      e.pageX = event.pageX + 5
      e.pageY = event.pageY + 20
      e.clientX = event.clientX + 50
      e.clientY = event.clientY + 2
      this.$refs.contextShow.showMenu(e)
      this.cellMouseIndex = -1
    },
    menuFavoriteOver(index, isFavorite) {
      this.highlightFavorite(isFavorite, false)
    },
    menuFavoriteLeave(index, isFavorite) {
      this.highlightFavorite(isFavorite, false)
    },
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
    show() {
      const that = this
      this.contextmenuDisabled = true
      setTimeout(function() {
        that.contextmenuDisabled = false
      }, 1000)
    },
    hide() {
      const that = this
      this.isJustHideMenus = true
      setTimeout(function() {
        that.isJustHideMenus = false
      }, 100)
      this.cellMouseIndex = -1
    },
    // 全局右键菜单操作
    contextmenuClick(operation) {
      this.$refs.fileListTable.clearSelection()
      switch (operation) {
        case 'vmode-list':
          this.grid = true
          this.changeVmode()
          break
        case 'vmode-grid':
          this.grid = false
          this.changeVmode()
          break
        case 'show-folder-size':
          const showFolderSize = localStorage.getItem('showFolderSize')
          if (showFolderSize === '1') {
            localStorage.setItem('showFolderSize', '0')
          } else {
            localStorage.setItem('showFolderSize', '1')
          }
          this.getFileListEnter()
          break
        case 'orderName':
          this.sortChangeOfMenu('name', 1)
          break
        case 'orderSize':
          this.sortChangeOfMenu('size', 2)
          break
        case 'orderUpdateDate':
          this.sortChangeOfMenu('updateDate', 3)
          break
        case 'orderUploadDate':
          this.sortChangeOfMenu('uploadDate', -1)
          break
        case 'refresh':
          this.getFileListEnter()
          break
        case 'createTextFile':
          this.newCreateFileDialogTitle = '新建文本文件'
          this.createNewFile('txt')
          break
        case 'createFolder':
          this.newCreateFileDialogTitle = '新建文件夹'
          this.createNewFile('')
          break
        case 'createDrawioFile':
          this.newCreateFileDialogTitle = '新建流程图'
          this.createNewFile('drawio')
          break
        case 'createMinderFile':
          this.newCreateFileDialogTitle = '新建思维导图'
          this.createNewFile('mind')
          break
        case 'createWordFile':
          this.newCreateFileDialogTitle = '新建Word文档'
          this.createNewFile('docx')
          break
        case 'createExcalidrawFile':
          this.newCreateFileDialogTitle = '新建白板'
          this.createNewFile('excalidraw')
          break
        case 'createExcelFile':
          this.newCreateFileDialogTitle = '新建Excel工作表'
          this.createNewFile('xlsx')
          break
        case 'createPPTFile':
          this.newCreateFileDialogTitle = '新建PPT演示文档'
          this.createNewFile('pptx')
          break
        case 'createMarkdownFile':
          this.newDocument()
          break
        case 'clearTrash':
          this.clearTrash()
          break
      }
    },
    // 新建文件
    createNewFile(suffix) {
      if (this.newCreateFileDialogTitle === '新建文件夹') {
        this.newCreateFileName = `新建文件夹`
      } else {
        this.newCreateFileName = `未命名文件.${suffix}`
      }
      this.newCreateFileName = this.getNewFileName(
        this.fileList,
        this.newCreateFileName
      )
      this.newCreateFileDialog = true
      this.$nextTick(() => {
        let newFileNameInput = this.$refs.newCreateFileName.$el.querySelector(
          '.el-input__inner'
        )
        this.renameInputFocus(newFileNameInput, suffix)
      })
    },
    // 列表右键菜单操作
    menusOperations(operation, event) {
      switch (operation) {
        case 'share':
          // 分配标签
          this.share()
          break
        case 'tag':
          // 分配标签
          this.allocateTag()
          break
        case 'favorite':
          // 收藏
          this.favoriteOperating(true)
          break
        case 'edit':
          // 编辑
          window.open(
            `/setting/website/manager-articles?operation=editor&id=${
              this.rowContextData.id
            }`,
            '_blank'
          )
          break
        case 'open':
          // 打开
          this.fileClick(this.rowContextData, event)
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
        case 'duplicate':
          // 创建副本
          this.duplicate()
          break
        case 'copy':
          // 移动或复制
          this.moveOrCopy()
          break
        case 'copyOnly':
          this.copyOperation()
          break
        case 'download':
          // 下载
          this.downloadFile()
          break
        case 'copyDownloadLink':
          // 复制下载链接
          this.copyDownloadLink(this.rowContextData)
          break
        case 'remove':
          // 删除
          this.removeOperation()
          break
        case 'sweep':
          // 清空回收站
          this.sweepFile()
          break
        case 'restore':
          // 返回原处
          this.restoreFile()
          break
      }
      this.$refs.contextShow.hideMenu()
    },
    clearTreeNode() {
      // 清空文件树
    },
    removeOperation() {
      this.permanentDelete = false
      this.selectFileList = this.getSelectFileList()
      this.deleteConfirmVisible = true
    },
    onCopy(fileIdList, targetPath, targetFolder) {
      this.checkCopyOrMoveApi('copy', fileIdList, targetFolder, undefined, targetPath)
    },
    onMove(fileIdList, targetPath, targetFolder) {
      this.checkCopyOrMoveApi('move', fileIdList, targetFolder, undefined, targetPath)
    },
    copyOperation() {
      store.dispatch('updateFileClipboard', this.getSelectFileList())
    },
    // 加载下一级文件树
    directoryTreeLoadNode(node, resolve) {
      let fileId = null
      if (node.level === 0) {
        const that = this
        setTimeout(function() {
          that.$refs.directoryTree.setCurrentKey('0')
        }, 0)
        return resolve([{ id: '0', name: '根目录' }])
      }
      if (node.level > 1) {
        fileId = node.data.mountFileId || node.data.id
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
      this.fileTreeAndNewFolderDisabled = row.hasOwnProperty('newFolder')
      this.selectTreeNode = row
      this.selectTreeNode.showName = ' "' + row.name + '"'
    },
    // 节点被展开时触发
    treeNodeExpand(row, node, event) {},
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
        isLeaf: true,
      }
      this.$refs.directoryTree.append(newNode, this.selectTreeNode)
      setTimeout(function() {
        let treeInput = document.getElementById('treeInput')
        if (treeInput) {
          treeInput.value = newFolderName
          treeInput.focus()
          treeInput.select()
        }
      }, 100)
    },
    // 移动文件
    moveFileTree() {
      this.copyOrMove('move')
    },
    // 复制文件
    copyFileTree() {
      this.copyOrMove('copy')
    },
    // 解压文件
    confirmUnzip() {
      this.unzip(this.openingFile, this.selectTreeNode.id, false)
    },
    showDialogMoveOrCopyVisible() {
      this.dialogMoveOrCopyVisible = true
    },
    /**
     * 创建副本
     */
    duplicate() {
      const newFilename = this.getDuplicateFileName(
        this.fileList,
        this.rowContextData.name
      )
      api
        .duplicateFile({
          fileId: this.rowContextData.id,
          newFilename: newFilename,
        })
        .then(() => {
          this.$message.success('创建副本成功')
          this.setOnCreateFilename(newFilename)
        })
    },
    moveOrCopy() {
      this.showDialogMoveOrCopyVisible()

      this.titlePrefix = '移动或复制到: '
      this.unzipOperating = false
      const that = this
      setTimeout(function() {
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
        selectNodePath =
          this.selectTreeNode.path + this.selectTreeNode.name + '/'
      }

      let fileIds = []
      if (this.menusIsMultiple || this.selectRowData.length > 1) {
        const exits = this.$refs.fileListTable.tableSelectData.some(value => {
          fileIds.push(value.id)
          const thisParentPath = value.path
          if (thisParentPath === selectNodePath) {
            this.$message({
              message: '不能将文件' + operation + '到自身或其子目录下',
              type: 'warning',
            })
            return true
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
      this.checkCopyOrMoveApi(operating, fileIds, this.selectTreeNode.id, this.selectTreeNode.name)
    },
    checkCopyOrMoveApi(operating, froms, to, toName, targetPath) {
      if (!to && !targetPath) {
        to = '0'
        toName = '根目录'
      }
      if (targetPath) {
        toName = path.basename(targetPath)
      }
      api['checkMoveOrCopy']({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        froms: froms,
        to: to,
        targetPath: targetPath
      }).then((res) => {
        if (res.count > 0) {
          this.copyOrMoveConfirmVisible = true
          this.copyOrMoveParams = {operating: operating, froms: froms, to: to, targetPath: targetPath}
          this.copyOrMoveToName = `${(operating === 'copy' ? '复制' : '移动')}到: "${toName}"`
          this.existsFileList = res.data
        } else {
          this.copyOrMoveApi(operating, froms, to, false, targetPath)
        }
      })
    },
    copyOrMoveApi(operating, froms, to, isOverride, targetPath) {
      this.copyOrMoveConfirmVisible = false
      let operation = '复制'
      if (operating === 'move') {
        operation = '移动'
      }
      let copying = this.$message({
        iconClass: 'el-icon-loading',
        type: 'info',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: operation + '中...',
      })
      this.dialogMoveOrCopyVisible = false
      api[operating]({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        froms: froms,
        to: to,
        targetPath: targetPath,
        isOverride: isOverride
      }).then(() => {
          this.$refs.fileClipboard.clear()
          copying.iconClass = null
          copying.type = 'success'
          copying.message = operation + '中...'
          if (this.rowContextData.isFolder) {
            this.$refs.directoryTree.append(this.rowContextData, to)
          }
          if (operating === 'move') {
            // 移除列表
            this.getFileListEnter()
          }
          setTimeout(function() {
            copying.close()
          }, 1000)
        }).catch(() => {
          copying.close()
        })
    },
    renderContent(h, { node, data, store }) {
      if (data.newFolder) {
        return (
          <span class="custom-tree-node">
            <span>
              <svg-icon icon-class="folder" />
            </span>
            <span>
              <div class="el-input el-input--mini el-input-tree">
                <input
                  type="text"
                  autocomplete="on"
                  value="新建文件夹"
                  id="treeInput"
                  class="el-input__inner"
                />
              </div>
              <button
                type="button"
                on-click={() => {
                  let path = '/'
                  let parentData = node.parent.data
                  if (parentData.path) {
                    path = parentData.path + parentData.name + path
                  }
                  let newFolderName = document.getElementById('treeInput').value
                  api
                    .newFolder({
                      isFolder: true,
                      filename: encodeURI(newFolderName),
                      currentDirectory: this.getQueryPath(),
                      folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
                      username: this.$store.state.user.name,
                      userId: this.$store.state.user.userId,
                    })
                    .then(res => {
                      data.newFolder = false
                      data.name = newFolderName
                      data.id = res.data
                    })
                    .catch(() => {
                      window.event.preventDefault()
                      window.event.stopPropagation()
                    })
                }}
                class="el-button el-icon-check el-button--mini el-input-tree-button"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#f6f7fa88"
              />
              <button
                type="button"
                on-click={() => {
                  this.$refs.directoryTree.remove(node)
                  window.event.preventDefault()
                  window.event.stopPropagation()
                }}
                class="el-button el-icon-close el-button--mini el-input-tree-button"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#f6f7fa88"
              />
            </span>
          </span>
        )
      }
      if (node.expanded) {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="open-folder" />
            <span style="margin-left: 5px;">{node.label}</span>
            <span />
          </span>
        )
      } else {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="folder" />
            <span style="margin-left: 5px;">{node.label}</span>
            <span />
          </span>
        )
      }
    },
    allocateTag() {
      // 将this.$refs.fileListTable.tableSelectData拷贝给tagDialogObjectList而不是赋值
      this.tagDialogObjectList = JSON.parse(
        JSON.stringify(this.$refs.fileListTable.tableSelectData)
      )
      this.tagDialogVisible = true
    },
    allocateTagSuccess() {
      this.getFileListEnter()
    },
    share(row) {
      if (!row || !row.id) {
        if (this.rowContextData.id) {
          row = this.rowContextData
        } else {
          row = this.$refs.fileListTable.tableSelectData[0]
        }
      }
      this.shareDialogObject = row
      this.shareDialogObject.fileId = row.id
      this.shareDialogObject.shareBase = row.shareBase
      this.shareDialogObject.subShare = row.subShare
      this.shareDialogVisible = true
    },
    shareSuccess(shareBase, subShare) {
      this.updateRowContextData()
      this.rowContextData.shareBase = shareBase
      this.rowContextData.subShare = subShare
      this.rowContextData.isShare = true
    },
    onCancelShare() {
      this.updateRowContextData()
      delete this.rowContextData.shareBase
      delete this.rowContextData.subShare
      delete this.rowContextData.isShare
    },
    updateRowContextData() {
      // 这3行代码是为了让vue刷新数据
      const isFavorite = this.rowContextData.isFavorite
      this.rowContextData.isFavorite = !isFavorite
      this.rowContextData.isFavorite = isFavorite
    },
    downloadFile() {
      let fileIds = []
      if (this.$refs.fileListTable.tableSelectData.length > 0) {
        this.$refs.fileListTable.tableSelectData.forEach(value => {
          fileIds.push(value.id)
        })
      } else {
        fileIds.push(this.rowContextData.id)
      }
      if (fileIds.length > 1 || this.rowContextData.isFolder) {
        fileConfig.packageDownload(fileIds)
        return
      }
      fileConfig.download(
        this.$store.state.user.name,
        this.rowContextData,
        this.$store.getters.token
      )
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
      clipboard.on('success', e => {
        this.$message({ message: '复制成功', type: 'success', duration: 1000 })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
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
      const fileIds = this.getSelectIdList()
      this.rowContextData.isFavorite = isFavorite
      this.highlightFavorite(isFavorite, true)
      api
        .favoriteUrl({
          fileIds: fileIds,
          isFavorite: isFavorite,
        })
        .then(() => {
          // 收藏页面
          const homePage =
            !this.$route.query.path || this.$route.query.length <= 1
          if (!isFavorite && this.isCollectView && homePage) {
            // 移除列表
            this.removeSelectItme()
          }
        })
        .catch(() => {
          this.rowContextData.isFavorite = !isFavorite
        })
    },
    // 移动至回收站
    moveToRecycle() {
      this.permanentDelete = false
      this.deleteFile()
    },
    // 彻底删除
    sweepDeleteFile() {
      this.permanentDelete = true
      this.deleteFile()
    },
    // 删除
    deleteFile() {
      // 提取出selectFileList中的id
      const fileIds = this.selectFileList.map(item => item.id)
      this.deleteLoading = true
      api.delete({
        currentDirectory: this.getQueryPath(),
        username: this.$store.state.user.name,
        fileIds: fileIds,
        sweep: this.permanentDelete,
      }).then(() => {
        this.deleteLoading = false
        this.deleteConfirmVisible = false
        // 刷新列表
        if (this.$route.query.folder) {
          this.getFileListEnter()
        }
      }).catch(() => {
        this.deleteLoading = false
        this.deleteConfirmVisible = false
      })
    },
    restoreFile() {
      const fileIds = this.getSelectIdList()
      api.restore({fileIds: fileIds}).then()
    },
    sweepFile() {
      const fileIds = this.getSelectIdList()
      this.$confirm(`此操作将永久删除 ${fileIds.length}个文件, 是否继续?`, '提示', {
        confirmButtonText: '彻底删除',
        confirmButtonClass: 'el-button--danger',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.sweep({fileIds: fileIds}).then()
      })
    },
    clearTrash() {
      this.$confirm(`是否清空回收站? 此操作将无法还原!!!`, '提示', {
        confirmButtonText: '清空',
        confirmButtonClass: 'el-button--danger',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.clearTrash().then()
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
    getSelectFileList() {
      const fileList = [];
      this.permanentDeleteDisable = false;
      const addFileToList = ({ id, suffix, name, mountFileId, contentType, isFolder, music, video }) => {
        fileList.push({ id, suffix, name, mountFileId, contentType, isFolder, music, video });
      };
      if (this.selectRowData.length > 1 || this.menusIsMultiple) {
        this.$refs.fileListTable.tableSelectData.forEach(value => addFileToList(value));
      } else {
        addFileToList(this.rowContextData);
      }
      if (fileList.length > 0) {
        this.checkPermanentDelete(fileList[0]);
      }
      return fileList;
    },
    checkPermanentDelete(file) {
      if (/\//.test(file.id) || file.mountFileId) {
        this.permanentDeleteDisable = true
        this.permanentDelete = true
      }
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
        this.fileList.map((item, index) => {
          item.index = index
        })
        // 改变拖拽目标
        this.rowDrop()
        // 画矩形选取
        this.darwRectangle()
      }, 300)
    },
    // 预览压缩文件
    compressionFilePreview(file) {
      this.unzip(file, undefined, true)
    },
    unzipTo(file) {
      this.showDialogMoveOrCopyVisible()
      this.titlePrefix = '解压到: '
      this.unzipOperating = true
      const that = this
      setTimeout(function() {
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
        message: '<span>&nbsp;&nbsp;正在' + status + '</span>',
      })
      api
        .unzip({
          fileId: file.id,
          destFileId: destFileId,
        })
        .then(res => {
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
          setTimeout(function() {
            decompressing.close()
            that.openCompressionVisible = false
            if (file.id === destFileId) {
              that.getFileListEnter()
            }
            if (destFileId && file.id !== destFileId && !tempDir) {
              that.dialogMoveOrCopyVisible = false
            }
          }, 1000)
        })
        .catch(() => {
          decompressing.close()
        })
    },
    // 点击文件或文件夹
    fileClick(row, event) {
      this.drawer = false
      if (this.queryFileType === 'trash') {
        return
      }
      if (this.editingIndex === row.index) {
        return
      }
      this.openingFile = row
      if (row.isFolder) {
        this.editingIndex = -1
        const queryTagId = this.$route.query.tagId ? `&tagId=${this.$route.query.tagId}` : ''
        const keyword = this.$route.query.keyword ? `&keyword=${this.$route.query.keyword}` : ''
        // 打开文件夹
        if (this.listModeSearch) {
          const item = {}
          item['folder'] = row.name
          item['search'] = true
          item['row'] = row
          this.pathList.push(item)
          this.pagination.pageIndex = 1
          const searchOpenFolder = row.id ? `&searchOpenFolder=${row.id}` : ''
          const path = this.$route.query.path ? `&path=${this.$route.query.path}` : ''
          const folder = this.$route.query.folder ? `&folder=${this.$route.query.folder}` : ''
          const basePath = this.getBasePath()
          this.$router.push(
            `?vmode=${
              this.vmode
            }${path}${keyword}${searchOpenFolder}${folder}${queryTagId}${basePath}`
          )
          this.searchFileAndOpenDir(row.id)
        } else {
          let notHomePage = this.$route.path.length > 1
          if (
            notHomePage &&
            this.path + '/' !== row.path &&
            this.basePath.length === 1
          ) {
            this.basePath = row.path
          }

          this.path += '/' + row.name
          this.path = this.path.replace(/\\/g, '/')
          this.path = this.path.replace(/\/\//g, '/')
          // 去掉this.path开头的this.basePath
          this.path = this.path.replace(this.basePath, '/')
          const path = encodeURI(this.path).replaceAll('#', '%23')

          const item = { folder: row.name, shareBase: row.shareBase }
          this.pathList.push(item)
          this.pagination.pageIndex = 1
          if (this.$store.getters.userId !== row.userId) {
            row.mountFileId = row.id
          }
          if (row.mountFileId) {
            localStorage.setItem(this.path, row.mountFileId)
          }
          const basePath = this.basePath && this.basePath.length > 1 ? `&basePath=${this.basePath}` : ''
          const searchOpenFolder = this.$route.query.searchOpenFolder ? `&searchOpenFolder=${this.$route.query.searchOpenFolder}` : ''
          this.$router.push(`?vmode=${this.vmode}&path=${path}${row.mountFileId ? '&folder=' + row.mountFileId : ''}${queryTagId}${basePath}${keyword}${searchOpenFolder}`)
          this.openDir(row)
        }
      } else {
        if (this.selectFile) {
          let selectFile = row
          const selectData = this.$refs.fileListTable.tableSelectData
          if (selectData.length < 1 || selectData[0].id !== row.id) {
            this.$refs.fileListTable.clearSelection()
            this.$refs.fileListTable.toggleRowSelection([{ row: row }])
            this.pinSelect(row, event)
          } else {
            this.$refs.fileListTable.clearSelection()
            selectFile = {}
          }
          this.$emit('selectedFile', selectFile)
          return
        }
        const fileHandler = fileConfig.hasIframePreview(row.suffix, this.$store.getters.iframePreviewConfig)
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
        if (row.contentType.indexOf('audio') > -1) {
          // 音频文件
          this.$store.dispatch('updateMessage', {
            event: 'onAddAudio',
            data: { row: row, audioCoverUrl: this.audioCoverUrl },
          })
          return
        }
        if (suffix.compressedFile.includes(row.suffix)) {
          // 压缩文件
          this.openCompressionVisible = true
          return
        }
        if (row.contentType.indexOf('office') > -1 || suffix.iframePreviewFile.includes(row.suffix)) {
          // iframe 预览
          this.iframePreviewVisible = true
          this.iframePreviewRow = row
          this.fileHandler = {}
          return
        }
        if (row.contentType.indexOf('utf-8') > -1) {
          // 文本文件
          this.textPreviewRow = row
          this.textPreviewVisible = true
          return
        }
        this.notPreviewDialogVisible = true
      }
    },
    openOnlyOffice(row) {
      this.drawer = false
      this.iframePreviewVisible = true
      this.iframePreviewRow = row
      this.fileHandler = {}
      this.specifyPreviewer = 'office'
    },
    searchClose() {
      this.searchFileName = ''
      this.searchInputBlur()
      this.searchFileEnter()
    },
    searchInputFocus() {
      this.searchInputClass = 'search-input search-input-focus'
      this.setInputFocus()
    },
    searchInputBlur() {
      this.searchInputClass = this.searchFileName ? 'search-input search-input-focus' : 'search-input'
      this.setInputBlur()
    },
    searchFilterChange() {
      this.debounceSearch(this.searchFileName, false)
    },
    checkPreviewVisible() {
      if (this.iframePreviewVisible) {
        return true
      }
      if (this.imagePreviewVisible) {
        return true
      }
      if (this.textPreviewVisible) {
        return true
      }
      if (this.videoPreviewVisible) {
        return true
      }
      if (this.audioPreviewVisible) {
        return true
      }
      if (this.openCompressionVisible) {
        return true
      }
      if (this.shareDialogVisible) {
        return true
      }
      if (this.tagDialogVisible) {
        return true
      }
      if (this.compressedFileVisible) {
        return true
      }
      if (this.drawer) {
        return true
      }
      if (this.dialogMoveOrCopyVisible) {
        return true
      }
      if (this.deleteConfirmVisible) {
        return true
      }
      return this.notPreviewDialogVisible;
    },
    determineDownload(file) {
      this.download(file)
      this.notPreviewDialogVisible = false
    },
    download(file) {
      fileConfig.download(
        this.$store.state.user.name,
        file,
        this.$store.getters.token
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'src/styles/index';
@import 'src/styles/home-index';
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

.list-item {
  height: 50px;
}

.table-file-name:hover {
  cursor: default;
}

>>> .plTableBox .el-table .el-table__header {
  th {
    background-color: #ffffff;
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
  color: #409eff;
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

>>> .open-file-dialog {
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

>>> .v-contextmenu-item {
  .svg-icon {
    font-size: 14px;
  }
}

>>> .new-text-file-dialog {
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

.dialog-footer-delete {
  display: flex;
  justify-content: space-between;
}

>>> .van-grid-item__content {
  background-size: cover;
  background-position: center;
  border-radius: 5px !important;
  padding: 0;
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
    background-color: #e0f3fc;
  }
}

>>> .el-table::before {
  height: 0;
}

>>> .el-table {
  padding-left: 40px;
  th.gutter {
    display: table-cell !important;
  }
}
.dialog-file-list {
  padding: 10px 0;
}
.delete-attention {
  padding: 10px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  .el-checkbox {
    color: #606266;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
  }
}
.mt-5 {
  margin-top: 5px;
}

.search-input {
  width: 150px;
  transition: width 0.3s ease-in-out;
}

.search-input-focus {
  width: 240px;
}

.search-close-btn {
  padding: 4px;
  color: #C0C4CC;
  :hover {
    color: #409EFF;
  }
}

.search-option-btn {
  padding: 4px;
  margin-right: 4px;
  color: #606266;
  :hover {
    color: #409EFF;
  }
}

.search-option-btn-active {
  background: #409EFF;
  color: #fff;
  :hover {
    color: #fff;
  }
}

</style>
