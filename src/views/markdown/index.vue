<template>
  <div v-loading="vditorLoading">
    <div class="article-editor">
      <div class="editor-left">
        <cite v-if="currentDarft">你正在编辑的是保存于 {{ file.updateDate }} 的草稿, 你也可以
          <el-button round type="text" style="color: #F56C6C" @click="deleteDraft">删除它</el-button>
        </cite>
        <el-header>
          <div class="header-item">
            <el-input class="articles-title" placeholder="标题" v-model="filename"/>
          </div>
          <div class="url-slug">
            <div>{{ siteUrl + (alonePage ? '/o/' : '/s/') }}</div>
            <edit-element
              ref="editElement"
              class="mark-setting-input"
              :style="{minWidth: file.slug && file.slug.length > 0 ? '0px' : '35px'}"
              v-model="file.slug"
              placeholder="缩略名"
              can-edit
            ></edit-element>
            <a v-if="isEdit" class="view-icon" :title="'预览 '+filename" :href="siteUrl + (alonePage ? '/o/':'/s/')+(file.slug ? file.slug : file.id)" target="_blank">
              <svg-icon class="wailian" icon-class="eye-open"></svg-icon>预览
            </a>
          </div>
        </el-header>
        <el-main>
          <div id="vditor" :style="{maxHeight: clientHeight + 'px'}"></div>
        </el-main>
      </div>
      <div class="editor-right">
        <div class="operation">
          <el-button round class="release-button" type="warning" size="small" @click="saveDraft" :loading="updating">保存草稿
          </el-button>
          <el-button round class="release-button" type="primary" size="small" @click="release" :loading="updating">发布文章
          </el-button>
        </div>
        <div class="more-setting">
          <p class="mark-setting-label">发布日期：</p>
          <el-date-picker
            v-model="file.uploadDate"
            type="datetime"
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <p class="mark-setting-label">文章封面：</p>
          <upload-image-input v-model="file.cover" placeholder="请输入文章封面大图的url"
                              :intput-autosize="{ minRows: 2, maxRows: 6}"/>
          <div v-if="!alonePage">
            <p class="mark-setting-label">分类：</p>
            <multiple-tree-select
              ref="selectTree"
              style="width: 100%;"
              size="medium"
              placeholder="请选择分类"
              :options="categories"
              select-pack-up
              v-model="file.categoryIds"
            >
            </multiple-tree-select>
          </div>
          <div v-if="!alonePage" class="setting-tags">
            <p class="mark-setting-label">标签：</p>
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag.id"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{ tag }}
            </el-tag>
            <el-autocomplete
              :class="[inputNewTagClass, inputValueExist?inputErrorClass:'']"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              :fetch-suggestions="querySearch"
              :popper-append-to-body="true"
              :trigger-on-focus="false"
              @select="handleSelect"
              placeholder="请输入标签名"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-autocomplete>
            <div v-if="inputValueExist" class="instruction-error">该标签已存在</div>
            <el-button round v-if="!inputVisible" class="button-new-tag" size="small" @click="showInput"> + 新增标签</el-button>
          </div>
          <!--          <p class="mark-setting-label">-->
          <!--            其他：-->
          <!--          </p>-->
          <!--          <el-button round size="small" @click="moreSet">更多设置</el-button>-->
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
        <upload-image-input v-model="file.cover"/>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import markdownApi from '@/api/markdown-api'
import DirTree from "@/components/FileTree/DirTree"
import fileConfig from '@/utils/file-config'

import Vditor from 'vditor'
import "vditor/src/assets/less/index.less"
import categoryApi from "@/api/category";
import tagApi from "@/api/tag";
import EditElement from "@/views/markdown/EditElement";
import UploadImageInput from "@/components/input/UploadImageInput";
import MultipleTreeSelect from "@/components/select/MultipleTree";

let toolbar = [
  'emoji',
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
  'line',
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
  'code-theme',
  'outline',
  'preview',
  'fullscreen',
  {
    name: 'more',
    toolbar: [
      'export',
      'both',
      'info',
      'help',
    ],
  }]

