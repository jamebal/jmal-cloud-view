import request from '@/utils/request'

export default {
  sync(params) {
    return request({
      url: 'setting/sync',
      method: 'get',
      params
    })
  }
}
