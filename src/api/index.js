import axios from 'axios';
import store from '../store/index';

/* 默认请求头，其中包含了LeanCloud应用的ID和Key、当前用户的IM会话Token以及请求的数据格式（JSON） */
axios.defaults.headers = {
    "X-LC-Id": "bIbSPV8ltG9IPrIfzoAx4XQH-gzGzoHsz",
    "X-LC-Key": "II0ANcGFRzA9QfwEzrIeuG5j",
    "X-LC-IM-Session-Token": store.state.token,
    "Content-Type": "application/json",
}

axios.defaults.timeout = 2500, // axios发送请求时，设置了默认的请求超时时间为2500毫秒

axios.defaults.baseURL = 'https://leancloud.cn:443/1.1/'  //axios发送请求时，设置了默认的请求基本URL
/* 响应拦截器，用于对所有的响应结果进行处理 */
axios.interceptors.response.use(
    (res) => {
        return res.data
    },
    (err) => {
        return Promise.reject(err.response? err.response.data : err)
    }
)

export {
    axios
};