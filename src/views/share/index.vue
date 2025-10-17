<template>
  <div class="container">
    <share-dialog :file.sync="shareDialogObject" :status.sync="shareDialogVisible" @onUpdateExpireData="onUpdateExpireData" @onUpdateShareForm="onUpdateShareForm" @onCancelShare="onCancelShare"></share-dialog>
    <!--list布局-->
    <div v-show="fileList.length > 0" :style="{'width':'100%','height': clientHeight+'px'}">
    <pl-table
      ref="fileListTable"
      v-loading="tableLoading"
      :max-height="clientHeight"
      :default-sort="sortable"
      :highlight-current-row="false"
      empty-text="无文件"
      :use-virtual="false"
      :row-height="50"
      :border="false"
      :excess-rows="3"
      style="width: 100%;margin: 20px 0 0 0;"
      :height-change="false"
      :row-class-name="tableRowClassName"
      element-loading-text="文件加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#f6f7fa88"
      @selection-change="handleSelectionChange"
      @cell-click="cellClick"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @sort-change="sortChange"
      @table-body-scroll="tableBodyScroll"
    >
      <template v-for="(item,index) in tableHead">
        <!--索引-->
        <pl-table-column
          v-if="index === 0"
          :key="index"
          :index="index"
          type="selection"
          width="50"
        >
        </pl-table-column>
        <!--图标-->
        <pl-table-column
          v-if="index === 1"
          :prop="item.name"
          :label="item.label"
          :key="index"
          :index="index"
          width="60"
          header-align="right"
        >
          <template slot="header">
            <div v-if="item.label !== ''">
              <span class="header-font">{{item.label}}</span>
            </div>
          </template>
          <template slot-scope="scope">
            <icon-file :item="scope.row" :image-url="imageUrl" :audio-cover-url="audioCoverUrl"></icon-file>
          </template>
        </pl-table-column>
        <!--名称-->
        <pl-table-column
          v-if="index === 2"
          :key="index"
          :show-overflow-tooltip="true"
          :index="index"
          :prop="item.name"
          :label="item.label"
          :sort-orders="['ascending', 'descending']"
          :sortable="item.sortable"
          header-align="left"
        >
          <template slot="header">
            <div v-if="item.label === ''" class="cancel-share-header">
              <span class="header-font">{{sumFileAndFolder}}</span><el-button round size="small" @click="cancelShare(false)"><svg-icon style="font-size: 12px" icon-class="cancel-share"/> 取消分享</el-button>
            </div>
          </template>
          <template slot-scope="scope">
            <span class="table-file-name">{{ scope.row.fileName }}</span>
            <span v-if="scope.row.fatherShareId" style="color: #9a9a9a">(子分享)</span>
          </template>
        </pl-table-column>
        <!-- 分享链接 -->
        <pl-table-column
          v-if="index === 3"
          :key="index"
          :label="item.label"
          :index="index"
          :show-overflow-tooltip="true"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-link :underline="false" class="copy-link-btn" :data-clipboard-text="shareLink(scope.row.id, scope.row.shortId)" @click="copyShareLink(scope.row)">{{ shareLink(scope.row.id, scope.row.shortId) }}</el-link>
          </template>
        </pl-table-column>
        <!--取消分享-->
        <pl-table-column v-if="index === 5" :key="index" width="50" :index="index" align="center" header-align="center" tooltip-effect="dark">
          <template slot-scope="scope">
              <svg-icon v-if="scope.row.index === cellMouseIndex" class="button-class" icon-class="cancel-share" @click="cancelShare(scope.row)"/>
          </template>
        </pl-table-column>
        <!--创建时间-->
        <pl-table-column
          v-if="index === 6"
          :key="index"
          width="180"
          :prop="item.name"
          :index="index"
          :label="item.label"
          :sort-orders="['ascending', 'descending']"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </pl-table-column>
        <!--分享形式-->
        <pl-table-column
          v-if="index === 7"
          :key="index"
          width="100"
          :prop="item.name"
          :label="item.label"
          :index="index"
          :sort-orders="['ascending', 'descending']"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.isPrivacy ? '私密':'公开'}}</span>
          </template>
        </pl-table-column>
        <!--过期时间-->
        <pl-table-column
          v-if="index === 8"
          :key="index"
          width="180"
          :prop="item.name"
          :label="item.label"
          :index="index"
          :sort-orders="['ascending', 'descending']"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
          align="left"
          header-align="left"
        >
          <template slot-scope="scope">
            <span :style="{color: expireColor(scope.row)}">{{expireInfo(scope.row)}}</span>
          </template>
        </pl-table-column>
      </template>
    </pl-table>
    </div>
    <empty-file
      v-if="fileList.length < 1 && !tableLoading"
      emptyStatus="还没有分享历史哦~"
      :emptyShare="true"
    >
    </empty-file>
  </div>
