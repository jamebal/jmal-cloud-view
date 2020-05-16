<template>
  <div class="container">
    <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->

    <!--左侧菜单-->
    <van-popup v-model="leftMenuShow" get-container="body" position="left" :style="{ height: '100%', width: '35%'}">
      <div class="left-menu">
        <div class="avatar">
          <van-image
            round
            width="5rem"
            height="5rem"
            fit="cover"
            :src="imageUrl+avatar"
          />
        </div>
        <span>{{name}}</span>

        <div class="classification">
          <van-cell title="首页" icon="wap-home-o"  @click="clickFileType(null,{})"/>
          <van-cell title="收藏" icon="star-o"  @click="clickFileType(null,{isFavorite: true})"/>
          <van-cell title="图片" icon="photo-o" @click="clickFileType('image',{isFolder: false})"/>
          <van-cell title="视频" icon="video-o" @click="clickFileType('video',{isFolder: false})"/>
          <van-cell title="音乐" icon="music-o" @click="clickFileType('audio',{isFolder: false})"/>
        </div>

        <div class="logout">
          <van-button round type="danger" @click.native="logout">退出登录</van-button>
        </div>
      </div>
    </van-popup>

    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="statistics()"
      @load="searchStatus && searchValue.length>0?searchFile(searchValue,true):getFileList(true)"
    >
      <van-checkbox-group v-model="selectRowData" @change="checkboxChange" ref="checkboxGroup">
        <van-cell-group>
          <van-sticky :offset-top="-1">
            <!-- <div>{{test}} {{diffTabbarTop}} {{lastTabbarOffsetTop}}</div> -->
            <van-nav-bar
              :style="vanNavBarClass"
              v-if="pathList.length < 3 && !selectStatus"
              title="浏览"
              right-arrow
              @click-right="checkboxAll"
              :right-text="this.selectRowData.length !== this.fileList.length ? '选择' : '取消'"
              @click-left="leftMenu"
              left-arrow>
              <div class="header-button" slot="left">
                <svg
                  class="header-button-icon"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                >
                  <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" />
                </svg>
              </div>
            </van-nav-bar>
            <van-nav-bar
              :style="vanNavBarClass"
              v-if="pathList.length < 3 && selectStatus"
              :title="selectRowData.length === 0 ? '选择项目' : selectRowData.length+'项'"
              right-arrow
              :left-text="this.selectRowData.length !== this.fileList.length ? '全选' : '取消全选'"
              @click-left="checkboxAll"
              @click-right="cancelSelect"
              right-text="完成"
            >
            </van-nav-bar>

            <van-nav-bar
              :style="vanNavBarClass"
              v-if="pathList.length >= 3"
              :title="pathList[pathList.length-2].folder"
              right-text="选择"
              left-arrow
              @click-left="clickBack">
              <div class="header-button" slot="left">
                <van-icon name="arrow-left" />
              </div>
            </van-nav-bar>
            <div class="searchbar" :style="searchBarClass">
              <van-search
                ref="search"
                v-model="searchValue"
                :show-action="searchStatus"
                shape="round"
                placeholder="搜索"
                @focus="startSearch"
                @search="onSearch"
                @input="onSearch"
              >
                <div slot="action" @click="endSearch">取消</div>
              </van-search>
            </div>
          </van-sticky>

          <!--操作-->
          <van-cell :center="true" style="padding: 0 0 10px 0;">
            <div class="operating-header">
              <van-row>
                <van-col class="operating-header-col" span="4" align="center" type="flex" @click="moreOperations">
                  <van-icon name="more-o"/>
                </van-col>
                <van-col class="operating-header-col" span="16" align="center" @click="showSortSheet">
                  已按{{actionsSortName}}排序 <van-icon class="sortable" :name="'arrow-'+sortOrder" />
                </van-col>
                <van-col class="operating-header-col" span="4" align="center" @click="changeVmode">
                  <van-icon name="bars" :style="!grid?{background:'#1989fa',color:'#ffffff',padding:'0 5px',borderRadius: '5px'}:{}"/>
                </van-col>
              </van-row>
            </div>
          </van-cell>

          <!--搜索结果-->
          <van-cell v-if="searchStatus && searchValue.length > 0 && fileList.length > 0" style="background-color:#f7f8fa;">
            <div class="search-result">{{resultCount}}个结果</div>
          </van-cell>
          <van-cell v-if="searchStatus && searchValue.length > 0 && fileList.length === 0">
            <div class="search-result-no">无结果</div>
          </van-cell>

          <van-cell v-show="!grid" class="list-item" :style="{'background': selectIndexList.includes(index) ? '#90c2fcb5' : ''}" center v-for="(item,index) in fileList" :key="item.id" @click="fileClick(item,index)" :is-link="item.isFolder">
            <div class="list-item-div" @touchstart="touchStart(item)" @touchend="touchEnd" @touchmove="touchMove">
              <van-row class="row-file">
                <van-col span="4" align="center" class="list-cell-icon">
                  <icon-file :item="item" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></icon-file>
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
                <van-col span="4">

                </van-col>
              </van-row>
            </div>
            <van-checkbox v-if="selectStatus" slot="right-icon" :name="item" ref="checkboxes"></van-checkbox>
          </van-cell>

          <van-grid v-show="grid" square :center="true" :column-num="4" :gutter="10" :border="false" :style="{'width':'100%','overflow':'auto'}">
            <van-grid-item v-for="(item,index) in fileList" ref="gridItem"  :key="item.id">
              <div>
                <div class="grid-item-icon">
                  <icon-file :item="item" :image-url="imageUrl" :audio-cover-url="audioCoverUrl" :grid="true"></icon-file>
                </div>
                <span :title="item.name" class="grid-item-text">{{item.name}}</span>
              </div>
            </van-grid-item>
          </van-grid>

        </van-cell-group>
      </van-checkbox-group>

    </van-list>
    <!-- </van-pull-refresh> -->

    <!--选择上传文件菜单-->
    <van-action-sheet
      v-model="actionSheetShow"
      :actions="actionsMenus"
      cancel-text="取消"
      @cancel="onCancel"
      @select="selectActionsMenus">
    </van-action-sheet>

    <!--排序菜单-->
    <van-action-sheet
      v-model="actionSortSheetShow"
      :actions="actionsSortMenus"
      cancel-text="取消"
      description="排序方式"
      @cancel="onCancel"
      @select="selectSortActionsMenus">
    </van-action-sheet>

    <van-dialog v-model="showNewFolder" show-cancel-button @confirm="newFolderNameClick">
      <van-field class="new-folder-input" v-model="newFolderName" placeholder="请输入文件夹名称" :border="true" :clearable="true" ref="newFolderInput" :autofocus="true">
      </van-field>
    </van-dialog>

    <van-dialog v-model="showRename" show-cancel-button @confirm="rowRename()">
      <van-field class="rename-input" v-model="renameFileName" placeholder="请输入文件名称" :border="true" :clearable="true" ref="renameInput" :autofocus="true">
      </van-field>
    </van-dialog>

    <e-vue-contextmenu ref="contextShow" class="newFileMenu" @ctx-show="show" @ctx-hide="hide">
      <ul v-for="(item,index) in menus" :key="item.label" :class="{'menu-list-first':index===0,'menu-list-last':index===menus.length-1,'menu-list':index<menus.length-1&&index>0}">
        <div v-if="index !== 0" style="border-bottom:1px solid #cccccc85"></div>
        <li :class="{'remove':item.operation==='remove'}" @click="menusOperations(item.operation)">
          <div class="menuitem"><svg-icon :icon-class="item.iconClass" />
            <span class="menuitem text">{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </e-vue-contextmenu>

    <van-overlay ref="overlayShow" :show="overlayShow" duration="0.3" @click="overlayClick">
      <van-cell v-if="rowContextData.name!=null" :style="overlayContentClass" class="list-item overlay-content-class" center @click="fileClick(rowContextData)" :is-link="rowContextData.isFolder">
        <!--<div :style="overlayContentClass">-->
        <div>
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
        <van-checkbox v-if="selectStatus" v-model="isShowCheckContext" slot="right-icon" :name="rowContextData"></van-checkbox>
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
  import 'vant/lib/notify/style';
  import 'vant/lib/checkbox/style';
  import 'vant/lib/checkbox-group/style';
  import 'vant/lib/popup/style';
  import 'vant/lib/search/style';

  import { mapGetters } from 'vuex'
  import {formatSize, formatTime, strlen, substring10} from '@/utils/number'
  import api from '@/api/file-api'
  import IconFile from "../../../components/Icon/IconFile";
  import Bus from '@/assets/js/bus'
  import {Dialog, Notify, Toast} from 'vant';
  import {getPath, getPathList, removePath, setPath} from '@/utils/path'

  let pinyin = require("pinyin");

  export default {
    components: {IconFile,[Dialog.Component.name]: Dialog.Component},
    computed: {
      ...mapGetters([
        'name',
        'avatar'
      ])
    },
    data() {
      return {
        test: 0,
        lastTabbarOffsetTop: 0,// 底部tabbar与上边框 上次的距离
        diffTabbarTop: 0,// 底部tabbar与上边框的变化距离
        isiPhoneX: 0,
        imageUrl: process.env.VUE_APP_BASE_API + '/view/thumbnail?jmal-token=' + this.$store.state.user.token + '&id=',
        audioCoverUrl: process.env.VUE_APP_BASE_API + '/view/cover?jmal-token=' + this.$store.state.user.token + '&id=',
        tabActive: 0,
        path: this.$route.query.path,
        fileList: [],
        pathList: [
          { 'folder': '', index: 0 },
          { 'folder': '+', index: 1 }
        ],
        pagination: {
          pageIndex: 0,
          pageSize: 50,
          total: 0,
        },
        queryFileType: null,
        queryCondition: {isFolder:null},
        loading: false,
        finished: false,
        refreshing: false,
        actionSheetShow: false, // 下拉菜单
        actionsMenus: [
          { name: '新建文件夹' },
        ],
        actionSortSheetShow: false,
        actionsSortMenus: [
          { name: '名称' },
          { name: '日期' },
          { name: '大小' },
        ],
        actionsSortName: '名称',
        showNewFolder: false,
        showRename: false,
        newFolderName: '新建文件夹',
        Loop: null,
        isJustHideMenus: false,
        menus: [
          // { iconClass: 'menu-open', label: '打开', operation: 'open' },
          { iconClass: 'menu-select', label: '选择', operation: 'select' },
          { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
          { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
          { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
          { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
        ],
        rowContextData: {},
        selectRowData: [],
        checkboxGroup: [],
        newFolderLoading: false,
        renameLoading: false,
        renameFileName: '',
        selectIndexList: [],
        selectStatus: false,
        isShowCheckContext: false,
        overlayShow: false,
        overlayContentClass: {},
        vanNavBarClass: {},
        searchBarClass: {},
        leftMenuShow: false,
        searchValue: '',
        searchStatus: true,
        resultCount: 0,
        sortOrder: 'up',
        sortableProp: null,
        order: null,
        grid: false,
        vmode: 'list'
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
      showCheckContext(){
        return this.selectIndexList.includes(this.rowContextData.index)
      },
      // 长按事件
      rowContextmenu(row, target, touchClientX) {

        // 改变菜单
        if(this.selectStatus && this.selectIndexList.includes(row.index)){
          if(this.selectIndexList.includes(row.index)){
            const item = { iconClass: 'menu-unselect', label: '取消选择', operation: 'unselect' }
            this.menus.splice(0,1,item)
          }
        }else{
          const item = { iconClass: 'menu-select', label: '选择', operation: 'select' }
          this.menus.splice(0,1,item)
        }

        this.preliminaryRowData(row)
        // 长按选择的数据
        const offsetTop = target.offsetTop - row.scrollY
        const e = {}
        if ((offsetTop+(target.offsetHeight/2)) > document.body.offsetHeight/2) {
          e.pageX = touchClientX
          e.pageY = target.offsetTop - this.menus.length*47 + 5
        } else {
          e.pageX = touchClientX
          e.pageY = target.offsetTop + target.offsetHeight + 5
        }
        this.$refs.contextShow.showMenu(e)
      },
      // 选择某行预备数据
      preliminaryRowData(row) {
        this.rowContextData = row
        this.isShowCheckContext = this.selectIndexList.includes(row.index)
        const isFavorite = this.rowContextData.isFavorite
        this.highlightFavorite(isFavorite, false)
      },
      // 菜单操作
      menusOperations(operation) {
        const that = this
        switch (operation) {
          case 'favorite':
            console.log('operation', '收藏')
            this.favoriteOperating(true)
            break
          case 'open':
            console.log('open', '打开')
            this.fileClick(this.rowContextData)
            break
          case 'unselect':
            console.log('unselect', '取消选择')
            const index = this.rowContextData.index
            // this.selectIndexList.splice(this.selectIndexList.indexOf(index),1)

            console.log(this.selectIndexList)
            this.$refs.checkboxes[index].toggle();
            break
          case 'unFavorite':
            console.log('unFavorite', '取消收藏')
            this.favoriteOperating(false)
            break
          case 'select':
            // Notify({
            //   message: this.rowContextData.name,
            //   color: '#ad0000',
            //   background: '#ffe1e1',
            //   duration: 1000
            // });
            console.log('select', this.rowContextData)
            this.selectStatus = true
            this.selectIndexList.push(this.rowContextData.index)
            console.log(this.selectIndexList)
            setTimeout(function () {
              that.$refs.checkboxes[that.rowContextData.index].toggle();
            },0)
            break
          case 'rename':
            console.log('重命名')
            this.renameFileName = this.rowContextData.name
            this.showRename = true
            setTimeout(function () {
              that.$refs.renameInput.focus()
            },0)
            break
          case 'copy':
            console.log('移动或复制')
            Toast('暂不支持移动');
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
      // 重命名
      rowRename() {
        const row = this.rowContextData
        let newFileName = this.renameFileName
        if (newFileName) {
          if (!row.isFolder) {
            const ext = '.' + row.suffix
            if (!newFileName.endsWith(ext)) {
              newFileName += ext
            }
          }
          console.log('newFileName', newFileName)
          this.renameLoading = true
          const findIndex = this.fileList.findIndex(item => {
            if(newFileName === item.name){
              return item;
            }
          })
          if(findIndex > -1){
            let msg = '该文件已存在'
            if(row.isFolder){
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
              this.fileList[row.index] = row
              this.editingIndex = -1
            }
          })
        } else {
          this.editingIndex = -1
        }
      },
      // 下载
      downloadFile() {
        let totalSize = 0
        if(this.selectRowData.length > 0){
          this.selectRowData.forEach(item => {
            totalSize += item.size
          })
        }else{
          totalSize += this.rowContextData.size
        }
        if (totalSize > 0) {
          let fileIds = [];
          if (this.selectRowData.length > 0) {
            this.selectRowData.forEach(value => {
              fileIds.push(value.id)
            })
          } else {
            fileIds.push(this.rowContextData.id)
          }
          if(process.env.NODE_ENV !== 'development'){
            let host = window.location.host
            if(window.location.port.length > 0){
              host = window.location.host.substring(0,window.location.host.length - window.location.port.length - 1)
            }
            window.open(`http://${host}:10010/download?jmal-token=${this.$store.state.user.token}&fileIds=${fileIds}`,'_self')
          }else{
            window.open(process.env.VUE_APP_BASE_FILE_API + '/download?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds, '_self')
          }
        } else {
          this.$message({
            message: '所选文件夹为空',
            type: 'warning'
          });
        }
      },
      // 收藏/取消收藏
      favoriteOperating(isFavorite) {
        this.rowContextData.isFavorite = isFavorite

        this.highlightFavorite(isFavorite, true)
        api.favoriteUrl({
          token: this.$store.state.user.token,
          id: this.rowContextData.id,
          isFavorite: isFavorite
        }).then(res => {
        })
      },
      // 删除
      deleteFile() {
        let fileList = []
        const fileIds = []
        if (this.selectRowData.length > 0) {
          fileList = this.selectRowData
          this.selectRowData.forEach(value => {
            fileIds.push(value.id)
          })
        } else {
          fileList = this.selectRowData
          fileIds.push(this.rowContextData.id)
        }
        console.log(this.rowContextData)
        const str = this.getShowSumFileAndFolder(fileList)

        Dialog.confirm({
          title: '提示',
          message: '此操作将永久删除' + str + ', 是否继续?'
        }).then(() => {
          api.delete({
            username: this.$store.state.user.name,
            fileIds: fileIds
          }).then(() => {
            // 移除列表
            if (this.selectRowData.length === 1) {
              this.fileList.splice(this.rowContextData.index, 1)
            } else {
              this.getFileList()
            }
            Toast.setDefaultOptions({ duration: 500 });
            Toast.success('删除成功');
            this.$refs.fileListTable.clearSelection()// 删除后清空之前选择的数据
            this.selectRowData = []
          })
        })
      },
      touchMove() {
        // // 避免和长按事件冲突
        clearTimeout(this.Loop);
        // e.preventDefault();
      },
      touchStart(item){
        // e.preventDefault();
        // Toast.setDefaultOptions({ duration: 500 });
        //手指触摸
        clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
        const that = this
        const e = window.event
        this.Loop = setTimeout(function() {
          item.scrollY = e.targetTouches[0].pageY-e.targetTouches[0].clientY
          const touchClientX = e.targetTouches[0].clientX;
          console.log(e.targetTouches[0])
          that.findListItem(item,e.targetTouches[0].target,touchClientX)
          that.overlayShow = true
          document.documentElement.style.overflow='hidden';
        },500);
      },
      touchEnd(){
        //手指离开
        clearTimeout(this.Loop);
      },
      // 点击遮罩层
      overlayClick() {
        this.overlayShow = false
        document.documentElement.style.overflow = null;
      },
      findListItem(item,target,touchClientX){
        let background = this.selectIndexList.includes(this.rowContextData.index) ? '#90c2fcb5' : ''
        const offsetParent = target.offsetParent
        const parentElement = target.parentElement
        if(!offsetParent && parentElement){
          this.findListItem(item,target.parentElement,touchClientX)
        }else{
          if(offsetParent.className.indexOf('list-item') > -1){
            this.overlayContentClass = {
              'top': (offsetParent.offsetTop-item.scrollY)+'px',
              'height': offsetParent.offsetHeight+'px',
              'width': offsetParent.offsetWidth+'px',
              'left': offsetParent.offsetLeft+'px',
              'border-radius': '0px',
              'background': background
            }
            const that = this
            setTimeout(function () {
              that.overlayContentClass = {
                'top': (offsetParent.offsetTop-item.scrollY)+'px',
                'height': offsetParent.offsetHeight+'px',
                'width': (offsetParent.offsetWidth-20)+'px',
                'left': (offsetParent.offsetLeft+10)+'px',
                'border-radius': (offsetParent.offsetHeight/4)+'px',
                'background': background
              }
            },0)
            document.addEventListener('touchstart', function() {}, false);
            this.rowContextmenu(item,offsetParent,touchClientX)
            return offsetParent
          } else {
            this.findListItem(item,target.offsetParent,touchClientX)
          }
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
      //菜单键
      leftMenu(){
        console.log('菜单')
        this.leftMenuShow = true
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      },
      startSearch(){
        console.log('startSearch')
        // this.searchStatus = true
        this.vanNavBarClass = {
          visibility: 'hidden'
        }
        this.searchBarClass = {
          marginTop: '-30px'
        }
        let searchAction = document.querySelector('.van-search__action')
        searchAction.style.marginRight = '0px'
        searchAction.style.visibility = 'visible'
        searchAction.style.color = '#1989fa'
      },
      endSearch() {
        const that = this
        setTimeout(function () {
          that.vanNavBarClass = {
            visibility: 'visible'
          }
        },150)
        this.searchBarClass = {
          marginTop: '0px'
        }
        let searchAction = document.querySelector('.van-search__action')
        searchAction.style.marginRight = '-44px'
        searchAction.style.visibility = 'hidden'
        this.searchValue = ''
        this.getFileList()
      },
      onSearch(){
        console.log('onSearch')
        if(this.searchValue.length < 1){
          this.getFileList()
        }else{
          this.searchFile(this.searchValue)
        }
      },
      // 切换布局
      changeVmode(){
        this.grid = !this.grid
        this.vmode = 'list'
        if(this.grid){
          this.vmode = 'grid'
        }
        if(!this.path){
          this.path = ''
        }
        this.$router.push(`?vmode=${this.vmode}&path=${this.path}`)
      },
      showSortSheet() {
        this.actionSortSheetShow = true
      },
      // 更多操作
      moreOperations() {
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
            this.$router.push(`/_m?path=${encodeURIComponent(this.path)}`)
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
        this.beforeLoadData(onLoad)
        api.fileList({
          userId: this.$store.state.user.userId,
          currentDirectory: this.$route.query.path,
          queryFileType: this.queryFileType,
          sortableProp: this.sortableProp,
          order: this.order,
          isFolder: this.queryCondition.isFolder,
          isFavorite: this.queryCondition.isFavorite,
          queryCondition: this.queryCondition,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
        }).then(res => {
          this.loadData(res,onLoad)
        }).catch(e => {})
      },
      searchFile(key,onLoad) {
        if(key){
          this.beforeLoadData(onLoad)
          this.$router.push(`?vmode=${this.vmode}&search-file=${key}`)
          api.searchFile({
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            keyword: key,
            currentDirectory: this.$route.query.path,
            pageIndex: this.pagination.pageIndex,
            pageSize: this.pagination.pageSize
          }).then(res => {
            this.loadData(res,onLoad)
            this.path = ''
            this.listModeSearch = true
            this.listModeSearchOpenDir = false
          })
        }
      },
      // 请求之前的准备
      beforeLoadData(onLoad){
        if (onLoad) {
          this.pagination.pageIndex++
        } else {
          this.pagination.pageIndex = 1
        }
        this.finished = false;
      },
      // 填充数据
      loadData(res,onLoad){
        if(onLoad){
          res.data.forEach((file,number) => {
            file['index'] = (this.pagination.pageIndex - 1) * this.pagination.pageSize + number
            this.fileList.push(file)
          });
        }else{
          this.fileList = res.data
        }
        // 加载状态结束
        this.loading = false
        this.refreshing = false
        this.resultCount = res.count
        // 数据全部加载完成
        if (this.fileList.length >= res.count) {
          this.finished = true;
        }
        // 排序
        this.fileList.sort(this.compare(this.sortableProp))
      },
      clickFileType(queryFileType,queryCondition){
        console.log(queryCondition)
        this.queryCondition = queryCondition
        this.queryFileType = queryFileType
        this.getFileList()
        this.leftMenuShow = false
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
      // 全选或反选
      checkboxAll() {
        if(this.selectRowData.length !== this.fileList.length){
          this.$refs.checkboxGroup.toggleAll(true);
        }else{
          this.$refs.checkboxGroup.toggleAll();
        }
      },
      // 取消选择状态
      cancelSelect() {
        this.$refs.checkboxGroup.toggleAll(false)
        const that = this
        setTimeout(function () {
          that.selectStatus = false
        })
      },
      // 选择状态改变时触发
      checkboxChange(any) {
        this.selectRowData = any
        this.selectIndexList = []
        for (const item of any) {
          this.selectIndexList.push(item.index)
        }
        this.selectStatus = true
      },
      // 点击文件或文件夹
      fileClick(row,index) {
        if(this.selectStatus){
          this.$refs.checkboxes[index].toggle();
        }else{
          if (row.isFolder) {
            // 打开文件夹
            if(this.path){
              this.path += '/' + row.name
            } else {
              this.path = '/' + row.name
            }
            const itemFirst = {}
            itemFirst['folder'] = row.name
            itemFirst['index'] = this.pathList.length - 1
            const itemSecond = {}
            itemSecond['folder'] = '+'
            itemSecond['index'] = this.pathList.length
            this.pathList[this.pathList.length - 1] = itemFirst
            this.pathList.push(itemSecond)
            this.$router.push(`/_m?path=${encodeURIComponent(this.path)}`)
            setPath(this.path, this.pathList)
            this.getFileList()
          } else {
            if(row.contentType.includes('text')){
              // let routeData = this.$router.resolve({path: '/public/p',query: {mark: row.id}})
              // window.open(routeData.href, '_blank');
              this.$router.push(`/public/articles/article?mark=${row.id}`)
            }else{
              // 打开文件
              const fileIds = [row.id]
              const url = process.env.VUE_APP_BASE_FILE_API + 'preview/' + row.name + '?jmal-token=' + this.$store.state.user.token + '&fileIds=' + fileIds
              window.open(url, '_blank')
            }
          }
        }
      },
      onCancel() {
        this.actionSheetShow = false
        this.actionSortSheetShow = false
      },
      compare(property){
        return (a,b) => {
          let value1 = a[property]
          let value2 = b[property]
          if(this.order === 'ascending'){
            return value1 - value2
          }else{
            return value2 - value1
          }
        }
      },
      selectSortActionsMenus(action) {
        const that = this
        setTimeout(function () {
          that.actionSortSheetShow = false
        },100)
        if(this.sortOrder === 'up'){
          this.sortOrder = 'down'
          this.order = 'descending'
        }else{
          this.sortOrder = 'up'
          this.order = 'ascending'
        }
        this.actionsSortName = action.name
        if(action.name === '名称'){
          this.sortableProp = 'name'
          if(this.sortOrder === 'up'){
            this.order = null
          }
          this.getFileList()
        }
        if(action.name === '大小'){
          this.sortableProp = 'size'
          this.fileList.sort(this.compare(this.sortableProp))
        }
        if(action.name === '日期'){
          this.sortableProp = 'updateDate'
          this.getFileList()
          // this.fileList.sort(this.compare('agoTime'))
        }
      },
      // 选择上传文件菜单
      selectActionsMenus(action) {
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
              Notify({ type: 'success', message: '新建文件夹成功', duration: 1000 });
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

  /deep/.van-sticky {
    background: inherit;
    -webkit-backdrop-filter: saturate(180%) blur(10px);
    backdrop-filter: saturate(180%) blur(10px);
    background-color: rgba(255,255,255,0.72);
    box-shadow: 2px 0 2px rgba(0, 0, 0, 0.25);
  }

  [class*=van-hairline]::after {
    border: 0 solid rgba(255,255,255,0.72);
  }

  /deep/ .van-sticky--fixed {
    z-index: 1;
  }

  .van-nav-bar {
    /*height: 59px;*/
    /*line-height: 59px;*/
    background-color: unset;
    -webkit-transition: all .15s ease-in-out 0s;
    transition: all .15s ease-in-out 0s;
    /*position: relative;*/
    /*box-shadow: 4px 0 2px rgba(0,0,0,0.5);*/
  }
  .van-nav-bar::after{
    /*background: inherit;*/
    /*!*-webkit-filter: blur(15px);*!*/
    /*!*filter: blur(20px);*!*/
    /*-webkit-backdrop-filter: saturate(180%) blur(20px);*/
    /*backdrop-filter: saturate(180%) blur(20px);*/
    /*background-color: rgba(255,255,255,0.72);*/
  }

  .van-overlay {
    -webkit-backdrop-filter: saturate(180%) blur(1.5px);
    backdrop-filter: saturate(180%) blur(1.5px);
    background-color: rgba(0,0,0,.7);
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
    .van-icon-arrow-left {
      font-size: 24px;
    }
  }
  /*.van-nav-bar__left:active {*/
    /*background-color: #f8f8f8;*/
    /*!*background-color: hsl(0, 94%, 47%);*!*/
  /*}*/
  .van-nav-bar__right {
    z-index: 11;
  }
  .van-nav-bar__arrow+.van-nav-bar__text {
    max-width: 7.5rem;
    min-width: 5.5rem;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
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
  .newFileMenu {
    color: #000000db;
    background-color: #efefef;
    padding: 1px 0;
  }
  /deep/.menu-background::after{
    background: inherit;
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    background-color: rgba(255,255,255,0.72);
  }
  .newFileMenu li {
    cursor: pointer;
    margin: 0;
    padding: 0;
    font-size: 1em;
    min-width: 136px;
    height: 3em;
  }

  .newFileMenu .remove {
    color: rgba(255, 0, 0, 0.8);
  }

  .newFileMenu .menu-list-first li:active {
    border-top-left-radius:1rem;
    border-top-right-radius:1rem;
    background-color: #E1E1E1;
  }
  .newFileMenu .menu-list li:active {
    background-color: #E1E1E1;
  }
  .newFileMenu .menu-list-last li:active {
    border-bottom-right-radius:1rem;
    border-bottom-left-radius:1rem;
    background-color: #E1E1E1;
  }

  /*.newFileMenu li:active {*/
  /*cursor: pointer;*/
  /*border-radius: 1rem;*/
  /*background-color: #cccccc;*/
  /*}*/

  .newFileMenu li .menuitem {
    cursor: pointer;
    line-height: 3em;;
    margin-left: 10%;
  }
  .newFileMenu li .menuitem .text {
    cursor: pointer;
    margin-left: 10%;
    font-weight: normal;
  }
  .newFileMenu li .menuitem .svg-icon {
    width: 1rem;
    height: 1rem;
  }
  /deep/ .ctx-menu-container {
    top: unset;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 1rem;
    -webkit-box-shadow: 0 0 0 #ccc;
    box-shadow: 0 0 0 #ccc;
  }
  .header-button {
    margin: 0 -16px;
    padding: 0 16px;
  }
  .header-button-icon {
    width: 1.5rem;
    height: 1.5rem;
    vertical-align: middle;
  }
  .header-button:active {
    background-color: #f2f3f5;
  }
  .left-menu {
    padding: 1rem 0 0 0;
    height: 100%;
    width: 100%;
    text-align: center;
  }
  .logout {
    padding: 1rem 0 0 0;
  }
  .classification {
    padding: 1rem 0 0 0;
    /deep/.van-cell:active {
      background-color: #f8f8f8;
    }
  }
  .searchbar{
    height: 48px;
    background-color: unset;
    -webkit-transition: all .3s ease-in-out 0s;
    transition: all .3s ease-in-out 0s;
    /*background: inherit;*/
    /*background-color: #fff;*/
    /*-webkit-backdrop-filter: saturate(180%) blur(20px);*/
    /*backdrop-filter: saturate(180%) blur(20px);*/
    /*background-color: rgba(255,255,255,0.72);*/
  }
  /*.searchbar::after{*/
    /*background: inherit;*/
    /*background-color: #fff;*/
    /*-webkit-backdrop-filter: saturate(180%) blur(20px);*/
    /*backdrop-filter: saturate(180%) blur(20px);*/
    /*background-color: rgba(255,255,255,0.72);*/
  /*}*/
  .van-search {
    padding:0 12px;
  }
  .van-search__action {
    -webkit-transition: all .3s ease-in-out 0s;
    transition: all .3s ease-in-out 0s;
    margin-right: -44px;
    visibility: hidden;
  }
  .search-result {
    font-weight: 600;
    font-size: 20px;
  }
  .search-result-no {
    height: 80px;
    line-height: 80px;
    font-weight: 600;
    font-size: 20px;
    text-align: center;
  }
  .operating-header {
    .operating-header-col {
      height: 28px;
      color: #1989fa;
      .sortable {
        font-size: 14px!important;
      }
      .van-icon{
        line-height: 28px;
        font-size: 20px;
        color: #1989fa;
      }
    }
    .operating-header-col:active {
      color: #C2CCD1;
      .van-icon{
        color: #C2CCD1;
      }
    }
  }

  /deep/ .grid-item-text {
    text-align: center;
    color: #606266;
    font-size: smaller;
    word-wrap: break-word;
    width: -webkit-fill-available;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
