/**
 * S3 直传上传器 (兼容版)
 * 支持小文件简单上传、大文件分片上传、并发控制、断点续传、错误重试和暂停/恢复。
 *
 */
import api from '@/api/file-api';

class AbortError extends Error {
  constructor(message = 'Upload aborted by user') {
    super(message);
    this.name = 'AbortError';
  }
}

export const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024
export const PLATFORM_S3 = 'minio'

export default class S3DirectUploader {
  // --- 使用下划线约定私有属性 ---
  _chunkSize;
  _concurrency;
  _simpleUploadThreshold;
  _retryCount;
  _retryDelay;

  // --- 回调函数 ---
  _onProgress;
  _onSuccess;
  _onError;
  _onStart;

  // --- 内部状态管理 ---
  _aborted = false;
  _paused = false;
  _activeXhrs = new Map();
  _uploadCache = new Map();
  _partProgress = new Map();
  _completedSize = 0;
  _totalFileSize = 0;
  _uploadStartTime = 0;
  _uploaderFile = null;

  constructor(options = {}) {
    this._chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
    this._concurrency = options.concurrency || 3;
    this._simpleUploadThreshold = options.simpleUploadThreshold || DEFAULT_CHUNK_SIZE;
    this._retryCount = options.retryCount || 3;
    this._retryDelay = options.retryDelay || 1000;

    this._onProgress = options.onProgress || (() => {});
    this._onSuccess = options.onSuccess || (() => {});
    this._onError = options.onError || (() => {});
    this._onStart = options.onStart || (() => {});
  }

  // --- 公共控制方法 ---

  start() {
    this._aborted = false;
  }

  abort() {
    this._aborted = true;
    this._paused = false;
    this._activeXhrs.forEach((xhr, partNumber) => {
      try {
        xhr.abort();
      } catch (e) {
        console.warn(`Failed to abort xhr for part ${partNumber}:`, e);
      }
    });
    this._activeXhrs.clear();
  }

  pause() {
    this._paused = true;
  }

  resume() {
    if (!this._paused) return;
    this._paused = false;
  }

  // --- 内部状态和进度计算 ---

  _reset() {
    this.abort();
    this._aborted = false;
    this._paused = false;
    this._partProgress.clear();
    this._completedSize = 0;
    this._totalFileSize = 0;
    this._uploadStartTime = 0;
    this._uploaderFile = null;
  }

  _calculateTotalProgress() {
    let currentUploadedSize = this._completedSize;
    this._partProgress.forEach(({ loaded }) => {
      currentUploadedSize += loaded;
    });
    return currentUploadedSize;
  }

