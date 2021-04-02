// 获取DOM元素到页面顶部的距离
export function getElementToPageTop(el) {
  if (el.className.indexOf('parent-grid-item') > -1) {
    return el.offsetTop
  }
  if (el.parentElement) {
    return getElementToPageTop(el.parentElement) + el.offsetTop
  }
  return el.offsetTop
}
// 获取DOM元素到页面左边的距离
export function getElementToPageLeft(el) {
  if (el.className.indexOf('parent-grid-item') > -1) {
    return el.offsetLeft
  }
  if (el.offsetParent) {
    return getElementToPageLeft(el.offsetParent) + el.offsetLeft
  }
  return el.offsetLeft
}
