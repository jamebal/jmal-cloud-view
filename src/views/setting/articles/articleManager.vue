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
      <markdown-editor ref="editor" :has-change.sync="hasChange" :alone-page="alonePage" @onTitle="onTitle" @onRelease="onRelease"></markdown-editor>
    </el-dialog>
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>{{ alonePage ? '管理独立页面':'管理文章' }}</span>
            <el-button class="card-button" size="mini" type="primary" @click="newArticle">新建</el-button>
          </div>
          <div class="card-header-right" v-show="this.multipleSelection.length > 0">
            <el-button size="small" type="danger" @click="handleDelete()">删除</el-button>
          </div>
        </div>
      </div>
      <div>
        <div class="table-top">
          <div class="table-top-left">
            <el-badge :hidden="draftNums === 0" :value="draftNums" class="item" type="primary">
              <el-radio-group v-model="query.radioStatus" size="mini" @change="getArticleList">
                <el-radio-button label="">可用</el-radio-button>
                <el-radio-button v-if="!alonePage" label="release">已发布</el-radio-button>
                <el-radio-button label="draft">草稿</el-radio-button>
              </el-radio-group>
            </el-badge>
            <span class="table-top-author">作者:</span>
            <el-radio-group v-model="query.radioUser" size="mini" @change="getArticleList">
              <el-radio-button label="all">所有</el-radio-button>
              <el-radio-button label="my">我的</el-radio-button>
            </el-radio-group>
          </div>
          <div class="table-top-right">
            <el-button v-if="isFilter" type="text" size="mini" @click="cancelFilter">取消筛选</el-button>
            <el-input v-model="query.keyword" size="mini" placeholder="请输入关键字" @keyup.enter.native="getArticleList"></el-input>
            <el-cascader
              v-if="!alonePage"
              v-model="categoryIdsList"
              class="mark-setting-input"
              placeholder="不选择"
              size="mini"
              :collapse-tags="false"
              :options="categories"
              :show-all-levels="false"
              :props="{ multiple: true, checkStrictly: true, value: 'id', label: 'name' }"
              clearable
              @change="selectCategory"
            ></el-cascader>
            <el-button type="primary" size="mini" @click="getArticleList">筛选</el-button>
          </div>
        </div>
        <el-table
          :data="articleList"
          :class="{'el-table-alone-page': alonePage}"
          row-key="id"
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
                <router-link :title="'浏览 '+scope.row.name" :to="'/articles/'+scope.row.slug" target="_blank"><svg-icon class="wailian" icon-class="wailian"></svg-icon></router-link>
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
              <router-link :to="$route.path+'?uid='+scope.row.userId">{{scope.row.username}}</router-link>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!alonePage"
            prop="categories"
            label="分类">
            <template slot-scope="scope">
            <span v-for="(category,i) in scope.row.categories">
              {{i>0?' ,':''}}
              <a :href="'?categoryIds='+category.id">{{category.name}}</a>
            </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateDate"
            label="日期"
            width="160">
            <template slot-scope="scope">
              <span>{{scope.row.updateDate.substring(0, 16)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        style="text-align: center"
        :hide-on-single-page="true"
        :current-page.sync="pagination.pageIndex"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="currentChange"
        layout="prev, pager, next">
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
export default {
  name: 'articleManager',
  components: {
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
    }
  },
  data() {
    return {
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
        keyword: '',
        categoryIds: ''
      },
      draftNums: 0,
      multipleSelection: [],
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
          console.log(fileIdList)
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
    cancelFilter() {
      this.$router.push({query: {}})
      this.query.keyword = ''
      this.categoryIdsList = []
      this.getArticleList()
    },
    getArticleList() {
      this.query.categoryIds = ''
      if(this.$route.query.categoryIds){
        this.query.categoryIds = this.$route.query.categoryIds
      }
      if(this.categoryIdsList.length > 0){
        this.categoryIdsList.forEach(categoryIdList => {
          this.query.categoryIds += categoryIdList[categoryIdList.length - 1] + ','
        })
        this.query.categoryIds = this.query.categoryIds.substring(0, this.query.categoryIds.length - 1)
      }
      this.isFilter = this.query.keyword.length > 0 || this.query.categoryIds.length > 0;
      if(this.isFilter){
        this.$router.push({query: {keyword: this.query.keyword, categoryIds: this.query.categoryIds}})
      }
      markdownApi.getMarkdown({
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        userId: this.query.radioUser === 'my' ? this.$store.state.user.userId : null,
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
    findCategoryIds(parentCategory, categories, categoryIds) {
      if(!categoryIds){
        return
      }
      categories.forEach(category => {
        let ids = []
        if(parentCategory && parentCategory.ids){
          ids = parentCategory.ids
        }
        ids.push(category.id)
        category['ids'] = ids
        if(categoryIds.includes(category.id)){
          let newIds = []
          Object.assign(newIds , ids)
          this.categoryIdsList.push(newIds)
        }
        if(category.children){
          this.findCategoryIds(category, category.children, categoryIds)
        }
      })
    },
    selectCategory(val) {
      console.log('selectCategory', val)
      let categoryIds = ''
      this.categoryIdsList.forEach(categoryIdList => {
        categoryIds += categoryIdList[categoryIdList.length - 1] + ','
      })
      categoryIds = categoryIds.substring(0, categoryIds.length - 2)
      console.log(categoryIds)
    },
    currentChange() {
      this.$router.push({query: {page : this.pagination.pageIndex}})
      this.getArticleList()
    },
    newArticle() {
      this.newArticleDialogVisible = true
      this.$router.push({query: {operation: 'new'}})
    },
    editArticle(id) {
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
          let categoryIds = this.query.categoryIds.split(",")
          if(categoryIds){
            this.findCategoryIds(null, this.categories, categoryIds)
          }
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
      }
      if(operation === 'editor'){
        this.title = '编辑：' + val
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
/deep/.el-card__body {
  min-width: 1080px;
}
/deep/ .el-dialog__body {
  padding: 0 20px;
}
/deep/ .el-table-alone-page {
  tbody .el-table__row:hover {
    cursor: move;
  }
}
</style>
