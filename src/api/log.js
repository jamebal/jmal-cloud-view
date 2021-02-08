import request from '@/utils/request'
const qs = require('qs')

export default {
  logList(params) {
    return request({
      url: '/log/list',
      method: 'get',
      params
    })
  },
}

