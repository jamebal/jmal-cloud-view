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
            :divider="!!item.divider"
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
            :disabled="item.operation === 'create' && isNotUploadAllowed"
            :title="item.label"
          >
            <!-- 二级菜单 -->
            <div v-for="itemSecond of item.child" :key="itemSecond.operation">
              <v-contextmenu-item
                v-if="!itemSecond.child"
                :divider="!!itemSecond.divider"
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
              popper-class="upload-file"
              v-if="showUploadButton"
              v-show="!isNotUploadAllowed"
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
                      <el-button round
                        slot="append"
                        :loading="newFolderLoading"
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

            <el-autocomplete
              ref="searchInput"
              :class="searchInputClass"
              v-show="showSearchButton"
              :fetch-suggestions="fetchDynamicSuggestions"
              hide-loading
              :popper-append-to-body="false"
              :placeholder="`搜索 ${cmdKey} P`"
              v-model="searchFileName"
              @keyup.enter.native="searchFileEnter"
              @focus="searchInputFocus"
              @blur="searchInputBlur"
              @select="handleSelectSuggestion"
            >
              <template v-slot:suffix>
                <div>
                  <el-button round v-if="searchFileName" type="text" class="search-close-btn" @click="searchClose">
                    <i class="el-icon-circle-close"></i>
                  </el-button>
                  <el-popover
                    v-show="searchFileName"
                    placement="bottom-end"
                    popper-class="search-filter-popover"
                    trigger="click">
                    <search-option
                      ref="searchOption"
                      :has-search-conditions-param.sync="hasSearchFilterOption"
                      :keyword.sync="searchFileName"
                      :filter-option-param.sync="filterOption"
                      :query-condition="queryCondition"
                      :search-path="currentDirectory"
                      :search-result-count="pagination['total']"
                      @filter-change="searchFilterChange" >
                    </search-option>
                    <el-button round slot="reference" type="text" :class="searchOptionBtnClass" @click.native="showSearchOption">
                      <i class="el-icon-s-operation"></i>
                    </el-button>
                  </el-popover>
                </div>
              </template>

              <!-- 自定义提示项 -->
              <template #default="{ item }" class="autocomplete-suggestion-custom">

                <!-- 固定操作项：当前路径搜索 -->
                <div v-if="item.sugType === 'action_current_path_search'" class="suggestion-item action-item">
                  <div class="suggestion-action-item-title">
                    <i class="el-icon-search"></i>
                    <div class="suggestion-action-item-text">
                      <span class="suggestion-item-keyword">{{ item.keyword }}</span>
                      <span class="suggestion-item-hint">当前路径 或按 Enter</span>
                    </div>
                  </div>
                </div>

                <!-- 固定操作项：全盘搜索 -->
                <div v-else-if="item.sugType === 'action_global_search'" class="suggestion-item action-item">
                  <div class="suggestion-action-item-title">
                    <i class="el-icon-search"></i>
                    <div class="suggestion-action-item-text">
                      <span class="suggestion-item-keyword">{{ item.keyword }}</span>
                      <span class="suggestion-item-hint">全盘搜索</span>
                    </div>
                  </div>
                </div>

                <div v-else-if="item.sugType === 'clearAllHistory'" class="suggestion-item recently-item">
                  <span class="suggestion-item-text">最近搜索</span>
                  <div>
                    <el-button
                      round
                      type="text"
                      class="clear-search-history-btn"
                      @click.stop.prevent="clearAllSearchHistory($event)"
                    >清除所有</el-button>
                  </div>
                </div>

                <!-- 历史记录项 -->
                <div v-else-if="item.sugType === 'history'" class="suggestion-item history-item">
                  <div class="suggestion-item-title">
                    <i class="el-icon-time"></i>
                    <span class="suggestion-item-text">{{ item.keyword }}</span>
                  </div>
                  <div>
                    <el-button
                      round
                      type="text"
                      icon="el-icon-close"
                      class="clear-search-history-btn"
                      @click.stop.prevent="clearSearchHistoryForItem(item, $event)"
                    ></el-button>
                  </div>
                </div>

                <!-- 默认显示 -->
                <div v-else class="suggestion-item">
                  <span class="suggestion-item-text">{{ item.value }}</span>
                </div>
              </template>

            </el-autocomplete>
            <sort-dropdown :sortable="sortable" @sort-change="handleSortChange" />
            <el-button v-if="showChangeVmodeBtn" round type="text" class="vmode" @click="changeVmode">
              <svg-icon :icon-class="grid ? 'list' : 'grid'" />
            </el-button>
          </div>
        </div>
      </el-breadcrumb>
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

      <!--右键菜单-->
      <file-contextmenu ref="contextShow" :menus="menus" @menusOperations="menusOperations" @show="show" @hide="hide" @contextmenu="contextmenu" />

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
          element-loading-spinner="el-icon-loading"
          element-loading-background="#f6f7fa88"
          @mouseenter="disableBodyScroll"
          @mouseleave="enableBodyScroll"
        >
          <van-checkbox-group
            ref="checkboxGroup"
          >
            <div :class="fileListScrollTop > 0 ? 'shadow-container' : ''">
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
                  paddingBottom: '12px',
                  overscrollBehavior: 'contain',
                  transform: 'translateZ(0)',
                }"
              >
                  <van-grid-item
                    v-for="(item, index) in fileList"
                    :key="item.id"
                    :style="{paddingTop: 100/gridColumnNum + '%'}"
                  >
                    <div
                      class="grid-item van-grid-item__content van-grid-item__content--center van-grid-item__content--square"
                      :style="{
                      right: gridPaddingRight + 'px',
                      bottom: '10px',
                      height: gridItemWidth + 'px',
                      background: selectRowData.includes(item) ? 'var(--grid-active-color)' : '',
                      'background-size': 'cover',
                      'background-position': 'center',
                      'box-shadow': selectRowData.includes(item) ? '0 4px 12px var(--apple-shadow-color)' : '',
                      'transition': 'box-shadow 0.3s ease, transform 0.3s ease;',
                      border: selectRowData.includes(item)
                        ? 'solid 1px var(--apple-shadow-color)'
                        : '',
                    }"
                      v-tooltip="tooltipConfig(item)"
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
                          @keyup.enter.prevent.native="rowRename(renameFileName, item)
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
            </div>
          </van-checkbox-group>
        </div>
        <table class="drag-table" id="drag-table"></table>
      </div>

      <empty-file v-if="fileList.length < 1 && !tableLoading" :emptyStatus="emptyStatus"/>
      <img id="dragImage" draggable="false" style="position: fixed;opacity: 0" src="~@/assets/img/hide.png" />
      <div id="numberFiles" class="number-files" v-if="!selectFile">
        <img class="icon" src="~@/assets/img/arrow1_left.png" style="display: none" />
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
    <video-preview :file="videoPreviewRow" :status.sync="videoPreviewVisible" ></video-preview>
    <iframe-preview :file="iframePreviewRow" :fileHandler="fileHandler" :status.sync="iframePreviewVisible" :specifyPreviewer="specifyPreviewer"></iframe-preview>
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
        <el-button round size="small" @click="unzipTo(openingFile)"
          >解压到...</el-button
        >
        <el-button round
          size="small"
          @click="unzip(openingFile, openingFile.id, false)"
          >解压到当前目录</el-button
        >
        <el-button round
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
      class="compressed-file"
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
        <el-button round
          size="small"
          @click="fileTreeAndNewFolder"
          :disabled="fileTreeAndNewFolderDisabled"
          ><i class="el-icon-folder-add"></i>&nbsp;&nbsp;新建文件夹
        </el-button>
        <el-button round
          v-if="!unzipOperating"
          size="small"
          type="primary"
          @click="moveFileTree"
          >移 动</el-button
        >
        <el-button round
          v-if="!unzipOperating"
          size="small"
          type="primary"
          @click="copyFileTree"
          >复制</el-button
        >
        <el-button round
          v-if="unzipOperating"
          size="small"
          type="primary"
          @click="confirmUnzip"
          >解压</el-button
        >
        <el-button round size="small" @click="dialogMoveOrCopyVisible = false"
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
    <direct-link-dialog ref="directLinkDialog" :status.sync="directLinkDialogVisible" :file="rowContextData"/>
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
        <el-button round size="small" @click="newCreateFileDialog = false"
          >取消</el-button
        >
        <el-button round
          size="small"
          type="primary"
          @click="createFile(newCreateFileName)"
          :loading="createFileLoading"
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
            <el-button round v-if="!permanentDeleteDisable" type="danger" size="small" @click="sweepDeleteFile"  :loading="deleteLoading">彻底删除</el-button>
          </div>
          <div>
            <el-button round size="small" @click="deleteConfirmVisible = false">取 消</el-button>
            <el-button round v-if="permanentDeleteDisable" type="danger" size="small" @click="sweepDeleteFile" :loading="deleteLoading">彻底删除</el-button>
            <el-button round v-if="!permanentDeleteDisable" type="warning" size="small" @click="moveToRecycle" :loading="deleteLoading">移至回收站</el-button>
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
            <p>同名文件如何处理</p>
          </div>
        </div>
        <dialog-file-list class="dialog-file-list" :file-list="existsFileList" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></dialog-file-list>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button round size="small" @click="copyOrMoveConfirmVisible = false">取 消</el-button>
        <el-button round type="warning" size="small" @click="copyOrMoveApi(copyOrMoveParams.operating, copyOrMoveParams.froms, copyOrMoveParams.to, true, copyOrMoveParams.targetPath)">覆 盖</el-button>
        <el-button round type="primary" size="small" @click="copyOrMoveApi(copyOrMoveParams.operating, copyOrMoveParams.froms, copyOrMoveParams.to, false, copyOrMoveParams.targetPath)">跳 过</el-button>
      </span>
    </el-dialog>

    <file-clipboard ref="fileClipboard" v-if="showClipboard && fileClipboard.length > 0" :file-list="fileClipboard" :image-url="imageUrl" :audio-cover-url="audioCoverUrl" :target-path="path" :target-folder="currentFolder" @onCopy="onCopy" @onMove="onMove"></file-clipboard>
  </div>
