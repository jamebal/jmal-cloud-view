<template>
  <div id="global-uploader">
    <!-- 上传 -->
    <uploader
      v-if="showUploader"
      ref="uploader"
      :options="options"
      :file-status-text="statusText"
      :auto-start="false"
      class="uploader-app"
      @files-added="onFilesAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @dragenter="onDragenter"
      @file-removed="onFileRemoved"
    >
      <uploader-unsupport></uploader-unsupport>

      <uploader-drop v-if="dragover && enableDragUpload" class="uploader-drop">
        <span>上传文件到当前目录下</span>
      </uploader-drop>

      <uploader-btn id="global-uploader-btn" ref="uploadBtn" :attrs="attrs"
        >选择文件</uploader-btn
      >

      <uploader-btn id="folder-uploader-btn" ref="folderBtn" :directory="true"
        >选择文件夹</uploader-btn
      >

      <uploader-list v-show="panelShow">
        <div
          slot-scope="props"
          class="file-panel"
          :class="{ collapse: collapse }"
          :style="filePanel"
        >
          <div class="file-title">
            <h2 class="files-title">文件列表</h2>
            <div class="operate">
              <el-button round
                v-if="fileListLength > 0"
                type="text"
                class="button-collapse"
                @click="shrink"
              >
                <i class="iconfont el-icon-position"></i>
              </el-button>
              <!--<el-button round type="text" class="button-collapse" :title="collapse ? '展开':'折叠' " @click="fileListShow">-->
              <!--<i class="iconfont" :class="collapse ? 'el-icon-circle-plus-outline': 'el-icon-remove-outline'"></i>-->
              <!--</el-button>-->
              <el-button round
                type="text"
                class="button-collapse"
                title="关闭"
                @click="close"
              >
                <i class="iconfont el-icon-circle-close"></i>
              </el-button>
            </div>
          </div>

          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file
                ref="files"
                :class="'file_' + file.id"
                :file="file"
                :list="true"
              ></uploader-file>
            </li>
            <div v-if="!props.fileList.length" class="no-file">
              <i class="iconfont icon-empty-file"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
      </uploader-list>
    </uploader>

    <div
      class="process-area"
      id="drag-ball"
      @click="expand"
      :style="processAreaClass"
    >
      <div class="process-anime">
        <div class="cube-a" :style="{ top: -process - 65 + '%' }"></div>
        <div class="cube-b" :style="{ top: -process - 65 + '%' }"></div>

        <div v-if="process < 100" class="process-info">
          <div class="process">{{ process }}%</div>
          <div v-if="isUploading" class="net-speed">{{ netSpeed }}</div>
        </div>

        <div v-if="process >= 100" class="done">
          <svg xmlns="http://www.w3.org/2000/svg" class="done-icon checkmark">
            <!--"M 14.1 27.2 l 7.1 7.2 l 16.7 -16.8"-->
            <path
              d="M 13.1 21.2 l 5.1 5.2 l 12.7 -12.8"
              class="checkmark__check"
              style="fill: transparent;"
            ></path>
            <!--<path v-if="pc" d="M 13.1 21.2 l 5.1 5.2 l 12.7 -12.8" class="checkmark__check" style="fill: transparent;"></path>-->
            <!--<path v-if="!pc" d="M 15.5 20.2 l 3.5 3.6 l 7.7 -7.8" class="checkmark__check" style="fill: transparent;"></path>-->
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import store from '@/store'
import $ from 'jquery'
import api from '@/api/file-api'
import { formatNetSpeed } from '@/utils/number'
import {mapState} from 'vuex'
import {encodeIfNeeded} from "@/utils/path"
import { isDragUploadAllowed } from './dragUploadUtils'
import S3DirectUploader from './S3DirectUploader'
import { DEFAULT_CHUNK_SIZE } from './S3DirectUploader'