  _updateProgress() {
    if (!this._uploaderFile) return;
    const uploadedSize = this._calculateTotalProgress();
    const progress = this._totalFileSize > 0
      ? Math.round((uploadedSize / this._totalFileSize) * 100)
      : 0;

    const elapsed = (Date.now() - this._uploadStartTime) / 1000;
    const speed = elapsed > 0 ? uploadedSize / elapsed : 0;

    this._onProgress(this._uploaderFile, progress, speed, uploadedSize, this._totalFileSize);
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  // --- 核心上传逻辑 ---

  async upload(uploaderFile, objectName, params = {}) {
    this._reset();
    this._onStart(uploaderFile);
    this._uploaderFile = uploaderFile;
    this._totalFileSize = uploaderFile.file.size;
    this._uploadStartTime = Date.now();

    try {
      let result;
      if (uploaderFile.file.size < this._simpleUploadThreshold) {
        result = await this._simpleUpload(objectName, params);
      } else {
        result = await this._multipartUpload(objectName, params);
      }
      if (!this._aborted) {
        this._onSuccess(this._uploaderFile);
      }
      return result;
    } catch (error) {
      if (!(error instanceof AbortError)) {
        this._onError(this._uploaderFile, error);
      }
      throw error;
    }
  }

  // --- 简单上传 ---

  async _simpleUpload(objectName, params) {
    const file = this._uploaderFile.file;

    const presignRes = await api.getPresignedUploadUrl({
      objectName,
      contentType: file.type || 'application/octet-stream',
      fileSize: file.size,
      ...params
    });

    if (!presignRes.data) {
      throw new Error('Failed to get presigned URL for simple upload');
    }

    return new Promise((resolve, reject) => {
      if (this._aborted) return reject(new AbortError());

      const xhr = new XMLHttpRequest();
      this._activeXhrs.set('simple', xhr);

      xhr.open('PUT', presignRes.data);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          this._completedSize = e.loaded;
          this._updateProgress();
        }
      };

      xhr.onload = () => {
        this._activeXhrs.delete('simple');
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ success: true, merge: false });
        } else {
          reject(new Error(`Simple upload failed with status ${xhr.status}: ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => {
        this._activeXhrs.delete('simple');
        reject(new Error('Network error during simple upload'));
      };

      xhr.onabort = () => {
        this._activeXhrs.delete('simple');
        reject(new AbortError());
      };

      xhr.send(file);
    });
  }

  // --- 分片上传 ---

  async _multipartUpload(objectName, params) {
    const file = this._uploaderFile.file;
    const totalParts = Math.ceil(file.size / this._chunkSize);

    const { uploadId, presignedUrls, completedParts } = await this._initOrResumeMultipart(file, objectName, totalParts, params);

    try {
      const allParts = await this._uploadPartsConcurrently(file, objectName, totalParts, presignedUrls, completedParts);

      if (this._aborted) throw new AbortError();

      allParts.sort((a, b) => a.partNumber - b.partNumber);

      await api.completeMultipartUpload({
        objectName,
        uploadId,
        parts: allParts,
        fileTotalSize: file.size,
        ...params
      });

      this._uploadCache.delete(this._getCacheKey(file, objectName));
      return { success: true, merge: false };
    } catch (error) {
      if (error instanceof AbortError) {
        await this._abortMultipartUpload(objectName, uploadId, params);
        this._uploadCache.delete(this._getCacheKey(file, objectName));
      }
      throw error;
    }
  }

  _getCacheKey(file, objectName) {
    return `${objectName}_${file.size}_${file.lastModified}`;
  }

  async _initOrResumeMultipart(file, objectName, totalParts, params) {
    const cacheKey = this._getCacheKey(file, objectName);
    const cachedInfo = this._uploadCache.get(cacheKey);

    if (cachedInfo && cachedInfo.uploadId) {
      console.log('Resuming multipart upload from cache...');
      this._completedSize = cachedInfo.completedParts.reduce((acc, part) => acc + part.size, 0);
      return cachedInfo;
    }

    const initRes = await api.initMultipartUpload({
      objectName,
      contentType: file.type || 'application/octet-stream',
      ...params
    });
    if (!initRes.data) {
      throw new Error('Failed to initialize multipart upload');
    }

    const uploadId = initRes.data;

    const urlsRes = await api.getMultipartPresignUrls({
      objectName,
      uploadId,
      totalParts,
      ...params
    });
    if (!urlsRes.data) {
      throw new Error('Failed to get multipart presigned URLs');
    }

    const newInfo = {
      uploadId,
      objectName,
      presignedUrls: urlsRes.data,
      completedParts: []
    };

    this._uploadCache.set(cacheKey, newInfo);
    return newInfo;
  }

  async _uploadPartsConcurrently(file, objectName, totalParts, presignedUrls, completedParts) {
    const partsToUpload = [];
    const completedPartNumbers = new Set(completedParts.map(p => p.partNumber));

    for (let i = 1; i <= totalParts; i++) {
      if (!completedPartNumbers.has(i)) {
        partsToUpload.push(i);
      }
    }

    const results = [...completedParts];
    const queue = [...partsToUpload];

    const worker = async () => {
      while (queue.length > 0) {
        if (this._aborted) throw new AbortError();

        while (this._paused) {
          await this._sleep(200);
          if (this._aborted) throw new AbortError();
        }

        const partNumber = queue.shift();
        if (partNumber === undefined) break;

        const start = (partNumber - 1) * this._chunkSize;
        const end = Math.min(start + this._chunkSize, file.size);
        const chunk = file.slice(start, end);

        try {
          const result = await this._uploadPartWithRetry(presignedUrls[partNumber], chunk, partNumber);
          const resultWithSize = {...result, size: chunk.size};
          results.push(resultWithSize);

          this._completedSize += chunk.size;
          const cacheKey = this._getCacheKey(file, objectName);
          const cached = this._uploadCache.get(cacheKey);
          if (cached) {
            cached.completedParts.push(resultWithSize);
          }

          this._updateProgress();
        } catch (error) {
          this.abort();
          throw error;
        }
      }
    };

    const workers = Array(this._concurrency).fill(null).map(() => worker());
    await Promise.all(workers);

    return results;
  }

  async _uploadPartWithRetry(url, chunk, partNumber) {
    for (let attempt = 1; attempt <= this._retryCount; attempt++) {
      try {
        return await this._uploadSinglePart(url, chunk, partNumber);
      } catch (error) {
        if (error instanceof AbortError) {
          throw error;
        }
        console.warn(`Part ${partNumber} upload attempt ${attempt} failed. Retrying in ${this._retryDelay}ms...`, error.message);
        if (attempt === this._retryCount) {
          throw new Error(`Part ${partNumber} failed to upload after ${this._retryCount} attempts.`);
        }
        await this._sleep(this._retryDelay);
      }
    }
    throw new Error(`Upload logic error for part ${partNumber}`);
  }

  _uploadSinglePart(url, chunk, partNumber) {
    return new Promise((resolve, reject) => {
      if (this._aborted) return reject(new AbortError());

      const xhr = new XMLHttpRequest();
      this._activeXhrs.set(partNumber, xhr);

      xhr.open('PUT', url);

      this._partProgress.set(partNumber, { loaded: 0, total: chunk.size });

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          this._partProgress.set(partNumber, { loaded: e.loaded, total: e.total });
          this._updateProgress();
        }
      };

      xhr.onload = () => {
        this._activeXhrs.delete(partNumber);
        this._partProgress.delete(partNumber);

        if (xhr.status >= 200 && xhr.status < 300) {
          const etag = (xhr.getResponseHeader('ETag') || '').replace(/"/g, '');
          resolve({ partNumber, etag });
        } else {
          reject(new Error(`Part ${partNumber} HTTP error: ${xhr.status} ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => {
        this._activeXhrs.delete(partNumber);
        this._partProgress.delete(partNumber);
        reject(new Error(`Part ${partNumber} network error`));
      };

      xhr.onabort = () => {
        this._activeXhrs.delete(partNumber);
        this._partProgress.delete(partNumber);
        reject(new AbortError(`Part ${partNumber} aborted`));
      };

      xhr.send(chunk);
    });
  }

  async _abortMultipartUpload(objectName, uploadId, params) {
    console.log(`Aborting multipart upload: ${uploadId}`);
    try {
      await api.abortMultipartUpload({
        objectName,
        uploadId,
        ...params
      });
    } catch (error) {
      console.error('Failed to abort multipart upload on S3:', error);
    }
  }
}