export default {
  name: 'MarkdownEditor',
  components: {
    MultipleTreeSelect,
    EditElement,
    DirTree, Vditor, UploadImageInput
  },
  props: {
    hasChange: {
      type: Boolean,
      defalut: false
    },
    alonePage: {
      type: Boolean,
      default: false
    },
    siteUrl: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNames: ['1'],
      file: {},
      editStatus: false,
      filename: '',
      clientHeight: document.documentElement.clientHeight - 150,
      updating: false,
      storageLocation: '',
      selectLocationVisible: false,
      moreSetting: false,
      contentEditor: '',
      categories: [],
      draft: false,
      currentDarft: false,
      tags: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      inputValueExist: false,
      inputNewTagClass: 'input-new-tag',
      inputErrorClass: 'input-error',
      vditorLoading: false,
      releaseTime: undefined,
    }
  },
  mounted() {
    this.getMarkdown()
    this.categoryTree()
    this.getTags()
  },
  watch: {
    file() {
      this.valueHasChanged()
    },
    filename(val) {
      this.valueHasChanged()
      this.$emit('onTitle', val)
    },
    storageLocation() {
      this.valueHasChanged()
    }
  },
  computed: {},
  methods: {
    reload() {
      this.getMarkdown(true)
      this.categoryTree()
    },
    querySearch(queryString, cb) {
      let tags = this.tags
      let results = queryString ? tags.filter((tag) => {
        return (tag.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }) : []
      // 调用 callback 返回建议列表的数据
      results = results.map(res => {
        return {value: res.name}
      })
      cb(results)
    },
    handleSelect() {
      this.handleInputConfirm()
    },
    valueHasChanged() {
      this.$emit('update:hasChange', true)
    },
    getMarkdown(isReload) {
      this.vditorLoading = true
      this.draft = false
      if (this.$route.query.id) {
        this.editStatus = true
        markdownApi.getMarkdown({
          mark: this.$route.query.id
        }).then((res) => {
          if (res.data.draft) {
            this.file = JSON.parse(res.data.draft)
            if (res.data.release) {
              this.currentDarft = true
            }
          } else {
            this.currentDarft = false
            this.file = res.data
          }
          // 初始化编辑器
          if (isReload) {
            this.contentEditor.setValue(this.file.contentText)
            this.vditorLoading = false
          } else {
            this.vditorInit(this.file.contentText)
          }
          this.content = this.file.contentText
          this.filename = this.file.name.split('.md')[0]
          // 加载标签
          if (this.file.tagIds && this.file.tagIds.length > 0 && this.tags && this.tags.length > 0) {
            this.loadDynamicTags()
          }
        }).then(() => {
          const that = this
          setTimeout(function () {
            that.$emit('update:hasChange', false)
          }, 200)
        })
      } else {
        if (isReload) {
          this.contentEditor.setValue('')
        } else {
          this.vditorInit('')
        }
      }
    },
    moreSet() {
      this.moreSetting = true
    },
    categoryTree() {
      categoryApi.categoryTree().then(res => {
        this.categories = res.data
      })
    },
    getTags() {
      tagApi.tagList().then(res => {
        this.tags = res.data
        if (this.file.tagIds && this.file.tagIds.length > 0) {
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
      const that = this
      setTimeout(function () {
        let inputValue = that.inputValue
        if (inputValue) {
          if (that.dynamicTags.includes(inputValue)) {
            that.inputValueExist = true
            return
          }
          that.dynamicTags.push(inputValue)
        }
        that.inputValueExist = false
        that.inputVisible = false
        that.inputValue = ''
      }, 250)
    },
    vditorInit(content) {
      this.contentEditor = new Vditor('vditor', {
        height: this.clientHeight,
        resize: {
          "enable": true
        },
        toolbar: [
          ...toolbar
        ],
        toolbarConfig: {
          pin: true,
        },
        cdn: `${window.location.origin}/resource/vditor@3.9.3`,
        preview: {
          mode: 'both',
          hljs: {
            lineNumber: true
          },
          markdown: {
            toc: true
          },
        },
        cache: {
          enable: false,
        },
        after: () => {
          this.contentEditor.setValue(content)
          this.vditorLoading = false
        },
        input: () => {
          this.valueHasChanged()
        },
        upload: this.markdownImageUplaod()
      })
    },
    markdownImageUplaod() {
      return {
        accept: 'image/*,.mp3, .wav, .rar',
        headers: {
          'jmal-token': this.$store.state.user.token,
          'name': this.$store.state.user.name,
          'username': this.$store.state.user.name,
          'userId': this.$store.state.user.userId
        },
        url: '/api/upload-markdown-image',
        extraData: {
          'username': this.$store.state.user.name,
          'userId': this.$store.state.user.userId
        },
        fieldName: 'files',
        filename(name) {
          return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').replace('/\\s/g', '')
        },
        format(files, responseText) {
          let response = JSON.parse(responseText)
          let succMap = {}
          response.data.forEach(map => {
            succMap[map.filename] = fileConfig.markdownPreviewUrl(map.filepath)
          })
          response.data = {}
          response.data['succMap'] = succMap
          return JSON.stringify(response)
        },
        error(msg) {
          console.log('error', msg)
        },
        linkToImgUrl: '/api/upload-markdown-link-image',
        linkToImgFormat(responseText) {
          let response = JSON.parse(responseText)
          response.data['url'] = fileConfig.markdownPreviewUrl(response.data.url)
          return JSON.stringify(response)
        },
      }
    },
    save() {
      if (this.editStatus) {
        this.update()
      } else {
        this.add()
      }
    },
    imageFilter() {
      return true
    },
    checkParam() {
      if (!this.filename) {
        this.$message.warning("请输入文章标题")
        return false
      }
      if (this.contentEditor.getValue().length < 2) {
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
    deleteDraft() {
      this.$confirm('您确定要删除这份草稿吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        markdownApi.deleteDraft({
          fileId: this.$route.query.id,
          username: this.$store.state.user.name
        }).then(() => {
          this.$message({
            message: "草稿已被删除",
            type: 'success',
            duration: 1000
          })
          this.reload()
        })
      })
    },
    // update
    update(message) {
      if (!this.checkParam()) {
        return
      }
      this.updating = true
      if (this.filename) {
        const filename = this.filename + ".md"
        markdownApi.editMarkdown({
          fileId: this.$route.query.id,
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          filename: encodeURI(filename),
          cover: this.file.cover,
          isDraft: this.draft,
          isRelease: this.file.release,
          isAlonePage: this.alonePage,
          slug: this.file.slug ? this.file.slug : this.filename,
          categoryIds: this.file.categoryIds,
          tagNames: this.dynamicTags,
          currentDirectory: encodeURI(this.path),
          contentText: this.contentEditor.getValue(),
          html: this.contentEditor.getHTML(),
          uploadDate: this.file.uploadDate,
        }).then((res) => {
          this.$emit('update:hasChange', false)
          this.updating = false
          this.$message({
            message: message ? message : "发布成功",
            type: 'success',
            duration: 1000
          })
          if (this.draft) {
            this.$router.push({path: this.$route.path, query: {operation: 'editor', id: res.data}})
            this.$emit('onTitle', this.filename)
            this.reload()
          } else {
            this.$emit('onRelease')
          }
        }).catch(() => {
          this.updating = false
        })
      }
    },
    selectDir() {
      this.$refs.dirTree.show()
    },
    confirmSelectDir() {
      const node = this.$refs.dirTree.getSelectTreeNode()
      this.storageLocation = node.path + node.name
      this.$refs.dirTree.hide()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/setting";

>>> .el-main {
  padding: 35px 20px 20px 20px;

  .v-note-wrapper {
    z-index: 200;
  }
}

>>> .el-header {
  height: 43px !important;
}

>>> .el-input-group {
  width: unset;
}

>>> .header-item {
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
      color: #000000 !important;
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

>>> .el-drawer__body {
  .more-setting {
    padding: 15px;
  }
}

>>> .more-setting {
  margin-top: 32px;
  padding-top: 15px;

  .el-input {
    width: 100%;
  }

  .mark-setting-label {
    font-weight: bold;
    margin-top: 10px !important;
    margin-bottom: 5px;
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
    margin-top: 15px;
    width: 25%;

    .operation {
      float: right;
    }
  }
}

.setting-tags {
  >>> .el-tag {
    margin-left: 8px;
    margin-top: 8px;
  }

  >>> .button-new-tag {
    margin-left: 8px;
    margin-top: 8px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  >>> .input-new-tag {
    margin-left: 8px;
    margin-top: 8px;
    max-width: 94px;
    vertical-align: bottom;

    input {
      padding: 0 5px;
    }
  }
}

>>> .input-error {
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

>>> .el-autocomplete-suggestion__wrap {
  padding: 2px 0;
}

@media (min-width: 1200px) {
  .article-editor {
    max-width: 1200px;
  }
}

@media (min-width: 1440px) {
  .article-editor {
    max-width: 1440px;
  }
}

@media (min-width: 1920px) {
  .article-editor {
    max-width: 1920px;
  }
}

>>> .el-tree-node {
  &:focus > .el-tree-node__content {
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

>>> .url-slug {
  display: flex;
  color: #aaaaaa;

  .mark-setting-input {
    font-size: 14px;
    padding: 0 2px;
    border-radius: 2px;
    color: #666;
    width: fit-content;
    min-width: 35px;
    background-color: #ecf5ff;

    &:focus {
      outline: none;
    }
  }
}

>>> .vditor-toolbar--pin {
  top: unset;
}

>>> .el-scrollbar__wrap {
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
.view-icon {
  margin-left: 10px;
  >>>.svg-icon{
    margin-right: 2px;
  }
}
</style>
