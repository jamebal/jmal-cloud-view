<template>
  <div class="vue-codemirror-wrap">
    <textarea @keydown="onKeyDown"></textarea>
  </div>
</template>

<script>

  // 加载codemirror/mode目录下所有js文件
  const modulesFiles = require.context("codemirror/mode", true, /\.js$/);
  modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules;
  }, {});
  // require('codemirror/mode/xml/xml.js')
  // require('codemirror/mode/javascript/javascript.js')
  // require('codemirror/mode/css/css.js')
  // require('codemirror/mode/shell/shell.js')
  // require('codemirror/mode/yaml/yaml.js')
  // require('codemirror/mode/swift/swift.js')
  // require('codemirror/mode/sql/sql.js')
  // require('codemirror/mode/sass/sass.js')
  // require('codemirror/mode/sas/sas.js')
  // require('codemirror/mode/php/php.js')
  // require('codemirror/mode/css/css.js')
  // require('codemirror/mode/markdown/markdown.js')
  // require('codemirror/mode/go/go.js')
  // require('codemirror/mode/dart/dart.js')
  // require('codemirror/mode/clike/clike.js')

  // 语法警告
  // 加载codemirror/addon/hint目录下所有js文件
  window.JSHINT = require('jshint').JSHINT;
  require('codemirror/addon/lint/lint.js')
  require('codemirror/addon/lint/lint.css')
  require('codemirror/addon/lint/javascript-lint.js')
  // require('codemirror/addon/lint/json-lint.js')
  // require('codemirror/addon/lint/html-lint.js')
  // const modulesFiles1 = require.context("codemirror/addon/lint", true, /\.js$/);
  // modulesFiles1.keys().reduce((modules, modulePath) => {
  //   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  //   const value = modulesFiles1(modulePath);
  //   modules[moduleName] = value.default;
  //   return modules;
  // }, {});

  // theme
  require('codemirror/theme/idea.css')
  require('codemirror/theme/ayu-dark.css')
  require('codemirror/theme/3024-day.css')
  require('codemirror/theme/3024-night.css')
  require('codemirror/theme/ambiance.css')
  require('codemirror/theme/seti.css')
  require('codemirror/theme/darcula.css')

  // 支持代码折叠
  require('codemirror/addon/fold/foldgutter.css')
  require('codemirror/addon/fold/foldcode.js')
  require('codemirror/addon/fold/foldgutter.js')
  require('codemirror/addon/fold/brace-fold.js')
  require('codemirror/addon/fold/comment-fold.js')

  // 括号高亮
  require('codemirror/addon/edit/matchbrackets.js')

  // 全屏模式
  require('codemirror/addon/display/fullscreen.css')
  require('codemirror/addon/display/fullscreen.js')

  // 自动补全
  require('codemirror/addon/hint/anyword-hint.js')
  require('codemirror/addon/hint/css-hint.js')
  require('codemirror/addon/hint/html-hint.js')
  require('codemirror/addon/hint/javascript-hint.js')
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/show-hint.js')
  require('codemirror/addon/hint/sql-hint.js')
  require('codemirror/addon/hint/xml-hint.js')

  // Crtl-F 搜索

  import 'codemirror/addon/scroll/annotatescrollbar.js'
  import 'codemirror/addon/search/matchesonscrollbar.js'
  import 'codemirror/addon/search/match-highlighter.js'
  import 'codemirror/addon/search/jump-to-line.js'
  import 'codemirror/addon/dialog/dialog.js'
  import 'codemirror/addon/dialog/dialog.css'
  import 'codemirror/addon/search/searchcursor.js'
  import 'codemirror/addon/search/search.js'

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
            lineWrapping: true,
            // foldGutter: true, // 启用行槽中的代码折叠
            // // 在行槽中添加行号显示器、折叠器、语法检测器
            // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
            // lint: true,
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

      console.log(this.editor)

      this.$nextTick(()=>{
        this.editor.clearHistory()
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
        this.editor.clearHistory()
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
