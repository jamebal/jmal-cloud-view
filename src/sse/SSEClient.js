import Bus from "@/assets/js/bus";

let eventSource = null;
let timer = null;

export function connectToSSE(username) {
  if (typeof (EventSource) !== 'undefined') {
    const url = `/api/events?username=${username}`;
    eventSource = new EventSource(url);
    eventSource.addEventListener('message', function (event) {
      const msg = JSON.parse( event.data);
      onMessage(msg)
    });
    eventSource.addEventListener('error', function (event) {
      eventSource.close()
    });
    // 清除定时器
    if (timer) {
      clearInterval(timer);
    }
    // 15s检测一次连接状态
    timer = setInterval(() => {
      if (eventSource.readyState === 2) {
        connectToSSE(username);
      }
    }, 15000);

  } else {
    console.error('EventSource is not supported by the browser');
  }
}

function onMessage(msg) {
  const url = msg.url
  if (url === 'synced') {
    Bus.$emit('msg/synced', msg)
  } else {
    Bus.$emit('msg/file/change', msg)
    if ('operationFile' === url) {
      let doc = msg.body
      if (doc.code === 0) {
        Bus.$notify({
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
        Bus.$emit('msg/file/operation/fault', 'fault')
        Bus.$notify({
          title: `${doc.operation}失败`,
          dangerouslyUseHTMLString: true,
          message: `<span style="font-size: 12px;">${doc.msg}</span>`,
          type: 'error'
        });
      }
    }
  }
}
