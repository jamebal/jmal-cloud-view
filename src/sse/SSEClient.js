import Bus from "@/assets/js/bus";
import _ from "lodash";
import store from "@/store";
import { generateUUID } from "ant-design-vue/lib/vc-select/util";

let eventSource = null;
let timer = null;
const uuid = generateUUID();

const throttledConnectSSE = _.throttle((username) => {
  if (typeof EventSource !== 'undefined') {
    // 判断cookie中是否有token
    if (store.getters.name) {
      connectToSSE(username);
    }
  } else {
    console.error('EventSource is not supported by the browser');
  }
}, 3000);

function connectToSSE(username) {

  if (eventSource) {
    // 移除之前的事件监听器
    eventSource.removeEventListener('message', handleMessage);
    eventSource.removeEventListener('error', handleError.bind(null, username));
  }

  const url = `/api/events?username=${username}&uuid=${uuid}`;
  eventSource = new EventSource(url);

  eventSource.addEventListener('message', handleMessage);
  eventSource.addEventListener('error', handleError.bind(null, username));
}

function handleMessage(event) {
  const msg = JSON.parse(event.data);
  onMessage(msg);
}

function handleError(username) {
  eventSource.close();
  throttledConnectSSE(username);
}

function clearExistingTimer() {
  if (timer) {
    clearInterval(timer);
  }
}

function onMessage(msg) {
  const { url, body } = msg;
  const eventMapping = {
    synced: 'msg/synced',
    taskProgress: 'msg/taskProgress',
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
}

export function initiateSSE(username) {
  throttledConnectSSE(username);
}

