import request from '@/utils/request'

export default {
  categories(params) {
    return request({
      url: 'category/list',
      method: 'get',
      params
    })
  },
  categoryTree(params) {
    return request({
      url: 'category/tree',
      method: 'get',
      params
    })
  },
  categoryInfo(params) {
    return request({
      url: 'category/info',
      method: 'get',
      params
    })
  },
  add(data) {
    return request({
      url: 'category/add',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: 'category/update',
      method: 'put',
      data
    })
  },
  delete(name) {
    return request({
      url: 'category/delete',
      method: 'delete',
      params: {name}
    })
  }
}

