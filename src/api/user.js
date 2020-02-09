import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'user/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'get'
  })
}
