const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  showName: state => state.user.showName,
  userId: state => state.user.userId,
  userInfo: state => state.user.userInfo,
  menuList: state => state.user.menuList,
}
export default getters
