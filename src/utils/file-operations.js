export const fileOperations = {
  open: { iconClass: 'menu-open', label: '打开', operation: 'open' },
  remove: { iconClass: 'menu-remove', label: '删除', operation: 'remove', shortcut: ['Del'] },
  duplicate: { iconClass: 'duplicate', label: '创建副本', operation: 'duplicate' },
  download: { iconClass: 'menu-download', label: '下载', operation: 'download' },
  copy: { iconClass: 'menu-copy', label: '移动或复制...', operation: 'copy' },
  rename: { iconClass: 'menu-rename', label: '重命名', operation: 'rename', shortcut: ['F2'] },
  copyOnly: { iconClass: 'menu-copy', label: '复制', operation: 'copyOnly', shortcut: [navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl', 'C'] },
  detail: {
    iconClass: 'menu-details',
    label: '详情...',
    shortcut: ["space"],
    operation: 'details',
  }
}

export const directLinkSubMenus = [
  { label: '管理...', operation: 'manageDirectLink', iconClass: 'a-editlink_nor'},
  { label: '复制', operation: 'copyDirectLink', iconClass: 'copy-link'},
]

export const fileArrangements = [
  { label: '名称 - 顺序', operation: 'orderName-ascending', orderProp: 'name', order: 'ascending'},
  { label: '名称 - 倒序', operation: 'orderName-descending', orderProp: 'name', order: 'descending'},
  { divider: true, operation: 'divider' },
  { label: '大小 - 顺序', operation: 'orderSize-ascending', orderProp: 'size', order: 'ascending'},
  { label: '大小 - 倒序', operation: 'orderSize-descending', orderProp: 'size', order: 'descending'},
  { divider: true, operation: 'divider' },
  { label: '上传时间 - 顺序', operation: 'orderUploadDate-ascending', orderProp: 'uploadDate', order: 'ascending'},
  { label: '上传时间 - 倒序', operation: 'orderUploadDate-descending', orderProp: 'uploadDate', order: 'descending'},
  { divider: true, operation: 'divider' },
  { label: '修改时间 - 顺序', operation: 'orderUpdateDate-ascending', orderProp: 'updateDate', order: 'ascending'},
  { label: '修改时间 - 倒序', operation: 'orderUpdateDate-descending', orderProp: 'updateDate', order: 'descending'},
]

export const createFiles = [
  { label: '文件夹', operation: 'createFolder', iconClass: 'folder'},
  { divider: true, operation: 'divider' },
  { label: '文本', operation: 'createTextFile', iconClass: 'file-txt'},
  { label: '白板', operation: 'createExcalidrawFile', iconClass: 'file-excalidraw'},
  { label: '思维导图', operation: 'createMinderFile', iconClass: 'file-mind'},
  { label: '流程图', operation: 'createDrawioFile', iconClass: 'file-drawio'},
  { label: 'Word', operation: 'createWordFile', iconClass: 'file-word'},
  { label: 'Excel', operation: 'createExcelFile', iconClass: 'file-excel'},
  { label: 'PPT', operation: 'createPPTFile', iconClass: 'file-ppt'},
]
