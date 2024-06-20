// loadScript.js
export function loadScript(scriptUrl, type) {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载了相同的脚本
    const existingScript = Array.from(document.head.getElementsByTagName('script')).find(
      script => script.src === scriptUrl
    )
    if (existingScript) {
      resolve()
    } else {
      const script = document.createElement('script');
      script.src = scriptUrl;
      if (type)  {
        script.type = type
      }
      script.onload = () => {
        resolve()
      }
      script.onerror = () => {
        reject(new Error(`Failed to load script with URL ${scriptUrl}`));
      }
      document.head.appendChild(script);
    }
  })
}
