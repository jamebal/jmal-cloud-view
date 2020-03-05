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
  // 获取markdown内容 /markdown/add
  addMarkdown: function(data) {
    return request({
      url: '/markdown/add',
      method: 'post',
      data
    })
  },
}
