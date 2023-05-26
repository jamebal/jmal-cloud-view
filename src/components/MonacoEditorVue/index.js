import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

function noop() { }

export { monaco };

export default {
  name: 'MonacoEditor',
  props: {
    diffEditor: { type: Boolean, default: false },      //是否使用diff模式
    // width: {type: [String, Number], default: '100%'},
    // height: {type: [String, Number], default: '100%'},
    width: Number,
    height: Number,
    original: String,       //只有在diff模式下有效
    value: String,
    language: {type: String, default: 'javascript'},
    theme: {type: String, default: 'vs'},
    options: {type: Object, default() {return {};}},
    editorMounted: {type: Function, default: noop},
    editorBeforeMount: {type: Function, default: noop}
  },

  watch: {
    options: {
      deep: true,
      handler(options) {
        this.editor && this.editor.updateOptions(options);
      }
    },

    value() {
      this.editor && this.value !== this._getValue() && this._setValue(this.value);
      // 滚动到顶部
      this.editor.setScrollPosition({scrollTop: 0,scrollLeft: 0});
    },

    language() {
      // console.log(monaco.languages.getLanguages(),this.editor.getModel(),this.language)
      if(!this.editor) return;
      if(this.diffEditor){      //diff模式下更新language
        const { original, modified } = this.editor.getModel();
        monaco.editor.setModelLanguage(original, this.language);
        monaco.editor.setModelLanguage(modified, this.language);
      }else{
        monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
      }
    },

    theme() {
      this.editor && monaco.editor.setTheme(this.theme);
    },

    style() {
      this.editor && this.$nextTick(() => {
        this.editor.layout();
      });
    }
  },

  computed: {
    style() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  },

  mounted () {
    this.initMonaco();
  },

  beforeDestroy() {
    this.editor && this.editor.dispose();
  },

  render (h) {
    return (
      <div class="monaco_editor_container" style={this.style} on-keydown={event => {
        const isMac = navigator.platform.startsWith('Mac');
        const {key, code, keyCode, ctrlKey, metaKey} = event;
        const isCmd = isMac && metaKey || !isMac && ctrlKey;
        if (!isCmd) {
          return;
        }
        const isS = key === 's' || code === 'KeyS' || keyCode === 83;
        if (isS) {
          this.$emit('save', this._getValue());
          event.stopPropagation();
          event.preventDefault();
        }
      }}
      ></div>
  );
  },

  methods: {
    keyDown(event){
      const isMac = navigator.platform.startsWith('Mac');
      const {key, code, keyCode, ctrlKey, metaKey} = event;
      const isCmd = isMac && metaKey || !isMac && ctrlKey;
      if (!isCmd) {
        return;
      }
      const isS = key === 's' || code === 'KeyS' || keyCode === 83;
      if (isS) {
        this.$emit('save', this._getValue());
        event.stopPropagation();
        event.preventDefault();
      }
    },
    initMonaco() {
      const { value, language, theme, options } = this;
      Object.assign(options, this._editorBeforeMount());      //编辑器初始化前
      this.editor = monaco.editor[this.diffEditor ? 'createDiffEditor' : 'create'](this.$el, {
        value: value,
        language: language,
        theme: theme,
        ...options
      });
      this.diffEditor && this._setModel(this.value, this.original);
      this._editorMounted(this.editor);      //编辑器初始化后
    },

    onKeyDown(event) {
      const isMac = navigator.platform.startsWith('Mac');
      const {key, code, keyCode, ctrlKey, metaKey} = event;
      const isCmd = isMac && metaKey || !isMac && ctrlKey;
      if (!isCmd) {
        return;
      }
      const isS = key === 's' || code === 'KeyS' || keyCode === 83;
      if (isS && this.textPreviewVisible) {
        if(this.newContent !== ''){
          this.save()
        }
        event.stopPropagation();
        event.preventDefault();
      }
    },

    _getEditor() {
      if(!this.editor) return null;
      return this.diffEditor ? this.editor.modifiedEditor : this.editor;
    },

    _setModel(value, original) {     //diff模式下设置model
      const { language } = this;
      const originalModel = monaco.editor.createModel(original, language);
      const modifiedModel = monaco.editor.createModel(value, language);
      this.editor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    },

    _setValue(value) {
      let editor = this._getEditor();
      if(editor) return editor.setValue(value);
    },

    _getValue() {
      let editor = this._getEditor();
      if(!editor) {
        if (this.diffEditor) {
          return this.editor.getModel().modified.getValue()
        } else {
          return ''
        }
      }
      return editor.getValue();
    },

    _editorBeforeMount() {
      const options = this.editorBeforeMount(monaco);
      return options || {};
    },

    _editorMounted(editor) {
      this.editorMounted(editor, monaco);
      if(this.diffEditor){
        editor.onDidUpdateDiff((event) => {
          const value = this._getValue()
          this._emitChange(value, event)
        });
      }else{
        editor.onDidChangeModelContent(event => {
          const value = this._getValue();
          this._emitChange(value, event);
        });
      }
    },

    _emitChange(value) {
      this.$emit('change', value);
      this.$emit('input', value);
    }
  }
}
