import Bus from "@/assets/js/bus";
import store from "@/store";
import { generateUUID } from "ant-design-vue/lib/vc-select/util";

let eventSource = null;
let reconnectTimer = null; // 新增一个我们自己控制的重连计时器
const RECONNECT_INTERVAL = 5000; // 每 5 秒尝试一次
const uuid = generateUUID();

/**
 * 处理从服务器接收到的业务消息
 * @param {MessageEvent} event - SSE 消息事件
 */
function handleBusinessMessage(event) {
  try {
    const msg = JSON.parse(event.data);
    onMessage(msg);
  } catch (e) {
    console.error('Failed to parse message data:', event.data, e);
  }
}

/**
 * EventSource 错误处理器
 * 当连接丢失或无法建立时触发
 */
function handleError() {
  // 当 readyState 变为 CLOSED 时，意味着原生重连已放弃
  // 这通常是因为服务器返回了非 200 状态码
  if (eventSource && eventSource.readyState === EventSource.CLOSED) {
    console.warn('EventSource connection closed permanently. Attempting to restart after a delay.');
    // 启动我们自己的重连逻辑
    startManualReconnect();
  }
}

/**
 * 启动手动重连计时器
 */
function startManualReconnect() {
  // 防止重复启动计时器
  if (reconnectTimer) return;

  // 先关闭可能存在的旧的、已死掉的 eventSource 实例
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  reconnectTimer = setTimeout(() => {
    console.log('Attempting to manually reconnect SSE...');
    // 从 store 或其他地方获取当前用户名
    const username = store.getters.name;
    if (username) {
      connectToSSE(username);
    } else {
      console.error("Cannot reconnect: username not found.");
    }
  }, RECONNECT_INTERVAL);
}

/**
 * EventSource 连接成功打开时的处理器
 */
function handleOpen() {
  //console.log('EventSource connection established successfully.');
  // 连接成功，可以更新 UI 状态
  //store.dispatch('updateConnectionStatus', 'connected');
}

/**
 * 关闭当前的 SSE 连接
 */
function closeConnection() {
  if (eventSource) {
    eventSource.close(); // 这会阻止 EventSource 自动重连
    eventSource = null;
  }
}

/**
 * 连接到 SSE 服务
 * @param {string} username - 当前登录的用户名
 */
function connectToSSE(username) {

  // 如果已存在连接，先断开旧的，以防用户切换等场景
  terminateSSE()

  if (typeof EventSource === 'undefined') {
    console.error('EventSource is not supported by your browser.');
    return;
  }

  const url = `/api/events?username=${username}&uuid=${uuid}`;

  try {
    eventSource = new EventSource(url);

    // 1. 监听连接打开
    eventSource.onopen = handleOpen;

    // 2. 监听业务消息（这是默认事件）
    // 服务器发送的不带 "event:" 字段的数据会触发此监听器
    // 服务器的心跳（无论是注释行还是自定义事件名）都不会触发它
    eventSource.onmessage = handleBusinessMessage;

    // 3. 监听错误（这是自动重连的关键）
    eventSource.onerror = handleError;

  } catch (e) {
    console.error('Failed to create EventSource:', e);
  }
}

/**
 * 初始化 SSE 连接的入口函数
 * @param {string} username - 当前登录的用户名
 */
export function initiateSSE(username) {
  // 确保有用户名（即用户已登录）
  if (username) {
    connectToSSE(username);
  } else {
    console.warn('Cannot initiate SSE connection without a username.');
  }
}

/**
 * 组件卸载或用户登出时，应调用此函数清理连接
 */
export function terminateSSE() {
  clearTimeout(reconnectTimer);
  reconnectTimer = null;
  closeConnection();
}

function onMessage(msg) {
  const { url, body } = msg;
  const eventMapping = {
    synced: 'msg/synced',
    calculateFolderSizeProcessed: 'msg/calculateFolderSizeProcessed',
    taskProgress: 'msg/taskProgress',
    transcodeStatus: 'msg/transcodeStatus',
    uploaderChunkSize: 'uploaderChunkSize',
  };

  if (eventMapping[url]) {
    store.dispatch('updateMessage', { event: eventMapping[url], data: msg });
  } else {
    handleFileChangeMessage(msg, url, body);
  }
}

function handleFileChangeMessage(msg, url, body) {
  store.dispatch('updateMessage', { event: 'msg/file/change', data: msg });

  if (url === 'operationFile') {
    const { operation, from, to, code, msg: message } = body;
    const notificationOptions = {
      title: `${operation} ${code === 0 ? '成功' : '失败'}`,
      dangerouslyUseHTMLString: true,
      message: code === 0
        ? `
            <div>
              <p>from:</p>
              <pre style="word-break: break-all;white-space: pre-wrap;font-size: 12px;">${from}</pre>
            </div>
            <div>
              <p>to:</p>
              <pre style="word-break: break-all;white-space: pre-wrap;font-size: 12px;">${to}</pre>
            </div>`
        : `<span style="font-size: 12px;">${message}</span>`,
      type: code === 0 ? 'success' : 'error',
    };

    Bus.notify(notificationOptions);

    if (code !== 0) {
      store.dispatch('updateMessage', { event: 'msg/file/operation/fault', data: msg });
    }
  }

  if (url === 'operationTips') {
    const { operation, success, msg: message } = body
    const notificationOptions = {
      title: `${operation} ${success ? '成功' : '失败'}`,
      dangerouslyUseHTMLString: true,
      message: success ? '' : message ? `<span style="font-size: 12px;">${message}</span>` : '',
      type: success ? 'success' : 'error',
    }
    Bus.notify(notificationOptions)
  }

}

