import SockJS from  'sockjs-client';
import  Stomp from './stomp-index';
import ws from './websocket_config';

export function toConnection(username,token) {
  connect(username,token);
  // 断开重连机制,尝试发送消息,捕获异常发生时重连
  ws.timer = setInterval(() => {
    try {
      if(ws.isConnected){
        ws.stompClient.send("test");
      }else{
        connect(username,token);
      }
    } catch (err) {
      connect(username,token);
    }
  }, 10000);
}

function connect(username,token){
  //地址+端点路径，构建websocket链接地址,注意，对应config配置里的addEndpoint
  let socket = new SockJS(ws.url + '/mq' + '?name='+username+'&jmal-token='+token);
  // 获取STOMP子协议的客户端对象
  ws.stompClient = Stomp.over(socket);
  // 定义客户端的认证信息,按需求配置
  ws.headers = {
    Authorization:token
  };
  // 向服务器发起websocket连接
  ws.stompClient.connect(ws.headers,() => {
    ws.isConnected = true;
  }, (err) => {
    ws.isConnected = false;
    // 连接发生错误时的处理函数
    console.log(err);
  });

}

export function disconnect() {
  if (ws.stompClient) {
    ws.stompClient.disconnect();
  }
  clearInterval(ws.timer);
}
