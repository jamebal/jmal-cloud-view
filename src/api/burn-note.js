import request from '@/utils/request'

/**
 * 创建阅后即焚笔记
 */
export function createBurnNote(data) {
  return request({
    url: '/public/burn-notes/create',
    method: 'post',
    data
  })
}

/**
 * 检查笔记是否存在
 */
export function checkBurnNote(id) {
  return request({
    url: `/public/burn-notes/${id}/check`,
    method: 'get'
  })
}

/**
 * 查询是否允许访客使用阅后即焚功能
 */
export function getAllowGuestBurnNote() {
  return request({
    url: `/burn-notes/allow-guest-burnNote`,
    method: 'get'
  })
}

/**
 * 设置是否允许访客使用阅后即焚功能
 */
export function setAllowGuestBurnNote(params) {
  return request({
    url: `/burn-notes/allow-guest-burnNote`,
    method: 'put',
    params
  })
}

/**
 * 读取并消费笔记
 */
export function consumeBurnNote(id) {
  return request({
    url: `/public/burn-notes/${id}`,
    method: 'delete'
  })
}

/**
 * 确认删除
 */
export function confirmDelete(id) {
  return request({
    url: `/public/burn-notes/${id}/confirm-delete`,
    method: 'delete'
  })
}

/**
 * 获取阅后即焚笔记列表
 */
export function getBurnNotes() {
  return request({
    url: `/burn-notes/list`,
    method: 'get'
  })
}

/**
 * 删除阅后即焚笔记
 */
export function deleteBurnNote(noteId) {
  return request({
    url: `/burn-notes/delete/${noteId}`,
    method: 'delete'
  })
}
