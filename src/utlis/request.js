// 基于 axios 封装的请求模块
import router from '@/router'
import ajax from 'axios'
import { Notify } from 'vant'
// 新建一个新的axios实例
const axios = ajax.create({
  baseURL: 'http://toutiao.itheima.net', // 基地址
  timeout: 2000
})
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 当状态码为2xx/3xx开头的进这里
  // 对响应数据做点什么
  return config
}, function (error) {
  // 响应状态码4xx/5xx进这里
  // 对响应错误做点什么
  // 只有401表示身份过期，需要重新登录
  if (error.response.status === 401) {
    Notify({ type: 'warning', message: '身份已过期' })
    router.push({ path: '/login' })
  }
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

// 导出自定义函数, 参数对象解构赋值
export default ({ url, method = 'GET', params, data, headers }) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })
}
