import request from '@/utils/request'

export default {
  sync(params) {
    return request({
      url: '/user/setting/sync',
      method: 'get',
      params
    })
  },
  isSync(params) {
    return request({
      url: '/user/setting/isSync',
      method: 'get',
      params
    })
  },
  updateNetdiskName(params) {
    return request({
      url: '/user/setting/update_netdisk_name',
      method: 'put',
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
  },
  getAccessTokenList(params) {
    return request({
      url: '/user/setting/accessTokenList',
      method: 'get',
      params
    })
  },
  generateAccessToken(params) {
    return request({
      url: '/user/setting/generateAccessToken',
      method: 'put',
      params
    })
  },
  deleteAccessToken(params) {
    return request({
      url: '/user/setting/deleteAccessToken',
      method: 'delete',
      params
    })
  },
  resetMenuAndRole() {
    return request({
      url: '/user/setting/resetMenuAndRole',
      method: 'put',
    })
  }
}

export function getWebstieRecord(params) {
  return request({
    url: '/public/website/record',
    method: 'get',
    params
  })
}

export function getSetting(params) {
  return request({
    url: '/website/setting',
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

export function getHeartwings(params) {
  return request({
    url: '/website/heartwings',
    method: 'get',
    params
  })
}
