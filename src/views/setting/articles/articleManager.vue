<template>
  <div>
    <el-dialog
      :title="title"
      :fullscreen="true"
      :visible.sync="newArticleDialogVisible"
      :before-close="handleClose"
      :destroy-on-close="true"
      @open="openDialog"
      @close="closeDialog"
    >
      <markdown-editor ref="editor" :has-change.sync="hasChange" :alone-page="alonePage" :site-url="siteUrl" :is-edit="isEdit" @onTitle="onTitle" @onRelease="onRelease"></markdown-editor>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>{{ alonePage ? '管理独立页面':'管理文章' }}</span>
            <el-button class="card-button" size="mini" type="primary" @click="newArticle">{{newArticleText}}</el-button>
          </div>
          <div class="card-header-right" v-show="this.multipleSelection.length > 0">
            <el-button size="small" type="danger" @click="handleDelete()">删除</el-button>
          </div>
        </div>
      </div>
      <div>
        <div class="table-top">
          <el-row>
            <el-col :xs="24" :sm="5">
              <div class="query-item">
                <el-badge :hidden="draftNums === 0" :value="draftNums" type="primary">
                  <el-radio-group v-model="query.radioStatus" size="mini" @change="getArticleList">
                    <el-radio-button label="">可用</el-radio-button>
                    <el-radio-button v-if="!alonePage" label="release">已发布</el-radio-button>
                    <el-radio-button label="draft">草稿</el-radio-button>
                  </el-radio-group>
                </el-badge>
              </div>
            </el-col>
            <el-col :xs="24" :sm="5">
              <div class="query-item">
                <span class="table-top-author">作者:</span>
                <el-radio-group v-model="query.radioUser" size="mini" @change="getArticleList">
                  <el-radio-button label="all">所有</el-radio-button>
                  <el-radio-button label="my">我的</el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
            <el-col :xs="24" :sm="14" class="text-align-right">
              <el-button v-if="isFilter" type="text" size="mini" @click="cancelFilter">取消筛选</el-button>
              <el-input
                  v-model="query.keyword"
                  style="width:unset;"
                  class="query-item"
                  clearable
                  size="mini"
                  placeholder="请输入关键字"
                  @keyup.enter.native="getArticleList">
              </el-input>
              <multiple-tree-select
                  ref="selectTree"
                  class="query-item"
                  placeholder="请选择分类"
                  size="mini"
                  collapse-tags
                  :options="categories"
                  v-model="categoryIdsList"
              >
              </multiple-tree-select>
              <el-button type="primary" size="mini" @click="theFilter">筛选</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="articleList"
          :max-height="tableMaxHeight"
          :class="{'el-table-alone-page': alonePage}"
          row-key="id"
          size="medium"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            :show-overflow-tooltip="true"
            min-width="200"
            label="标题">
            <template slot-scope="scope">
                <a :title="'编辑 '+scope.row.name" @click="editArticle(scope.row.id)">{{scope.row.name}}<svg-icon icon-class="bianji-"></svg-icon></a>
                <a :title="'浏览 '+scope.row.name" :href="(alonePage?siteUrl+'/o/':siteUrl+'/s/')+scope.row.slug" target="_blank"><svg-icon class="wailian" icon-class="wailian"></svg-icon></a>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!alonePage"
            min-width="100"
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.draft" size="medium" type="warning">草稿</el-tag>
              <el-tag v-if="scope.row.release" size="medium" type="success">已发布</el-tag>
              <el-tag v-if="!scope.row.release" size="medium" type="info">未发布</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="alonePage"
            prop="slug"
            label="缩略名">
          </el-table-column>
          <el-table-column
            prop="username"
            label="作者">
            <template slot-scope="scope">
              <a v-if="!alonePage" @click="theFilterUserId(scope.row.userId)">{{scope.row.username}}</a>
              <span v-if="alonePage">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!alonePage"
            prop="categories"
            label="分类">
            <template slot-scope="scope">
            <span v-for="(category,i) in scope.row.categories">
              {{i>0?',':''}}
              <a @click="theFilterCategoty(category.id)">{{category.name}}</a>
            </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateDate"
            label="发布日期"
            width="160">
            <template slot-scope="scope">
              <span>{{scope.row.uploadDate.substring(0, 16)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        style="text-align: center"
        background
        :hide-on-single-page="true"
        :current-page.sync="pagination.pageIndex"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="currentChange"
        layout="total, prev, pager, next">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import MarkdownEditor from '@/views/markdown/index'
import markdownApi from "@/api/markdown-api";
import categoryApi from "@/api/category";
import api from "@/api/file-api";
import {getSetting} from '@/api/setting-api'
import MultipleTreeSelect from "@/components/select/MultipleTree";
export default {
  name: 'articleManager',
  components: {
    MultipleTreeSelect,
    MarkdownEditor
  },
  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    alonePage: {
      type: Boolean,
      default: false
    },
    newArticleText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableMaxHeight: document.documentElement.clientHeight,
      newArticleDialogVisible: false,
      title: this.pageTitle,
      hasChange: false,
      articleList: [],
      pagination: {
        pageIndex: this.$route.query.page ? parseInt(decodeURI(this.$route.query.page)) : 1,
        pageSize: 12,
        total: 0,
      },
      categories: [],
      categoryIdsList: [],
      isFilter: false,
      query: {
        radioStatus: '',
        radioUser: 'my',
        userId: undefined,
        keyword: undefined,
        categoryIds: undefined
      },
      draftNums: 0,
      multipleSelection: [],
      siteUrl: `${window.location.origin}/articles`,
      isEdit: false,
    }
  },
  computed: {},
  created(){
    if(this.$route.query.keyword){
      this.query.keyword = this.$route.query.keyword
      this.isFilter = true
    }
    if(this.$route.query.categoryIds){
      this.query.categoryIds = this.$route.query.categoryIds
      this.isFilter = true
    }
  },
  mounted() {
    this.getArticleList()
    this.categoryTree()
    this.getWebsiteSetting()
    this.newArticleDialogVisible = !!this.$route.query.operation
    // 监听返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))

    if(this.alonePage){
      // 阻止默认行为
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.rowDrop()
    }
    this.setMaxHeight()
    let that = this
    window.onresize = function (){
      that.setMaxHeight()
    }
  },
  watch: {
    hasChange(val){
      if(val){
        window.onbeforeunload = function() {
          return "还有文件正在上传, 确定退出吗?"
        }
      }else {
        window.onbeforeunload = null
      }
    }
  },
  methods: {
    setMaxHeight(){
      this.tableMaxHeight = document.documentElement.clientHeight - 265
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.articleList.splice(oldIndex, 1)[0]
          _this.articleList.splice(newIndex, 0, currRow)

          let fileIdList = []
          _this.articleList.forEach(article => {
            fileIdList.push(article.id)
          })
          // 修改排序
          markdownApi.sortMarkdown(fileIdList).then(()=>{

          }).catch(() => {

          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete() {
      let fileIds = []
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(value => {
          fileIds.push(value.id)
        })
      }
      this.$confirm('此操作将永久删除选中的文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delete({
          currentDirectory: '',
          username: this.$store.state.user.name,
          fileIds: fileIds
        }).then(() => {
          // 移除列表
          this.getArticleList()
        }).then(() => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 1000
          })
        })
      })
    },
    beforeunloadFn(){
      return '确定要退出吗？'
    },
    goBack() {
      const operation = this.$route.query.operation
      this.newArticleDialogVisible = !!operation;
    },
    // 获取网站设置
    getWebsiteSetting() {
      getSetting({userId: this.$store.state.user.userId}).then((res) => {
        if(res.data) {
          this.siteUrl = res.data.siteUrl
        }
      })
    },
    // 取消筛选
    cancelFilter() {
      this.query.userId = ''
      this.query.keyword = ''
      this.categoryIdsList = []
      this.theFilter()
    },
    // 筛选
    theFilter() {
      this.query.categoryIds = ''
      if(this.categoryIdsList.length > 0){
        this.categoryIdsList.forEach(categoryId => {
          this.query.categoryIds += categoryId + ','
        })
        this.query.categoryIds = this.query.categoryIds.substring(0, this.query.categoryIds.length - 1)
      }
      this.getArticleList()
    },
    theFilterUserId(userId) {
      this.query.userId = userId
      this.theFilter()
    },
    theFilterCategoty(categoryId) {
      this.categoryIdsList = [categoryId]
      this.theFilter()
    },
    // 查询条件
    filterQuery(){
      this.isFilter = false
      if(!this.query.keyword || this.query.keyword.length === 0){
        this.query.keyword = undefined
      } else {
        this.isFilter = true
      }
      if(!this.query.categoryIds || this.query.categoryIds.length === 0){
        this.query.categoryIds = undefined
      } else {
        this.isFilter = true
      }
      if(!this.query.userId || this.query.userId.length === 0){
        this.query.userId = undefined
      } else {
        this.isFilter = true
      }
      if(!this.$route.query.operation){
        this.$router.push({query: {uid: this.query.userId, keyword: this.query.keyword, categoryIds: this.query.categoryIds}})
      }
    },
    getArticleList() {
      this.filterQuery()
      markdownApi.getMarkdown({
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        userId: this.query.radioUser === 'my' ? this.$store.state.user.userId : this.query.userId ? this.query.userId : null,
        isRelease: this.query.radioStatus === 'release',
        isDraft: this.query.radioStatus === 'draft',
        isAlonePage: this.alonePage,
        keyword: this.query.keyword,
        categoryIds: this.query.categoryIds
      }).then((res) => {
        this.articleList = res.data
        this.pagination.total = res.count
        this.$nextTick(() => {
          this.isLoading = false
        })
      })
      markdownApi.getMarkdown({
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        isAlonePage: this.alonePage,
        isDraft: true
      }).then((res) => {
        this.draftNums = res.count
      })
    },
    currentChange() {
      this.$router.push({query: {page : this.pagination.pageIndex}})
      this.getArticleList()
    },
    newArticle() {
      this.newArticleDialogVisible = true
      this.$router.push({query: {operation: 'new'}})
      this.isEdit = false
    },
    editArticle(id) {
      this.isEdit = true
      this.newArticleDialogVisible = true
      this.$router.push({query: {operation: 'editor', id: id}})
      if(this.$refs.editor){
        this.$refs.editor.reload()
      }
    },
    categoryTree() {
      categoryApi.categoryTree().then(res => {
        this.categories = res.data
        if(this.$route.query.categoryIds){
          this.query.categoryIds = this.$route.query.categoryIds
          this.categoryIdsList = this.query.categoryIds.split(",")
        }
      })
    },
    handleClose(done) {
      if(this.hasChange){
        this.$confirm('还有未保存的内容，确定要离开吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
        return
      }
      done()
    },
    onTitle(val){
      const operation = this.$route.query.operation
      if(operation === 'new'){
        this.title = '撰写新文章 ' + val
        if(this.alonePage){
          this.title = '创建新页面 ' + val
        }
        this.isEdit = false
      }
      if(operation === 'editor'){
        this.title = '编辑：' + val
        this.isEdit = true
      }
    },
    openDialog() {
      this.title = '撰写新文章'
      if(this.alonePage){
        this.title = '创建新页面'
      }
    },
    onRelease() {
      this.newArticleDialogVisible = false
      this.closeDialog()
    },
    closeDialog(){
      this.title = this.pageTitle
      this.$router.replace({path: this.$route.path})
      window.onbeforeunload = null
      this.hasChange = false
      this.getArticleList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/setting";
.table-top-author {
  margin-left: 15px;
}
.wailian {
  margin-left: 8px;
}
>>> .el-dialog {
  max-width: 100vw !important;
}
>>> .el-dialog__body {
  padding: 0 15px;
}
>>> .el-table-alone-page {
  tbody .el-table__row:hover {
    cursor: move;
  }
}
>>>.el-pagination{
  padding: 15px 5px 0;
}
</style>
