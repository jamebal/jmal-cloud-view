<template>
  <div v-wechat-title="'编辑:'+filename">
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
          <el-button class="release-button" type="warning" size="small" @click="add" :loading="adding">保存草稿</el-button>
          <el-button v-if="!editStatus" class="release-button" type="primary" size="small" @click="add" :loading="adding">发布文章</el-button>
          <el-button v-if="editStatus" class="release-button" type="primary" size="small" @click="update" :loading="updating">更新文章</el-button>
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
          <el-cascader
            class="mark-setting-input"
            placeholder="不选择"
            :options="categories"
            :show-all-levels="false"
            :props="{ checkStrictly: true }"
            clearable></el-cascader>

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
    data() {
      return {
        file: {},
        editStatus: false,
        html:'',    // 及时转的html
        filename: '',
        clientHeight: document.documentElement.clientHeight - 210,
        updating: false,
        adding: false,
        isFullScreen: false,
        storageLocation: '/',
        selectLocationVisible: false,
        moreSetting: false,
        contentEditor: '',
        categories: []
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
    destroyed() {
      this.contentEditor.destroy()
    },
    methods: {
      getMarkdown(){
        if(this.$route.query.id){
          this.editStatus = true
          markdownApi.getMarkdown({
            mark: this.$route.query.id
          }).then((res) => {
            this.file = res.data
            this.content = this.file.contentText
            this.filename = this.file.name.split('.md')[0]
            this.storageLocation = res.data.path
            // 初始化编辑器
            this.vditorInit(res.data.contentText)
          })
        } else {
          this.vditorInit('')
        }
      },
      categoryTree() {
        categoryApi.categoryTree({userId: this.$store.state.user.userId}).then(res => {
          this.categories = res.data
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
        })
      },
      $imgAdd(pos, $file) {
        const maxSize = 1024 * 1024 * 5
        if($file.size > maxSize){
          this.$message({
            message: '请选择小于5M的图片！ 大于5M的图片将无法上传',
            type: 'warning',
            duration: 3000,
          });
          return
        }
        // 第一步.将图片上传到服务器.
        let data = new FormData();
        data.append('filename', this.filename)
        data.append('username', this.$store.state.user.name)
        data.append('userId', this.$store.state.user.userId);
        data.append('file', $file);
        uploadApi.uploadImage(data).then((res) => {
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          /**
           * $vm 指为mavonEditor实例，可以通过如下两种方式获取
           * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
           * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
           */
          // const url = process.env.VUE_APP_BASE_FILE_API + '/public/image/' + res.data
          const url = fileConfig.publicPreviewUrl(res.data);
          console.log(url)
          this.$refs.md.$img2Url(pos, url);
        })
      },
      $imgDel(pos, $file) {
      },
      // 所有操作都会被解析重新渲染
      change(value, render){
        // render 为 markdown 解析后的结果[html]
        this.html = render;
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
      // add
      add(){
        this.adding = true
        if(this.filename){
          const filename = this.filename + ".md"
          markdownApi.addMarkdown({
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            filename: filename,
            cover: this.markdownCover,
            currentDirectory: this.storageLocation,
            contentText: this.contentEditor.getValue()
          }).then((res) => {
            this.adding = false
            this.$message({
              message: "发布成功",
              type: 'success',
              duration : 1000
            });
            this.$router.push(`/`)
          })
        }
      },
      // update
      update(){
        this.updating = true
        if(this.filename){
          const filename = this.filename + ".md"
          markdownApi.editMarkdown({
            fileId: this.$route.query.id,
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            filename: filename,
            cover: this.markdownCover,
            currentDirectory: this.storageLocation,
            contentText: this.contentEditor.getValue()
          }).then(() => {
            this.updating = false
            this.$message({
              message: "更新成功",
              type: 'success',
              duration : 1000
            });
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
