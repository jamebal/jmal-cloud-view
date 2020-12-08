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
  // 编辑文档 /markdown/edit
  editMarkdown: function(data) {
    return request({
      url: '/markdown/edit',
      method: 'post',
      data
    })
  },
  // 删除草稿 /markdown/deleteDraft
  deleteDraft: function(params) {
    return request({
      url: '/markdown/deleteDraft',
      method: 'delete',
      params
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
