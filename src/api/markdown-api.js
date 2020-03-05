import request from '@/utils/request'
// const qs = require('qs')

export default {
  getMarkdown: function(params) {
    return request({
      url: 'public/p',
      method: 'get',
      params
    })
  },
}
