import request from '@/utils/request'

export function groupList(params) {
  return request({
    url: '/group/list',
    method: 'get',
    params
  })
}

export function addGroup(data) {
  return request({
    url: '/group/add',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/group/update',
    method: 'put',
    data
  })
}

export function deleteGroup(ids) {
  return request({
    url: '/group/delete',
    method: 'delete',
    params: { ids }
  })
}

export function getGroupInfo(id) {
  return request({
    url: '/group/info',
    method: 'get',
    params: { id }
  })
}

export function getAssignedUserList(groupId) {
  return request({
    url: '/group/assigned-users',
    method: 'get',
    params: { groupId }
  })
}

export function assignUsers(data) {
  return request({
    url: '/group/assign-users',
    method: 'post',
    data
  })
}
