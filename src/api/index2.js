/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */
import request from '@/utlis/request'
import { getToken } from '@/utlis/token'
// 统一封装接口方法
// 接口方法, 只负责调用一个接口, 返回一个Promise对象
// 逻辑页面，导入这个接口方法，就能发请求

// 登录
export const loginAPI = ({ mobile, code }) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}
//  获取频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})
// 频道 - 用户已选列表
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels',
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

// 文章 - 获取列表
export const articlesListAPI = ({ channelId, timestamp }) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp: timestamp || (new Date()).getTime()
    }
  })
}

// 文章 - 不感兴趣
export const articleDislikeAPI = ({ artId }) => {
  return request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data: {
      target: artId
    }
  })
}

// 文章 - 举报
export const articleReportsAPI = ({ artId, type }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  data: {
    target: artId,
    type: type,
    remark: '其他问题'
  }
})
