<template>
  <div class="container">
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="statistics()"
      @load="getFileList(true)"
      @scroll="swipeUp"
    >
      <van-sticky :offset-top="0">
         <div>{{test}} {{diffTabbarTop}} {{lastTabbarOffsetTop}}</div>
        <van-nav-bar
          v-if="pathList.length < 3"
          title="浏览"
          right-arrow
          @click-right="titleRightClick">
          <!--<van-icon name="wap-nav" slot="right">-->
          <!--</van-icon>-->
          <svg-icon class="title-right-icon" icon-class="add-file" slot="right"/>
        </van-nav-bar>

        <van-nav-bar
          v-if="pathList.length === 3"
          :title="pathList[pathList.length-2].folder"
          left-text="所有文件"
          right-text="选择"
          left-arrow
          @click-left="clickBack">
        </van-nav-bar>

        <van-nav-bar
          v-if="pathList.length > 3"
          :title="pathList[pathList.length-2].folder"
          :left-text="pathList[pathList.length-3].folder"
          right-text="选择"
          left-arrow
          @click-left="clickBack">
        </van-nav-bar>

      </van-sticky>

      <van-cell class="list-item" center v-for="item in fileList" :key="item.id" @click="fileClick(item)" :is-link="item.isFolder">
        <div @touchstart="touchStart" @touchend="touchEnd">
          <van-row class="row-file">
            <van-col span="4" align="center" class="list-cell-icon">
              <icon-file :item="item" :image-url="imageUrl"></icon-file>
            </van-col>
            <van-col span="16" class="list-item-content">
              <van-col span="24">
                {{item.name}}
              </van-col>
              <van-col span="24" class="file-description" justify="space-between">
                <van-col span="24">
                  {{formatTime(item.agoTime)}}&nbsp;&nbsp;&nbsp;{{formatSize(item.size)}}
                </van-col>
                <!-- <van-col span="8">
                  {{formatSize(item.size)}}
                </van-col> -->
              </van-col>
            </van-col>
            <van-col span="4"></van-col>
          </van-row>
          <!--<van-divider></van-divider>-->
        </div>
      </van-cell>
    </van-list>
  </van-pull-refresh>
    <!--<van-tabbar v-model="tabActive" :class="tabBottom">-->
    <!--<div v-if="diffTabbarTop === 0 || diffTabbarTop > 0">-->
      <!--<van-tabbar-->
        <!--id="tabbar"-->
        <!--active-color="#07c160"-->
        <!--inactive-color="#000"-->
        <!--v-model="tabActive"-->
        <!--class="tab-bottom">-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-folder" /><div class="tab-text">浏览</div></van-tabbar-item>-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-recently" /><div class="tab-text">最近</div></van-tabbar-item>-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-favorite" /><div class="tab-text">收藏</div></van-tabbar-item>-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-setting" /><div class="tab-text">设置</div></van-tabbar-item>-->
      <!--</van-tabbar>-->
    <!--</div>-->
    <!--<div v-if="diffTabbarTop < 0">-->
      <!--<van-tabbar-->
        <!--id="tabbar"-->
        <!--v-if="isiPhoneX === 30"-->
        <!--active-color="#07c160"-->
        <!--inactive-color="#000"-->
        <!--v-model="tabActive"-->
        <!--class="tab-bottom-iphoneX">-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-folder" /><div class="tab-text">浏览</div></van-tabbar-item>-->
        <!--<van-tabbar-item> <a href="http://www.baidu.com"><svg-icon icon-class="tab-recently" /><div class="tab-text">最近</div></a></van-tabbar-item>-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-favorite" /><div class="tab-text">收藏</div></van-tabbar-item>-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-setting" /><div class="tab-text">设置</div></van-tabbar-item>-->
      <!--</van-tabbar>-->

      <!--<van-tabbar-->
        <!--id="tabbar"-->
        <!--v-if="isiPhoneX === 35"-->
        <!--active-color="#07c160"-->
        <!--inactive-color="#000"-->
        <!--v-model="tabActive"-->
        <!--class="tab-bottom-iphoneXS">-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-folder" /><div class="tab-text">浏览</div></van-tabbar-item>-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-recently" /><div class="tab-text">最近</div></van-tabbar-item>-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-favorite" /><div class="tab-text">收藏</div></van-tabbar-item>-->
        <!--<van-tabbar-item><svg-icon icon-class="tab-setting" /><div class="tab-text">设置</div></van-tabbar-item>-->
      <!--</van-tabbar>-->
    <!--</div>-->

    <van-action-sheet
      v-model="actionSheetShow"
      :actions="actionsMenus"
      cancel-text="取消"
      @cancel="onCancel"
      @select="selectActionsMenus">
    </van-action-sheet>

    <van-dialog v-model="showNewFolder" show-cancel-button @confirm="newFolderNameClick">
        <van-field class="new-folder-input" v-model="newFolderName" placeholder="请输入文件夹名称" :border="true" :clearable="true" ref="newFolderInput" :autofocus="true">
        </van-field>
    </van-dialog>

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
  import 'vant/lib/nav-bar/style';
  import 'vant/lib/icon/style';
  import 'vant/lib/tabbar/style';
  import 'vant/lib/tabbar-item/style';
  import 'vant/lib/dialog/style';
  import 'vant/lib/field/style';
  import 'vant/lib/toast/style';

  import { strlen, substring10, formatTime, formatSize } from '@/utils/number'
  import api from '@/api/upload-api'
  import IconFile from "../../../components/Icon/IconFile";
  import Bus from '@/assets/js/bus'
  import { Toast } from 'vant';

  export default {
    components: {IconFile},
    data() {
      return {
        test: 0,
        lastTabbarOffsetTop: 0,// 底部tabbar与上边框 上次的距离
        diffTabbarTop: 0,// 底部tabbar与上边框的变化距离
        isiPhoneX: 0,
        imageUrl: process.env.VUE_APP_BASE_API + '/view/thumbnail?jmal-token=' + this.$store.state.user.token + '&id=',
        tabActive: 0,
        path: this.$route.query.path,
        fileList: [],
        pathList: [
          { 'folder': '', index: 0 },
          { 'folder': '+', index: 1 }
        ],
        pagination: {
          pageIndex: 0,
          pageSize: 25,
          total: 0,
        },
        loading: false,
        finished: false,
        refreshing: false,
        actionSheetShow: false, // 下拉菜单
        actionsMenus: [
          { name: '新建文件夹' },
        ],
        showNewFolder: false,
        newFolderName: '新建文件夹',
        Loop: null
      };
    },
    mounted(){

      var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        if(screen.height === 812 && screen.width === 375){
          // iPhone X iPhone XS
          this.isiPhoneX = 30
        }else if (screen.height === 896 && screen.width === 414){
          // iPhone XS Max   iPhone XR
          this.isiPhoneX = 35
        }
      }

      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }

      const that = this
      // 判断底部tabbar与上边框的距离,用来适配iPhoneX机型下面多出来的部分
      window.addEventListener('scroll', () => {
        that.test = 14
        var tabbar= document.getElementById("tabbar");
        if(tabbar.offsetTop){

        }
        const top = tabbar.offsetTop
        that.test = tabbar.offsetTop
        if(that.lastTabbarOffsetTop === 0){
          if(top > 0){
            that.lastTabbarOffsetTop = top
          }
        }else{
          const diff = that.lastTabbarOffsetTop - top
          if(diff > 0){
            console.log("显示")
            that.diffTabbarTop = diff
          } else if(diff < 0){
            console.log("隐藏")
            that.diffTabbarTop = diff
          }
          that.lastTabbarOffsetTop = top
        }
      }, true);

    },
    destroyed(){
      window.removeEventListener('popstate', this.goBack, false);
    },
    methods: {
      touchStart(e){
        e.preventDefault();
        Toast("手指触摸").setDefaultOptions({ duration: 200 });
        //手指触摸
        clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
        this.Loop = setTimeout(function() {
          Toast("哈哈").setDefaultOptions({ duration: 200 });
        },700);
      },
      touchEnd(){
        Toast("手指离开").setDefaultOptions({ duration: 200 });
        //手指离开
        clearTimeout(this.Loop);
      },
      // 浏览器的返回事件
      goBack(){
        const linkIndex = this.pathList.length-3
        this.handleLink(this.pathList[linkIndex],linkIndex)
      },
      // 点击返回按钮(标题)
      clickBack() {
        const linkIndex = this.pathList.length-3
        this.handleLink(this.pathList[linkIndex], linkIndex, true)
      },
      // 点击右边按钮(标题)
      titleRightClick() {
        Toast("提示").setDefaultOptions({ duration: 200 });
        // this.actionSheetShow = true
        // this.actionsMenus = [
        //   { name: '新建文件夹' },
        // ]
        // if(window.uploader.support){
        //   const menuItem = {}
        //   menuItem['name'] = '上传文件'
        //   this.actionsMenus.push(menuItem)
        // }
        // if(window.uploader.supportDirectory){
        //   const menuItem = {}
        //   menuItem['name'] = '上传文件夹'
        //   this.actionsMenus.push(menuItem)
        // }
      },
      handleLink(item, index, isPushLink) {

        console.log("handleLink", item)
        console.log("handleLink - index", index)

        if (!this.$route.query.path){
          this.$router.push(`/_m`)
        }

        if(item.search){
          if(item.searchKey){
            this.searchFileByKeyWord(item.searchKey)
          } else if(item.row){
            this.searchFileAndOpenDir(item.row)
          }
          this.pathList.splice(this.pathList.findIndex(v => v.index === index + 2), this.pathList.length - (index + 2))
        } else {
          this.pathList.splice(this.pathList.findIndex(v => v.index === index + 2), this.pathList.length - (index + 2))
          this.pathList.forEach((p, number) => {
            if (number === 0) {
              this.path = ''
            } else if (number === this.pathList.length - 1) {
            } else {
              this.path += '/' + this.pathList[number].folder
            }
          })
          if(isPushLink){
            this.$router.push(`/_m?path=${this.path}`)
          }
          this.getFileList()
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
      getFileList(onLoad) {
        if (onLoad) {
          this.pagination.pageIndex++
        } else {
          this.pagination.pageIndex = 1
        }
        this.finished = false;
        api.fileList({
          userId: this.$store.state.user.userId,
          currentDirectory: this.$route.query.path,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
        }).then(res => {
          if(onLoad){
            res.data.forEach(file => {
              this.fileList.push(file)
            });
            this.addEventListener()
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
        let totalSize = 0
        this.fileList.forEach(file => {
          totalSize += file.size;
        })
        return this.getShowSumFileAndFolder() + ' ' + this.getShowSumSize(totalSize)
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
          this.$router.push(`/_m?path=${this.path}`)
          this.getFileList()
        } else {
          // 打开文件
          const fileIds = [row.id]
          const url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
          window.open(url, '_blank')
        }
      },
      onCancel() {
        this.actionSheetShow = false;
      },
      // 选择上传文件菜单
      selectActionsMenus(action,index) {
        const that = this
        setTimeout(function () {
          that.actionSheetShow = false
        },100)
        // 新建文件夹
        if(action.name === '新建文件夹'){
          this.newFolderName = '新建文件夹'
          let append = 0
          let filenameList = []
          this.fileList.forEach(file => {
            filenameList.push(file.name)
          })
          while(filenameList.includes(this.newFolderName)){
            append += 1
            this.newFolderName = '新建文件夹' + append
          }
          this.showNewFolder = true
          const that = this
          setTimeout(function () {
            that.$refs.newFolderInput.focus()
          },0)
        }

        // 上传文件
        if(action.name === '上传文件'){
          // 打开文件选择框
          Bus.$emit('openUploader', {
            // 传入的参数
            currentDirectory: this.path,
            username: this.$store.state.user.name,
            userId: this.$store.state.user.userId
          })
        }

        // 上传文件夹
        if(action.name === '上传文件夹'){
          // 打开文件夹选择框
          console.log('selectFolder')
          Bus.$emit('uploadFolder', {
            // 传入的参数
            currentDirectory: this.path,
            username: this.$store.state.user.name,
            userId: this.$store.state.user.userId
          })
        }
      },
      // 新建文件夹
      newFolderNameClick() {
        console.log('user', this.$store.state.user);
        this.newFolderLoading = true
        if(this.newFolderName){
          api.uploadFolder({
            isFolder: true,
            filename: this.newFolderName,
            currentDirectory: this.path,
            username: this.$store.state.user.name,
            userId: this.$store.state.user.userId
          }).then((res) => {
            if(res.data === 1){
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
          })
        }else{
          this.newFolderLoading = false
          this.$message({
            message: '请输入文件夹名称',
            type: 'warning'
          });
        }
      },
      swipeUp() {
        this.test = 10
        console.log(67)
      },
      tabBottom() {
        return { padding: '0 0 20px 0' }
      }
    }
  }
</script>
<style lang="scss" scoped>

  .tab-bottom {
    padding: 0 0 25px 0;
    .van-tabbar-item {
      margin-top:25px;
      animation:ordinary .4s forwards;
      -moz-animation:ordinary .4s forwards; /* Firefox */
      -webkit-animation:ordinary .4s forwards; /* Safari and Chrome */
      -o-animation:ordinary .4s forwards; /* Opera */
    }
  }

  @keyframes iphoneX
  {
    from {margin-top:25px;}
    to {margin-top:-5px;}
  }

  @keyframes ordinary
  {
    from {margin-top:-5px;}
    to {margin-top:25px;}
  }

  .tab-bottom-iphoneX {
    padding: 0 0 25px 0;
    .van-tabbar-item {
      animation:iphoneX .4s forwards;
      -moz-animation:iphoneX .4s forwards; /* Firefox */
      -webkit-animation:iphoneX .4s forwards; /* Safari and Chrome */
      -o-animation:iphoneX .5s forwards; /* Opera */
    }
  }

  .tab-bottom-iphoneXS {
    padding: 0 0 25px 0;
    .van-tabbar-item {
      animation:iphoneX .4s forwards;
      -moz-animation:iphoneX .4s forwards; /* Firefox */
      -webkit-animation:iphoneX .4s forwards; /* Safari and Chrome */
      -o-animation:iphoneX .4s forwards; /* Opera */
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
  /deep/ .svg-icon {
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

  .van-list {
    margin-bottom: 75px
  }

  .list-item {
    padding: 5px 10px;

    .list-cell-icon {
      font-size: 18px;
    }

    .list-item-content {
      margin-left: 5px;
    }
  }

  .list-item:active {
    background-color: #bfcbd930;
  }

  .van-nav-bar {
    background: #ffffffcc;
    position: relative;
    box-shadow: 4px 0 2px rgba(0,0,0,0.5);
  }
  .van-nav-bar::after{
    background: inherit;
    -webkit-filter: blur(15px);
    filter: blur(20px);
}

  .van-nav-bar__title {
    width: 30%;
    position: absolute;
    margin-left: 35%;
    z-index: 11;
  }

  .van-nav-bar__left {
    //  max-width: 30%;
     z-index: 11;
   }
   .van-nav-bar__left:active {
    background-color: hsl(0, 94%, 47%);
  }
   .van-nav-bar__right {
    z-index: 11;
  }
  /*.van-nav-bar__left {*/
     /*left: 0;*/
  /*}*/

  .van-icon.van-icon-arrow-left.van-nav-bar__arrow {
    left: 5px;
  }

  .van-nav-bar__left {
    left: 0;
    .van-nav-bar__text {
      padding: 0 0 0 25px;
    }
  }

  .van-nav-bar__arrow+.van-nav-bar__text {
    max-width: 7.5rem;
    min-width: 5.5rem;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }

  .title-right-icon {
    width: 2rem;
    height: 2rem;
    vertical-align: middle;
  }
  .new-folder-input /deep/ .van-field__body{
    height: 40px;
  }
</style>
