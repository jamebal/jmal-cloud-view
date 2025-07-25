// utils/dragUploadUtils.js

/**
 * 拖拽上传相关工具函数
 */

// 特殊路由 - 完全禁止拖拽上传
const SPECIAL_ROUTES = ['/recently', '/document', '/audio', '/image', '/video']

// 禁用拖拽路由 - 需要特定条件才允许
const NO_DRAG_ROUTES = ['/favorite', '/mount', '/trash', '/tag']

/**
 * 检查是否禁止拖拽上传
 * @param {Object} route - 路由对象 { path, query }
 * @returns {boolean}
 */
export function isNotDragUploadAllowed(route) {
  if (!route) return false

  const { path, query = {} } = route
  const { keyword, searchOpenFolder } = query || {}

  // 标准化路径
  const normalizedPath = path ? path.replace(/\/$/, '') : ''

  // 三种禁用拖拽的条件
  const isSpecialRoute = SPECIAL_ROUTES.includes(normalizedPath)
  const isNoDragRoute = NO_DRAG_ROUTES.includes(normalizedPath) && !query.path
  const isSearchWithoutFolder = keyword && !searchOpenFolder

  return isSpecialRoute || isNoDragRoute || isSearchWithoutFolder
}

/**
 * 检查是否允许拖拽上传
 * @param {Object} route - 路由对象 { path, query }
 * @returns {boolean}
 */
export function isDragUploadAllowed(route) {
  return !isNotDragUploadAllowed(route)
}

