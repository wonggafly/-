//导入请求
import axios from './index.js';

export function fetchBanner() {
    return axios.get('/getlunbo');
}

export function fetchShopList(limit = 10) {
    return axios.get(`/recommend?limit=${limit}`);
}

//新闻列表接口
export function fetchnewsList(page = 1, limit = 6) {
    return axios.get(`/getnewslist?page=${page}&pagesize=${limit}`);
}

//新闻详情接口
export function fetchNewsDetail(newsid) {
    return axios.get(`/getnew/${newsid}`);
}

//发布评论接口
export function fetchNewsComments(id, page = 1) {
    return axios.get(`/getcomments/${id}?page=${page}`);
}

//发送评论接口
export function fetchPostComments(id, content) {
    return axios.post(`/postcomment/${id}`, content);
}

//商品轮播图接口
export function fetchGoodsImage(id) {
    return axios.get(`/getthumbimages/${id}`);
}

//商品详情接口
export function fetchGoodsInfo(id) {
    return axios.get(`/getgoodsinfo/${id}`);
}

//搜索结果接口
export function fetchSearch(option) {
    let { value, sort, order, page, pagesize } = option;
    return axios.get(`/search/?value=${value}&sort=${sort}&order=${order}&page=${page}&pagesize=${pagesize}`);
}

//获取订单结果接口
export function fetchOrder(option) {
    return axios.post('/order', option);
}

//获取购物车列表接口
export function fetchShopCarList(ids) {
    return axios.get(`/getshopcarlist/${ids}`);
}

