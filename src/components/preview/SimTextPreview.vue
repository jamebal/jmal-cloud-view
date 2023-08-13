<template>
  <div>
    <message-dialog
      title="确认信息"
      content="检测到未保存的内容，是否在离开前保存修改？"
      :show.sync="isSaveDialogVisible"
      operatButtonText="放弃修改"
      confirmButtonText="保存"
      @operating="closeDialog"
      @confirm="confirmUpdate"
    >
    </message-dialog>

    <message-dialog
      title="确认信息"
      content="是否在关闭前保存修改？"
      :show.sync="isTabSaveDialogVisible"
      operatButtonText="放弃修改"
      confirmButtonText="保存"
      @operating="closeTabDialog"
      @confirm="saveTabAndClose"
    >
    </message-dialog>

    <el-dialog
      ref="simTextDialog"
      v-bind="$attrs" v-on="$listeners"
      :fullscreen="fullscreen"
      :visible.sync="textPreviewVisible"
      :title="file.name"
      :close-on-click-modal="false"
      @close="closeDialog"
      :before-close="handleClose"
      :width="dialogWidth+'px'"
      v-resize="containerResize"
      class="simtext-dialog"
      v-dialogDrag="{ dialogWidthPercent: dialogWidthPercent}">
      <div slot="title" class="simtext-header-title">
        <span v-show="!moblie"><file-path-nav class="title-name" :path="filePathNav" @loadPath="loadPath"></file-path-nav></span>
        <div class="title-extension">

          <history-popover
            ref="historyPopover"
            :saved="!isShowUpdateBtn"
            :has-history-version.sync="hasHistoryVersion"
            :history-list-popover-visible.sync="historyListPopoverVisible"
            :history-operation-loading="!loading.closed"
            :light-theme.sync="lightTheme"
            buttonSize="small"
            @viewHistoryFile="viewHistoryFile"
            @recoverySuccess="recoverySuccess"
            @loadHistoryPathListSuccess="loadHistoryPathListSuccess"
          >
          </history-popover>

          <el-button v-if="isShowUpdateBtn" @click="saveAll(false)" :class="lightTheme?'':'dark-button'" size="small" :loading="updating">保存所有</el-button>

          <el-button
            v-if="editableTabsValue.endsWith('.md') && editableTabs.length > 0"
            :class="lightTheme?'':'dark-button'"
            size="small"
            circle
            @click="changePreviewMode"
            :title="previewMode?'编辑':'预览'"
          >
            <icon :type="previewMode?lightTheme?'icon-quxiaoyulan1':'icon-quxiaoyulan1-copy':lightTheme?'icon-yulan':'icon-yulan-copy'"></icon>
          </el-button>
          <el-button
            :class="lightTheme?'':'dark-button'"
            size="small"
            :icon="lightTheme?'el-icon-moon':'el-icon-sunny'"
            circle
            :title="lightTheme?'暗色':'亮色'"
            @click="skinning"
          />
          <button class="title-extension-button" @click="fullScreen">
            <svg-icon :icon-class="fullscreen?'normalscreen':'fullscreen'"></svg-icon>
          </button>
          <button class="title-extension-button" @click="closeDialog">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
      </div>
      <div class="content" :style="{height: editorHieght+26+'px'}">
        <div class="file-contents" :style="{width: contentsWidth+'px',height: editorHieght+32+'px',transition: transition,left: panelReadOnly || moblie || contentsHide ?`-${contentsWidth}px`:`0px`}">
          <div class="content-tree">
            <fancy-tree
              ref="fancTree"
              v-if="!this.shareId"
              :editableTabs="editableTabs"
              :editableTabsValue.sync="editableTabsValue"
              :contentsWidth="contentsWidth"
              :contentsHieght="editorHieght"
              :lightTheme="lightTheme"
              :directoryTreeData="directoryTreeData"
              @treeNodeClick="treeNodeClick"
              @onLoadTreePath="onLoadTreePath"
              @onRename="onRename"
              @removeFile="removeFile"
            >
            </fancy-tree>
          </div>
        </div>
        <div class="editor-resize" :style="{marginLeft: panelReadOnly || moblie || contentsHide ?`0px`:`${contentsWidth}px`,transition: transition}">
          <div class="darg-resize-conter"></div>
          <i v-show="!panelReadOnly" class="editor-resize-conter" icon="el-icon-arrow-right" :title="contentsHide ? '展开目录' : '隐藏目录'" @click="hideContents"/>
        </div>
        <div :style="{width: editorWidth-2+'px'}">
          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab()">
            <el-tab-pane
              v-for="(item,index) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <span slot="label"><svg-icon class="tabs-icon-svg" :icon-class="findSvgClass(item.name)"></svg-icon> {{item.title}}</span>
              <div v-if="textPreviewVisible" class="editor">
                <vditor-preview
                  :ref="'vditor'+index"
                  class="content-body"
                  v-show="editableTabsValue.endsWith('.md') && previewMode"
                  :style="{height: editorHieght+'px'}"
                />
                <MonacoEditor
                  v-show="editableTabsValue.endsWith('.md') ? !previewMode: true"
                  :ref="'monacoEditor'+index"
                  :width="editorWidth"
                  :height="editorHieght"
                  :theme="lightTheme?'vs':'vs-dark'"
                  :language="item.language"
                  :diffEditor="item.hasHistoryVersion"
                  original="..."
                  :options="options"
                  @change="change($event,index)"
                  @save="save($event,index)"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="nwse-resize" :style="{left: dialogWidth-15+'px'}"></div>
    </el-dialog>

  </div>
