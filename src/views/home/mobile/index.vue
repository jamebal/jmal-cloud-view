<template>
  <div class="container">
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="statistics()"
      @load="getFileList(true)"
    >
      <!-- <van-sticky :offset-top="0">
        <van-row class="classification">
          <van-col span="6" align="center">
            <svg-icon icon-class="image" />
            <div>图片</div>
          </van-col>
          <van-col span="6" align="center">
            <svg-icon icon-class="document" />
            <div>文档</div>
          </van-col>
          <van-col span="6" align="center">
            <svg-icon icon-class="video" />
            <div>视屏</div>
          </van-col>
          <van-col span="6" align="center">
            <svg-icon icon-class="audio" />
            <div>音乐</div>
          </van-col>
        </van-row>
      </van-sticky> -->

      <!--<van-cell v-for="item in fileList" :key="item.id" :title="item.name"></van-cell>-->
      <!--<van-cell v-for="item in fileList" :key="item.id" :title="item.name" :label="item.updateDate"></van-cell>-->
      <van-cell class="list-item" v-for="(item,index) in fileList" :key="item.id">

        <template slot="left">
          <van-button square type="primary" text="选择"></van-button>
        </template>

        <!--<van-divider v-if="index === 0" style="margin: 0 15px 0 15px;"></van-divider>-->
        <van-row>
          <van-col span="4" align="center" class="list-cell-icon">
              <svg-icon v-if="item.isFavorite" icon-class="menu-favorite-hover" style="font-size: 1rem;float: right;margin-bottom: -1rem;position: relative;" />
              <svg-icon v-if="item.isFolder" icon-class="folder" />
              <svg-icon v-else-if="item.contentType.indexOf('video') > -1" icon-class="video" />
              <svg-icon v-else-if="item.contentType.indexOf('audio') > -1" icon-class="audio" />
              <svg-icon v-else-if="item.contentType.indexOf('text') > -1" icon-class="file-txt" />
              <el-avatar v-else-if="item.contentType.indexOf('image') > -1" shape="square" :src="imageUrl+item.id"></el-avatar>
              <svg-icon v-else-if="item.contentType.indexOf('application/pdf') > -1" icon-class="file-pdf" />
              <svg-icon v-else-if="item.contentType.indexOf('word') > -1" icon-class="file-word" />
              <svg-icon v-else-if="item.contentType.indexOf('excel') > -1" icon-class="file-excel" />
              <svg-icon v-else-if="item.contentType.indexOf('zip') > -1" icon-class="zip" />
              <svg-icon v-else icon-class="file" />
          </van-col>
          <van-col span="16" @click="fileClick(item)">
            <van-col span="16">
              {{item.name}}
            </van-col>
            <van-col span="16" class="file-description" justify="space-between">
              <van-col span="12">
                {{formatTime(item.agoTime)}}&nbsp;&nbsp;&nbsp;{{formatSize(item.size)}}
              </van-col>
              <!-- <van-col span="8">
                {{formatSize(item.size)}}
              </van-col> -->
            </van-col>
          </van-col>
          <van-col span="4"></van-col>
        </van-row>

        <template slot="right">
          <van-button square type="primary" text="收藏"></van-button>
          <van-button square type="danger" text="删除"></van-button>
        </template>

        <!--<van-divider></van-divider>-->
      </van-cell>
    </van-list>
  </van-pull-refresh>
  </div>
</template>
<script>
  import 'vant/lib/button/style';
  import 'vant/lib/cell/style';
  import 'vant/lib/cell-group/style'
  import 'vant/lib/image/style';
  import 'vant/lib/list/style';
  import 'vant/lib/pull-refresh/style';
  import 'vant/lib/swipe-cell/style';
  import 'vant/lib/col/style';
  import 'vant/lib/row/style';
  import 'vant/lib/divider/style';
  import 'vant/lib/sticky/style';

  import { getPath, getPathList, setPath, removePath } from '@/utils/path'
  import { strlen, substring10, formatTime, formatSize } from '@/utils/number'
  import api from '@/api/upload-api'

  export default {
    data() {
      return {
        path: this.$route.query.path,
        fileList: [],
        totalSize: 0,
        pathList: [
          { 'folder': '', index: 0 },
          { 'folder': '+', index: 1 }
        ],
        pagination: {
          pageIndex: 1,
          pageSize: 25,
          total: 0,
        },
        loading: false,
        finished: false,
        refreshing: false
      };
    },
    mounted(){
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }
    },
    destroyed(){
      window.removeEventListener('popstate', this.goBack, false);
    },
    methods: {
      // 浏览器的返回事件
      goBack(){
        if (this.$route.query.path){
          this.path = this.$route.query.path
          console.log('goBack path', this.path)
        } else {
          this.path = ''
          this.$router.push(`/_m`)
        }
        this.getFileList()
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
      getFileList(onLoad) {
        console.log('onLoad', onLoad)
        api.fileList({
          userId: this.$store.state.user.userId,
          currentDirectory: this.$route.query.path,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
        }).then(res => {
          if(onLoad){
            res.data.forEach(file => {
              this.totalSize += file.size
              this.fileList.push(file)
            });
          }else{
            this.fileList = res.data
          }
          // 加载状态结束
          this.loading = false;
          this.refreshing = false;
          // 数据全部加载完成
          if (this.fileList.length >= res.count) {
            this.finished = true;
          }
        }).catch(e => {})
      },
      // 统计
      statistics() {
        return this.getShowSumFileAndFolder() + ' ' + this.getShowSumSize(this.totalSize)
      },
      // 统计文件和文件夹
      getShowSumFileAndFolder() {
        let folderSize = 0
        let fileSize = 0
        this.fileList.forEach((fileInfo) => {
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
      // 点击文件或文件夹
      fileClick(row) {
        console.log('fileClick', row)
        if (row.isFolder) {
          // 打开文件夹
          if(this.path){
            this.path += '/' + row.name
          } else {
            this.path = '/' + row.name
          }
          const item1 = {}
          item1['folder'] = row.name
          item1['index'] = this.pathList.length - 1
          const item2 = {}
          item2['folder'] = '+'
          item2['index'] = this.pathList.length
          this.pathList[this.pathList.length - 1] = item1
          this.pathList.push(item2)
          console.log('push path',this.path)
          this.$router.push(`/_m?path=${this.path}`)
          // window.open(process.env.VUE_APP_BASE_API + '/m?path=' + this.path, '_self')
          this.getFileList()
        } else {
          // 打开文件
          const fileIds = [row.id]
          const url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
          window.open(url, '_blank')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .container {
    font-size: 14px;

    .classification {
      padding: 1rem 0 1rem 0;
      background: wheat;
    }

  }
  .svg-icon {
    width: 2.5em;
    height: 2.5em;
  }
  /*.van-divider {*/
    /*margin: 5px 15px 0px 15px;*/
  /*}*/
  .file-description {
    color: #646566;
    font-size: 12px;
  }
  .van-col {
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .list-item {
    padding: 5px 0;
    height: 3.5rem;

    .list-cell-icon {
      margin-top: 7px;
      height: 3.5rem;
      line-height: 3.5rem;
    }
  }
</style>
