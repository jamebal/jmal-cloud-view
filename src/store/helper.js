import { basePermissions } from '@/settings'
import api from '@/api'

export async function getUserInfo() {
  const res = await api.getUser()
  const { id, username, showName, avatar, netdiskName, netdiskLogo, newVersion } = res.data || {}
  return {
    id,
    username,
    avatar,
    showName,
    netdiskName,
    netdiskLogo,
    newVersion,
  }
}

export async function getMenus() {
  let asyncPermissions = []
  try {
    const res = await api.getMenus()
    asyncPermissions = res?.data || []
  }
  catch (error) {
    console.error(error)
  }
  return basePermissions.concat(asyncPermissions)
}
