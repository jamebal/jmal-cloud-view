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
 * 读取并消费笔记
 */
export function consumeBurnNote(id) {
  return request({
    url: `/public/burn-notes/${id}`,
    method: 'delete'
  })
}
