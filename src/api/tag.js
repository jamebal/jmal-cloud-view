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
  },
  // 修改标签排序
  setTagSort: function(data) {
    return request({
      url: '/tag/sort',
      method: 'post',
      data
    })
  },
  deleteFileTag: function(params) {
    return request({
      url: '/deleteTag',
      method: 'delete',
      params
    })
  },
  updateFileTag: function(params) {
    return request({
      url: '/updateTag',
      method: 'put',
      params
    })
  }
}