export default {
  components: {},
  props: {
    publicApi: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showUploader: true,
      options: {
        target: api.simpleUploadURL + (this.publicApi ? '/public/upload' : '/upload'),
        chunkSize: localStorage.getItem('uploader_chunk_size') || 1024 * 1024,
        // speedSmoothingFactor: 0.1,
        // progressCallbacksInterval: 500,
        maxChunkRetries: 3, // 最大重试次数
        simultaneousUploads: 3, // 并发上传数
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function (chunk, message) {
          const objMessage = JSON.parse(message)
          const res = objMessage.data
          if (!res) {
            return []
          }
          if (res.pass) {
            // 秒传
            return true
          }
          // 断点续传
          return (res.resume || []).indexOf(chunk.offset + 1) >= 0
        },
        parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
          return parsedTimeRemaining
              .replace(/\syears?/, '年')
              .replace(/\days?/, '天')
              .replace(/\shours?/, '小时')
              .replace(/\sminutes?/, '分钟')
              .replace(/\sseconds?/, '秒')
        },
        headers: {
          'jmal-token': this.$store.state.user.token,
          'name': this.$store.state.user.name,
          'share-token': this.$store.getters.shareToken,
          'shareId': this.$store.getters.shareId
        },
        query() {
        }
      },
      attrs: {
        accept: '*'
      },
      statusText: {
        success: '上传成功',
        error: '上传失败',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      fileListLength: 0,
      panelShow: false, // 选择文件后，展示上传panel
      collapse: false,
      isShrink: true,
      process: -10,
      pageTitle: this.$route.meta.title,
      netSpeed: 0,
      isUploading: false,
      filePanel: {},
      processAreaClass: {},
      dragover: false,
      isDragStart: false,
      fileListScrollTop: 0,
      dragoverLoop: null,
      successMsg: null,
      enableDragUpload: true,// 是否启用拖拽上传
      uploader: null,
      resolveFilesAddedPromise: null, // 用于等待获取上传参数
      params: {},
      // S3直传相关
      useS3Direct: true, // 是否启用S3直传模式
      s3Uploader: null,
    }
  },
  computed: {
    ...mapState(['message'])
  },
  watch: {
    $route(route) {
      this.checkDrag(route)
    },
    message(msg) {
      switch (msg.event) {
        case 'uploaderChunkSize':
          this.onStorageTypeChange(msg.data.body)
          break
        case 'fileListScrollTop':
          this.fileListScrollTop = msg.data
          break
        case 'onDragStart':
          this.isDragStart = msg.data
          break
        case 'uploadFileListBack':
          if (this.process !== -10 && this.process !== 100 && this.fileListLength !== 0) {
            this.shrink()
          }
          break
        case 'openUploader':
          if (this.uploader.fileList.length > 0) {
            this.$message({
              message: 'S3直传模式下无法添加更多',
              type: 'warning'
            })
            return
          }
          if (this.$refs.uploadBtn) {
            $('#global-uploader-btn').click()
          }
          break
        case 'uploadFolder':
          if (this.uploader.fileList.length > 0) {
            this.$message({
              message: 'S3直传模式下无法添加更多',
              type: 'warning'
            })
            return
          }
          if (this.$refs.folderBtn) {
            $('#folder-uploader-btn').click()
          }
          break
        case 'onUploadParams':
          this.params = msg.data || {}
          if (this.resolveFilesAddedPromise) {
            this.resolveFilesAddedPromise();
            this.resolveFilesAddedPromise = null;
          }
          break
      }
    }
  },
  mounted() {
    this.checkDrag(this.$route)
    this.initS3Uploader()
    let that = this
    let dropbox = document.body

    this.$store.dispatch('app/setUploadDragEnabled', true)

    dropbox.addEventListener("dragstart", function (e) {
      if (e.target.closest('.sortable-chosen')) {
        that.$store.dispatch('app/setUploadDragEnabled', false)
      }
      if (that.enableDragUpload && that.$store.getters.isUploadDragEnabled) {
        if (e.target.slot === 'jmal') {
          that.isDragStart = true
        }
        return e.target.slot === 'jmal' && that.fileListScrollTop === 0
      }
      return true
    });

    dropbox.addEventListener("dragenter", function (e) {
      if (!that.$store.getters.isUploadDragEnabled) {
        return
      }
      e.stopPropagation();
      e.preventDefault();
    }, false);

    dropbox.addEventListener("dragover", function (e) {
      if (!that.$store.getters.isUploadDragEnabled) {
        return
      }
      e.stopPropagation();
      e.preventDefault();
      clearInterval(that.dragoverLoop)
      if (!that.isDragStart) {
        that.dragover = true
      }
      that.dragoverLoop = setTimeout(function () {
        that.dragover = false
      }, 100)
    }, false);

    dropbox.addEventListener("drop", function (e) {
      if (!that.$store.getters.isUploadDragEnabled) {
        return
      }
      e.stopPropagation();
      e.preventDefault();
      that.dragover = false
    }, false);
    this.initUploader()
  },
  methods: {
    initS3Uploader() {
      this.s3Uploader = new S3DirectUploader({
        onProgress: this.onS3Progress.bind(this),
        onSuccess: this.onS3Success.bind(this),
        onError: this.onS3Error.bind(this)
      });
    },

    onS3Progress(uploadFile, progress, speed) {
      console.log(`Uploading ${uploadFile.file.name}: ${progress}% at ${formatNetSpeed(speed, false)}`);
      // 更新文件进度
      const fileInfo = this.uploader.fileList.find(f => f.id === uploadFile.id);
      if (fileInfo) {
        this.$set(fileInfo, 'currentSpeed', speed);
        this.$set(fileInfo, 'averageSpeed', speed);
        this.$set(fileInfo, 'isUploading', true);
        this.$set(fileInfo, '_prevProgress', progress / 100);
      }

      this.netSpeed = formatNetSpeed(speed, false);
      this.process = Math.trunc(window.uploader.progress() * 100)
      this.setPageTitle(this.netSpeed);

      if (this.process > 0 && this.process < 100 && window.uploader.fileList.length > 0) {
        window.onbeforeunload = function () {
          return "还有文件正在上传, 确定退出吗?";
        }
      } else {
        window.onbeforeunload = null
      }

    },

    onS3Success(uploadFile) {
      const fileInfo = this.uploader.fileList.find(f => f.id === uploadFile.id);
      if (fileInfo) {
        fileInfo.completed = true;
        this.$set(fileInfo, '_fileComplete', true);
      }

      store.dispatch('updateMessage', {event: 'fileSuccess', data: uploadFile.name});
      this.showSuccessMsg();

    },

    onS3Error(uploadFile, error) {
      console.error('S3 upload error:', error);
      const fileInfo = this.uploader.fileList.find(f => f.id === uploadFile.id);
      if (fileInfo) {
        this.statusSet(fileInfo.id, 'failed');
      }
      this.$message({
        message: `文件 ${uploadFile.name} 上传失败: ${error.message}`,
        type: 'error'
      });
    },

    // S3直传上传处理
    async doS3DirectUpload() {

      if (this.$pc) {
        this.displayPanel(true);
      } else {
        this.shrink();
      }

      this.s3Uploader.start();

      // 逐个上传文件
      for (const uploadFile of this.uploader.fileList) {
        const file = uploadFile.file
        if (this.s3Uploader.aborted) {
          break;
        }

        try {
          // 构建objectName
          const objectName = this.buildObjectName(file);
          await this.s3Uploader.upload(uploadFile, objectName, {
            currentDirectory: encodeIfNeeded(this.params.currentDirectory),
            username: this.params.username,
            userId: this.params.userId,
            folder: this.$route.query.folder,
            lastModified: file.lastModified,
            publicApi: this.publicApi,
            fileId: this.params.fileId
          });
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }
    },

    buildObjectName(file) {
      // 根据当前目录和文件相对路径构建objectName
      let basePath = this.params.currentDirectory || '';
      if (basePath && ! basePath.endsWith('/')) {
        basePath += '/';
      }

      // 如果是文件夹上传，保留相对路径
      if (file.relativePath && file.relativePath !== file.name) {
        // 防止路径遍历
        return basePath + file.relativePath.replace(/(\.\.\/|\.\.\\)/g, '');
      }

      return this.params.username + basePath + file.name;
    },

    checkDrag(route) {
      this.enableDragUpload = isDragUploadAllowed(route)
    },
    onStorageTypeChange(uploaderOption) {
      const { chunkSize, proxyEnabled } = uploaderOption;
      localStorage.setItem('uploader_chunk_size', chunkSize)
      if (this.options.chunkSize !== chunkSize && !this.panelShow) {
        this.updateChunkSize(chunkSize)
      }
      this.useS3Direct = chunkSize === DEFAULT_CHUNK_SIZE && !proxyEnabled;
      // 同时更新S3上传器
      if (this.s3Uploader) {
        this.s3Uploader.chunkSize = chunkSize;
      }
    },
    initUploader() {
      this.$nextTick(() => {
        this.uploader = this.$refs.uploader.uploader
        window.uploader = this.uploader
      })
    },
    updateChunkSize(chunkSize) {
      // 更新 options
      this.options.chunkSize = chunkSize;
      // 重新渲染 uploader 组件
      this.showUploader = false;
      this.$nextTick(() => {
        this.showUploader = true;
        this.$nextTick(() => {
          this.uploader = this.$refs.uploader.uploader
          window.uploader = this.uploader
        });
      });
    },
    onDragenter() {
    },
    isPath(str) {
      // 这个正则表达式检测路径中的斜杠字符
      return /[/\\]/.test(str);
    },
    async onFilesAdded(files) {
      console.log('Files added:', files, this.uploader.filePaths);
      if (files.length === 0) {
        return;
      }
      try {
        const waitForParams = new Promise((resolve, reject) => {
          this.resolveFilesAddedPromise = resolve;
          // 添加超时以防止未收到响应时挂起，如果服务端没有及时返回上传参数，则取消上传
          setTimeout(() => reject(new Error('Timeout waiting for upload parameters')), 3000);
        });

        await this.$store.dispatch('updateMessage', { event: 'getUploadParams' });

        await waitForParams;

        await this.doFilesAdded(files);

      } catch (error) {
        console.error("Failed to add files:", error);
        this.uploaderCancel();
      }
    },
    async doFilesAdded(files) {
      let filenames = files.map(file => file.name)
      const paths = Object.keys(this.uploader.filePaths)
      if (paths.length > 0 && this.useS3Direct) {
        // 暂不支持文件夹上传
        this.$message({
          message: 'S3直传模式下暂不支持文件夹上传',
          type: 'warning'
        })
        this.uploaderCancel();
        return
      }
      paths.forEach(path => {
        if (this.isPath(path)) {
          // 取第一级
          const folder = path.split('/')[0]
          filenames.push(folder)
        }
      })
      const query = {
        filenames: filenames,
        ...this.params
      }
      const res = await api.checkExist(query)
      if (res.data.exist) {
        this.$confirm('文件已存在，是否覆盖？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doUploadBefore(files)
        }).catch(() => {
          this.uploaderCancel()
        })
      } else {
        await this.doUploadBefore(files)
      }
    },
    uploaderCancel() {
      // 取消S3上传
      if (this.s3Uploader) {
        this.s3Uploader.abort();
      }

      this.uploader.cancel()
      this.displayPanel(false)
      const chunkSize = localStorage.getItem('uploader_chunk_size');
      if (chunkSize && chunkSize !== this.uploader.opts.chunkSize) {
        this.updateChunkSize(Number.parseInt(chunkSize))
      }
    },
    displayPanel(display) {
      this.panelShow = display
    },
    async doUploadBefore(files) {
      this.fileListLength = this.uploader.fileList.length
      const filePaths = this.uploader.filePaths
      const paths = Object.keys(filePaths)
      const pathsLength = paths.length

      if (pathsLength > 0) {
        paths.forEach(path => {
          const folder = filePaths[path]
          // 上传文件夹
          api.uploadFolder({
            isFolder: true,
            folderPath: encodeIfNeeded(folder.parent.path),
            filename: encodeIfNeeded(folder.name),
            folder: this.$route.query.folder,
            currentDirectory: encodeIfNeeded(this.params.currentDirectory),
            username: this.params.username,
            userId: this.params.userId,
            publicApi: this.publicApi,
            fileId: this.params.fileId
          })
        })
      }

      // 判断是否使用S3直传
      if (this.useS3Direct) {
        // 使用S3直传模式
        await this.doS3DirectUpload();
      } else {
        // 使用原有的分片上传模式
        if (this.$pc) {
          this.displayPanel(true)
        } else {
          this.shrink()
        }
        files.forEach(file => {
          Object.assign(this.uploader.opts, {
            query: {
              isFolder: false,
              lastModified: file.file.lastModified,
              ...this.params
            }
          })
        })
        this.$nextTick(() => {
          this.uploader.resume()
        })
      }
    },
    setPageTitle(netSpeed) {
      if (this.publicApi) {
        return
      }
      if (this.process === -10 || this.process === 100 || this.fileListLength === 0) {
        document.title = `${this.$route.meta.title}`
      } else {
        document.title = `${this.process}% | ${netSpeed}`
      }
    },
    onFileProgress(rootFile, file, chunk) {
      this.netSpeed = formatNetSpeed(file.currentSpeed, false)
      this.process = Math.trunc(window.uploader.progress() * 100)
      this.setPageTitle(this.netSpeed)
      if (rootFile.isFolder && this.process < 100) {
        this.statusSet(rootFile.id, 'progress', formatNetSpeed(file.currentSpeed, true))
      }
      if (this.process > 0 && this.process < 100 && window.uploader.fileList.length > 0) {
        window.onbeforeunload = function () {
          return "还有文件正在上传, 确定退出吗?";
        }
      } else {
        window.onbeforeunload = null
      }
      this.isUploading = window.uploader.isUploading()
      // console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess(rootFile, file, response) {
      const res = JSON.parse(response)
      if (!res.data) {
        this.$message({
          message: res.message,
          type: 'error'
        })
        this.close()
        return;
      }
      const data = res.data
      // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      if (!data.upload) {
        // this.$message({ message: res.message, type: 'error' })
        // 文件状态设为“失败”
        this.statusSet(file.id, 'failed')
        return
      } else {
        // console.log(`上传成功 ${file.name}`)
        this.statusSet(file.id, 'success')
      }
      // 如果服务端返回需要合并
      if (data.merge) {
        // 文件状态设为“合并中”
        this.statusSet(file.id, 'merging')
        api.mergeSimpleUpload({
          filename: encodeIfNeeded(file.name),
          relativePath: encodeIfNeeded(file.relativePath),
          identifier: file.uniqueIdentifier,
          folder: this.$route.query.folder,
          currentDirectory: encodeIfNeeded(this.params.currentDirectory),
          username: this.params.username,
          userId: this.params.userId,
          totalSize: file.size,
          isFolder: file.isFolder,
          lastModified: file.file.lastModified,
          publicApi: this.publicApi,
          fileId: this.params.fileId
        }).then(() => {
          // 文件合并成功
          store.dispatch('updateMessage', {event: 'fileSuccess', data: file.name})
          this.statusRemove(file.id)
          this.statusSet(file.id, 'success')
          // file.removeFile(file)
          this.showSuccessMsg()
        }).catch(e => {
        })
        // 不需要合并
      } else {
        store.dispatch('updateMessage', {event: 'fileSuccess', data: file.name})
        // 完成后从文件列表移除
        // file.removeFile(file)
        // console.log('上传成功')
        this.showSuccessMsg()
      }
      if (file.parent == null) {
        this.close()
      }
    },
    showSuccessMsg() {
      if (this.successMsg === null) {
        this.successMsg = this.$message({
          message: '文件上传成功',
          type: 'success',
          onClose: () => {
            this.successMsg = null
          }
        });
      }
      if (this.process === -10 || this.process === 100 || this.fileListLength === 0) {
        this.uploaderCancel()
      }
    },
    onFileError(rootFile, file, response) {
      this.$message({
        message: response,
        type: 'error'
      })
    },
    onFileRemoved() {
      this.fileListLength = this.uploader.fileList.length
    },
    // 展开球
    expand() {
      if (!this.$pc) {
        this.$router.push(`/upload/index_m`)
      }
      this.filePanel = {
        'width': '720px',
        'height': '300px',
      }
      this.processAreaClass = {
        'right': '66px',
        'bottom': '66px',
        'width': '0',
        'height': '0',
      }
      this.isShrink = false
    },
    // 收缩成球
    shrink() {
      let width = '92px';
      let height = '92px';
      let right = '20px';
      let bottom = '20px';
      if (!this.$pc) {
        width = '92px';
        height = '92px';
        right = '10px';
        bottom = '70px';
      }
      const that = this
      this.filePanel = {
        'color': 'white',
        'z-index': '-1',
        'right': '20px',
        'bottom': '20px',
        'width': '92px',
        'height': '92px',
        cursor: 'pointer',
        'border-radius': '50%',
      }
      setTimeout(function () {
        that.isShrink = true
        that.processAreaClass = {
          'right': right,
          'bottom': bottom,
          'width': width,
          'height': height,
        }
        that.filePanel = {
          'color': 'white',
          'z-index': '-1',
          'right': '66px',
          'bottom': '66px',
          'width': '0px',
          'height': '0px',
          cursor: 'pointer',
          'border-radius': '50%',
        }
      }, 500)
    },
    close() {
      if (this.process === -10 || this.process === 100 || this.fileListLength === 0) {
        this.uploaderCancel()
      } else {
        this.$confirm('还有文件正在上传, 确定要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.uploaderCancel()
        })
      }
    },

    /**
     * @param id
     * @param status
     * @param progressText
     */
    statusSet(id, status, progressText) {
      const statusMap = {
        progress: {
          text: progressText,
          bgc: '#ffffff00'
        },
        merging: {
          text: '合并中',
        },
        transcoding: {
          text: '转码中',
        },
        failed: {
          text: '上传失败',
        },
        success: {
          text: '上传成功',
        }
      }

      if (status === 'progress') {
        $('.uploader-file-status').find('span:eq(1) em').text(progressText)
        return
      }

      this.$nextTick(() => {
        $(`.file_${id} .uploader-file-status`).empty()
        $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
          'position': 'absolute',
          'font-size': '13px',
          'left': '0',
          'right': '0',
          'bottom': '0',
          'zIndex': '1',
          'marginBottom': '0',
        }).text(statusMap[status].text)
      })
    },
    statusRemove(id) {
      this.$nextTick(() => {
        $(`.myStatus_${id}`).remove()
      })
    },

    error(msg) {
      this.$notify({
        title: '错误',
        message: msg,
        type: 'error',
        duration: 2000
      })
    }
  }
}
</script>