</template>

<script>
import BreadcrumbFilePath from '@/components/Breadcrumb/BreadcrumbFilePath'
import ButtonUpload from '@/components/button/ButtonUpload'
import DirectLinkDialog from '@/components/DirectLinkDialog/index.vue'
import EmptyFile from '@/components/EmptyFile'

import FileTree from '@/components/FileTree'

import '@/utils/directives.js'
import IconFile from '@/components/Icon/IconFile'
import MessageDialog from '@/components/message/MessageDialog'
import AudioPreview from '@/components/preview/AudioPreview'
import FileDetails from '@/components/preview/FileDetails.vue'
import IframePreview from '@/components/preview/IframePreview.vue'
import ImageViewer from '@/components/preview/ImageViewer'
import SimTextPreview from '@/components/preview/SimTextPreview'
import VideoPreview from '@/components/preview/VideoPreview'
import SearchOption from '@/components/SearchOption/index.vue'
import ShareDialog from '@/components/ShareDialog/index.vue'
import DialogFileList from '@/components/ShowFile/DialogFileList.vue'
import FileClipboard from '@/components/ShowFile/FileClipboard.vue'
import SortDropdown from '@/components/SortDropdown/index.vue'
import TagDialog from '@/components/TagDialog/index.vue'
import FileContextmenu from '@/components/VContextmenu/file-contextmenu.vue'
import fileConfig from '@/utils/file-config'
import EditElement from '@/views/markdown/EditElement'

