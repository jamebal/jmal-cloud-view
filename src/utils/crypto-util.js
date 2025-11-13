/**
 * 阅后即焚加密工具类
 * 使用 Web Crypto API (浏览器原生)
 */
export class BurnNoteCrypto {
  /**
   * 生成随机密钥（Base64URL 编码，512位）
   */
  static async generateKey() {
    const keyMaterial = window.crypto.getRandomValues(new Uint8Array(64))
    return this._arrayBufferToBase64URL(keyMaterial)
  }

  /**
   * 从密钥材料派生 AES-256 密钥
   */
  static async _deriveAESKey(keyMaterialBase64URL) {
    const keyMaterial = this._base64URLToArrayBuffer(keyMaterialBase64URL)

    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

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
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * 加密内容（文本 -> Base64URL）
   */
  static async encrypt(content, keyMaterialBase64URL) {
    try {
      const key = await this._deriveAESKey(keyMaterialBase64URL)
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const encoder = new TextEncoder()
      const data = encoder.encode(content)

      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128
        },
        key,
        data
      )

      // 拼接 IV + 密文
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
   * 解密内容（Base64URL -> 文本）
   */
  static async decrypt(encryptedBase64URL, keyMaterialBase64URL) {
    try {
      const key = await this._deriveAESKey(keyMaterialBase64URL)
      const combined = this._base64URLToArrayBuffer(encryptedBase64URL)

      // 提取 IV 和 密文
      const iv = combined.slice(0, 12)
      const encrypted = combined.slice(12)

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
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
   * 加密文件（流式处理 - 返回 Uint8Array 数组）
   */
  static async encryptFile(file, keyMaterialBase64URL, onProgress) {
    try {
      const key = await this._deriveAESKey(keyMaterialBase64URL)
      const CHUNK_SIZE = 1024 * 1024 // 1MB
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      const encryptedChunks = [] // Array<Uint8Array>

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)

        const arrayBuffer = await chunk.arrayBuffer()
        const iv = window.crypto.getRandomValues(new Uint8Array(12))

        const encrypted = await window.crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv: iv,
            tagLength: 128
          },
          key,
          arrayBuffer
        )

        const combined = new Uint8Array(iv.length + encrypted.byteLength)
        combined.set(iv, 0)
        combined.set(new Uint8Array(encrypted), iv.length)

        encryptedChunks.push(combined)

        if (onProgress) {
          onProgress(Math.round(((i + 1) / totalChunks) * 100))
        }
      }

      return {
        encryptedChunks,
        metadata: {
          originalName: file.name,
          originalSize: file.size,
          mimeType: file.type,
          totalChunks: totalChunks,
          chunkSize: CHUNK_SIZE,
          encryptedAt: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('文件加密失败:', error)
      throw new Error('文件加密失败')
    }
  }

  /**
   * 解密单个分片
   */
  static async decryptChunk(encryptedChunk, keyMaterialBase64URL) {
    try {
      const key = await this._deriveAESKey(keyMaterialBase64URL)
      const combined = new Uint8Array(encryptedChunk)

      // 提取 IV (前 12 字节) 和 密文
      const iv = combined.slice(0, 12)
      const encrypted = combined.slice(12)

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128
        },
        key,
        encrypted
      )

      return new Uint8Array(decrypted)
    } catch (error) {
      console.error('分片解密失败:', error)
      throw new Error('分片解密失败')
    }
  }

  /**
   * ArrayBuffer 转 Base64URL
   */
  static _arrayBufferToBase64URL(buffer) {
    const bytes = new Uint8Array(buffer);
    const CHUNK_SIZE = 8192;
    const chunks = [];

    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      chunks.push(String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE)));
    }

    const binary = chunks.join('');

    return window.btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Base64URL 转 ArrayBuffer
   */
  static _base64URLToArrayBuffer(base64url) {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')

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
