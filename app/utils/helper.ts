/**
 * get url search object
 * @param url 
 */
export const getURLQuery = <T>(url: string): T => {
  const obj: any = {}
  const strArr = url.split('?')
  if (strArr.length < 2) return obj
  const str = strArr[1]
  const arr = str.split('&')
  arr.map((item) => {
    if (item) {
      const array = item.split('=')
      if (array.length > 1 && array[0].length > 0) obj[array[0]] = array[1]
    }
  })
  return obj
}
/**
 * get rnd number
 * @param n  min
 * @param m max
 */
export const getRandom = (n: number, m: number): number => {
  return Math.floor(Math.random() * (m - n + 1) + n)
}
export const formatDateByDate = (date: Date, flag: boolean = false) => {
  const year = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()
  if (flag) return `${year}-${M}-${D}`
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const h = hours < 10 ? `0${hours}` : `${hours}`
  const m = minutes < 10 ? `0${minutes}` : `${minutes}`
  const s = seconds < 10 ? `0${seconds}` : `${seconds}`
  return `${year}-${M}-${D} ${h}:${m}:${s}`
}
/**
 * copy the string
 * @param str 
 */
export const copyString = (str: string): boolean => {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('type', 'text')
  input.setAttribute('value', str)
  document.body.appendChild(input)
  input.setSelectionRange(0, 9999)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    document.body.removeChild(input)
    return true
  }
  document.body.removeChild(input)
  return false

}
export const base642Bolb = (data: string): Blob => {
  if (data.length === 0 || data === null) { return }
  data = data.split(',')[1]
  data = window.atob(data)
  const ia = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) { ia[i] = data.charCodeAt(i) }
  return new Blob([ia], { type: 'image/png' })
}
export const Bolb2Base64 = (blob: Blob): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (blob === null) { resolve(null) }
    const reader = new FileReader()
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = (err) => {
      reject(err)
    }
  })
}

//#region 
// set cache by lastTime, if get caceh time less than lastTime will return null
export interface CacheProp {
  data: any,
  lastTime: number
}
export const setCache = (key: string, data: any, lastTime: number) => {
  window.localStorage.setItem(key, JSON.stringify({ data, lastTime }))
}
export const getCache = <T>(key: string): T | null => {
  try {
    const result = window.localStorage.getItem(key)
    if (result && result.length > 0) {
      const res = JSON.parse(result) as CacheProp
      const now = new Date().getTime()
      if (now > res.lastTime) return null
      return res.data
    }
  } catch (error) {
    return null
  }
}
//#endregion