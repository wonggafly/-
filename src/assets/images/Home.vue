<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="home-container">
        <!-- 判断是否是home页面，是home页面才显示home页面 -->
        <template v-if="showHome">
            <div class="search-container">
                <img :src="logo" alt="">
                <van-search @focus="$router.push('/home/search')" v-model="value" placeholder="请输入搜索关键词" />
            </div>
            <div class="banner-container">
                <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                    <van-swipe-item v-for="(item, index) in banner" :key="item.id">
                        <img v-lazy="item.img" alt="" @click="jump(item.url)">
                    </van-swipe-item>
                </van-swipe>
            </div>
            <van-grid square>
                <van-grid-item v-for="(item, index) in displayList" :key="item.img" icon="photo-o" text="文字" :to="item.url">
                    <div class="grid">
                        <img :src="item.img" alt="">
                        <div>{{ item.text }}</div>
                    </div>
                </van-grid-item>
            </van-grid>
            <van-divider dashed>商品展示</van-divider>
            <div class="shopList">
                <Goods v-for="item in shopList" :key="item.id" :data="item" @click="handle"></Goods>
            </div>
            <BackTop :num="100"></BackTop>
        </template>
        <router-view />
    </div>
</template>

<script>
import { fetchBanner, fetchShopList } from '@/api/request'
import BackTop from '@/components/BackTop.vue'
import Goods from '@/components/Goods.vue'
export default {
    data () {
        return {
            value: '',
            logo: require('@/assets/images/logo.png'),
            banner: [],
            shopList: [],
            showHome: true,
            displayList: [
                { img: require('@/assets/images/menu10.png'), text: '数码电器', url: '/goodslist' },
                { img: require('@/assets/images/menu19.png'), text: '今日头条', url: '/newslist' },
                { img: require('@/assets/images/menu18.png'), text: '美图欣赏' },
                { img: require('@/assets/images/menu13.png'), text: '分类' },
                { img: require('@/assets/images/menu15.png'), text: '9.9元拼单' },
                { img: require('@/assets/images/menu12.png'), text: '话费充值' },
                { img: require('@/assets/images/menu16.png'), text: '物流查询' },
                { img: require('@/assets/images/menu17.png'), text: '查看更多' }
            ]
        }
    },
    created () {
        this._fetchBanner()
        this._fetchShopList()
    },
    beforeRouteUpdate (to, from, next) {
        if (to.name !== 'home') {
            this.showHome = false
        } else {
            this.showHome = true
        }
        next()
    },
    methods: {
        async _fetchBanner () {
            let { message } = await fetchBanner()
            this.banner = message
        },
        async _fetchShopList () {
            let { message } = await fetchShopList()
            this.shopList = message
        },
        onClear () {
            this.value = ''
        },
        jump (url) {
            console.log(url)
        },
        handle (data, e) {
            this.$router.push('/goodsDetail/' + data.id) // 跳转
        }
    },
    components: {
        Goods,
        BackTop
    }
}
</script>

<style lang="scss" scoped>
.home-container {
    padding-bottom: 50px;

    .search-container {
        height: 50px;
        display: flex;

        .van-search {
            flex: 1;
        }
    }

    .banner-container {

        .van-swipe {
            height: 180px;

            .van-swipe-item {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    .van-grid {
        .van-grid-item {
            .grid {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: #0d0e11;

                img {
                    width: 50%;
                }
            }
        }
    }

    .van-divider {
        margin: 8px 0;
    }

    .shopList {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        background-color: #f0ecef;
        padding-top: 5px;
        color: #0d0e11;
    }
}
</style>
