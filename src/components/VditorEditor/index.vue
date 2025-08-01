<template>
  <div ref="vditorRef" class="vditor-container"></div>
</template>

<script>
import Vditor from 'vditor';
import "vditor/src/assets/less/index.less"
import fileConfig from '@/utils/file-config'

// Vditor 的工具栏配置可以作为常量提取出来
const toolbar = [
  'undo', 'redo', 'emoji', 'headings', 'bold', 'italic', 'strike', 'link', '|', 'list', 'ordered-list',
  'check', 'outdent', 'indent', '|', 'quote', 'line', 'code', 'inline-code', 'insert-before',
  'insert-after', '|', 'upload', 'record', 'table', '|', '|', 'edit-mode',
  'content-theme', 'code-theme', 'export', '|', 'preview', 'fullscreen', 'outline'
];

export default {
  name: 'VditorEditor',
  props: {
    // 使用 v-model 语法糖
    value: {
      type: String,
      default: ''
    },
    // 编辑器高度
    height: {
      type: Number,
      default: 500
    },
    // 用于文件上传的用户信息，避免直接依赖 $store
    uploadUser: {
      type: Object,
      required: true,
      validator: (val) => ['token', 'name', 'userId'].every(key => key in val)
    },
    fileId: '', // markdown文件id
  },
  data() {
    return {
      initialized: false,
      vditor: null,
      // 内部值，用于防止 v-model 和 editor input 之间的无限循环
      internalChange: false
    };
  },
  watch: {
    // 监听外部 value 的变化，并更新编辑器内容
    value(newValue) {
      // 如果变化是由编辑器内部 input 事件触发的，则忽略
      if (this.internalChange) {
        this.internalChange = false;
        return;
      }
      if (!this.initialized) {
        return
      }
      if (this.vditor && newValue !== this.vditor.getValue()) {
        this.vditor.setValue(newValue);
      }
    },
    height(newHeight) {
      if (this.vditor) {
        this.vditor.setHeight(newHeight);
      }
    }
  },
  mounted() {
    this.initVditor();
  },
  beforeDestroy() {
    this.$emit('beforeDestroy');
    // 组件销毁时，销毁 Vditor 实例，防止内存泄漏
    if (this.vditor) {
      this.vditor.destroy();
      this.vditor = null;
    }
  },
  methods: {
    handleKeydown(event) {
      const isMac = navigator.platform.startsWith('Mac');
      const {key, code, keyCode, ctrlKey, metaKey} = event;
      const isCmd = isMac && metaKey || !isMac && ctrlKey;
      if (!isCmd) {
        return;
      }
      const isS = key === 's' || code === 'KeyS' || keyCode === 83;
      if (isS) {
        this.$emit('save', this.getValue());
        event.stopPropagation();
        event.preventDefault();
      }
    },
    initVditor() {
      this.vditor = new Vditor(this.$refs.vditorRef, {
        height: this.height,
        // 这里使用传入的 value 作为初始值
        value: this.value,
        resize: {
          enable: true
        },
        toolbar,
        toolbarConfig: {
          pin: true,
        },
        cdn: `${window.location.origin}/resource/vditor@3.11.1`,
        mode: 'wysiwyg',
        preview: {
          hljs: {
            lineNumber: true
          },
          markdown: {
            toc: true,
            mark: true,
            footnotes: true,
            autoSpace: true,
          },
          math: {
            engine: "KaTeX",
            inlineDigit: true,
          },
        },
        cache: {
          enable: false,
        },
        after: () => {
          // 实例创建完成后，通知父组件
          this.initialized = true;
          this.$emit('initialized', this.vditor);
        },
        keydown: (event) => {
          this.handleKeydown(event);
        },
        // 监听编辑器输入事件
        input: (value) => {
          this.internalChange = true;
          // 通过 input 事件实现 v-model
          this.$emit('input', value);
        },
        // 文件上传配置
        upload: this.getUploadOptions(),
      });
    },
    getUploadOptions() {
      return {
        accept: 'image/*,.mp3,.wav,.rar,.*',
        headers: {
          'jmal-token': this.uploadUser.token,
          'name': this.uploadUser.name,
          'username': this.uploadUser.name,
          'userId': this.uploadUser.userId,
        },
        url: '/api/upload-markdown-image',
        extraData: {
          'username': this.uploadUser.name,
          'userId': this.uploadUser.userId,
          'fileId': this.fileId ? this.fileId : '',
        },
        fieldName: 'files',
        filename(name) {
          return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').replace('/\\s/g', '');
        },
        format(files, responseText) {
          const response = JSON.parse(responseText);
          const succMap = {};
          response.data.forEach(map => {
            succMap[map.filename] = fileConfig.markdownPreviewUrl(map.filepath);
          });
          const result = {
            ...response,
            data: { succMap }
          };
          return JSON.stringify(result);
        },
        error(msg) {
          console.error('Vditor upload error:', msg);
          this.$emit('upload-error', msg);
        },
        linkToImgUrl: '/api/upload-markdown-link-image',
        linkToImgFormat(responseText) {
          const response = JSON.parse(responseText);
          response.data['url'] = fileConfig.markdownPreviewUrl(response.data.url);
          return JSON.stringify(response);
        },
      };
    },
    // --- 公开方法，供父组件通过 ref 调用 ---
    /**
     * @description 获取 Markdown 原文
     */
    getValue() {
      return this.vditor ? this.vditor.getValue() : '';
    },
    async getHTML() {
      return this.vditor ? this.vditor.getHTML() : '';
    },
    /**
     * @description 设置编辑器内容
     */
    setValue(value) {
      if (this.vditor) {
        this.vditor.setValue(value);
      }
    },
    setTheme(theme, contentTheme, codeTheme) {
      if (this.vditor) {
        this.vditor.setTheme(theme, contentTheme, codeTheme);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.vditor-container {
  // 确保编辑器撑满容器
  width: 100%;
  height: 100%;
}

>>> .vditor-content {
  a {
    color: #1890ff;
  }
}

</style>
