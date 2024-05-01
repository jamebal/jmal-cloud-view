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

      <uploader-drop v-if="dragover && enableDragUplaod" class="uploader-drop">
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
              <el-button
                v-if="fileListLength > 0"
                type="text"
                class="button-collapse"
                @click="shrink"
              >
                <i class="iconfont el-icon-position"></i>
              </el-button>
              <!--<el-button type="text" class="button-collapse" :title="collapse ? '展开':'折叠' " @click="fileListShow">-->
              <!--<i class="iconfont" :class="collapse ? 'el-icon-circle-plus-outline': 'el-icon-remove-outline'"></i>-->
              <!--</el-button>-->
              <el-button
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

// import { ACCEPT_CONFIG } from '@/assets/js/config'
import store from '@/store'
import $ from 'jquery'
import SparkMD5 from 'spark-md5'
import api from '@/api/file-api'
import {formatNetSpeed} from '@/utils/number'
import {mapState} from 'vuex'
import {encodeIfNeeded} from "@/utils/path";

export default {
  components: {},
  data() {
    return {
      showUploader: true,
      username: this.$store.state.user.name,
      options: {
        target: api.simpleUploadURL,
        chunkSize: 5 * 1024 * 1024,
        // speedSmoothingFactor: 0.1,
        // progressCallbacksInterval: 500,
        maxChunkRetries: 3, // 最大重试次数
        simultaneousUploads: 5, // 并发上传数
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
          'name': this.$store.state.user.name
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
      pc: true,
      dragover: false,
      isDragStart: false,
      fileListScrollTop: 0,
      dragoverLoop: null,
      successMsg: null,
      enableDragUplaod: false,// 是否启用拖拽上传
      uploader: null,
    }
  },
  computed: {
    ...mapState(['message'])
  },
  watch: {
    $route(route) {
      // 只有首页才启用拖拽上传
      this.enableDragUplaod = route.path === '/'
    },
    message(msg) {
      switch (msg.event) {
        case 'storageTypeChange':
          this.onStorageTypeChange(msg.data)
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
          this.params = msg.data || {}
          if (this.$refs.uploadBtn) {
            $('#global-uploader-btn').click()
          }
          break
        case 'uploadFolder':
          this.params = msg.data || {}
          if (this.$refs.folderBtn) {
            $('#folder-uploader-btn').click()
          }
          break
      }
    }
  },
  mounted() {
    this.enableDragUplaod = this.$route.path === '/'
    let that = this
    let dropbox = document.body

    document.body.ondragstart = function (e) {
      if (that.enableDragUplaod) {
        if (e.target.slot === 'jmal') {
          that.isDragStart = true
        }
        return e.target.slot === 'jmal' && that.fileListScrollTop === 0
      }
      return true
    }

    dropbox.addEventListener("dragenter", function (e) {
      e.stopPropagation();
      e.preventDefault();
    }, false);

    dropbox.addEventListener("dragover", function (e) {
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

    dropbox.addEventListener("ondragleave", function (e) {
      e.stopPropagation();
      e.preventDefault();
      that.dragover = false
    }, false);

    dropbox.addEventListener("drop", function (e) {
      e.stopPropagation();
      e.preventDefault();
      that.dragover = false
    }, false);
    this.initUploader()
  },
  destroyed() {
  },
  methods: {
    onStorageTypeChange(storageType) {
      if (storageType === 'File') {
        if (this.options.chunkSize === 1024 * 1024) {
          return
        }
        this.updateChunkSize(1024 * 1024)
      } else {
        if (this.options.chunkSize === 5 * 1024 * 1024) {
          return
        }
        this.updateChunkSize(5 * 1024 * 1024)
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
    onDragenter(e) {
      this.params = {
        currentDirectory: this.$route.query.path || '/',
        username: this.$store.state.user.name,
        userId: this.$store.state.user.userId,
        folder: this.$route.query.folder
      }
    },
    isPath(str) {
      // 这个正则表达式检测路径中的斜杠字符
      return /[/\\]/.test(str);
    },
    async onFilesAdded(files) {
      if (files.length === 0) {
        return
      }
      let filenames = files.map(file => file.name)
      const paths = Object.keys(this.uploader.filePaths)
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
          this.uploader.cancel()
        })
      } else {
        this.doUploadBefore(files)
      }
    },
    doUploadBefore(files) {
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
            userId: this.params.userId
          }).then(() => {
            this.getFileList()
          }).catch(e => {
          })
        })
      }
      if (window.pc) {
        this.pc = true
        this.panelShow = true
      } else {
        this.pc = false
        this.shrink()
      }
      files.forEach(file => {
        // 上传文件
        Object.assign(this.uploader.opts, {
          query: {
            isFolder: false,
            ...this.params
          }
        })
      })
      this.$nextTick(() => {
        this.uploader.resume()
      })
    },
    onFileProgress(rootFile, file, chunk) {
      this.netSpeed = formatNetSpeed(file.currentSpeed)
      this.process = Math.trunc(window.uploader.progress() * 100)
      if (this.process === -10 || this.process === 100 || this.fileListLength === 0) {
        document.title = `${this.$route.meta.title}`
      } else {
        document.title = `${this.process}% | ${this.$route.meta.title}`
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
        this.uploader.cancel()
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
          isFolder: file.isFolder
        }).then(() => {
          // console.log('文件合并成功', res)
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
      } else {

      }
      if (this.process === -10 || this.process === 100 || this.fileListLength === 0) {
        this.uploader.cancel()
        this.panelShow = false
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
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      const fileReader = new FileReader()
      // const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1024
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()

      // 文件状态设为"计算MD5"
      this.statusSet(file.id, 'md5')
      file.pause()

      loadNext()

      fileReader.onload = e => {
        spark.append(e.target.result)

        if (currentChunk < chunks) {
          currentChunk++
          loadNext()

          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          })
        } else {
          const md5 = spark.end()
          this.computeMD5Success(md5, file)
          // console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }

      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }

      function loadNext() {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },

    computeMD5Success(md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      // const fileName = file.name
      // const suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)// 后缀名
      Object.assign(this.uploader.opts, {
        query: {
          isFolder: false,
          ...this.params
        }
      })
      file.uniqueIdentifier = md5
      file.resume()
      this.statusRemove(file.id)
    },

    fileListShow() {
      const $list = $('#global-uploader .file-list')

      if ($list.is(':visible')) {
        $list.slideUp()
        this.collapse = true
      } else {
        $list.slideDown()
        this.collapse = false
      }
    },
    // 展开球
    expand() {
      if (!pc) {
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
      if (!pc) {
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
        this.uploader.cancel()
        this.panelShow = false
      } else {
        this.$confirm('还有文件正在上传, 确定要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.uploader.cancel()
          this.panelShow = false
        })
      }
    },

    /**
     * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet(id, status) {
      const statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#fff'
        },
        merging: {
          text: '合并中',
          bgc: '#e2eeff'
        },
        transcoding: {
          text: '转码中',
          bgc: '#e2eeff'
        },
        failed: {
          text: '上传失败',
          bgc: '#e2eeff'
        },
        success: {
          text: '上传成功',
          bgc: '#e2eeff'
        }
      }

      this.$nextTick(() => {
        $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
          'position': 'absolute',
          'font-size': '13px',
          'left': '0',
          'right': '0',
          'bottom': '0',
          'zIndex': '1',
          'marginBottom': '0',
          'backgroundColor': statusMap[status].bgc
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

  .uploader-drop {
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff99;

    span {
      font-size: 34px;
      font-weight: 700;
      color: #616161;
      position: relative;
      top: 48%;
    }
  }

  .uploader-app {
    width: 720px;
  }

  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    right: 2%;
    bottom: 2%;
    width: 720px;
    height: 300px;
    color: black;
    margin: auto;
    overflow: hidden;
    background-size: 100% 100%;
    border-radius: 7px 7px 0 0;
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
      border-bottom: 1px solid #ddd;

      .files-title {
        margin-left: 3%;
        font-size: 20px;
        line-height: 3.5rem;
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
      background-color: #fff;
      padding: 0;
      margin: 0;

      > li {
        background-color: #fff;
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

  > .uploader-file-icon {
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

  > .uploader-file-actions > span {
    margin-right: 6px;
  }
}

> .uploader-file-status {
  width: 32%;
  text-indent: 20px;
}

> .uploader-file-meta {
  width: 0;
}

> .uploader-file-icon {
  width: 32px;
  height: 32px;
  display: inline-block;
  vertical-align: top;
  margin-top: 8px;
  margin-right: 8px;
}

> .uploader-file-actions > span {
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
  background: #eee;
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
  border: 4px solid #fff;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  background: linear-gradient(45deg, #fde47c, #fdeca6);
  border-radius: 50%;
  overflow: hidden;
}

.process-anime .cube-a {
  position: absolute;
  left: 50%;
  background: rgba(53, 53, 53, 0.3);
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
  background: #fff;
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
