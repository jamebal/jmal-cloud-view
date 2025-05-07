import request from '@/utils/request'

export default {
  logList(params) {
    return request({
      url: '/log/list',
      method: 'get',
      params
    })
  },
  getFileOperationHistory(params) {
    return request({
      url: '/log/getFileOperationHistory',
      method: 'get',
      params
    })
  },
}

