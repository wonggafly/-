<template>
<div class="detail">
    <!-- 加载图标 -->
    <div v-if="loading" class="center" >
        <van-loading type="spinner" color="#1989fa"/>
    </div>
    <div v-else>
        <!-- 返回上一个页面components -->
        <GoBack></GoBack>
        <!-- 轮播图 -->
        <van-swipe class="goods-swipe" :autoplay="4000">
            <van-swipe-item v-for="(value,key) in 3" :key="key">
                <van-image
                fit="cover"
                :src="good.picture.url"
                >
                </van-image>
            </van-swipe-item>
        </van-swipe>
        <van-cell-group>
            <van-cell>
                <div class="goods-title">{{ good.name }}</div>
                <div class="goods-price">￥{{ good.price }}</div>
            </van-cell>
            <van-cell class="goods-express">
                <van-col span="10">运费：{{ good.fare }}</van-col>
                <van-col span="14">销量：{{ good.saleVolume }}</van-col>
            </van-cell>
        </van-cell-group>
        <van-cell-group class="goods-cell-group">
            <van-cell value="进入店铺" icon="shop-o" is-link @click="sorry">
                <template slot="title">
                    <span class="van-cell-text">蛋黄之家</span>
                    <van-tag class="goods-tag" type="danger">官方</van-tag>
                </template>
            </van-cell>
            <van-cell title="线下门店" icon="location-o" is-link @click="sorry" />
        </van-cell-group>
        <van-cell-group class="goods-cell-group">
            <van-cell title="查看商品详情" is-link @click="sorry" />
        </van-cell-group>
        <van-goods-action>
            <van-goods-action-icon icon="star-o" @click="toggleFavorite">
                收藏
            </van-goods-action-icon>
            <van-goods-action-icon icon="cart-o" @click="$router.push('/cart')">
                购物车
            </van-goods-action-icon>
            <van-goods-action-button type="warning" @click="changeCart">
                加入购物车
            </van-goods-action-button>
            <van-goods-action-button type="danger" @click="sorry">
                立即购买
            </van-goods-action-button>
        </van-goods-action>
    </div>
</div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { Tag, Col, Cell, CellGroup, Swipe, Toast, SwipeItem, GoodsAction, GoodsActionIcon, GoodsActionButton, Loading } from 'vant';
import GoBack from '@/components/GoBack'
export default {
    components: {
        [Tag.name]: Tag,
        [Col.name]: Col,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [GoodsAction.name]: GoodsAction,
        [GoodsActionIcon.name]: GoodsActionIcon,
        [GoodsActionButton.name]: GoodsActionButton,
        GoBack
    },
    data() {
        return {
            loading: false,
            finish: true,  // 防止连点购物车，请求完成后才能发起新请求
            good: {},  // 商品列表
            cartId: null,   // 购物车Id
            cartQuantity: 0,    // 购物车数量
        }
    },
    methods: {
        /*  用于通过 Axios 发送 HTTP GET 请求，获取指定 ID 的商品信息 */
        getList () {
            return this.$axios.get(
                `/classes/Goods/${this.$route.params.id}`,
            )
        },
        /*  它使用 Axios 库向服务器发出一个 GET 请求来获取购物车中特定商品的信息。
        其中，请求的 URL 是 '/classes/cart'，参数中的 'where' 指定了查询条件，
        即要筛选出 'good_id' 等于路由参数中的 'id'，并且 'username' 等于 Vuex 
        store 中的 'username' 的购物车记录。在请求成功后，
        该方法会返回一个 Promise 对象，可以通过调用 then() 方法来处理响应数据。 */
        getCart () {
            return this.$axios.get(
                '/classes/cart',
                {params: {
                    where: {
                        'good_id': this.$route.params.id,
                        'username': this.$store.state.username
                    }
                }}
            )
        },
        // 添加购物车
        /*  通过调用 then() 方法来处理响应数据，将返回的响应结果中的 'objectId'
        赋值给组件中的 'cartId'，将商品数量赋值为1，将 'finish' 属性设为 
        'true'，最后使用 Toast 组件提示用户成功添加到购物车中。
        将商品数量赋值为1，并将 'finish' 属性设为 'true'，表示购物车添加完成。
        最后使用 Toast 组件提示用户成功添加到购物车中。 */
        addCart () {
            this.finish = false /* 表示购物车添加失败 */
            this.$axios.post(
                '/classes/cart',
                {
                    good_id: this.good.objectId,
                    name: this.good.name,
                    url: this.good.picture.url,
                    price: this.good.price,
                    username: this.$store.state.username,
                    quantity: 1
                }
            )
            .then(res => {
                this.cartId = res.objectId
                this.cartQuantity = 1
                this.finish = true
                Toast('已加入购物车~')
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err=>{
                this.finish = true
                Toast('加入购物车失败，请重试')
            })
        },
        /* 体实现是发送一个 PUT 请求到 /classes/cart/${this.cartId} ，
        更新购物车中的商品数量为 this.cartQuantity，并在成功时弹出一个提示信息，
        失败时提示添加失败并将数量减1。this.finish 用于控制添加购物车的 loading 状态。 */
        putCart () {
            this.finish = false
            this.cartQuantity += 1
            this.$axios.put(
                `/classes/cart/${this.cartId}`,{
                    quantity: this.cartQuantity
            })
            // eslint-disable-next-line no-unused-vars
            .then(res => {
                this.finish = true
                Toast('已加入购物车~')
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err=>{
                this.finish = true
                this.cartQuantity -= 1
                Toast('加入购物车失败，请重试')
            })
        },
        // 如果没有登录就点击加入购物车，就会跳到登录页面让用户先登录
        changeCart () {
            if(this.$store.state.token){
                if(this.finish){
                    this.cartId ? this.putCart() : this.addCart()
                }
            } else {
                Toast('请先登录!')
                this.$router.push('/user/login')
            }
        },
        sorry() {
            Toast('暂无后续逻辑~')
        },
        toggleFavorite () {
            
        }
    },
    /*这段代码是一个 Vue 组件的 created 钩子函数，用于在组件实例被创建后发送两个并行请求来获取商品列表和购物车信息。
    当两个请求都完成后，将商品数据赋值给 this.good 并将购物车中的商品数量和 ID 分别赋值给 this.cartQuantity 
    和 this.cartId。最后根据商品名设置页面标题，
    并将 loading 状态设为 false。如果请求出错或被拒绝，将不会发生任何操作。 */
    created () {
        this.loading = true
        this.$axios.all([this.getList(), this.getCart()])
        .then(this.$axios.spread((good, cart) => {
            this.$nextTick(() => {
                this.good = good
            })
            if(cart.results[0]){
                this.cartId = cart.results[0].objectId
                this.cartQuantity = cart.results[0].quantity
            }
        }))
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
        })
        .finally(() => {
            document.title = this.good.name
            this.loading = false
        })
    }
}
</script>

<style lang="less" scoped>
.center{
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center
}
.detail {
    padding-bottom: 50px;
    .goback{
        color: white;
    }
    .van-image {
        width: 100vw;
        height: 60vw;
    }
    .goods-title {
        font-size: 16px;
    }
    .goods-price {
        color: #f44;
    }
    .goods-express {
        color: #999;
        font-size: 12px;
        padding: 5px 15px;
    }
    .goods-cell-group {
        margin: 15px 0;

        .van-cell__value {
        color: #999;
        }
    }
    .goods-tag {
        margin-left: 5px;
    }
}
</style>
