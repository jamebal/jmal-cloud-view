const url = process.env.VUE_APP_WEBSOCKET;
let stompClient = '';
let isConnected = false;
let timer = '';

export default {
  stompClient,
  timer,
  url,
  isConnected,
}
