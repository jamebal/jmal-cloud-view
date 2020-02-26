<template>
  <div class="container">
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="statistics()"
      @load="getFileList(true)"
    >
      <van-sticky :offset-top="0">
         <!-- <div>{{test}} {{diffTabbarTop}} {{lastTabbarOffsetTop}}</div> -->
        <van-nav-bar
          v-if="pathList.length < 3"
          title="浏览"
          right-arrow
          @click-right="titleRightClick">
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
        <div class="list-item-div" @touchstart="touchStart(item)" @touchend="touchEnd" @touchmove="touchMove">
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
              </van-col>
            </van-col>
            <van-col span="4"></van-col>
          </van-row>
        </div>
      </van-cell>
    </van-list>
  </van-pull-refresh>

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

    <e-vue-contextmenu ref="contextShow" class="newFileMenu" :class="menuTriangle" @ctx-show="show" @ctx-hide="hide">
      <div class="popper-arrow"></div>
      <ul v-for="item in menus" :key="item.label">
        <li
          v-if="item.operation === 'unFavorite' || item.operation === 'favorite'"
          @click="menusOperations(item.operation)"
        >
          <label class="menuitem"><svg-icon :icon-class="item.iconClass" /><span class="menuitem text">{{ item.label }}</span>
          </label>
        </li>
        <li
          v-else
          @click="menusOperations(item.operation)"
        >
          <label class="menuitem"><svg-icon :icon-class="item.iconClass" /><span class="menuitem text">{{ item.label }}</span>
          </label>
        </li>
      </ul>
    </e-vue-contextmenu>

    <van-overlay ref="overlayShow" :show="overlayShow" duration="0.3" @click="overlayClick">
      <van-cell v-if="rowContextData.name!=null" :style="overlayContentClass" class="list-item overlay-content-class" center @click="fileClick(rowContextData)" :is-link="rowContextData.isFolder">
        <!--<div :style="overlayContentClass">-->
        <div >
          <van-row class="row-file">
            <van-col span="4" align="center" class="list-cell-icon">
              <icon-file :item="rowContextData" :image-url="imageUrl"></icon-file>
            </van-col>
            <van-col span="16" class="list-item-content">
              <van-col span="24">
                {{rowContextData.name}}
              </van-col>
              <van-col span="24" class="file-description" justify="space-between">
                <van-col span="24">
                  {{formatTime(rowContextData.agoTime)}}&nbsp;&nbsp;&nbsp;{{formatSize(rowContextData.size)}}
                </van-col>
              </van-col>
            </van-col>
            <van-col span="4"></van-col>
          </van-row>
        </div>
      </van-cell>
    </van-overlay>

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
  import 'vant/lib/overlay/style';

  import { strlen, substring10, formatTime, formatSize } from '@/utils/number'
  import api from '@/api/upload-api'
  import IconFile from "../../../components/Icon/IconFile";
  import Bus from '@/assets/js/bus'
  import { Toast } from 'vant';
  import { getPath, getPathList, setPath, removePath } from '@/utils/path'

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
        Loop: null,
        isJustHideMenus: false,
        menusIsMultiple: false,
        menus: [],
        singleMenus: [
          { iconClass: 'menu-open', label: '打开', operation: 'open' },
          { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
          { iconClass: 'menu-details', label: '详细信息', operation: 'details' },
          { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
          { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
          { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
        ],
        multipleMenus: [
          { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
          { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
        ],
        multipleRightMenus: [
          { iconClass: 'menu-deselect', label: '取消选定', operation: 'deselect' },
          { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
          { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
        ],
        rowContextData: {},
        selectRowData: [],
        tableLoading: false,
        newFolderLoading: false,
        renameLoading: false,
        menuTriangle: '', // 三角菜单
        cellMouseIndex: -1,
        editingIndex: -1,
        indexList: [],
        overlayShow: false,
        overlayContentClass: {}
      };
    },
    mounted(){

      // 加载路径
    const pathList = getPathList()
    if (pathList && pathList !== 'undefined') {
      const res = JSON.parse(pathList)
      const list = []
      res.forEach(function(element) {
        const item0 = {}
        item0['folder'] = element.folder + ''
        item0['index'] = element.index
        list.push(item0)
      })
      this.pathList = list
    }

      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      }
    },
    destroyed(){
      window.removeEventListener('popstate', this.goBack, false);
    },
    methods: {
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
            item_menu.iconClass = 'menu-favorite-hover'
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
      // 显示操作菜单
      show() {
      },
      hide() {
        const that = this
        this.isJustHideMenus = true
        setTimeout(function() {
          that.isJustHideMenus = false
        }, 100)
      },
      // 长按事件
      rowContextmenu(row, target) {
        if (this.indexList.includes(row.index)) {
          this.menusIsMultiple = true
          this.menus = this.multipleRightMenus
        } else {
          this.menusIsMultiple = false
          this.menus = this.singleMenus
          this.preliminaryRowData(row)
        }
        // 长按选择的数据
        this.rowContextData = row
        this.menuTriangle = ''
        const offsetTop = target.offsetTop - row.scrollY
        const e = {}
        if ((offsetTop+(target.offsetHeight/2)) > document.body.offsetHeight/2) {
          e.pageX = 50
          e.pageY = target.offsetTop - 288
        } else {
          e.pageX = 50
          e.pageY = target.offsetTop + target.offsetHeight + 5
        }
        this.$refs.contextShow.showMenu(e)
      },
      // 选择某行预备数据
      preliminaryRowData(row) {
        if (row) {
          this.selectRowData[0] = row
        }
        const isFavorite = this.selectRowData[0].isFavorite
        this.highlightFavorite(isFavorite, false)
      },
      // 菜单操作
      menusOperations(operation) {
        switch (operation) {
          case 'favorite':
            console.log('operation', '收藏')
            this.favoriteOperating(true)
            break
          case 'open':
            console.log('open', '打开')
            this.fileClick(this.rowContextData)
            break
          case 'deselect':
            console.log('deselect', '取消选定')
            this.$refs.fileListTable.toggleRowSelection(this.rowContextData)
            break
          case 'unFavorite':
            console.log('unFavorite', '取消收藏')
            this.favoriteOperating(false)
            break
          case 'details':
            this.$notify.info({
              title: this.rowContextData.name,
              duration: 2000
            })
            console.log('详情', this.rowContextData)
            break
          case 'rename':
            console.log('重命名')
            this.renameFileName = this.rowContextData.name
            this.editingIndex = this.rowContextData.index
            break
          case 'copy':
            console.log('移动或复制')
            break
          case 'download':
            console.log('下载')
            this.downloadFile()
            break
          case 'remove':
            console.log('operation', '删除')
            this.deleteFile()
            break
        }
        this.overlayShow = false
        document.documentElement.style.overflow = null;
        this.$refs.contextShow.hideMenu()
      },
      downloadFile() {
        let totalSize = 0
        this.selectRowData.forEach(item => {
          totalSize += item.size
        })
        if (totalSize > 0) {
          var fileIds = [];
          if (this.menusIsMultiple) {
            this.selectRowData.forEach(value => {
              fileIds.push(value.id)
            })
          } else {
            fileIds.push(this.rowContextData.id)
          }
          window.open(process.env.VUE_APP_BASE_FILE_API + 'download?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds, '_self')
        } else {
          this.$message({
            message: '所选文件夹为空',
            type: 'warning'
          });
        }
      },
      // 收藏/取消收藏
      favoriteOperating(isFavorite) {
        this.selectRowData[0].isFavorite = isFavorite

        this.highlightFavorite(isFavorite, true)
        api.favoriteUrl({
          token: this.$store.state.user.token,
          id: this.selectRowData[0].id,
          isFavorite: isFavorite
        }).then(res => {
        })
      },
      // 删除
      deleteFile() {
        let fileList = []
        const fileIds = []
        if (this.menusIsMultiple) {
          fileList = this.selectRowData
          this.selectRowData.forEach(value => {
            fileIds.push(value.id)
          })
        } else {
          fileIds.push(this.selectRowData[0].id)
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
            if (this.selectRowData.length === 1) {
              this.fileList.splice(this.selectRowData[0].index, 1)
            } else {
              this.getFileList()
            }
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 1000
            })
            this.$refs.fileListTable.clearSelection()// 删除后清空之前选择的数据
            this.selectRowData = []
          })
        })
      },
      touchMove(e) {
        // 避免和长按事件冲突
        clearTimeout(this.Loop);
        e.preventDefault();
      },
      touchStart(item){
        // e.preventDefault();
        Toast.setDefaultOptions({ duration: 500 });
        // Toast("手指触摸");
        //手指触摸
        clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
        const that = this
        const e = window.event
        this.Loop = setTimeout(function() {
          console.log(e.targetTouches[0].pageY-e.targetTouches[0].clientY)
          item.scrollY = e.targetTouches[0].pageY-e.targetTouches[0].clientY
          console.log(item)
          that.findListItem(item,e.targetTouches[0].target)
          that.overlayShow = true
          Toast("长按"+document.documentElement.style.overflow);
          document.documentElement.style.overflow='hidden';
        },500);
      },
      touchEnd(){
        // Toast("手指离开");
        //手指离开
        clearTimeout(this.Loop);
      },
      // 点击遮罩层
      overlayClick() {
        this.overlayShow = false
        document.documentElement.style.overflow = null;
      },
      findListItem(item,target){
        const offsetParent = target.offsetParent
        if(offsetParent.className.indexOf('list-item') > -1){
            this.overlayContentClass = {
              'top': (offsetParent.offsetTop-item.scrollY)+'px',
              'height': offsetParent.offsetHeight+'px',
              'width': offsetParent.offsetWidth+'px',
              'left': offsetParent.offsetLeft+'px',
              'border-radius': '0px'
            }
            const that = this
            setTimeout(function () {
              that.overlayContentClass = {
                'top': (offsetParent.offsetTop-item.scrollY)+'px',
                'height': offsetParent.offsetHeight+'px',
                'width': (offsetParent.offsetWidth-20)+'px',
                'left': (offsetParent.offsetLeft+10)+'px',
                'border-radius': (offsetParent.offsetHeight/4)+'px',
              }
            },0)
            this.rowContextmenu(item,offsetParent)
            return offsetParent
        } else {
          this.findListItem(item,target.offsetParent)
        }
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
        // Toast("提示").setDefaultOptions({ duration: 200 });
        this.actionSheetShow = true
        this.actionsMenus = [
          { name: '新建文件夹' },
        ]
        if(window.uploader.support){
          const menuItem = {}
          menuItem['name'] = '上传文件'
          this.actionsMenus.push(menuItem)
        }
        if(window.uploader.supportDirectory){
          const menuItem = {}
          menuItem['name'] = '上传文件夹'
          this.actionsMenus.push(menuItem)
        }
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
          setPath(this.path, this.pathList)
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
        return this.getShowSumFileAndFolder(this.fileList) + ' ' + this.getShowSumSize(totalSize)
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
          setPath(this.path, this.pathList)
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

  * {
    -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
    -webkit-user-select:none; /*webkit浏览器*/
    -moz-user-select:none;/*火狐*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
  }

  input {
    -webkit-user-select:auto; /*webkit浏览器*/
  }

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

  .list-item {
    padding: 5px 10px;

    .list-cell-icon {
      font-size: 18px;
    }

    .list-item-content {
      margin-left: 5px;
    }
  }
  .overlay-content-class {
    -webkit-transition: all .1s ease-in-out 0s;
    transition: all .1s ease-in-out 0s;
    box-shadow: 2px 3px 3px #888888;

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

  .newFileMenu ul {
    list-style: none;
    padding-inline-start: 0px;
    margin-top: 0;
    margin-bottom: 0;
  }
  .newFileMenu li {
    cursor: pointer;
    margin: 0;
    padding: 0;
    font-size: 16px;
    min-width: 136px;
  }
  .newFileMenu li:active {
    cursor: pointer;
    border-radius: 5px;
    /*background-color: #409eff14;*/
    background-color: #409eff30;
  }
  .newFileMenu li > .menuitem {
    cursor: pointer;
    line-height: 38px;
    margin-left: 10%;
  }
  .newFileMenu li > .menuitem > .text {
    cursor: pointer;
    margin-left: 8%;font-weight: normal;
  }
  .newFileMenu li > .menuitem > .svg-icon {
    width: 1.2rem;
    height: 1.2rem;
  }
  /deep/ .ctx-menu-container {
    top: unset;
  }
</style>
