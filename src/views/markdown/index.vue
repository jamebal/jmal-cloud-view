<template>
  <div v-loading="pageLoading">
    <div class="article-editor">
      <div class="editor-left">
        <cite v-if="currentDraft">你正在编辑的是保存于 {{ file.updateDate }} 的草稿, 你也可以
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
          <vditor-editor
            ref="vditorEditor"
            v-model="file.contentText"
            :height="clientHeight"
            :upload-user="uploadUserInfo"
            @initialized="onVditorInitialized"
            @input="valueHasChanged"
          />
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
import markdownApi from '@/api/markdown-api';
import DirTree from "@/components/FileTree/DirTree";

import categoryApi from "@/api/category";
import tagApi from "@/api/tag";
import EditElement from "@/views/markdown/EditElement";
import UploadImageInput from "@/components/input/UploadImageInput";
import MultipleTreeSelect from "@/components/select/MultipleTree";

import VditorEditor from '@/components/VditorEditor';
import { mapState } from 'vuex'

export default {
  name: 'MarkdownEditor',
  components: {
    VditorEditor,
    MultipleTreeSelect,
    EditElement,
    DirTree,
    UploadImageInput
  },
  props: {
    hasChange: {
      type: Boolean,
      default: false
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
      // 确保 file 对象及其属性存在，避免模板渲染错误
      file: {
        contentText: '',
        name: '',
        slug: '',
        cover: '',
        categoryIds: [],
        tagIds: [],
        uploadDate: null
      },
      editStatus: false,
      filename: '',
      clientHeight: document.documentElement.clientHeight - 150,
      updating: false,
      storageLocation: '',
      selectLocationVisible: false,
      moreSetting: false,
      categories: [],
      draft: false,
      currentDraft: false,
      tags: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      inputValueExist: false,
      inputNewTagClass: 'input-new-tag',
      inputErrorClass: 'input-error',
      pageLoading: false,
      releaseTime: undefined,
    }
  },
  computed: {
    ...mapState(['theme']),
    // 创建一个计算属性，用于向子组件传递用户信息，实现解耦
    uploadUserInfo() {
      if (!this.$store.state.user) {
        return {}; // 返回空对象以处理未登录的情况
      }
      return {
        token: this.$store.state.user.token,
        name: this.$store.state.user.name,
        userId: this.$store.state.user.userId,
      }
    }
  },
  watch: {
    'file.categoryIds': 'valueHasChanged',
    dynamicTags: 'valueHasChanged',
    filename(val) {
      this.valueHasChanged()
      this.$emit('onTitle', val)
    },
    storageLocation() {
      this.valueHasChanged()
    },
    theme() {
      this.$nextTick(() => {
        if (this.$refs.vditorEditor && this.$refs.vditorEditor.vditor) {
          const isDark = document.documentElement.classList.contains('dark')
          this.$refs.vditorEditor.vditor.setTheme(isDark ? 'dark' : 'classic', isDark ? 'dark' : 'light', 'androidstudio')
        }
      });
    },
  },
  mounted() {
    this.getMarkdown();
    this.categoryTree();
    this.getTags();
  },
  methods: {
    reload() {
      this.getMarkdown(true);
      this.categoryTree();
    },
    querySearch(queryString, cb) {
      let tags = this.tags;
      let results = queryString ? tags.filter((tag) => {
        return (tag.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }) : [];
      results = results.map(res => ({ value: res.name }));
      cb(results);
    },
    handleSelect() {
      this.handleInputConfirm();
    },
    valueHasChanged() {
      this.$emit('update:hasChange', true);
    },
    getMarkdown(isReload) {
      this.pageLoading = true;
      this.draft = false;

      if (this.$route.query.id) {
        this.editStatus = true;
        markdownApi.getMarkdown({ mark: this.$route.query.id }).then((res) => {
          if (res.data.draft) {
            this.file = JSON.parse(res.data.draft);
            if (res.data.release) {
              this.currentDraft = true;
            }
          } else {
            this.currentDraft = false;
            this.file = res.data;
          }

          this.filename = this.file.name ? this.file.name.split('.md')[0] : '';

          if (this.file.tagIds && this.file.tagIds.length > 0 && this.tags.length > 0) {
            this.loadDynamicTags();
          }

          this.$nextTick(() => {
            this.$emit('update:hasChange', false);
          });

          // 如果是重新加载，等待编辑器更新内容后结束
          if (!isReload) {
            // VditorEditor 组件内部 after 回调会触发 initialized 事件来关闭 loading
          } else {
            this.pageLoading = false;
          }

        }).catch(() => {
          this.pageLoading = false;
        });
      } else {
        // // 新建文章，清空数据
        // this.file = { contentText: '', name: '', slug: '', cover: '', categoryIds: [], tagIds: [] };
        // this.filename = '';
        // this.dynamicTags = [];
      }
    },
    // 新方法：处理子组件初始化完成事件
    onVditorInitialized() {
      this.pageLoading = false;
      this.$refs.vditorEditor.setValue(this.file.contentText);
    },
    moreSet() {
      this.moreSetting = true;
    },
    categoryTree() {
      categoryApi.categoryTree().then(res => {
        this.categories = res.data;
      });
    },
    getTags() {
      tagApi.tagList().then(res => {
        this.tags = res.data;
        if (this.file.tagIds && this.file.tagIds.length > 0) {
          this.loadDynamicTags();
        }
      });
    },
    loadDynamicTags() {
      this.dynamicTags = this.tags.filter(tag => this.file.tagIds.includes(tag.id)).map(tag => tag.name);
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const that = this;
      setTimeout(function() {
        let inputValue = that.inputValue;
        if (inputValue) {
          if (that.dynamicTags.includes(inputValue)) {
            that.inputValueExist = true;
            return;
          }
          that.dynamicTags.push(inputValue);
        }
        that.inputValueExist = false;
        that.inputVisible = false;
        that.inputValue = '';
      }, 250);
    },
    // 移除了 vditorInit 和 markdownImageUplaod 方法
    checkParam() {
      if (!this.filename) {
        this.$message.warning("请输入文章标题");
        return false;
      }
      // 核心改动：直接从 v-model 绑定的数据中获取内容
      if (!this.file.contentText || this.file.contentText.length < 2) {
        this.$message.warning("请输入文章内容");
        return false;
      }
      return true;
    },
    saveDraft() {
      this.draft = true;
      this.update('保存草稿成功');
    },
    release() {
      this.draft = false;
      this.update();
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
          });
          this.reload();
        });
      });
    },
    async update(message) {
      if (!this.checkParam()) {
        return;
      }
      this.updating = true;
      const htmlContent = this.$refs.vditorEditor ? await this.$refs.vditorEditor.getHTML() : '';
      console.log(htmlContent);
      markdownApi.editMarkdown({
        fileId: this.$route.query.id,
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        filename: encodeURIComponent(this.filename + ".md"),
        cover: this.file.cover,
        isDraft: this.draft,
        isRelease: this.file.release,
        isAlonePage: this.alonePage,
        slug: this.file.slug ? this.file.slug : this.filename,
        categoryIds: this.file.categoryIds,
        tagNames: this.dynamicTags,
        contentText: this.file.contentText,
        html: htmlContent,
        uploadDate: this.file.uploadDate,
      }).then((res) => {
        this.$emit('update:hasChange', false);
        this.updating = false;
        this.$message({
          message: message ? message : "发布成功",
          type: 'success',
          duration: 1000
        });
        if (this.draft) {
          this.$router.push({ path: this.$route.path, query: { operation: 'editor', id: res.data } });
          this.$emit('onTitle', this.filename);
          this.reload();
        } else {
          this.$emit('onRelease');
        }
      }).catch(() => {
        this.updating = false;
      });
    },
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
      color: var(--text-color-hover) !important;
      font-size: 16px;
      border: none;
      border-bottom: var(--timeline-empty-text-color) 1px solid;
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
  align-items: center;
  color: var(--text-color);

  .mark-setting-input {
    font-size: 14px;
    padding: 0 2px;
    border-radius: 5px;
    color: var(--text-color-hover);
    width: fit-content;
    min-width: 35px;
    background-color: var(--url-slug-bg-color);

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
  display: inline-flex;
  align-items: center;
  >>>.svg-icon{
    margin-right: 2px;
  }
}
</style>
