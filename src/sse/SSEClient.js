import Bus from "@/assets/js/bus";
import _ from "lodash";
import store from "@/store";
import {generateUUID} from "ant-design-vue/lib/vc-select/util";

let eventSource = null;
let timer = null;
let lastHeartbeat = new Date().getTime();

const uuid = generateUUID();

const throttledConnectSSE = _.throttle(username => {
  if (typeof (EventSource) !== 'undefined') {
    const url = `/api/events?username=${username}&uuid=${uuid}`;
    eventSource = new EventSource(url);
    eventSource.addEventListener('message', function (event) {
      if (event.data === 'h') {
        // 心跳包, 超过5s没有收到心跳包, 则关闭连接
        lastHeartbeat = new Date().getTime()
      } else {
        const msg = JSON.parse( event.data);
        onMessage(msg)
      }
    });
    eventSource.addEventListener('error', function (event) {
      eventSource.close()
      connectToSSE(username);
    });
    // 清除定时器
    if (timer) {
      clearInterval(timer);
    }
    // 3s检测一次连接状态
    timer = setInterval(() => {
      if (eventSource.readyState === 1) {
        // 心跳包, 超过5s没有收到心跳包, 则关闭连接
        if (new Date().getTime() - lastHeartbeat > 5000) {
          eventSource.close()
        }
      }
      if (eventSource.readyState === 2) {
        connectToSSE(username);
      }
    }, 3000);
  } else {
    console.error('EventSource is not supported by the browser');
  }
}, 3000);

export function connectToSSE(username) {
  throttledConnectSSE(username);
}

function onMessage(msg) {
  const url = msg.url
  if (url === 'synced') {
    store.dispatch('updateMessage', {event: 'msg/synced', data: msg})
  } else {
    store.dispatch('updateMessage', {event: 'msg/file/change', data: msg})
    if ('operationFile' === url) {
      let doc = msg.body
      if (doc.code === 0) {
        Bus.notify({
          title: `${doc.operation}成功`,
          dangerouslyUseHTMLString: true,
          message: `
                <div>
                  <p>form:</p>
                  <pre style="word-break: break-all;white-space: pre-wrap;font-size: 12px;">${doc.from}</pre>
                </div>
                <div>
                  <p>to:</p>
                  <pre style="word-break: break-all;white-space: pre-wrap;font-size: 12px;">${doc.to}</pre>
                </div>`,
          type: 'success',
        });
      } else {
        store.dispatch('updateMessage', {event: 'msg/file/operation/fault', data: msg});
        Bus.notify({
          title: `${doc.operation}失败`,
          dangerouslyUseHTMLString: true,
          message: `<span style="font-size: 12px;">${doc.msg}</span>`,
          type: 'error'
        });
      }
    }
  }
}
