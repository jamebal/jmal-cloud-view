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

export function userList(params) {
  return request({
    url: 'user/userList',
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
    method: 'put',
    data
  })
}

export function addUser(data) {
  return request({
    url: 'user/add',
    method: 'post',
    data
  })
}

export function validOldPass(data) {
  return request({
    url: 'valid-old-pass',
    method: 'post',
    data
  })
}

export function updatePass(data) {
  return request({
    url: 'user/update-pass',
    method: 'put',
    data
  })
}

export function resetPass(id) {
  return request({
    url: 'user/reset-pass',
    method: 'put',
    params: {id}
  })
}

export function delUser(id) {
  return request({
    url: 'user/delete',
    method: 'delete',
    params: {id}
  })
}


