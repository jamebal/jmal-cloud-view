import request from '@/utils/request'
const qs = require('qs')

export default {
  roleList(params) {
    return request({
      url: '/role/list',
      method: 'get',
      params
    })
  },
  add(data) {
    return request({
      url: '/role/add',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: 'role/update',
      method: 'put',
      data
    })
  },
  delete(params) {
    return request({
      url: '/role/delete',
      method: 'delete',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  }
}