import { isNotDragUploadAllowed } from '@/components/SimpleUploader/dragUploadUtils'

import { scrollLockMixin } from './mixins/scrollLockMixin'
import globalContextmenuMixin from './mixins/globalContextmenu'
import shortcutKeyMixin from './mixins/shortcutKey'
import fileTooltipMixin from '@/components/ShowFile/mixins/fileTooltip'
import fileDragMixin from '@/components/ShowFile/mixins/fileDrag'
import filenameHandleMixin from '@/components/ShowFile/mixins/filenameHandle'
import fileHandleMixin from '@/components/ShowFile/mixins/fileHandle'
import filepathHandleMixin from '@/components/ShowFile/mixins/filepathHandle'
import fileLoadListMixin from '@/components/ShowFile/mixins/fileList'
import searchFileMixin from '@/components/ShowFile/mixins/searchFile'
import commonFileMixin from '@/components/ShowFile/mixins/common'
import styleControlMixin from '@/components/ShowFile/mixins/styleControl'
import fileContextmenuMixin from '@/components/ShowFile/mixins/fileContextmenu'
import clipboardMixin from '@/components/ShowFile/mixins/clipboard'

import { mapGetters, mapState } from 'vuex'

export default {
  mixins: [
    scrollLockMixin,
    globalContextmenuMixin,
    shortcutKeyMixin,
    fileTooltipMixin,
    fileDragMixin,
    filenameHandleMixin,
    fileHandleMixin,
    filepathHandleMixin,
    searchFileMixin,
    commonFileMixin,
    styleControlMixin,
    fileContextmenuMixin,
    clipboardMixin,
    fileLoadListMixin,// 这个要放在最后面, 里面的初始化操作会使用其他 mixin 中的方法
  ],
  name: 'ShowFile',
  components: {
    SortDropdown,
    DirectLinkDialog,
    FileContextmenu,
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
      default: false,
    },
    showChangeVmodeBtn: {
      // 是否显示切换视图模式图标按钮
      type: Boolean,
      default: true,
    },
    emptyStatus: {
      type: String,
      default: '空空如也~',
    },
    singleFileType: {
      type: String,
      default: '',
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
        return { isFolder: null, isMount: null }
      },
    },
  },
  data() {
    return {
      path: this.$route.query.path,

      shareToken: undefined,

      shareDialogVisible: false,
      directLinkDialogVisible: false,
      shareDialogObject: {},
      tagDialogVisible: false,
      tagDialogObjectList: [],

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
      audioPreviewVisible: false,
      notPreviewDialogMsg: '此文件不支持预览, 是否下载该文件?', // 非预览文件提示信息
      notPreviewDialogVisible: false,
      openingFile: '',
      openCompressionVisible: false,
      showUpdateDateItem: true, // 列表模式下是否显示修改时间
      showSizeItem: true, // 列表模式下是否显示文件大小
      stopSortChange: false,
      getFileListed: false,

      selectFileList: [], // 选中的文件
      deleteLoading: false, // 删除loading
    }
  },
  computed: {
    ...mapState(['message']),
    ...mapGetters(['name']),
    isNotUploadAllowed() {
      return isNotDragUploadAllowed(this.$route)
    },
    currentFolder() {
      return this.$route.query.folder
    },
  },
  created() {
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
        case 'getUploadParams':
          // 接收到 getUploadParams 事件，分发 onUploadParams 事件，携带上传参数
          this.$store.dispatch('updateMessage', {
            event: 'onUploadParams',
            data: this.getUploadParams(),
          })
          break
      }
    },
  },
  mounted() {
  },
  beforeDestroy() {
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
    setInputFocus() {
      this.inputting = true
    },
    setInputBlur() {
      this.inputting = false
    },
    clearTreeNode() {
      // 清空文件树
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
    openOnlyOffice(row) {
      this.drawer = false
      this.iframePreviewVisible = true
      this.iframePreviewRow = row
      this.fileHandler = {}
      this.specifyPreviewer = 'office'
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
      if (this.directLinkDialogVisible) {
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
    fileListTableClearSelection() {
      this.$refs.fileListTable.clearSelection()
    },
    directLinkDialogGetDirectLink(file, isCopy) {
      this.$refs.directLinkDialog.getDirectLink(file, isCopy)
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'src/styles/index';
@import 'src/styles/home-index';
@import "./style/index";

.compressed-file {
  >>> .el-dialog__body {
    padding: 0 20px 20px 20px;
  }
}

>>>.plTableBox .el-table .el-table__header th {
  background-color: var(--bg-color);
  color: var(--text-color);
}

>>>.el-table th.is-leaf {
  border-bottom: 1px solid var(--table-td-border-color);
}
</style>
