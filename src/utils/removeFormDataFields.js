/**
 * 通用删除 FormData 指定字段的工具
 */

// 公共字段数组
export const COMMON_FORM_DATA_DELETE_FIELDS = ["personalization", "createdTime", "updatedTime"];

/**
 * 删除 FormData 中指定字段
 * @param {FormData} data - FormData 对象
 * @param {string[]} fields - 要删除的字段名数组
 */
export function removeFormDataFields(data, fields = COMMON_FORM_DATA_DELETE_FIELDS) {
  fields.forEach(field => data.delete(field));
}
