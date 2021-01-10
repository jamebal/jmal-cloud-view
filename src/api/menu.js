import request from '@/utils/request'
const qs = require('qs')

export default {
  menuTree(params) {
    return request({
      url: '/menu/tree',
      method: 'get',
      params
    })
  },
  // 权限标识列表
  authorityList(params) {
    return request({
      url: '/menu/authorities',
      method: 'get',
      params
    })
  },
  // 菜单信息
  menuInfo(params) {
    return request({
      url: '/menu/info',
      method: 'get',
      params
    })
  },
  add(data) {
    return request({
      url: '/menu/add',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: 'menu/update',
      method: 'put',
      data
    })
  },
  delete(params) {
    return request({
      url: '/menu/delete',
      method: 'delete',
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  }
}

