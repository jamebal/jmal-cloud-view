export async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      Vue.prototype.$message.success('复制成功');
    } catch (err) {
      fallbackCopyText(text);
    }
  } else {
    fallbackCopyText(text);
  }
}

export function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', ''); // 防止手机端弹出键盘
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  // 兼容 Safari 和 Chrome 的选中文本方式
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length); // 额外设置范围，兼容 Safari
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      Vue.prototype.$message.success('复制成功');
    } else {
      Vue.prototype.$message.error('复制失败');
    }
  } catch (err) {
    console.error('execCommand 复制失败:', err);
    Vue.prototype.$message.error('复制失败');
  }
  document.body.removeChild(textarea);
}
