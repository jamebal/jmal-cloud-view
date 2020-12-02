import request from '@/utils/request'
const qs = require('qs')

export default {
  tagList(params) {
    return request({
      url: 'tag/list',
      method: 'get',
      params
    })
  },
  tagInfo(params) {
    return request({
      url: 'tag/info',
      method: 'get',
      params
    })
  },
  add(data) {
    return request({
      url: 'tag/add',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: 'tag/update',
      method: 'put',
      data
    })
  },
  delete(params) {
    return request({
      url: 'tag/delete',
      method: 'delete',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  }
}

