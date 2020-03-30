<template>
  <div class="vue-codemirror-wrap">
    <textarea @keydown="onKeyDown"></textarea>
  </div>
</template>

<script>

  // htmlmixed mode
  require('codemirror/mode/vue/vue.js')
  require('codemirror/mode/xml/xml.js')
  require('codemirror/mode/javascript/javascript.js')
  require('codemirror/mode/css/css.js')
  require('codemirror/mode/shell/shell.js')
  require('codemirror/mode/yaml/yaml.js')
  require('codemirror/mode/swift/swift.js')
  require('codemirror/mode/sql/sql.js')
  require('codemirror/mode/sass/sass.js')
  require('codemirror/mode/sas/sas.js')
  require('codemirror/mode/php/php.js')
  require('codemirror/mode/css/css.js')
  require('codemirror/mode/markdown/markdown.js')
  require('codemirror/mode/go/go.js')
  require('codemirror/mode/dart/dart.js')
  // require('codemirror/mode/clike/clike.js')

  // theme
  require('codemirror/theme/idea.css')
  require('codemirror/theme/ayu-dark.css')
  require('codemirror/theme/3024-day.css')
  require('codemirror/theme/3024-night.css')

  // require hint addon for javacript
  require('codemirror/addon/hint/show-hint.js')
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/javascript-hint.js')

  // Crtl-F 搜索
  import 'codemirror/addon/dialog/dialog';
  import 'codemirror/addon/scroll/annotatescrollbar';
  import 'codemirror/addon/search/matchesonscrollbar';
  import 'codemirror/addon/search/jump-to-line';
  import 'codemirror/addon/search/search';
  import 'codemirror/addon/search/searchcursor';

  let CodeMirror = require('codemirror/lib/codemirror.js')
  require('codemirror/lib/codemirror.css')
  export default {
    name: 'VueCodemirror',
    props: {
      value: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        default: function () {
          return {
            mode: 'text/javascript',
            lineNumbers: true,
            lineWrapping: true
          }
        }
      },
    },
    data: function () {
      return {
        skipNextChangeEvent: false,
        nowValue: ''
      }
    },
    ready: function () {
      console.log(6789)
      let that = this
      this.editor = CodeMirror.fromTextArea(this.$el.querySelector('textarea'), this.options)
      this.editor.setValue(this.value)
      this.editor.on('change', function(cm) {
        if (that.skipNextChangeEvent) {
          that.skipNextChangeEvent = false
          return
        }
        that.nowValue = cm.getValue()
        if (!!that.$emit) {
          that.$emit('change', cm.getValue())
        }
      })
    },
    beforeMount(){
      this.onKeyDown = this.onKeyDown.bind(this);
      document.addEventListener('keydown', this.onKeyDown);
    },
    mounted: function () {
      let that = this
      this.editor = CodeMirror.fromTextArea(this.$el.querySelector('textarea'), this.options)
      this.editor.setValue(this.value)
      this.editor.on('change', function(cm) {
        if (that.skipNextChangeEvent) {
          that.skipNextChangeEvent = false
          return
        }
        that.nowValue = cm.getValue()
        if (!!that.$emit) {
          that.$emit('change', cm.getValue())
          that.$emit('input', cm.getValue())
        }
      })
      this.$nextTick(()=>{
        this.editor.clearHistory();
      })
    },
    watch: {
      'value': function (newVal, oldVal) {
        var editorValue = this.editor.getValue()
        if (newVal !== editorValue) {
          this.skipNextChangeEvent = true
          // var scrollInfo = this.editor.getScrollInfo()
          // this.editor.refresh()
          this.editor.setValue(newVal)
          this.editor.scrollTo(0, 0)
          // this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
        }
        this.editor.clearHistory();
      },
      'options': function (newOptions, oldVal) {
        if (typeof newOptions === 'object') {
          for (const optionName in newOptions) {
            if (newOptions.hasOwnProperty(optionName)) {
              this.editor.setOption(optionName, newOptions[optionName])
            }
          }
        }
      }
    },
    methods: {
      onKeyDown(event) {
        const isMac = navigator.platform.startsWith('Mac');
        const {key, code, keyCode, ctrlKey, metaKey} = event;
        const isCmd = isMac && metaKey || !isMac && ctrlKey;
        if (!isCmd) {
          return;
        }
        const isS = key === 's' || code === 'KeyS' || keyCode === 83;
        if (isS && this.editor) {
          if(this.nowValue !== ''){
            this.$emit('save', this.nowValue)
          }
          event.stopPropagation();
          event.preventDefault();
        }
        const isF = key === 'f' || code === 'KeyF' || keyCode === 70;
        if (isF && this.editor) {
          this.editor.execCommand('find');
          event.preventDefault();
        }
      },
    },
    beforeDestroy: function () {
      if (this.editor) {
        this.editor.toTextArea()
      }
    }
  }
</script>

<style>
  .CodeMirror-code {
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  }
</style>
