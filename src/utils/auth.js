import Cookies from "js-cookie";
const cookieKey = 'current-admin-userName'

export function getCookie() {
  return Cookies.get(cookieKey)
}

export function setCookie(current_userName) {
  return Cookies.set(cookieKey, current_userName,{ expires: 1 })
}
export function removeCookie(){
  return Cookies.remove(cookieKey)
}