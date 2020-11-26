<template>
  <div>
    <dir-tree ref="dirTree" :append-to-body='true'>
        <el-button slot="footer" size="small" type="primary" @click="confirmSelectDir">确 定</el-button>
    </dir-tree>
    <div class="article-editor">
      <div class="editor-left">
        <el-header>
          <div class="header-item">
            <span class="title-label">标题：</span>
            <el-input class="articles-title" placeholder="文章标题" v-model="filename" />
            <!--        <el-input v-if="!editStatus" class="articles-storage" placeholder="存储位置" size="small" v-model="storageLocation" :readonly="true" @focus="selectDir">-->
            <!--          <el-button slot="prepend" size="small" @click="selectDir">保存位置</el-button>-->
            <!--        </el-input>-->
            <!--        <el-button type="primary" @click="moreSetting = true" size="small">更多设置</el-button>-->
            <!--        <el-button v-if="!editStatus" class="release-button" type="primary" size="small" @click="add" :loading="adding">发布文章</el-button>-->
            <!--        <el-button v-if="editStatus" class="release-button" type="primary" size="small" @click="update" :loading="updating">更新文章</el-button>-->
            <!--        <el-button v-if="!editStatus" class="release-button" type="warning" size="small" @click="add" :loading="adding">保存草稿</el-button>-->
          </div>
        </el-header>
        <el-main>
          <div id="vditor"></div>
        </el-main>
      </div>
      <div class="editor-right">
        <div class="operation">
          <el-button class="release-button" type="warning" size="small" @click="saveDraft" :loading="updating">保存草稿</el-button>
          <el-button class="release-button" type="primary" size="small" @click="release" :loading="updating">{{ editStatus?'发布文章':'更新文章' }}</el-button>
        </div>
        <div class="more-setting">
          <p class="mark-setting-label">文章封面：</p>
          <el-input
            class="mark-setting-input"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 8}"
            placeholder="输入图片URL"
            v-model="file.cover">
          </el-input>
          <p class="mark-setting-label">缩略名：</p>
          <el-input
            class="mark-setting-input"
            placeholder="缩略名"
            v-model="file.slug">
          </el-input>
          <span class="instruction">本文链接：<a>{{file.slug ? articleLink+file.slug : articleLink+file.id}}</a></span>
          <p class="mark-setting-label">分类：</p>
          <el-cascader
            v-model="categoryIdsList"
            class="mark-setting-input"
            placeholder="不选择"
            :collapse-tags="false"
            :options="categories"
            :show-all-levels="false"
            :props="{ multiple: true, checkStrictly: true, value: 'id', label: 'name' }"
            clearable
            @change="selectCategory"
          ></el-cascader>
        </div>
      </div>
    </div>

    <el-drawer
      :visible.sync="moreSetting"
      :append-to-body='true'
      :with-header="false">
      <div class="more-setting">
        <h2>更多设置</h2>
        <p class="mark-setting-label">文章封面：</p>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 8}"
          placeholder="输入图片URL"
          v-model="file.cover">
        </el-input>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import markdownApi from '@/api/markdown-api'
  import uploadApi from '@/api/file-api'
  import DirTree from"@/components/FileTree/DirTree"
  import fileConfig from '@/utils/file-config'

  import Vditor from 'vditor'
  import "vditor/src/assets/scss/index.scss"
  import categoryApi from "@/api/category";

  let toolbar = [
    'emoji',
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'check',
    'outdent',
    'indent',
    '|',
    'quote',
    'line',
    'code',
    'inline-code',
    'insert-before',
    'insert-after',
    '|',
    'upload',
    'record',
    'table',
    '|',
    'undo',
    'redo',
    '|',
    'edit-mode',
    'content-theme',
    'code-theme',
    'outline',
    'preview',
    {
      name: 'more',
      toolbar: [
        'fullscreen',
        'export',
        'both',
        'info',
        'help',
      ],
    }]

  export default {
    name: 'MarkdownEditor',
    components: {
      DirTree, Vditor
    },
    props: {
      hasChange: {
        type: Boolean,
        defalut: false
      }
    },
    data() {
      return {
        file: {},
        editStatus: false,
        html:'',    // 及时转的html
        filename: '',
        clientHeight: document.documentElement.clientHeight - 210,
        updating: false,
        isFullScreen: false,
        storageLocation: '/',
        selectLocationVisible: false,
        moreSetting: false,
        contentEditor: '',
        categories: [],
        categoryIdsList: [],
        draft: false,
        articleLink: `${window.origin}/artiles/`
      }
    },
    mounted() {
      this.getMarkdown()
      this.categoryTree()
      const that = this
      window.onresize = function temp() {
        that.reHeight()
      }
    },
    watch: {
      file(){
        this.valueHasChanged()
      },
      filename(val){
        this.valueHasChanged()
        this.$emit('onTitle', val)
      },
      storageLocation(){
        this.valueHasChanged()
      }
    },
    methods: {
      reload() {
        this.getMarkdown(true)
        this.categoryTree()
      },
      valueHasChanged(){
        this.$emit('update:hasChange', true)
      },
      getMarkdown(isReload){
        if(this.$route.query.id){
          this.editStatus = true
          markdownApi.getMarkdown({
            mark: this.$route.query.id
          }).then((res) => {
            this.file = res.data
            this.content = this.file.contentText
            this.filename = this.file.name.split('.md')[0]
            this.storageLocation = res.data.path
            if(this.categories && this.categories.length > 0){
              this.findCategoryIds(null, this.categories, this.file.categoryIds)
            }
            // 初始化编辑器
            if(isReload){
              this.contentEditor.setValue(res.data.contentText)
            } else {
              this.vditorInit(res.data.contentText)
            }
          }).then(() => {
            const that = this
            setTimeout(function (){
              that.$emit('update:hasChange', false)
            }, 100)
          })
        } else {
          if(isReload){
            this.contentEditor.setValue('')
          } else {
            this.vditorInit('')
          }
        }
      },
      categoryTree() {
        categoryApi.categoryTree({userId: this.$store.state.user.userId}).then(res => {
          this.categories = res.data
          if(this.file.categoryIds && this.file.categoryIds.length > 0){
            this.findCategoryIds(null, this.categories, this.file.categoryIds)
          }
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
      vditorInit(content){
        this.contentEditor = new Vditor('vditor', {
          height: this.clientHeight,
          toolbar,
          toolbarConfig: {
            pin: true,
          },
          preview: {
            mode: 'both',
            hljs: {
              lineNumber: true
            }
          },
          cache: {
            enable: false,
          },
          after: () => {
            this.contentEditor.setValue(content)
          },
          input: (val) => {
            this.valueHasChanged()
          },
          upload: this.markdownImageUplaod()
        })
      },
      // 所有操作都会被解析重新渲染
      change(value, render){
        // render 为 markdown 解析后的结果[html]
        this.html = render;
      },
      markdownImageUplaod(){
        return {
          accept: 'image/*,.mp3, .wav, .rar',
          headers: {
            'jmal-token': this.$store.state.user.token
          },
          url: '/api/upload-markdown-image',
          extraData: {
            'filename': this.filename,
            'username': this.$store.state.user.name,
            'userId': this.$store.state.user.userId
          },
          fieldName: 'files',
          filename (name) {
            return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
            replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
            replace('/\\s/g', '')
          },
          format(files, responseText) {
            let response = JSON.parse(responseText)
            let succMap = {}
            response.data.forEach(map => {
              succMap[map.filename] = fileConfig.mardownPreviewUrl(map.filepath)
            })
            response.data = {}
            response.data['succMap'] = succMap
            return JSON.stringify(response)
          }
        }
      },
      fullScreen(status) {
        this.isFullScreen = status
        this.reHeight()
      },
      reHeight(){
        if(this.isFullScreen){
          this.clientHeight = document.documentElement.clientHeight
        }else{
          this.clientHeight = document.documentElement.clientHeight - 210
        }
      },
      save(){
        if(this.editStatus){
          this.update()
        }else{
          this.add()
        }
      },
      imageFilter() {
        return true
      },
      checkParam(){
        if(!this.filename){
          this.$message.warning("请输入文章标题")
          return false
        }
        if(this.contentEditor.getValue().length < 2){
          this.$message.warning("请输入文章内容")
          return false
        }
        return true
      },
      saveDraft() {
        this.draft = true
        this.update('保存草稿成功')
      },
      release() {
        this.draft = false
        this.update()
      },
      selectCategory(val){
      },
      // update
      update(message){
        let categoryIds = []
        this.categoryIdsList.forEach(categoryIdList => {
          categoryIds.push(categoryIdList[categoryIdList.length - 1])
        })
        if(!this.checkParam()){
          return
        }
        this.updating = true
        if(this.filename){
          const filename = this.filename + ".md"
          markdownApi.editMarkdown({
            fileId: this.$route.query.id,
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            filename: filename,
            cover: this.file.cover,
            isDraft: this.draft,
            slug: this.file.slug ? this.file.slug : this.filename,
            categoryIds: categoryIds,
            currentDirectory: this.storageLocation,
            contentText: this.contentEditor.getValue()
          }).then(() => {
            this.$emit('update:hasChange', false)
            this.updating = false
            this.$message({
              message: message ? message : "发布成功",
              type: 'success',
              duration : 1000
            });
          }).catch(()=> {
            this.updating = false
          })
        }
      },
      selectDir(){
        this.$refs.dirTree.show()
      },
      confirmSelectDir(){
        const node = this.$refs.dirTree.getSelectTreeNode()
        this.storageLocation = node.path + node.name
        this.$refs.dirTree.hide()
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "src/styles/setting";
  /deep/ .el-main {
    padding: 30px 20px 20px 20px;
    .v-note-wrapper {
      z-index: 200;
    }
  }
  /deep/ .el-header {
    height: 43px!important;
  }
  /deep/ .el-input-group {
    width: unset;
  }
  /deep/ .header-item {
    line-height: 40px;
    padding: 5px 0 5px 0;
    .release-button {
      float: right;
      margin-left: 10px;
    }
    .el-input {
      width: 90%;
      input[type='text'] {
        font-weight: 900;
        color: #000000!important;
        font-size: 16px;
        border: none;
        border-bottom: #ccc 1px solid;
        border-radius: 0;
      }
    }
    .title-label {
      font-size: 16px;
      font-weight: 500;
    }
  }

  /deep/ .more-setting {
    .el-input {
      width: 100%;
    }
    margin-top: 68px;
    .mark-setting-label {
      font-weight: 500;
      margin-top: 10px!important;
    }
    .mark-setting-input {
      width: 100%;
    }
    .mark-description {
      font-size: 12px;
      font-weight: 100;
    }
  }
.article-editor {
  min-width: 1160px;
  margin: auto;
  display: flex;
  .editor-left {
    width: 75%;
  }
  .editor-right {
    width: 25%;
    .operation {
      float: right;
    }
  }
}

  @media (min-width: 1200px) {
    .article-editor {
      max-width: 1200px;
    }
  }
</style>
