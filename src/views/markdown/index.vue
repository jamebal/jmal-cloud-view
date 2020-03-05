<template>
  <div>
    <el-header>
      <div class="header-item">
        <el-input placeholder="请输入文档名称" v-model="filename">
          <template slot="append">.md</template>
        </el-input>
        <el-button class="release-button" type="primary" @click="submit">发布文章</el-button>
      </div>
    </el-header>
    <el-main>
      <mavon-editor
        v-model="content"
        ref="md"
        @change="change"
        :style="{'height': clientHeight+'px'}"
      />
    </el-main>
  </div>
</template>

<script>
  import markdownApi from '@/api/markdown-api'
  export default {
    data() {
      return {
        content:"# 一级标题\n" +
          "```java\n" +
          "import markdownApi from '@/api/markdown-api'\n" +
          "  export default {\n" +
          "    data() {\n" +
          "      return {\n" +
          "        content:'', // 输入的markdown\n" +
          "        html:'',    // 及时转的html\n" +
          "      }\n" +
          "    },\n" +
          "    methods: {\n" +
          "      // 所有操作都会被解析重新渲染\n" +
          "      change(value, render){\n" +
          "        console.log(value)\n" +
          "        // render 为 markdown 解析后的结果[html]\n" +
          "        this.html = render;\n" +
          "      },\n" +
          "      // 提交\n" +
          "      submit(){\n" +
          "        console.log(this.content);\n" +
          "        console.log(this.html);\n" +
          "        markdownApi.addMarkdown({\n" +
          "          userId: this.$store.state.user.userId,\n" +
          "          username: this.$store.state.user.name,\n" +
          "          filename: this.filename+\".md\"\n" +
          "        }).then((res) => {\n" +
          "\n" +
          "          console.log(res.data)\n" +
          "        })\n" +
          "      }\n" +
          "    },\n" +
          "    mounted() {\n" +
          "\n" +
          "    }\n" +
          "  }\n" +
          "```\n" +
          "## 二级标题", // 输入的markdown
        html:'',    // 及时转的html
        filename: '新建文档',
        clientHeight: document.documentElement.clientHeight - 155
      }
    },
    mounted() {
      const that = this
      window.onresize = function temp() {
        that.clientHeight = document.documentElement.clientHeight - 155
      }
    },
    methods: {
      // 所有操作都会被解析重新渲染
      change(value, render){
        console.log(value)
        // render 为 markdown 解析后的结果[html]
        this.html = render;
      },
      // 提交
      submit(){
        console.log(this.content);
        console.log(this.html);
        if(this.filename){
          const filename = this.filename + ".md"
          markdownApi.addMarkdown({
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            filename: filename,
            contentText: this.content
          }).then((res) => {
            console.log(res.data)
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
