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
 * 获取上传进度
 */
export function getProgress(id) {
  return request({
    url: `/public/burn-notes/${id}/progress`,
    method: 'get'
  })
}
