
let host = window.location.host;
let url = `${document.location.protocol}//${host}`;
if(process.env.NODE_ENV === 'development'){
  if (window.location.port.length > 0) {
    host = window.location.host.substring(0, window.location.host.length - window.location.port.length - 1)
  }
  url = `${document.location.protocol}//${host}:8088`;
}
let stompClient = '';
let isConnected = false;
let timer = '';

export default {
  stompClient,
  timer,
  url,
  isConnected,
}
