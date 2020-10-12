
import $ from 'jquery'
import Vue from 'vue'
export const addCodeBtn = _ => {
  //markdown代码存放在pre code 标签对中
  $('pre code').each(function () {
    let lines = $(this).text().split('\n').length - 1
    //添加有序列表
    let $numbering = $('<ul/>').addClass('pre-numbering')
    //添加复制按钮，此处使用的是element-ui icon 图标
    let $copy = $('<i title="copy"/>').addClass('el-icon-document-copy code-copy')
    $(this)
      .parent()
      .addClass('code')
      .append($numbering)
      .append($copy)
    for (let i = 0; i <= lines -1 ; i++) {
      $numbering.append($('<li/>'))
    }
  })
  //监听复制按钮点击事件
  $('pre .code i.code-copy').click(e => {
    let text = $(e.target).siblings('code').text()
    let element = $('<textarea>' + text + '</textarea>')
    $('body').append(element)
    element[0].select()
    document.execCommand('Copy')
    element.remove()
    //这里是自定义的消息通知组件
    Vue.prototype.$message({
      message: '代码复制成功',
      type: 'success',
      duration: 1000,
    });
  })
}