</template>
<script>

  import _ from "lodash"
  import '@/utils/directives.js'
  import api from '@/api/file-api'
  import historyApi from '@/api/file-history'
  import markdownApi from '@/api/markdown-api'

  import { iconClass,lineWrapping,suffix } from '@/utils/file-type'

  import MonacoEditor from '../MonacoEditorVue'
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

  import FileTree from"@/components/FileTree"
  import FancyTree from"@/components/FancyTree"
  import MessageDialog from "@/components/message/MessageDialog"
  import FilePathNav from '@/components/Breadcrumb/FilePathNav'
  import Icon from '@/components/Icon/Icon.vue'

  import VditorPreview from "@/components/preview/VditorPreview";
  import HistoryPopover from "@/components/HistoryPopover/index.vue";

  export default {
    name: "SimTextPreview",
    components: {
      HistoryPopover,
      Icon,MonacoEditor,FileTree,FancyTree,MessageDialog,FilePathNav,VditorPreview
    },
    props: {
      file: {
        type: Object,
        default: function () {
          return {}
        }
      },
      shareId: {
        type: String,
        default: undefined
      },
      filepath: {
        type: String,
        default: undefined
      },
      status: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    computed: {
    },
    data(){
      return{
        lightTheme: true,
        contentsHide: true,
        defalutLanguage: 'redis',
        lineWrapping: false,
        moblie: false,
        panelReadOnly: true,
        mountFileId: undefined,
        options: {
          fontSize: 14,
          contextmenu: true,
          codeLens: true,
          readOnly: true,
          lineNumbers: this.$pc,
          minimap: {
            enabled: this.$pc
          },
          // 换行
          wordWrap: this.lineWrapping ? 'wordWrapColumn':'',
          wordWrapMinified: true,
          wrappingIndent: "indent",
          preview: true,
          previewMode: 'subwordSmart'
        },
        textPreviewVisible: false,
        fullscreen: false,
        dialogWidth: 650,
        minDialogWidth: 650,
        dialogWidthPercent: 0.7,
        lastTransform: undefined,
        contentsWidth: 273,
        editorWidth: 1035,
        editorHieght: 640,
        transition: 'all 500ms ease 0s',
        newContent: '',
        previewMode: true,
        isShowUpdateBtn: false,
        updating: false,
        modifyMsg: undefined,
        isSaveDialogVisible: false,
        isTabSaveDialogVisible: false,
        removeIndex: 0,
        loading: {},
        darkButton: {
          background: '#3e3e3e!important',
          border: '1px solid #3e3e3e!important',
          color: '#ffffff!important'
        },
        directoryTreeData: {},
        editableTabsValue: '1',
        nextActiveName: '',
        editableTabs: [],
        editableValueMap: new Map(),
        abortControllerMap: new Map(),
        editableVersionMap: new Map(),
        hasHistoryVersion: false,
        historyListPopoverVisible: false,
        historyVersion: {metadata: {}},
        filePathNav: '',
        toolbars: {
          readmodel: true, // 沉浸式阅读
          navigation: true, // 导航目录
        },
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.setDialogWidth()
      })
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
          el.__vueSetInterval__ = setInterval(isReize, 0);
        },
        unbind(el) {
          clearInterval(el.__vueSetInterval__);
        }
      }
    },
    watch: { //监听file的变化，进行相应的操作即可
      file(file) {
        if(!file.path){
          return
        }
        this.editableTabs = []
        this.checkMobile()
        this.checkReadOnly(file)
        this.loadEditorSize()
        this.loading = this.$message({
          iconClass: 'el-icon-loading',
          type: 'info',
          duration: 0,
          dangerouslyUseHTMLString: true,
          offset: 100,
          message: '<span>&nbsp;&nbsp;正在加载数据...</span>'
        })
        if(lineWrapping.includes(file.suffix)) {
          this.options.wordWrap = 'wordWrapColumn'
          this.lineWrapping = true
        }else{
          this.options.wordWrap = ''
        }
        let request = 'previewText'
        if(this.shareId){
          request = 'sharePreviewText'
        }
        if(this.filepath){
          request = 'previewTextByPath'
          file.path = this.filepath
        }
        if(!file.id){
          request = 'previewTextByPath'
        }
        const params = {
          shareId: this.shareId,
          fileId: file.id,
          id: file.id,
          fileName: file.name,
          path: encodeURI(file.path),
          username: this.$store.state.user.name
        }
        api[request](params).then((res) => {
          this.loading.close()
          this.directoryTreeData = {
            name: res.data.name,
            isFolder: true,
            isLeaf: false,
            id: res.data.id,
            path: res.data.path
          }
          this.textPreviewVisible = true

          let pathname = res.data.path.substring(1, res.data.path.length) + res.data.name
          if ('previewTextByPath' === request) {
            pathname = `/${res.data.path}/${res.data.name}`
          }
          // 加载tabs
          this.editableTabs.push({
            title: res.data.name,
            copyTitle: res.data.name,
            language: this.getEditorLanguage(res.data.suffix),
            status: undefined,//标签状态
            name: pathname
          })

          this.requestStream(request, params, 0)

          this.editableTabsValue = pathname
          if (!this.shareId) {
            // 加载历史版本
            this.$refs.historyPopover.loadHistoryPathList(pathname)
          }
          // 界面的渲染后的初始化工作
          this.$nextTick(() => {
            this.onDialogDblClick()
            this.dragDialogSize()
            this.dragControllerDiv()
            this.setTheme()
          })
        }).catch(() => {
          this.loading.close()
        })
      },
      status: function(visible) {
        if(visible && this.loading.closed){
          this.textPreviewVisible = true
        }
      },
      editableTabsValue(value){
        if(value.endsWith('.md')){
          this.previewMode = false
        }
        this.hasHistoryVersion = this.editableVersionMap.get(value) || false
        if (this.hasHistoryVersion) {
          let currentIndex = this.editableTabs.findIndex(editable => editable.name === value)
          const tab = this.editableTabs[currentIndex]
          this.historyVersion = tab.historyVersion || {metadata: {}}
        } else {
          this.historyVersion = {metadata: {}}
        }
      }
    },
    methods:{
      setDialogWidth() {
        this.dialogWidth = document.body.clientWidth * this.dialogWidthPercent
      },
      loadHistoryPathListSuccess({res, pathname}) {
        if (res.count && res.count > 0) {
          this.editableVersionMap.set(pathname, true)
        } else {
          this.editableVersionMap.set(pathname, false)
        }
        this.hasHistoryVersion = this.editableVersionMap.get(pathname)
      },
      // loading
      viewHistoryFile({historyInfo, diff, recovery}) {
        this.previewMode = false
        const pathname = this.editableTabsValue
        let currentIndex = this.editableTabs.findIndex(editable => editable.name === pathname)
        const tab = this.editableTabs[currentIndex]

        if (this.isShowUpdateBtn) {
          this.$message({type: 'info', message: "请先保存当前修改的内容"})
          return
        }

        const currentContentText = this.getContentText(currentIndex)

        let loadingInfo = recovery ? '恢复中...' : '加载中...'
        this.loading = this.$message({
          iconClass: 'el-icon-loading',
          type: 'info',
          duration: 0,
          dangerouslyUseHTMLString: true,
          message: `<span>&nbsp;&nbsp;${loadingInfo}</span>`
        })
        historyApi.previewHistoryText({id: historyInfo.id}).then((res) => {
          // add new tab
          let newTab = {
            title: tab.title,
            copyTitle: tab.copyTitle,
            status: undefined,
            language: tab.language,
            name: pathname,
            hasHistoryVersion: !recovery || diff,
            historyVersion: historyInfo
          }
          // remove
          this.removeTab(pathname)
          this.$nextTick(() => {
            this.loading.close()
            this.editableTabs.splice(currentIndex, 0, newTab)
            if (diff) {
              this.setEditMap(currentIndex, currentContentText, res.data.contentText, historyInfo.metadata.time)
            } else {
              this.setEditMap(currentIndex, res.data.contentText)
            }
            this.editableTabsValue = pathname
            if (this.historyListPopoverVisible) {
              this.historyListPopoverVisible = false
            }
            if (recovery) {
              this.historyVersion = {metadata: {}}
            } else {
              this.historyVersion = newTab.historyVersion
            }
            if (recovery) {
              this.$message({message: '恢复成功',type: 'success'})
            }
          })
        }).catch(() => {
          this.loading.close()
        })
      },
      recoverySuccess({historyInfo}) {
        this.viewHistoryFile({historyInfo: historyInfo, diff: false, recovery: true})
      },
      abortControllerAbort(index) {
        const map = this.abortControllerMap.get(index)
        if (map !== undefined && map.abort !== undefined) {
          map.abort.abort()
          map.throttle.cancel()
        }
      },
      async requestStream(request, params, index) {
        try {
          const readOnly = this.options.readOnly
          this.options.readOnly = true
          this.abortControllerAbort(index)
          const queryString = this.buildQueryString(params)
          let url = "/api/preview/text/stream"
          if (request === 'previewTextByPath') {
            url = "/api/preview/path/text/stream"
          } else if (request === 'sharePreviewText') {
            url = "/api/public/s/preview/text/stream"
          }
          const abortController = new AbortController();
          let headers = new Headers();
          if (this.shareId) {
            headers.append('share-token', this.$store.state.user.shareToken);
          } else {
            headers.append('jmal-token', this.$store.state.user.token);
            headers.append('name', this.$store.state.user.name);
          }
          const response = await fetch(`${url}?${queryString}`, { signal: abortController.signal , headers: headers})
          let result = "";
          // 创建一个节流函数，限制更新频率为每 1500 毫秒一次
          const throttledUpdateContent = _.throttle(text => {
            this.setEditMap(index, text)
          }, 1500);

          this.abortControllerMap.set(index, {abort: abortController, throttle: throttledUpdateContent})

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          const processData = async () => {
            const { done, value } = await reader.read();
            if (done) {
              // 确保在流结束时取消节流
              throttledUpdateContent.cancel();
              this.setEditMap(index, result)
              this.options.readOnly = readOnly
              return;
            }
            result += decoder.decode(value, { stream: true });
            // 使用节流函数更新 content 属性
            throttledUpdateContent(result);
            await processData(); // 递归处理剩余数据
          };

          await processData();

        } catch (error) {
          console.error("Fetch error:", error);
        }
      },
      buildQueryString(params) {
        const queryParams = new URLSearchParams();
        for (const key in params) {
          queryParams.append(key, params[key]);
        }
      return queryParams.toString();
      },
      getEditorLanguage(suffix) {
        let editorLanguage = this.defalutLanguage
        let languages = monaco.languages.getLanguages();
        const languagesIndex = languages.findIndex(item => item.extensions && item.extensions.includes('.' + suffix))
        if (languagesIndex > -1) {
          editorLanguage = languages[languagesIndex].id
        }
        return editorLanguage;
      },
      // 隐藏目录
      hideContents(){
        const that = this
        let contents = document.querySelector('.file-contents')
        let resize = document.querySelector('.editor-resize')
        if(!this.contentsHide){
          contents.style.left = `-${this.contentsWidth}px`
          resize.style.marginLeft = '0px'
          setTimeout(function () {
            that.editorWidth += that.contentsWidth
          },250)
          this.contentsHide = true
          resize.setAttribute('icon-style', 'hide')
        }else{
          contents.style.left = '0px'
          resize.style.marginLeft = `${this.contentsWidth}px`
          setTimeout(function () {
            that.editorWidth -= that.contentsWidth
          },250)
          this.contentsHide = false
          resize.setAttribute('icon-style', 'show')
        }
      },
      // 双击header放大缩小
      onDialogDblClick() {
        const dialogHeader = document.querySelector('.simtext-dialog .el-dialog__header')
        const that = this
        dialogHeader.ondblclick = function (e) {
          if(e.target && 'simtext-header-title' === e.target.className){
            that.fullScreen()
          }
        }
      },
      // 拖动调整窗口大小
      dragDialogSize(){
        // 右下角
        let nwse = document.querySelector('.el-dialog__body .nwse-resize')
        if(nwse){
          const that = this
          nwse.onmousedown = function (e) {
            let startX = e.clientX;
            let startY = e.clientY;
            let editorWidth = that.editorWidth
            let editorHieght = that.editorHieght
            let dialogWidth = that.dialogWidth
            document.onmousemove = function (e) {
              let endX = e.clientX;
              let endY = e.clientY;
              const moveX = endX - startX
              if((dialogWidth + moveX) > 600){
                that.dialogWidth = dialogWidth + moveX
                that.editorWidth = editorWidth + moveX
                that.editorHieght = editorHieght + (endY - startY)
                that.loadContentSize()
              }
            }
            // 鼠标松开事件
            document.onmouseup = function () {
              document.onmousemove = null
              document.onmouseup = null
              nwse.releaseCapture && resize.releaseCapture()
            }
            nwse.setCapture && nwse.setCapture()
            return false
          }
        }
      },
      // 拖动调整目录的宽度
      dragControllerDiv() {
        let dialogBody = document.querySelector('.el-dialog__body .content')
        let resize = document.querySelector('.el-dialog__body .content .editor-resize')
        let contents = document.querySelector('.file-contents')
        let leftTools = document.querySelector('.file-contents .dir-tools')
        if(resize){
          // 鼠标按下事件
          const that = this
          resize.onmousedown = function (e) {
            if(that.contentsHide){
              return false
            }
            let startX = e.clientX
            let contentsStartWidth = contents.offsetWidth
            let dialogBodyWidth = dialogBody.clientWidth
            let contentsMaxWidth = (dialogBodyWidth * 0.6)>273?(dialogBodyWidth * 0.6):600
            // 鼠标拖动事件
            document.onmousemove = function (e) {
              that.transition = 'none 500ms ease 0s'
              let endX = e.clientX
              // 移动的距离。负数向左移动,正数向右移动
              let moveLen = endX - startX
              if((contentsStartWidth + moveLen) > leftTools.style.minWidth.split('\px')[0]){
                let contentsWidth = contentsStartWidth + moveLen
                if(contentsWidth < contentsMaxWidth){
                  that.contentsWidth = contentsWidth
                  that.editorWidth = that.dialogWidth - (contentsStartWidth + moveLen)
                }
              }
            }
            // 鼠标松开事件
            document.onmouseup = function (evt) {
              document.onmousemove = null
              document.onmouseup = null
              //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
              resize.releaseCapture && resize.releaseCapture()
              that.transition = 'all 500ms ease 0s'
            }
            //该函数在属于当前线程的指定窗口里设置鼠标捕获
            resize.setCapture && resize.setCapture()
            return false
          }
        }
      },
      findSvgClass(fileName){
        const suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
        if(iconClass.has(suffix)){
          return iconClass.get(suffix)
        }
        return 'file'
      },
      loadPath(data){
        this.$refs.fancTree.loadPath(data)
      },
      onRename(row){
        // 同步到 editableTabs
        this.editableTabs.map(item => {
          if(item.name === row.oldPath){
            item.title = row.name
            item.copyTitle = row.name
            item.name = row.path
          }
          return item
        })
        this.editableTabsValue = row.path
      },
      onLoadTreePath(path){
        this.filePathNav = path
      },
      removeFile(filepath) {
        let findIndex = this.editableTabs.findIndex(editable => editable.name === filepath)
        if(findIndex > -1){
          this.editableTabs.splice(findIndex, 1)
        }
      },
      treeNodeClick(row) {
        if(row.isFolder){
          return
        }
        if(!suffix.simText.includes(row.suffix) && row.contentType.indexOf('utf-8') < 0){
          return
        }
        let languages = monaco.languages.getLanguages();
        const languagesIndex = languages.findIndex(item => item.extensions && item.extensions.includes('.'+row.suffix))
        if(languagesIndex > -1){
          this.language = languages[languagesIndex].id
        }else{
          this.language = this.defalutLanguage
        }
        if(lineWrapping.includes(row.suffix)) {
          this.options.wordWrap = 'wordWrapColumn'
          this.lineWrapping = true
        }else{
          this.options.wordWrap = ''
        }
        if(this.editableTabs.findIndex(tab=> tab.name===row.path) < 0){
          this.loading = this.$message({
            iconClass: 'el-icon-loading',
            type: 'info',
            duration: 0,
            dangerouslyUseHTMLString: true,
            offset: document.body.clientHeight/3,
            message: '<span>&nbsp;&nbsp;正在加载数据...</span>'
          })
          const params = {
            path: encodeURI(row.path),
            fileName: row.name,
            username: this.$store.state.user.name
          }
          api.previewTextByPath(params).then(()=>{
            this.loading.close()
            // 添加一个tab
            let tab = {
              title:row.name,
              copyTitle:row.name,
              status: undefined,
              language: this.getEditorLanguage(row.suffix),
              name:row.path
            }
            if(row.isAddTab){
              this.editableTabs.push(tab)
              this.requestStream('previewTextByPath', params, this.editableTabs.length -1)
            }else{
              let thisTabIndex = this.editableTabs.findIndex(tab=> tab.status===undefined)
              if(thisTabIndex > -1){
                this.editableTabs[thisTabIndex] = tab
                this.requestStream('previewTextByPath', params, thisTabIndex)
              }else{
                this.editableTabs.push(tab)
                this.requestStream('previewTextByPath', params, this.editableTabs.length - 1)
              }
            }
            this.editableTabsValue = row.path
            // 加载历史版本
            this.$refs.historyPopover.loadHistoryPathList(row.path)
          }).catch(() => {
            this.loading.close()
          })
        }else{
          this.editableTabsValue = row.path
          this.clickTab()
        }
      },
      getContentText(index) {
        let ref = 'monacoEditor' + index
        return this.$refs[ref][0]._getValue()
      },
      setEditMap(index, text, historyText, historyVersion) {
        this.editableValueMap.set(index, text)
        this.$nextTick(()=> {
          let ref = 'monacoEditor' + index
          if (historyText) {
            this.$refs[ref][0]._setModel(text, historyText)
          } else {
            this.$refs[ref][0]._setValue(text)
          }
          if (!this.$pc && this.dialogWidthPercent < 1) {
            this.fullScreen()
          }
        })

        this.$nextTick(() => {
          const pathname = this.editableTabs[index].name
          let monacoDiffEditor = document.getElementById(`pane-${pathname}`)
          let original = monacoDiffEditor.querySelector(".editor.original")
          let current = monacoDiffEditor.querySelector(".editor.modified")
          if (original !== null && current !== null) {
            this.setVersionInfo(original, historyVersion)
            this.setVersionInfo(current, "当前版本")
          }
        })

      },
      setVersionInfo(editor, versionInfo) {
        const existingDiv = editor.querySelector('.version-info');
        if (!existingDiv) {
          const div = document.createElement('div');
          div.className = 'version-info';
          div.textContent = versionInfo;
          if (editor.firstChild) {
            editor.insertBefore(div, editor.firstChild);
          } else {
            editor.appendChild(div);
          }
        } else {
          existingDiv.textContent = versionInfo
        }
      },
      containerResize() {
        this.loadEditorSize()
      },
      checkMobile() {
        this.moblie = !this.$pc;
      },
      checkReadOnly(file){
        if(this.$store.state.user.token && this.$store.state.user.userId === file.userId){
          this.options.readOnly = false
          this.panelReadOnly = false
          return
        } else {
          this.mountFileId = file.id
        }
        if (this.$store.state.user.token && file.operationPermissionList && file.operationPermissionList.indexOf('PUT') > -1) {
          this.options.readOnly = false
          this.panelReadOnly = true
          return
        }
        if (!this.$pc) {
          this.options.readOnly = false
          this.panelReadOnly = true
        }
        if(this.panelReadOnly || this.moblie){
          this.$nextTick(()=> {
            this.editorWidth += this.contentsWidth
            this.contentsHide = true
          })
        }
      },
      loadEditorSize(){
        this.setDialogWidth()
        if(this.contentsHide){
          this.editorWidth = this.dialogWidth
        }else{
          this.editorWidth = this.dialogWidth - this.contentsWidth
        }
        this.editorHieght = document.body.clientHeight * this.dialogWidthPercent - 76
        this.loadContentSize()
      },
      loadContentSize(){
        let content = document.querySelector('.editor-resize .editor-resize-conter');
        if(content){
          content.style.marginTop = ((this.editorHieght+26)/2 - content.clientHeight/2) + 'px'
        }
      },
      handleClose(done) {
        if(this.isShowUpdateBtn){
          this.isSaveDialogVisible = true
        }else{
          done()
          this.closeAllTabs()
        }
      },
      saveTabAndClose(){
        this.update(this.editableTabs[this.removeIndex].change,this.editableTabs[this.removeIndex].name)
        this.isTabSaveDialogVisible = false
        this.editableTabs.splice(this.removeIndex,1)
      },
      confirmUpdate(){
        this.saveAll(true)
        this.textPreviewVisible = false
        this.$emit('update:status', this.textPreviewVisible)
        this.isSaveDialogVisible = false
        this.isShowUpdateBtn = false
      },
      // Abandon Modification
      closeTabDialog(){
        this.isTabSaveDialogVisible = false
        this.editableTabsValue = this.nextActiveName
        this.editableTabs.splice(this.removeIndex,1)
        let modifyingIndex = this.editableTabs.findIndex(editable => editable.status === 'Modifying')
        if (modifyingIndex < 0){
          this.isShowUpdateBtn = false
        }
      },
      closeDialog() {
        this.previewMode = false
        this.textPreviewVisible = false
        this.$emit('update:status', this.textPreviewVisible)
        this.isSaveDialogVisible = false
        this.isShowUpdateBtn = false
        this.historyVersion = {metadata: {}}
        this.closeAllTabs()
      },
      change(value,index) {
        let editableTabValue = this.editableTabs[index]
        if(value === this.editableValueMap.get(index)){
          if(editableTabValue.copyTitle !== editableTabValue.title){
            editableTabValue.title = editableTabValue.copyTitle
            editableTabValue.status = 'Modified'
            // without any change
            if(this.editableTabs.findIndex(tab=>tab.title !== tab.copyTitle) < 0){
              this.isShowUpdateBtn = false
            }
          }
        }else{
          if(editableTabValue.copyTitle === editableTabValue.title){
            editableTabValue.title += '*'
            editableTabValue.status = 'Modifying'
            this.isShowUpdateBtn = true
            editableTabValue.change = value
          }
        }
      },
      saveAll(isClose){
        this.editableTabs.forEach((tab,index) => {
          if(tab.status === 'Modifying'){
            if(isClose){
              this.update(tab.change,tab.name)
            }else{
              this.update(tab.change,tab.name,index)
            }
          }
        })
        if(isClose){
          this.closeAllTabs()
        }
      },
      closeAllTabs(){
        this.editableTabs.splice(0,this.editableTabs.length)
        this.$emit('update:file', {})
        for (const [key, value] of this.abortControllerMap) {
          this.abortControllerAbort(key)
        }
      },
      save(value, index) {
        if(value !== this.editableTabs[index].content && this.isShowUpdateBtn){
          this.update(value,this.editableTabs[index].name,index)
        }
      },
      update(value,path,index) {
        this.updating = true
        markdownApi.editMarkdownByPath({
            relativePath: encodeURI(path),
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            mountFileId: this.mountFileId,
            contentText: value
          }).then(() => {
            this.updating = false
            if(undefined !== index){
              this.editableTabs[index].content = value
              if(this.editableTabs[index].copyTitle !== this.editableTabs[index].title){
                this.editableTabs[index].title = this.editableTabs[index].copyTitle
                this.editableTabs[index].status = 'Modified'
                // 没有任何改变
                if(this.editableTabs.findIndex(tab=>tab.title !== tab.copyTitle) < 0){
                  this.isShowUpdateBtn = false
                }
              }
            }else{
              let update = false
              this.editableTabs.forEach((tab) => {
                if(tab.status === 'Modifying'){
                  update = true
                }
              })
              if(!update){
                this.isShowUpdateBtn = false
              }
            }
            if(!this.modifyMsg){
              this.$refs.historyPopover.loadHistoryPathList(this.editableTabsValue)
              this.modifyMsg = this.$message({
                message: "更新成功",
                type: 'success',
                duration : 1000
              });
              const that = this
              setTimeout(function () {
                that.modifyMsg = undefined
              },1000)
            }
          }).catch(() => {
            this.updating = false
        })
      },
      // 全屏
      fullScreen() {
        this.fullscreen = !this.fullscreen
        const dragDom = document.querySelector('.simtext-dialog .el-dialog');
        if(this.fullscreen){
          this.lastTransform = dragDom.style.transform
          this.dialogWidthPercent = 1
          this.setDialogWidth()
          dragDom.style.transform="translate("+0+"px,"+0+"px)";
        }else{
          this.dialogWidthPercent = 0.7
          this.setDialogWidth()
          let x = (document.body.clientWidth - this.dialogWidth)/2
          let y = (document.body.clientHeight - this.dialogWidth)/2
          if(this.lastTransform){
            dragDom.style.transform=this.lastTransform
          }else{
            dragDom.style.transform="translate("+x+"px,"+y+"px)"
          }
        }
        this.containerResize()
      },
      // 换肤
      skinning() {
        this.transition = 'none 500ms ease 0s'
        this.lightTheme = !this.lightTheme
        this.setTheme()
        const that = this
        setTimeout(function () {
          that.transition = 'all 500ms ease 0s'
        },100)
      },
      setTheme(){
        let dialog = document.querySelector('.simtext-dialog .el-dialog')
        let header = document.querySelector('.simtext-dialog .el-dialog .el-dialog__header')
        let fileContests = document.querySelector('.content');
        if(this.lightTheme){
          header.style.background = '#e6e6e6'
          header.style.color = '#181818'
          if(fileContests){
            fileContests.setAttribute('data-theme', 'light')
          }
          if(dialog){
            dialog.style.background = '#fff'
          }
          if(header){
            header.setAttribute('data-theme', 'light')
          }
        }else{
          header.style.background = '#2e2e30'
          header.style.color = '#fff'
          if(dialog){
            dialog.style.background = '#181818'
          }
          if(fileContests){
            fileContests.setAttribute('data-theme', 'dark')
          }
          if(header){
            header.setAttribute('data-theme', 'dark')
          }
        }
      },
      changePreviewMode() {
        let currentIndex = this.editableTabs.findIndex(editable => editable.name === this.editableTabsValue)
        if (currentIndex > -1){
          let ref = 'vditor' + currentIndex
          this.$refs[ref][0].setContent(this.editableValueMap.get(currentIndex))
        }
        this.previewMode = !this.previewMode
        this.clickTab()
      },
      clickTab() {
        this.editorWidth += 0.001
        this.editorHieght += 0.001
        // 加载历史版本
        this.$refs.historyPopover.loadHistoryPathList(this.editableTabsValue)
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        let removeIndex = 0
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              removeIndex = index
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          });
        }
        this.nextActiveName = activeName
        if(this.editableTabs[removeIndex].status !== 'Modifying'){
          this.editableTabs = tabs.filter(tab => tab.name !== targetName)
        }else{
          this.removeIndex = removeIndex
          this.isTabSaveDialogVisible = true
        }
        this.editableTabsValue = activeName
        this.abortControllerAbort(removeIndex)
        setTimeout(()=> {
          if (this.editableTabs.length < 1) {
            this.hasHistoryVersion = false
            this.historyVersion = {metadata: {}}
          }
        }, 100)
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "src/styles/markdown";

  $bg-color: #292929;
  $tree-title-bg-color: #3e3e3e;

  @mixin scrollBarLightStyle() {
    &::-webkit-scrollbar {
      width: 7px!important;
      height: 10px!important;
    }
    &::-webkit-scrollbar-thumb {
      border: unset!important;
      background-color: #c1c1c1 !important;
      border-radius: unset!important;
      outline: unset;
      outline-offset: unset;
    }
    &::-webkit-scrollbar-track-piece {
      border: unset!important;
      background-color: #ececec !important;
      border-radius: unset!important;
    }
  }

  @mixin scrollBarDarkStyle() {
    &::-webkit-scrollbar {
      width: 7px!important;
      height: 10px!important;
    }
    &::-webkit-scrollbar-thumb {
      border: unset!important;
      background-color: #aeaeae !important;
      border-radius: unset!important;
    }
    &::-webkit-scrollbar-track-piece {
      border: unset!important;
      background-color: #3e3e3e !important;
      border-radius: unset!important;
    }
  }

  >>> .v-note-show.single-show {
    ::-webkit-scrollbar {
      width: 10px!important;
      height: 10px!important;
    }
    ::-webkit-scrollbar-thumb {
      border: unset!important;
      background-color: #c1c1c1 !important;
      border-radius: unset!important;
    }
    ::-webkit-scrollbar-track-piece {
      border: unset!important;
      background-color: #ececec !important;
      border-radius: unset!important;
    }
  }
  .simtext-dialog {
    >>>.el-dialog {
      /*width: 1035px;*/
      margin: 0 !important;
      overflow: hidden;

      .el-button--small.is-circle {
        padding: 9px 10px;
      }

      .light-button {
        background: #ececec;
        border: 1px solid #ececec;
      }
      .light-button:hover {
        background: #DCDFE6;
      }
      .dark-button {
        background: #3e3e3e;
        border: 1px solid #3e3e3e;
        color: #ffffff;
      }
      .dark-button:hover {
        color: #409EFF;
        background-color: #181818;
      }

      .el-dialog__header {
        padding: 5px 10px 5px;
        overflow: hidden;

        .el-dialog__headerbtn {
          display: none;
        }
        .title-name {
          line-height: 34px;
        }
        .title-extension {
          float: right;
          margin-right: 0;
          margin-top: 3px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: end;
          -ms-flex-pack: end;
          justify-content: flex-end;

          .title-extension-button {
            padding: 0;
            margin-left: 15px;
            background: 0 0;
            border: none;
            outline: 0;
            cursor: pointer;
            color: #909399;
            .svg-icon {
              font-size: 18px;
            }
            .svg-icon:hover {
              color: #409EFF;
            }
            .el-icon-close {
              font-size: 28px;
            }
            .el-icon-close:hover {
              color: #409EFF;
            }
          }

        }

        &[data-theme=dark] {
          .redirect{
            color: #f5f5f5;
          }
          .no-redirect {
            color: #b7b7b7;
          }
          .home-link {
            color: #f5f5f5;
          }
        }

      }
      .el-dialog__body {
        padding: 0;
        word-break: normal;
      }
      .content {
        background: #F3F3F3;
        border-top: unset!important;
        display: inline-flex;

        .monaco-editor .minimap-shadow-visible {
          position: absolute;
          left: 0px;
          width: 6px;
          box-shadow: -2px 0px 5px #dddddd;
        }

        .el-tabs__header {
          margin: 0 0 0;
          .el-tabs__item {
            height: 32px;
            line-height: 32px;
          }
        }

        .tabs-icon-svg {
          font-size: 14px;
        }

        .el-tabs--card>.el-tabs__header {
          border-bottom: unset;
          .el-tabs__nav {
            border: unset;
          }
          .el-tabs__item {
            border-left: 1px solid #f3f3f3;
            color: #6A6A6A;
            background-color: #ebebeb;
          }
          .el-tabs__item:first-child {
            border-left: none;
          }
          .el-tabs__item.is-active {
            border-bottom-color: #ffffff;
            background-color: #ffffff;
            color: #2F302F;
          }
        }

        .editor_main_storey {
          display: inline-block;
          position: absolute;
          z-index: 999;
          width: 100%;
          height: 5px;
          background: linear-gradient(rgba(221,221,221,1), rgba(255, 255, 255, 0));
        }

        .el-tabs__nav-wrap {
          //margin-left: -1px;
        }

        .el-tabs--card>.el-tabs__header .el-tabs__nav {
          border-radius: 0 0 0 0;
        }

        .el-tabs__nav-next, .el-tabs__nav-prev {
          line-height: 32px;
        }

        .file-contents{

          left: 0;
          position: absolute;

          .content-tree{
            background-color: #F3F3F3;
            //box-shadow: inset #ececec -7px 0px;

            .svg-icon {
              font-size: 18px;
            }
            #dir-tree {

              $fancytreeTitleHoverColor: #E9E9E9;
              $fancytreeTitleActiveColor: #b6d8fb;

              overflow-x: hidden;
              @include scrollBarLightStyle;

              ul.fancytree-container{
                padding: 3px 0 0 0;
                background-color: #F3F3F3;
              }

              span.fancytree-title {
                padding: 2.5px 3px 0 3px;
              }

              .fancytree-active {
                background-color: $fancytreeTitleActiveColor;
              }

              .fancytree-active:hover {
                background-color: $fancytreeTitleActiveColor!important;
              }

              .fancytree-node:hover {
                background-color: $fancytreeTitleHoverColor;
              }

              .fancytree-plain span.fancytree-active span.fancytree-title{
                background-color: $fancytreeTitleActiveColor;
                border-color: $fancytreeTitleActiveColor;
                color: #000000;
              }
              .fancytree-plain span.fancytree-active:hover span.fancytree-title{
                background-color: $fancytreeTitleActiveColor!important;
                border-color: $fancytreeTitleActiveColor!important;
              }

              .fancytree-plain span.fancytree-node:hover span.fancytree-title{
                background-color: $fancytreeTitleHoverColor;
                border-color: $fancytreeTitleHoverColor;
              }

              .fancytree-plain.fancytree-container.fancytree-treefocus span.fancytree-active span.fancytree-title{
                background-color: $fancytreeTitleActiveColor;
                border-color: $fancytreeTitleActiveColor;
              }

            }
          }

          .dir-tools {
            background: #ececec;
            .el-button--small {
              padding: 9px 10px;
            }
            .el-button-group {
              display: unset;
              vertical-align: middle;
            }
          }

        }

        .editor-resize {
          width: 2px;
          bottom: 0;
          top: 0;
          cursor: col-resize;
          background-color: #ffffff;
          .darg-resize-conter {
            width: 2px;
          }
          .editor-resize-conter{
            height: 50px;
            width: 14px;
            position: absolute;
            z-index: 999;
            // top: 48%;
            background: #e2e2e2;
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
            border: 1px solid #ececec;
            border-left: none;
            cursor: pointer;
          }
          .editor-resize-conter:after {
            content: " ";
            display: inline-block;
            height: 10px;
            width: 10px;
            position: absolute;
            top: 50%;
            margin-top: -5px;
            left: 3px;
            z-index: 999;
            border-width: 2px 2px 0 0;
            border-color: #9a9a9a;
            border-style: solid;
            -webkit-transform: matrix(-0.71, 0.71, 0.71, 0.71, 0, 0);
            transform: matrix(-0.71, 0.71, 0.71, 0.71, 0, 0);
          }

          &[icon-style=hide] {
            .editor-resize-conter:after {
              left: -2px;
              -webkit-transform: matrix(0.71, -0.71, -0.71, -0.71, 0, 0);
              transform: matrix(0.71, -0.71, -0.71, -0.71, 0, 0);
            }
          }

        }

        &[data-theme=dark] {

          background: #202020;

          .monaco-editor .minimap-shadow-visible {
            box-shadow: -2px 0px 5px #000000;
          }

          .editor-resize {
            background-color: #181818;
            .editor-resize-conter{
              background: #292929;
              border: 1px solid #3e3e3e;
              border-left: 1px solid #292929;
            }
            .editor-resize-conter:after {
              border-color: #b2b2b2;
            }
          }

          .el-tabs--card>.el-tabs__header {
            border-bottom: unset;
            .el-tabs__nav {
              border: unset;
            }
            .el-tabs__item {
              border-left: 1px solid #202021;
              color: #aaaaaa;
              background-color: #292929;
            }
            .el-tabs__item:first-child {
              border-left: none;
            }
            .el-tabs__item.is-active {
              border-bottom-color: #181818;
              background-color: #181818;
              color: #fefefe;
            }
          }

          .file-contents{

            background: #3e3e3e;

            .dir-tools {
              background: #3e3e3e;
            }

            .content-tree {
              background: #202021;
              //box-shadow: inset #2d2d2d -7px 0px;
              #dir-tree {
                @include scrollBarDarkStyle;
                span.fancytree-title {
                  color: #dedede;
                }
                ul.fancytree-container {
                  background: #202021;
                }

                $fancytreeTitleHoverColor: #242A2B;
                $fancytreeTitleActiveColor: #004471;

                .fancytree-active {
                  background-color: $fancytreeTitleActiveColor;
                }

                .fancytree-active:hover {
                  background-color: $fancytreeTitleActiveColor!important;
                }

                .fancytree-node:hover {
                  background-color: $fancytreeTitleHoverColor;
                }

                .fancytree-plain span.fancytree-active span.fancytree-title{
                  background-color: $fancytreeTitleActiveColor;
                  border-color: $fancytreeTitleActiveColor;
                  color: #FFFFFF;
                }
                .fancytree-plain span.fancytree-active:hover span.fancytree-title{
                  background-color: $fancytreeTitleActiveColor!important;
                  border-color: $fancytreeTitleActiveColor!important;
                }

                .fancytree-plain span.fancytree-node:hover span.fancytree-title{
                  background-color: $fancytreeTitleHoverColor;
                  border-color: $fancytreeTitleHoverColor;
                }

                .fancytree-plain.fancytree-container.fancytree-treefocus span.fancytree-active span.fancytree-title{
                  background-color: $fancytreeTitleActiveColor;
                  border-color: $fancytreeTitleActiveColor;
                }

                .fancytree-edit-input {
                  background-color: #202021;
                  border: unset;
                }

              }
            }
          }
          .editor_main_storey {
            background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0));
          }

          .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input {
            background-color: #181818;
          }

          .monaco-editor{
            .margin {
              background-color: #181818;
            }
          }

        }
      }
      .nwse-resize {
        z-index: 99999;
        position: fixed;
        width: 12px;
        margin-left: 3px;
        background: #f0f0f0;
        height: 15px;
        margin-top: -15px;
        float: right;
        cursor: nwse-resize;
      }
      .nwse-resize::before {
        content: "⠿";
        display: inline-block;
        padding-right: 5px;
        vertical-align: middle;
      }
      .el-button--small.is-circle {
        padding: 9px 9px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  >>>.jmal-message-dialog {
    width: 420px;
    height: 200px;
    top: calc(50% - 100px);
    .el-dialog {
      .el-dialog__header {
        padding: 15px 20px 15px;
      }
      .el-dialog__body {
        padding: 0 10px 5px 20px;
      }
    }
  }
  >>> .fancytree-expander {
    margin-top: 5px;
  }
  .content-body {
    overflow-y: scroll;
    padding: 20px 30px;
    background-color: #ffffff;
  }

</style>
