<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="50"
        :immediate-check="false"
        >
        <!-- 文章列表 -->
        <ArtileItem
          v-for="item in articleList"
          :key="item.index"
          :obj="item"
          @dislikeEv="dislikeFn"
          @reportEv="reportFn"
        ></ArtileItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArtileItem from '../pages/GoodsList.vue'
import { articlesListAPI, articleDislikeAPI, articleReportsAPI } from '../api/index2'
import { Notify } from 'vant'
export default {
  components: {
    ArtileItem
  },
  props: {
    channel_Id: Number // 频道id
  },
  data () {
    return {
      articleList: [], // 文章列表
      loading: false,
      finished: false,
      theTime: new Date().getTime(), // 用于分页
      isLoading: false
    }
  },
  async created () {
    this.getArticleListFn()
  },
  methods: {
    async getArticleListFn (isRefresh) {
      const { data: res } = await articlesListAPI({
        channelId: this.channel_Id,
        timestamp: this.theTime
      })
      // eslint-disable-next-line no-console
      console.log(res)
      if (isRefresh) {
        // 证明是下拉刷新；新数据在前，旧数据在后
        // this.articleList = [新数据在后, 旧数据在前]
        this.articleList = [...res.data.results, ...this.articleList]
        this.isLoading = false
      } else {
        // 证明是上拉加载更多；旧数据在前，新数据在后
        // this.articleList = [旧数据在前, 新数据在后]
        this.articleList = [...this.articleList, ...res.data.results]
        this.theTime = res.data.pre_timestamp
        this.loading = false
      }
      if (res.data.pre_timestamp === null) {
        // 证明没有下一页数据了，直接把 finished 改为 true，表示数据加载完了！
        this.finished = true
      }
    },
    onLoad () {
      this.getArticleListFn()
    },
    onRefresh () {
      this.nextTime = null
      this.articleList = [] // 清空文章列表
      this.getArticleListFn()
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    },
    // 文章不感兴趣方法
    async dislikeFn (id) {
      await articleDislikeAPI({
        artId: id
      })
      Notify({ type: 'success', message: '反馈成功' })
    },
    // 举报文章方法
    async reportFn (id, value) {
      await articleReportsAPI({
        artId: id,
        type: value
      })
      Notify({ type: 'success', message: '举报成功' })
    }
  }
}
</script>

<style>

</style>
