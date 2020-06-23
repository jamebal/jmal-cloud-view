import request from '@/utils/request'
// const qs = require('qs')

export default {
  // 获取markdown内容
  getMarkdown: function(params) {
    return request({
      url: 'public/p',
      method: 'get',
      params
    })
  },
  // 添加文档 /markdown/add
  addMarkdown: function(data) {
    return request({
      url: '/markdown/add',
      method: 'post',
      data
    })
  },
  // 编辑文档 /markdown/edit
  editMarkdown: function(data) {
    return request({
      url: '/markdown/edit',
      method: 'post',
      data
    })
  },
  // 编辑文档 /markdown/edit
  editMarkdownByPath: function(data) {
    return request({
      url: '/markdown/edit1',
      method: 'post',
      data
    })
  },
}
