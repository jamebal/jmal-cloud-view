export const fileOperations = {
  open: { iconClass: 'menu-open', label: '打开', operation: 'open' },
  remove: { iconClass: 'menu-remove', label: '删除', operation: 'remove', shortcut: ['Del'] },
  duplicate: { iconClass: 'duplicate', label: '创建副本', operation: 'duplicate' },
  download: { iconClass: 'menu-download', label: '下载', operation: 'download' },
  copy: { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
  rename: { iconClass: 'menu-rename', label: '重命名', operation: 'rename', shortcut: ['F2'] },
  copyOnly: { iconClass: 'menu-copy', label: '复制', operation: 'copyOnly', shortcut: [navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl', 'C'] },
}

export const fileArrangements = [
  { label: '名称', operation: 'orderName', orderProp: 'name'},
  { label: '大小', operation: 'orderSize', orderProp: 'size'},
  { label: '上传时间', operation: 'orderUploadDate', orderProp: 'uploadDate'},
  { label: '修改时间', operation: 'orderUpdateDate', orderProp: 'updateDate'},
]
