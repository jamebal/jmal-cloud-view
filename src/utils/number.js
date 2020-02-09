// filters: {
//   numFilter (value) {
//     cutOutNum(value)
//   }
// }
//
/**
 * 对源数据截取decimals位小数，不进行四舍五入
 * @param {*} num 源数据
 * @param {*} decimals 保留的小数位数
 */
export const cutOutNum = (num, decimals) => {
  if (isNaN(num) || (!num && num !== 0)) {
    return '--'
  }
  // 默认为保留的小数点后两位
  const dec = decimals || 2
  // 源数据为整数或者小数点后面小于decimals位的不处理
  const pointIndex = String(num).indexOf('.') + 1 // 获取小数点的位置 + 1
  const pointCount = pointIndex ? String(num).length - pointIndex : 0 // 获取小数点后的个数(需要保证有小数位)
  if (pointIndex === 0 || pointCount <= dec) {
    return num
  }
  let realVal = ''
  // 截取当前数据到小数点后decimals位
  realVal = `${String(num).split('.')[0]}.${String(num).split('.')[1].substring(0, dec)}`
  // 判断截取之后数据的数值是否为0
  if (realVal === 0) {
    realVal = 0
  }
  return realVal
}
