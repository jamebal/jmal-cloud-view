import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: 'user/userInfo',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'get'
  })
}

export function userUpdate(data) {
  return request({
    url: 'user/update',
    method: 'post',
    data
  })
}
