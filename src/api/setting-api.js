import request from '@/utils/request'

export default {
  sync(params) {
    return request({
      url: '/user/setting/sync',
      method: 'get',
      params
    })
  },
  getWebp(params) {
    return request({
      url: '/user/setting/get/webp',
      method: 'get',
      params
    })
  },
  disabledWebp(params) {
    return request({
      url: '/user/setting/disabled/webp',
      method: 'put',
      params
    })
  }
}

export function getSetting(params) {
  return request({
    url: '/public/website/setting',
    method: 'get',
    params
  })
}

export function updateSetting(data) {
  return request({
    url: '/website/setting/update',
    method: 'put',
    data
  })
}
