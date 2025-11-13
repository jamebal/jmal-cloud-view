import request from '@/utils/request'

/**
 * 创建阅后即焚笔记
 */
export function createBurnNote(data) {
  return request({
    url: '/burn-notes/create',
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
