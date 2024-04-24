<template>
<div class="wrapper">
    <!-- 搜索框 -->
    <van-search 
        placeholder="请输入搜索关键词"
        v-model="keyWord"
        show-action
        @search="onSearch"
        @cancel="onCancel"
    />
    <!-- 侧边导航 -->
    <van-sidebar v-model="activeKey" @change="changeSide">
        <van-sidebar-item title="全部" />
        <van-sidebar-item title="潮流服饰" />
        <van-sidebar-item title="食品酒水" />
        <van-sidebar-item title="家居用品" />
        <van-sidebar-item title="出行户外" />
        <van-sidebar-item title="日常" />
    </van-sidebar>
    <div class="good-wrapper">
        <div class="tipImage" v-if="totalData.length === 0 && !loading">
            <img src="@/assets/images/empty.png" alt="暂无数据">
        </div>
        <van-grid 
        :column-num="2"
        v-infinite-scroll="getList"
        infinite-scroll-disabled="forbidInfinite"
        infinite-scroll-distance="10"
        >
            <!-- 列表数据 -->
            <van-grid-item v-for="(value, key) in totalData" :key="key">
                <router-link :to="{name: 'detail', params: {id:value.objectId}}">
                <van-image
                lazy-load
                fit="cover"
                :src="value.picture.url"
                >
                    <template v-slot:loading>加载中</template>
                    <template v-slot:error>加载失败</template>
                </van-image>
                <span>{{value.name}}</span>
                </router-link>
            </van-grid-item>
        </van-grid>
        <!-- 加载图片 -->
        <van-loading class="tipImage" type="spinner" color="#1989fa" v-show="loading"/>
    </div>
</div>
</template>

<script>
import { Sidebar, SidebarItem, Grid, GridItem, Search } from 'vant';
import { InfiniteScroll } from 'mint-ui';

export default {
    components: {
        [Sidebar.name]: Sidebar,
        [SidebarItem.name]: SidebarItem,
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Search.name]: Search
    },
    directives: {
        InfiniteScroll
    },
    data() {
        return {
            loading: false,
            forbidInfinite: false, //禁止无限滚动
            activeKey: 0 ,  // 0: 全部, 1: 衣, 2: 食, 3: 住, 4: 行
            totalData: [],
            currentData: [undefined],
            page: 1,
            source: null, // 防止频繁切换tab重复请求，存放取消的请求方法
            keyWord: ''
        }
    },
    methods: {
        initializeItem () {
            this.totalData = []
            this.currentData = [undefined]
            this.page = 1
            // this.keyWord = ''
        },  //  初始化数据

        getList () {
            this.loading = true;
            this.forbidInfinite = true
            const _this = this;
            /* axios库发送了一个HTTP GET请求，访问了'/classes/Goods'接口，并传递了一些参数 */
            this.$axios.get(
                '/classes/Goods',
                {
                    params: {
                        keys: 'name,picture', /* 返回结果中需要包含的字段名称 */
                        limit: 4, // 限制返回结果的数量为 4。
                        skip: (this.page-1)*4, /* 跳过前面的 (this.page-1)*4 条数据，也就是分页时，根据当前页数计算需要跳过的数据数量。 */
                        /* 根据条件筛选返回结果。根据代码逻辑，这里是根据 'type' 字段进行筛选，如果 'activeKey' 
                        等于 0，则筛选 'type' 包含 1,2,3,4 中任意一个的数据，否则根据 'activeKey' 的值进行筛选。 */
                        where: {'type': this.activeKey ===0 ?{"$in":[1,2,3,4]} : this.activeKey} 
                    },
                    /* axios取消令牌 */
                    cancelToken: new this.$axios.CancelToken(function executor(c) {
                        _this.source = c;
                    })
                }
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
            .catch(function(thrown) {
                _this.loading = false
            })
        },
        changeSide () {
            if(typeof this.source ==='function'){
                this.source('cancel')   //取消请求
            }
            this.initializeItem()
            this.getList()
        },
        /* 搜索 */
        onSearch () {
            this.initializeItem() // 对控件进行初始化
            this.forbidInfinite = true //禁止进行无限滚动
            this.loading = true // 设置加载状态
            /*  通过Axios库发送GET请求，请求数据。
            请求路径是'/classes/Goods'，查询参数是keys和where，
            其中，keys表示需要返回的数据字段，where表示查询条件。 */
            this.$axios.get(
                '/classes/Goods',
                {params: {
                    keys: 'name,picture',
                    where: {
                        'type': this.activeKey ===0 ?{"$in":[1,2,3,4]} : this.activeKey,
                        /* 使用正则表达式来匹配包含关键词（keyWord）的name字段。 */
                        'name': {"$regex":`.*${this.keyWord}.*`} // regex操作符,用于模糊匹配
                    }
                }}
            )
            .then(res => {
                this.totalData = res.results
                this.loading = false
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err=>{
                this.loading = false
            })
        },
        // 取消
        onCancel(){
            this.keyWord = ''
        }
    },
    created () {
        this.getList()
    }
};
</script>

<style lang="less">
.van-search{
    position: fixed;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    top: 0;
    z-index: 999;
    width: 100%;
}
.van-sidebar-item--select{
    border-color: #1989fa;
    &:hover{
        text-decoration: none
    }
}
.van-sidebar{
    position: fixed;
    top: 54px;
}
.good-wrapper{
    margin: 54px 0 0 85px;
    .van-grid-item{
        img{
            width: 120px;
            height: 120px;
        }
        span{
            color: #666;
            font-family: "Microsoft YaHei";
            font-size: 10px;
            margin-top:5px;        
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: inline-block;
            width: 120px;
        }
    }
}
.tipImage{
    text-align: center;
    margin: 20px 0;
}
</style>
