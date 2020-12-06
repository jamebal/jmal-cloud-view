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
          </div>
          <p class="url-slug"><span>{{ articleLink }}</span>
            <el-input
              class="mark-setting-input"
              placeholder="缩略名"
              v-model="file.slug"
              autosize
              size="mini"
              :style="{width:text(file.slug)}"
            >
            </el-input>
          </p>
        </el-header>
        <el-main>
          <div id="vditor" :style="{maxHeight: clientHeight + 'px'}" v-loading="vditorLoading"></div>
        </el-main>
      </div>
      <div class="editor-right">
        <div class="operation">
          <el-button class="release-button" type="warning" size="small" @click="saveDraft" :loading="updating">保存草稿</el-button>
          <el-button class="release-button" type="primary" size="small" @click="release" :loading="updating">{{ editStatus?'更新文章':'发布文章' }}</el-button>
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
          <p class="mark-setting-label">分类：</p>
          <el-tree
            class="category-tree"
            ref="categoryTree"
            node-key="id"
            :props="treeProps"
            :data="categories"
            icon-class="-"
            :check-on-click-node="true"
            :expand-on-click-node="false"
            :check-strictly="true"
            :default-expand-all="true"
            :default-checked-keys="file.categoryIds"
            show-checkbox
            @check="selectCategory"
          >
          </el-tree>
          <p class="mark-setting-label">标签：</p>
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag.id"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-autocomplete
            :class="[inputNewTagClass, inputValueExist?inputErrorClass:'']"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            :fetch-suggestions="querySearch"
            :popper-append-to-body="false"
            @select="handleSelect"
            placeholder="请输入标签名"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
<!--            <div slot="suffix"fsd></div>-->
          </el-autocomplete>
          <div v-if="inputValueExist" class="instruction-error">该标签已存在</div>
          <el-button v-if="!inputVisible" class="button-new-tag" size="small" @click="showInput"> + 新增标签 </el-button>
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
  import tagApi from "@/api/tag";

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
        draft: false,
        articleLink: `${window.origin}/artiles/`,
        tags: [],
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        inputValueExist: false,
        inputNewTagClass: 'input-new-tag',
        inputErrorClass: 'input-error',
        vditorLoading: true,
        treeProps: {
          label: 'name',
        }
      }
    },
    mounted() {
      this.getMarkdown()
      this.categoryTree()
      this.getTags()
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
    computed: {
      text () {
        return function (value) {
          if (value === '' || value === 0) {
            return '100%'
          } else {
            return String(value).length * 14 - 30 + 'px'
          }
        }
      }
    },
    methods: {
      reload() {
        this.getMarkdown(true)
        this.categoryTree()
      },
      querySearch(queryString, cb) {
        let tags = this.tags
        let results = queryString ? tags.filter((tag) => {
          return (tag.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }) : tags
        // 调用 callback 返回建议列表的数据
        results = results.map(res => {
          return {value: res.name}
        })
        cb(results)
      },
      handleSelect(item){
        this.handleInputConfirm()
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
            // 初始化编辑器
            if(isReload){
              this.contentEditor.setValue(res.data.contentText)
            } else {
              this.vditorInit(res.data.contentText)
            }
            this.file = res.data
            this.content = this.file.contentText
            this.filename = this.file.name.split('.md')[0]
            this.storageLocation = res.data.path
            // 加载标签
            if(this.tags && this.tags.length > 0) {
              this.loadDynamicTags()
            }
          }).then(() => {
            const that = this
            setTimeout(function (){
              that.$emit('update:hasChange', false)
            }, 200)
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
        categoryApi.categoryTree().then(res => {
          this.categories = res.data
        })
      },
      getTags() {
        tagApi.tagList().then(res => {
          this.tags = res.data
          if(this.file.tagIds && this.file.tagIds.length > 0) {
            this.loadDynamicTags()
          }
        })
      },
      loadDynamicTags() {
        this.dynamicTags = this.tags.filter(tag => this.file.tagIds.includes(tag.id)).map(tag => tag.name)
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          if (this.dynamicTags.includes(inputValue)){
            this.inputValueExist = true
            return
          }
          this.dynamicTags.push(inputValue)
        }
        this.inputValueExist = false
        this.inputVisible = false
        this.inputValue = ''
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
      selectCategory(props, data){
        this.file.categoryIds = data.checkedKeys
      },
      // update
      update(message){
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
            categoryIds: this.file.categoryIds,
            tagNames: this.dynamicTags,
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
    padding: 60px 20px 20px 20px;
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
/deep/ .el-tag {
  margin-left: 8px;
  margin-top: 8px;
}
/deep/ .button-new-tag {
  margin-left: 8px;
  margin-top: 8px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
/deep/ .input-new-tag {
  margin-left: 8px;
  margin-top: 8px;
  max-width: 94px;
  vertical-align: bottom;
  input {
    padding: 0 5px;
  }
}
/deep/ .input-error {
  input {
    border-color: #f56c6c;
  }
}
.instruction-error {
  color: #F56C6C;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  margin-left: 8px;
}
/deep/ .el-autocomplete-suggestion {
  li {
    background-color: #ecf5ff;
    color: #409eff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    margin: 2px 4px;
    text-align: center;
  }
  li:hover {
    background-color: #3f9eff;
    color: #fafdff;
  }
}
/deep/ .el-autocomplete-suggestion__wrap {
  padding: 2px 0;
}
  @media (min-width: 1200px) {
    .article-editor {
      max-width: 1200px;
    }
  }

/deep/ .el-tree-node {
  &:focus>.el-tree-node__content {
    background-color: unset;
  }
  .el-tree-node__content:hover {
    background-color: unset;
  }
}
.category-tree {
  max-height: 500px;
  overflow: auto;
}
/deep/ .url-slug {
  span {
    color: #aaaaaa;
  }
  input {
    font-size: 14px;
    padding: 0;
    background-color: #3f9eff2e;
    border: 0;
    height: 18px;
    line-height: 18px;
  }
}
</style>
