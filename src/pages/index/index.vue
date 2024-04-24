<!-- eslint-disable vue/no-unused-vars -->
<template>
<div class="wrapper">
    <!-- 轮播图 -->
    <!--  这个轮播图的代码没有直接调用接口。而是使用了 Vant 组件库中的 van-swipe
    组件和 van-swipe-item 组件来实现轮播图的效果，
    其中 v-for 指令根据 images 数组中的数据循环展示图片 -->
    <van-swipe :autoplay="4000" indicator-color="white">
        <van-swipe-item  v-for="(value,key) in images" :key="key">
            <img v-lazy="value" />
        </van-swipe-item>
    </van-swipe>
    <van-divider>猜你喜欢</van-divider>
    <!--用于首页展示商品列表。如果商品数据为空且未在加载中，就会展示一个“暂无数据”的图片。
    之后会展示一个无序列表，可以使用无限滚动获取更多数据。
    每个商品都会展示一张图片和商品名称、价格。如果在加载中，会展示一个Vue-loading组件。 -->
    <div class="may-like">
        <div class="tipImage" v-if="totalData.length === 0 && !loading">
            <img src="@/assets/images/empty.png" alt="暂无数据">
        </div>
        <!--  使用Vue的指令实现无限滚动翻页的功能。具体来说，
        它会在ul元素上绑定v-infinite-scroll指令，该指令会绑定一个方法getList，
        当滚动到ul元素底部时会触发该方法，从而实现获取更多数据。
        同时，使用infinite-scroll-disabled属性可以控制是否禁用无限滚动的功能，
        而infinite-scroll-distance属性则可以设置在距离底部多少像素的时候触发getList方法。 -->
        <ul
        class="clearfix"
        v-infinite-scroll="getList"
        infinite-scroll-disabled="forbidInfinite"
        infinite-scroll-distance="10"
        >
        <!-- 渲染列表 -->
        <li class="goods-item" v-for="(value,key) in totalData" :key="key">
            <div class="img-box">
                <router-link :to="{name: 'detail', params: {id:value.objectId}}">
                <van-image
                fit="cover"
                lazy-load
                :src="value.picture.url"
                >
                    <template v-slot:loading>加载中</template>
                </van-image>
                </router-link>
            </div>
            <div class="detail">
                <div class="title">{{value.name}}</div>
                <div class="price">￥{{value.price}}</div>
            </div> 
        </li>
        </ul>
        <!-- 加载动画 -->
        <van-loading class="tipImage" type="spinner" color="#1989fa" v-show="loading"/>
    </div>
    <div class="information" v-if="currentData.length === 0 && totalData.length>0">
        <dl>
            <dt>联系作者</dt>
            <dd>Email: <a href="2106541396@qq.com">2106541396@qq.com</a></dd>
        </dl>
    </div>
</div>
</template>

<script>
import { Swipe, SwipeItem, Divider,Lazyload } from 'vant';
/* 导入mint-ui组件 */
import { InfiniteScroll } from 'mint-ui';

export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [Divider.name]: Divider,
        [Lazyload.name]: Lazyload,
    },
    directives: {
        InfiniteScroll
    },
    data() {
        return {
            loading: false,/* 如果 loading 被设置为 true，那么页面上就会出现该 Loading 组件，反之则不会展示该组件。 */
            totalData: [],
            currentData: [undefined], // 保证初始值不为空，触发无限滚动
            page: 1,
            forbidInfinite: false, // 禁止无限滚动
            images: [
                // 轮播图
                'https://imgcps.jd.com/img-cubic/creative_server_cia_jdcloud/v2/2000268/100052560094/FocusFullshop/CkNqZnMvdDEvMTM1NjIxLzM0LzM1MDg1LzY4NzA0LzY0NmQxMmE3RjkxMzkyMTBiL2M4NGU5Nzg4NWZkYzc2NGEucG5nEgs1MDUtdHlfMF80MzABOIyLekIVChFUaGlua1BhZOeslOiusOacrBABQhEKDeenkuadgOS7tzQ0OTkQAkIQCgznq4vljbPmiqLotK0QBkIKCgbkvJjotKgQB1je0ePc9AI/cr_1125x449_0_166/s/q70.jpg',
                'https://imgcps.jd.com/ling4/10038702465753/5qih5Z2X55S15rqQ5YC85b6X6LSt/54m55oOg5aSn5pS-6YCB/p-60541365d250103053e030ee/f3093a90/cr_1125x449_0_166/s/q70.jpg',
                'https://m15.360buyimg.com/mobilecms/s1062x420_jfs/t1/86929/7/38591/51060/647ee8eaF1e591572/81faa3875530022c.jpg!cr_1053x420_4_0!q70.jpg'
            ],
        }
    },
    methods: {
        /*  这个函数将请求 /classes/Goods 的数据。请求参数包括 keys、order、limit、skip。 
        请求成功后，currentData 变量获取到新获取的结果，如果结果数量大于 0，则将获取到的结果拼接到 totalData
        变量中，并且将 page 加 1。同时，
        将 forbidInfinite 变量设置为 false，表示可以继续请求。最后，将 loading 变量设置为 false，表示加载结束。 
        如果请求出错，则仅将 loading 变量设置为 false，表示加载结束。 */
        getList () {
            this.loading = true;
            this.forbidInfinite = true
            this.$axios.get(
                '/classes/Goods',
                {params: {
                    keys: 'name,price,picture', // 要查询的字段，包括商品名称（name）、价格（price）和图片（picture）。
                    order: '-saleVolume', // 排序规则，按销售量（saleVolume）倒序排列。
                    limit: 4, // 数量4
                    skip: (this.page-1)*4, // 跳过的结果数量，根据当前页数（this.page）计算
                }}
            )
            .then(res => {
                this.currentData = res.results
                if(this.currentData.length>0){
                    this.totalData = this.totalData.concat(this.currentData)
                    this.page += 1
                    this.forbidInfinite = false
                }
                this.loading = false
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err=>{
                this.loading = false
            })
        },
        goToGoodsList(index) {
            if (index === 1) {
            this.$router.push({ path: '/goodsList' });
            }
        }
    },
    /* Vue.js 的生命周期钩子函数，表示当组件被创建时，调用 getList() 方法。
     getList() 方法可能是从后台获取数据或执行其他初始化操作的函数。 */
    created () {
        this.getList()
    }
}
</script>

<style lang="less" scoped>
.van-swipe{
    height: 50vw;
    img{
        width: 100%;
        height: 100%;
    }
}
.may-like{
    .goods-item{
        box-sizing: border-box;
        width: 50%;
        padding: 0 5px;
        float: left;
        margin: 5px 0;
        .van-image{
            width: 177px;
            height: 177px;
        }
        .detail{
            background: white;
            padding:10px;
        }
        .title{
            color: #666;
            font-size: 14px;
            padding-bottom:15px;        
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .price{
            font-size: 12px;
            color: #ff525e;
            font-weight: bold;
        }
    }
}
.tipImage{
    text-align: center;
    margin: 20px 0;
}
.information{
    font-size: 12px;
    color: white;
    background: black;
    padding: 10px 15px;
    dt{
        font-weight: bold;
        margin:5px 0 10px 0;
    }
    dd{
        margin:10px 0
    }
    a{
        color: white;
        cursor: pointer;
    }
}
    .container {
        display: flex;
        flex-wrap: wrap;
        background: #fff;
    }

    .image-container {
        width: 25%;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .image-container img {
        width: 55%;
        margin-bottom: 10px;
    }
</style>
