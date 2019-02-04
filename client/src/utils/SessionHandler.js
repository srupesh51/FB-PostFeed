import cookie from "react-cookies";
export const setCookie = (key,value) => {
  cookie.save(key, value, { path: '/' });
}
export const getCookie = (key) => {
  return cookie.load(key);
}
export const deleteCookie = (key) => {
  cookie.remove(key);
}