</template>

<script>
  import ShowFile from "@/components/ShowFile/ShowFile";
  import EmptyFile from "@/components/EmptyFile";
  import IconFile from "@/components/Icon/IconFile";
  import ShareDialog from "@/components/ShareDialog/index.vue";
  import api from '@/api/file-api';
  import Clipboard from "clipboard";
  export default {
    components: { ShowFile, EmptyFile, IconFile, ShareDialog},
    props: {
      emptyStatus: {
        'type': String,
        'default': '空空如也~',
      },
      singleFileType: {
        'type': String,
        'default': '',
      },
      showNavigation: {
        'type': Boolean,
        'default': true,
      },
      queryFileType: {
        'type': String,
        'default': null
      },
      defaultGrid: {
        'type': Boolean,
        'default': true
      },
      orderCustom: {
        'type': Boolean,
        'default': true
      },
      sortable: {
        'type': Object,
        'default': function () {
          return { prop: 'createDate', order: 'descending'}
        }
      },
      queryCondition: {
        'type': Object,
        'default': function () {
          return {isFolder:null}
        }
      },
    },
    data() {
      return {
        imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?id=`,
        audioCoverUrl: `${process.env.VUE_APP_BASE_API}/view/cover?id=`,
        path: this.$route.query.path,
        pathList: [
          { 'folder': '', index: 0 },
          { 'folder': '+', index: 1 }
        ],
        fileList: [],
        pagination: {
          pageIndex: 1,
          pageSize: 20,
          total: 0,
          pageSizes: [10,20,30,40,50]
        },
        indexList: [],
        clientHeight: 500,
        // 表头数据
        tableHead: [
          {
            name: '', label: '', index: 0
          },
          {
            name: 'icon', label: '', index: 1
          },
          {
            name: 'fileName', label: '分享文件', sortable: 'custom', index: 2
          },
          {
            name: 'shareLink', label: '分享链接', index: 3
          },
          {
            name: '', label: '', index: 4
          },
          {
            name: '', label: '', more: true, index: 5
          },
          {
            name: 'createDate', label: '链接创建时间', sortable: 'custom', index: 6
          },
          {
            name: 'isPrivacy', label: '分享形式', sortable: 'custom', index: 7
          },
          {
            name: 'expireDate', label: '过期时间', sortable: 'custom', index: 8
          }
        ],
        selectRowData: [],
        tableLoading: false,
        finished: false,
        cellMouseIndex: -1,
        shareDialog: false,
        sumFileAndFolder: '',
        shareDialogVisible: false,
        shareDialogObject: {},
      }
    },
    computed: {
      shareLink() {
        return (shareId, shortId) => {
          if (!shortId) {
            shortId = shareId
          }
          return `${window.location.origin}/s/${shortId}`
        }
      }
    },
    methods: {
      expireInfo(row) {
        if (row.expireDate) {
          let currentTime = new Date();
          let targetTime = new Date(row.expireDate);
          if (currentTime > targetTime) {
            return '已过期'
          } else {
            return row.expireDate
          }
        } else {
          return '永久有效'
        }
      },
      expireColor(row) {
        if (row.expireDate) {
          let currentTime = new Date();
          let targetTime = new Date(row.expireDate);
          if (currentTime > targetTime) {
            return '#F56C6C'
          } else {
            return 'var(--text-color)'
          }
        }
      },
      // 请求之前的准备
      beforeLoadData(onLoad){
        if (onLoad) {
          this.pagination.pageIndex++
        } else {
          this.pagination.pageIndex = 1
        }
        this.tableLoading = true
        this.finished = false
      },
      getFileList(onLoad) {
        this.beforeLoadData(onLoad)
        api.sharelist({
          userId: this.$store.state.user.userId,
          sortableProp: this.sortable.prop,
          order: this.sortable.order,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize
        }).then(res => {
          if(onLoad){
            res.data.forEach((file,number) => {
              file['index'] = (this.pagination.pageIndex - 1) * this.pagination.pageSize + number
              this.fileList.push(file)
            });
          }else{
            this.fileList = res.data
            this.fileList.map((item,index) => {
              item.index = index
            })
            this.$refs.fileListTable.reloadData(this.fileList)
          }
          // 数据全部加载完成
          if (this.fileList.length >= res.count) {
            this.finished = true;
          }
          this.tableLoading = false
          this.clientHeight = document.documentElement.clientHeight - 80
          this.pagination['total'] = res.count
          this.$nextTick(()=>{
            this.tableLoading = false
          })
        }).catch(e => {})
      },
      tableBodyScroll(table, e) {
        this.fileListScrollTop = e.target.scrollTop
        let scrollBottom = e.target.scrollHeight-e.target.clientHeight-e.target.scrollTop;
        if(scrollBottom < 200){
          if(!this.finished){
            this.getFileList(true)
          }
        }
      },
      sortChange(column) {
        this.sortable.prop = column.prop
        this.sortable.order = column.order
        this.pagination.pageIndex = 1
        this.getFileList();
      },
      // 收集选中的index值作为数组 传递给rowRed判断变换样式
      handleSelectionChange(row) {
        // 选中的值
        this.selectRowData = row
        let selectTotalSize = 0
        this.indexList = []
        for (const item of row) {
          selectTotalSize += item.size
          this.indexList.push(item.index)
        }
        row.forEach(r => {
          this.$refs.fileListTable.toggleRowSelection(r,true)
        });
        const itemIcon = this.tableHead[1]
        const itemName = this.tableHead[2]
        const itemShareLink = this.tableHead[3]
        const itemDate1 = this.tableHead[6]
        const itemIsPrivacy = this.tableHead[7]
        const itemDate = this.tableHead[8]
        if (this.selectRowData.length > 0) {
          this.sumFileAndFolder = this.getShowSumFileAndFolder(row)
          itemIcon.label = '已选中'
          itemName.label = ''
          itemName.sortable = false
          itemShareLink.label = ''
          itemDate1.label = ''
          itemDate1.sortable = false
          itemDate.label = ''
          itemDate.sortable = false
          itemIsPrivacy.label = ''
          itemIsPrivacy.sortable = false
        } else {
          itemIcon.label = ''
          itemName.label = '分享文件'
          itemName.sortable = 'custom'
          itemShareLink.label = '分享链接'
          itemDate1.label = '时间'
          itemDate1.sortable = 'custom'
          itemDate.label = '过期时间'
          itemDate.sortable = 'custom'
          itemIsPrivacy.label = '分享形式'
          itemIsPrivacy.sortable = 'custom'
        }
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
      // cell-style 通过返回值可以实现样式变换利用传递过来的数组index循环改变样式
      rowRed({ row, column, rowIndex, columnIndex }) {
        // if (this.indexList.length < 1 && columnIndex === 2 && this.cellMouseIndex === rowIndex) {
        //   return { cursor: 'pointer', color: "#19ACF9" }
        // }
        for (let i = 0; i < this.indexList.length; i++) {
          if (rowIndex === this.indexList[i]) {
            return { backgroundColor: '#000', color: '#b7b5b6', cursor: 'default' }
          }
        }
      },
      // 动态添加index到row里面去
      tableRowClassName({ row, rowIndex }) {
        row.index = rowIndex
      },
      // 单元格hover进入时时间
      cellMouseEnter(row) {
        if (this.indexList.length < 1) {
          this.cellMouseIndex = row.index
        }
      },
      // 单元格hover退出时时间
      cellMouseLeave() {
        this.cellMouseIndex = -1
      },
      // 单元格点击事件
      cellClick(row, column) {
        clearTimeout(this.Loop);
        const columnIndex = column.index
        if (columnIndex === 0) {
          // 点击选中
          this.$refs.fileListTable.toggleRowSelection(row)
        }
        if (columnIndex === 2) {
          if (this.indexList.length < 1) {
            this.fileClick(row)
          }
        }
        if (this.indexList.length > 0 && columnIndex > 0) {
          this.$refs.fileListTable.toggleRowSelection(row)
        }
      },
      // 取消分享
      cancelShare(row) {

        let shareIds = []
        if(row){
          shareIds.push(row.id)
        } else {
          this.selectRowData.forEach(row => {
            shareIds.push(row.id)
          })
        }

        api.hasSubShare({shareIds: shareIds}).then(res => {
          if (res.data) {
            this.$confirm('所选的文件夹下存其他分享，取消分享后其下的所有分享链接都将被删除，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doCancelShare(shareIds)
            })
          } else {
            let title = row === false ? '确定要取消选中的' + this.selectRowData.length + '项分享吗？' : '确定要取消分享 "' + row.fileName + '" 吗?'
            this.$confirm(title, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doCancelShare(shareIds)
            })
          }
        })
      },
      doCancelShare(shareIds) {
        api.cancelShareLink({
          userId: this.$store.state.user.userId,
          shareId: shareIds
        }).then(() => {
          if(shareIds.length === 1){
            // 如果是单个取消分享
            const index = this.fileList.findIndex(item => item.id === shareIds[0])
            if (index > -1) {
              this.fileList.splice(index, 1)
            }
          }else{
            this.getFileList()
          }
        })
      },
      onCancelShare() {
        this.getFileList()
      },
      // 点击文件或文件夹
      fileClick(row) {
        this.shareDialogObject = row
        this.shareDialogObject.name = row.fileName
        this.shareDialogObject.shareId = row.id
        this.shareDialogVisible = true
      },
      onUpdateExpireData(shareId, expireDate) {
        let index = this.fileList.findIndex(item => item.id === shareId)
        let share = this.fileList[index]
        share.expireDate = expireDate
        this.fileList.splice(index, 1, share)
      },
      onUpdateShareForm(shareId, isPrivacy) {
        let index = this.fileList.findIndex(item => item.id === shareId)
        let share = this.fileList[index]
        share.isPrivacy = isPrivacy
        this.fileList.splice(index, 1, share)
      },
      copyShareLink(row) {
        let clipboard = new Clipboard('.copy-link-btn')
        clipboard.on('success', e => {
          this.$message({
            message: '链接复制成功',
            type: 'success',
            duration: 3000
          });
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.$message({
            message: '该浏览器不支持自动复制',
            type: 'warning',
            duration: 1000
          });
          clipboard.destroy()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import 'src/styles/index';
@import 'src/styles/home-index';
  .container {
    min-width: 1024px;
  }
  .cancel-share-header {
    margin-left: -10px;
  }
  .table-header-icon {
    font-size: 18px;
  }
  .header-font {
    color: var(--text-color);
    font-size: 14px;
    font-weight: 500;
  }
  >>>.el-icon-my-export{
    background: url('~@/assets/img/cancel-share.png') center no-repeat;
    background-size: cover;
  }
  >>>.el-icon-my-export:before{
    content: "替";
    font-size: 16px;
    visibility: hidden;
  }
  //如果直接使用字体图片
  //直接在before属性设置对应的content就行
  >>>.el-icon-my-export{
    font-size: 16px;
  }
  >>>.el-icon-my-export:before{
    content: "\66ff";
    font-size: 16px;
    visibility: hidden;
  }
  >>>.plTableBox .el-table .el-table__header th {
    background-color: var(--bg-color);
    color: var(--text-color);
  }
  >>>.el-table td,>>>.el-table th.is-leaf {
    border-bottom: 1px solid var(--table-td-border-color);
  }
  >>>.el-table td {
    height: 50px!important;
  }
  .copy-link-btn,.table-file-name {
    cursor: pointer;
    &:hover {
      color: #409EFF;
    }
  }
>>> .el-table__body tr:hover > td {
  background-color: var(--table-tr-hover-color);
}
</style>

