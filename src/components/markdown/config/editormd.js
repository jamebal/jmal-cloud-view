const defaultConfig = {
  width: "100%",
  height: 600,
  path: '/static/editor.md/lib/',
  // theme: 'dark',
  // previewTheme: 'dark',
  // editorTheme: 'pastel-on-dark',
  markdown: '',      // 默认填充内容
  lineWrapping: true, // 编辑框不换行
  codeFold: true,                 // 代码折叠
  placeholder: '请输入...',
  syncScrolling: true,
  saveHTMLToTextarea: true,       // 保存 HTML 到 Textarea
  searchReplace: true,
  watch: true,                                // 实时预览
  htmlDecode: "style,script,iframe|on*",      // 开启 HTML 标签解析，为了安全性，默认不开启
  toolbar: true,                  //工具栏
  previewCodeHighlight: true,     // 预览 HTML 的代码块高亮，默认开启
  emoji: true,
  taskList: true,
  tocm: true,                     // Using [TOCM]
  tex: true,                      // 开启科学公式TeX语言支持，默认关闭
  flowChart: true,                // 开启流程图支持，默认关闭
  sequenceDiagram: true,          // 开启时序/序列图支持，默认关闭,
  // dialogLockScreen: false,      // 设置弹出层对话框不锁屏，全局通用，默认为true
  // dialogShowMask: false,        // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
  // dialogDraggable: false,       // 设置弹出层对话框不可拖动，全局通用，默认为true
  // dialogMaskOpacity: 0.4,       // 设置透明遮罩层的透明度，全局通用，默认值为0.1
  // dialogMaskBgColor: "#000",    // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
  // imageUpload: false,
  // imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
  // imageUploadURL: "./php/upload.php",
  // onload: function() {
  //    // this.fullscreen();
  //    // this.unwatch();
  //    // this.watch().fullscreen();
  //    // this.setMarkdown("#PHP");
  //    // this.width("100%");
  //    // this.height(480);
  //    // this.resize("100%", 640);
  // },
};
export {
  defaultConfig,
};
