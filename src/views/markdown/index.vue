<template>
  <div>
    <dir-tree ref="dirTree">
        <el-button slot="footer" size="small" type="primary" @click="confirmSelectDir">确 定</el-button>
    </dir-tree>
    <el-header>
      <div class="header-item">
        文章标题：
        <el-input class="articles-title" placeholder="文章标题" v-model="filename"/>
        <el-input v-if="!editStatus" class="articles-storage" placeholder="存储位置" v-model="storageLocation" :readonly="true" @click="selectDir">
          <el-button slot="prepend" @click="selectDir">选择位置</el-button>
        </el-input>
        <el-button type="primary" @click="moreSetting = true">更多设置</el-button>
        <el-button v-if="!editStatus" class="release-button" type="primary" @click="add" :loading="adding">发布文章</el-button>
        <el-button v-if="editStatus" class="release-button" type="primary" @click="update" :loading="updating">更新文章</el-button>
      </div>
    </el-header>
    <el-main>
      <mavon-editor
        v-model="content"
        ref="md"
        @change="change"
        codeStyle="atelier-dune-dark"
        :style="{'height': clientHeight+'px'}"
        :imageFilter="imageFilter"
        @save="save"
        @imgAdd="$imgAdd"
        @imgDel="$imgDel"
        @fullScreen="fullScreen"
      />
    </el-main>

    <el-drawer
      :visible.sync="moreSetting"
      :with-header="false">
      <div class="more-setting">
        <h2>更多设置</h2>
        <p class="mark-setting-label">文章封面：</p>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 8}"
          placeholder="输入图片URL"
          v-model="markdownCover">
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
  export default {
    components: {
      DirTree
    },
    data() {
      return {
        editStatus: false,
        content:"", // 输入的markdown
        html:'',    // 及时转的html
        filename: '新建文档',
        clientHeight: document.documentElement.clientHeight - 135,
        updating: false,
        adding: false,
        isFullScreen: false,
        storageLocation: '/',
        selectLocationVisible: false,
        moreSetting: false,
        markdownCover: null,
      }
    },
    mounted() {
      if(this.$route.query.id){
        this.editStatus = true
        markdownApi.getMarkdown({
          mark: this.$route.query.id
        }).then((res) => {
          this.content = res.data.contentText
          this.filename = res.data.name.split('.md')[0]
          this.markdownCover = res.data.cover
          this.storageLocation = res.data.path
        })
      }
      const that = this
      window.onresize = function temp() {
        that.reHeight()
      }
    },
    methods: {
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
          this.clientHeight = document.documentElement.clientHeight - 135
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
            contentText: this.content
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
            contentText: this.content
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
    padding: 5px 20px 20px 20px;
    .v-note-wrapper {
      z-index: 200;
    }
  }
  /deep/ .el-header {
    padding: 7.5px 20px 10px 20px;
  }
  /deep/ .el-input-group {
    width: unset;
  }
  .header-item {
    min-width: 800px;
    padding: 5px 0 5px 0;
    .release-button {
      float: right;
      margin-left: 10px;
    }
    .el-input {
      width: 300px;
    }
  }

  .more-setting {
    padding: 15px;
    .mark-setting-label {
      font-weight: 500;
    }
    .mark-description {
      font-size: 12px;
      font-weight: 100;
    }
  }

</style>