<style scoped lang="scss">
#global-uploader {
  position: fixed;
  z-index: 1002;
  right: 15px;
  bottom: 15px;

  >>>.uploader-file {
    border-bottom: 1px solid var(--uploader-file-border-color);
  }
  >>>.uploader-file-info {
    color: var(--text-color);
    &:hover {
      background-color: var(--menu-hover);
    }
  }
  >>>.uploader-file-progress {
    background-color: var(--uploader-file-process-success-bg-color);
  }

  .uploader-drop {
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--uploader-file-uploader-drop-bg-color);

    span {
      font-size: 34px;
      font-weight: 700;
      color: var(--uploader-file-uploader-drop-text-color);
      position: relative;
      top: 48%;
    }
  }

  .uploader-app {
    width: 720px;
  }

  .file-panel {
    background-color: var(--setting-bg);
    border: var(--dialog-border);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    right: 2%;
    bottom: 2%;
    width: 720px;
    height: 300px;
    color: var(--text-color);
    margin: auto;
    overflow: hidden;
    background-size: 100% 100%;
    border-radius: 16px;
    position: fixed;
    -webkit-transition: all 0.5s ease-in-out 0s;
    transition: all 0.5s ease-in-out 0s;

    ul {
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 0.1rem;
      margin-bottom: -0.2rem;
      overflow: -moz-scrollbars-none;
      overflow: -moz-scrollbars-none;
    }

    ul::-webkit-scrollbar {
      display: none;
    }

    .file-title {
      display: flex;
      height: 3.5rem;
      // line-height: 3.5rem;
      padding: 0 10px;
      border-bottom: 1px solid var(--menu-hover);

      .files-title {
        margin-left: 3%;
        font-size: 20px;
        line-height: 3.5rem;
        color:  var(--text-color);
      }

      .operate {
        flex: 1;
        text-align: right;

        .button-collapse {
          padding: 16px 5px;
          font-size: 25px;
          margin-left: 0;
        }
      }
    }

    .file-list {
      position: relative;
      max-height: 300px;
      /*height: 49px;*/
      overflow-x: hidden;
      list-style-type: none;
      overflow-y: auto;
      background-color: var(--bg-color);
      padding: 0;
      margin: 0;

      >>> li {
        background-color: var(--bg-color);
      }
    }

    &.collapse {
      .file-title {
        background-color: #e7ecf2;
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  >>> .uploader-file-icon {
    &:before {
      content: "" !important;
    }

    background: url(./images/file.svg);

    &[icon="image"] {
      background: url(./images/image.svg);
    }

    &[icon="video"] {
      background: url(./images/video.svg);
    }

    &[icon="document"] {
      background: url(./images/docment.svg);
    }

    &[icon="audio"] {
      background: url(./images/audio.svg);
    }

    &[icon="folder"] {
      background: url(./images/folder.svg);
    }
  }

  >>> .uploader-file-actions > span {
    margin-right: 6px;
  }
}

>>> .uploader-file-status {
  width: 32%;
  text-indent: 20px;
}

>>> .uploader-file-meta {
  width: 0;
}

>>> .uploader-file-icon {
  width: 32px;
  height: 32px;
  display: inline-block;
  vertical-align: top;
  margin-top: 8px;
  margin-right: 8px;
}

>>> .uploader-file-actions > span {
  margin-right: 6px;
  margin-left: 8px;
}

/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}

#folder-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}

.process-area {
  right: 66px;
  bottom: 66px;
  width: 0;
  height: 0;
  -webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  background: var(--setting-bg);
  color: var(--text-color);
  margin: auto;
  overflow: hidden;
  background-size: 100% 100%;
  border-radius: 50%;
  position: fixed;
  /*animation: load-process-area .5s 1 linear forwards;*/
  /*transition: all .5s;*/
  -webkit-transition: all 0.5s ease-in-out 0s;
  transition: all 0.5s ease-in-out 0s;
}

.process-area .process-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.process-area .process-info .process {
  font-size: 1.5rem;
}

.process-area .process-info .net-speed {
  font-size: 0.7rem;
  white-space: nowrap;
}

.process-anime {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 4px solid var(--bg-color);
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  background: var(--uploader-file-process-anime-bg-color);
  border-radius: 50%;
  overflow: hidden;
}

.process-anime .cube-a {
  position: absolute;
  left: 50%;
  background: var(--process-cube-a-bg);
  width: 130px;
  height: 130px;
  border-radius: 50px;
  animation: fx-rotate 15s infinite linear;
  transform-origin: 50% 50%;
  transition: 0.5s;
}

.process-anime .cube-b {
  position: absolute;
  left: 50%;
  background: var(--bg-color);
  width: 130px;
  height: 130px;
  border-radius: 50px;
  animation: fx-rotate 10s infinite reverse linear;
  transform-origin: 50% 50%;
  transition: 0.5s;
}

/**成功**/
.process-anime .done {
  position: absolute;
  width: 45px;
  height: 45px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(2.25);
}

.process-anime .done .checkmark {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0 0 0 #fdda65;
  animation: fill-data 0.4s ease-in-out 0.4s forwards,
    scale-data 0.3s ease-in-out 0.9s both;
}

.process-anime .done .checkmark__check {
  transform: translate(2px, 2px);
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke-data 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes fx-rotate {
  0% {
    transform: translate(-50%) rotate(0);
  }
  100% {
    transform: translate(-50%, 2px) rotate(365deg);
  }
}

@keyframes scale-data {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill-data {
  100% {
    box-shadow: inset 0 0 0 30px #fdda65;
  }
}

@keyframes stroke-data {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes load-process-area {
  0% {
    right: 66px;
    bottom: 66px;
    width: 0;
    height: 0;
  }
  100% {
    right: 20px;
    bottom: 20px;
    width: 92px;
    height: 92px;
  }
}
</style>
