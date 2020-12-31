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
  // 修改文档排序 /markdown/sort
  sortMarkdown: function(data) {
    return request({
      url: '/markdown/sort',
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
  // 上传url形式图片
  uploadLinkImage: function(params) {
    return request({
      url: '/upload-markdown-link-image',
      method: 'post',
      data: params
    })
  },
  // 上传blob格式的图片
  uploadImage: function(data) {
    return request({
      url: '/upload-markdown-image',
      method: 'post',
      data: data
    })
  },
}
