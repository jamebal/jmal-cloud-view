const ALGORITHM_NAME = 'AES-GCM'

/**
 * 阅后即焚加密工具类
 * 使用浏览器原生 Web Crypto API 实现 AES-256-GCM 加密和解密
 */
export class BurnNoteCrypto {

  /**
   * 生成随机密钥（Base64URL 编码）
   * @returns {Promise<string>} Base64URL 编码的密钥（64字节 = 512位）
   */
  static async generateKey() {
    // 生成 64 字节（512位）的随机密钥材料
    const keyMaterial = window.crypto.getRandomValues(new Uint8Array(64))

    // 转换为 Base64URL（URL 友好，无 +/= 字符）
    return this._arrayBufferToBase64URL(keyMaterial)
  }

  /**
   * 从密钥材料派生 AES-256 密钥
   * @private
   */
  static async _deriveAESKey(keyMaterialBase64URL) {
    const keyMaterial = this._base64URLToArrayBuffer(keyMaterialBase64URL)

    // 使用 PBKDF2 派生密钥
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    // 派生 AES-256 密钥
    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array([
          0x6a, 0x6d, 0x61, 0x6c, 0x63, 0x6c, 0x6f, 0x75,
          0x64, 0x2d, 0x62, 0x75, 0x72, 0x6e, 0x6e, 0x6f
        ]),
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: ALGORITHM_NAME, length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * 加密内容
   * @param {string} content - 明文内容
   * @param {string} keyMaterialBase64URL - Base64URL 编码的密钥材料
   * @returns {Promise<string>} Base64URL 编码的加密数据
   */
  static async encrypt(content, keyMaterialBase64URL) {
    try {
      const key = await this._deriveAESKey(keyMaterialBase64URL)
      const iv = window.crypto.getRandomValues(new Uint8Array(16))
      const encoder = new TextEncoder()
      const data = encoder.encode(content)

      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: ALGORITHM_NAME,
          iv: iv,
          tagLength: 128
        },
        key,
        data
      )

      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv, 0)
      combined.set(new Uint8Array(encrypted), iv.length)

      return this._arrayBufferToBase64URL(combined)
    } catch (error) {
      console.error('加密失败:', error)
      throw new Error('加密失败')
    }
  }

  /**
   * 解密内容
   * @param {string} encryptedBase64URL - Base64URL 编码的加密数据
   * @param {string} keyMaterialBase64URL - Base64URL 编码的密钥材料
   * @returns {Promise<string>} 解密后的明文
   */
  static async decrypt(encryptedBase64URL, keyMaterialBase64URL) {
    try {
      const key = await this._deriveAESKey(keyMaterialBase64URL)
      const combined = this._base64URLToArrayBuffer(encryptedBase64URL)
      const iv = combined.slice(0, 16)
      const encrypted = combined.slice(16)

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: ALGORITHM_NAME,
          iv: iv,
          tagLength: 128
        },
        key,
        encrypted
      )

      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    } catch (error) {
      console.error('解密失败:', error)
      throw new Error('解密失败，密钥可能不正确')
    }
  }

  /**
   * ArrayBuffer 转 Base64URL（URL 友好）
   * @private
   */
  static _arrayBufferToBase64URL(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    // 标准 Base64
    let base64 = window.btoa(binary)

    // 转换为 Base64URL：替换特殊字符，去除填充
    return base64
      .replace(/\+/g, '-')  // + 替换为
      .replace(/\//g, '_')  // / 替换为
      .replace(/=/g, '')    // 去除 = 填充
  }

  /**
   * Base64URL 转 ArrayBuffer
   * @private
   */
  static _base64URLToArrayBuffer(base64url) {
    // 还原为标准 Base64
    let base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    // 补充填充
    const padding = base64.length % 4
    if (padding > 0) {
      base64 += '='.repeat(4 - padding)
    }

    const binary = window.atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

}
