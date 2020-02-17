<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getFileList"
      >

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

      <!--<van-cell v-for="item in fileList" :key="item.id" :title="item.name"></van-cell>-->
      <!--<van-cell v-for="item in fileList" :key="item.id" :title="item.name" :label="item.updateDate"></van-cell>-->
      <van-swipe-cell v-for="(item,index) in fileList" :key="item.id" :title="item.name">
        <van-divider v-if="index === 0" style="margin: 0 15px 0px 15px;"></van-divider>
        <van-row>
          <van-col span="4" align="center">
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
          <van-col span="16">
            <van-col span="16">
              {{item.name}}
            </van-col>
            <van-col span="16" class="file-description" justify="space-between">
              <van-col span="8">
                {{formatTime(item.agoTime)}}
              </van-col>
              <van-col span="8">
                {{formatSize(item.size)}}
              </van-col>
            </van-col>
          </van-col>
          <van-col span="4"></van-col>
        </van-row>

        <van-button
          slot="right"
          square
          text="删除"
          type="danger"
          class="delete-button">
        </van-button>
        <van-divider></van-divider>
      </van-swipe-cell>
    </van-list>
  </van-pull-refresh>
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

import { getPath, getPathList, setPath, removePath } from '@/utils/path'
import { strlen, substring10, formatTime, formatSize } from '@/utils/number'
import api from '@/api/upload-api'

export default {
  data() {
    return {
      fileList: [],
      loading: false,
      finished: false,
      refreshing: false
    };
  },
  methods: {
    formatTime(time) {
      return formatTime(time)
    },
    formatSize(size) {
      return formatSize(size)
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getFileList();
    },
    getFileList() {
      this.loading = true
      api.fileList({
        userId: this.$store.state.user.userId,
        currentDirectory: getPath(),
        pageIndex: 1,
        pageSize: 30
      }).then(res => {
        this.fileList = res.data
        // 加载状态结束
        this.loading = true;
        this.refreshing = false;

          // 数据全部加载完成
          if (this.fileList.length >= res.count) {
            this.finished = true;
          }

      }).catch(e => {})
    },
  }
}
</script>
<style lang="scss" scoped>
  .svg-icon {
    width: 2.5em;
    height: 2.5em;
  }
  .van-divider {
    margin: 5px 15px 5px 15px;
  }
  .file-description {
    color: #646566;
    font-size: 12px;
    margin-top: 0.6rem;
  }
  .van-col {
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .classification {
    padding: 1rem 0 1rem 0;
  }
</style>
