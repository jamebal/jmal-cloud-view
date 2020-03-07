<template>
  <div>
    <el-header>
      <div class="header-item">
        <el-input placeholder="请输入文档名称" v-model="filename">
          <template slot="append">.md</template>
        </el-input>
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
      />
    </el-main>
  </div>
</template>

<script>
  import markdownApi from '@/api/markdown-api'
  import uploadApi from '@/api/upload-api'
  export default {
    data() {
      return {
        editStatus: false,
        content:"", // 输入的markdown
        html:'',    // 及时转的html
        filename: '新建文档',
        clientHeight: document.documentElement.clientHeight - 155,
        updating: false,
        adding: false,
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
        })
      }
      const that = this
      window.onresize = function temp() {
        that.clientHeight = document.documentElement.clientHeight - 155
      }
    },
    methods: {
      $imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
        console.log('pos',pos,'$file',$file)
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
          const url = process.env.VUE_APP_BASE_FILE_API + '/public/image/' + res.data
          console.log(url)
          this.$refs.md.$img2Url(pos, url);
        })
      },
      $imgDel() {

      },
      // 所有操作都会被解析重新渲染
      change(value, render){
        console.log('value',value)
        // render 为 markdown 解析后的结果[html]
        this.html = render;
      },
      save(){
        if(this.editStatus){
          this.update()
        }else{
          this.add()
        }
      },
      imageFilter() {
        console.log('imageFilter')
        return true
      },
      // add
      add(){
        console.log("this.content",this.content)
        this.adding = true
        if(this.filename){
          const filename = this.filename + ".md"
          markdownApi.addMarkdown({
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            filename: filename,
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-main {
    padding: 5px 20px 20px 20px;
  }
  /deep/ .el-header {
    padding: 12.5px 10px 20px 20px;
  }
  /deep/ .el-input-group {
    width: unset;
  }
  .header-item {
    float: right;
    .release-button {
      margin-left: 10px;
    }
  }

</style>
