export interface FetchConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'
  data?: any
  type?: 'json' | 'formData'
  auth?: boolean
  credentials?: 'include' | 'same-origin' | 'omit'
  repType?: 'json' | 'blob'
}
export interface HttpResult {
  msg?: string
  code?: number
  data?: any
}
const createFormData = (obj: any): FormData => {
  const data = new FormData()
  for (const key in obj) data.set(key, obj[key])
  return data
}
/**
 * asyncFetch
 * @param obj 
 * 
 * url: URL
 * method
 * data
 * type?: 'json' | 'formData'
 * auth?: boolean // Authorization add token 
 * credentials?: 'include' | 'same-origin' | 'omit'
 * repType?: 'json' | 'blob' // reponse data type 
 */
export const asyncFetch = async (obj: FetchConfig): Promise<HttpResult> => {
  const url = obj.url
  const method = obj.method || 'GET'
  const headers = new Headers()
  const credentials = obj.credentials || 'same-origin'
  const repType = obj.repType || 'json'
  if (obj.type === 'json') headers.append('Content-Type', 'application/json')
  if (obj.auth) {
    // TODO need write by yourself
    //headers.append('Authorization', getToken())
  }
  let confFetch: any = { method, headers, credentials }
  if (method === 'POST') {
    const body = obj.data || null
    if (obj.type === 'json') confFetch.body = JSON.stringify(body)
    else if (obj.type === 'formData') confFetch.body = createFormData(body)
  }
  return new Promise(function (resolve, reject) {
    fetch(url, confFetch)
      .then(response => {
        switch (response.status) {
          case 200: return repType === 'json' ? response.json() : response.blob()
          default: throw { message: response.status }
        }
      })
      .then(res => {
        if (repType !== 'json') resolve(res)
        else {
          const result: HttpResult = res as HttpResult
          if (result.code === 0) resolve(result)
          else reject({ message: result.msg })
        }

      })
      .catch((err: Error) => reject(err))
  })
}