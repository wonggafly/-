<template>
<div class="wrapper">
    <header class="clearfix">
        <GoBack></GoBack>
        <div class="left title">
            <h1>购物车</h1>
            <p>共<span> {{goods.length}} </span>件</p>
        </div>
    </header>
    <van-checkbox-group class="card-goods" v-model="checkedGoods">
        <van-swipe-cell
            class="card-goods__item"
            v-for="(value, key) in goods"
            :key="key"
        >
            <van-checkbox
                :name="value"
            />
            <van-card
            :title="value.name"
            :price="value.price"
            :num="value.quantity">
            <template slot="thumb">
                <router-link :to="{name: 'detail', params: {id:value.good_id}}">
                <van-image
                lazy-load
                fit="cover"
                :src="value.url"
                >
                    <template v-slot:loading>加载中</template>
                    <template v-slot:error>加载失败</template>
                </van-image>
                </router-link>
            </template>
            <template slot="num">
                <van-stepper v-model="value.quantity" prop="value" @change="changeQuantity(value, $event)"/>
            </template>
            </van-card>
            <template slot="right">
                <van-button square type="danger" prop="value" text="删除" @click="deleteGood(value)"/>
            </template>
        </van-swipe-cell>
    </van-checkbox-group>
    <van-submit-bar
    :price="totalPrice"
    :disabled="!checkedGoods.length"
    :button-text="submitBarText"
    @submit="onSubmit">
    <van-checkbox class="all-checked" @click="allChecked" v-model="ifAllChecked">全选</van-checkbox>
    </van-submit-bar>
</div>
</template>

<script>
import { Card, Checkbox, CheckboxGroup, SubmitBar, Stepper, SwipeCell, Button, Toast } from 'vant';
import GoBack from '@/components/GoBack'

export default {
    components: {
        [Card.name]: Card,
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup,
        [SubmitBar.name]: SubmitBar,
        [Stepper.name]: Stepper,
        [SwipeCell.name]: SwipeCell,
        [Button.name]: Button,
        GoBack
    },
    data() {
        return {
            checkedGoods: [],
            goods: [],
            number: 1,
            ifAllChecked: false
        }
    },
    computed: {
        submitBarText() {
            /* 用于计算结算栏的文本内容。其中，方法首先获取已勾选商品的数量，然后根据数量返回对应的结算文本字符串。 */
            const count = this.checkedGoods.length;
            return '结算' + (count ? `(${count})` : '');
        },
        /* 用于计算已勾选商品的总价 */
        totalPrice () {
            let totol = 0
            this.checkedGoods.forEach(element => {
                totol += element.price * element.quantity
            })
            return totol*100
        }
    },
    methods: {
        /*用于从服务端获取购物车列表数据。 具体来说，
        它使用了axios插件发送了一个GET请求到服务端的'/classes/cart'接口 */
        getList () {
            this.$axios.get(
                '/classes/cart',
                {params: {
                    where: {'username': this.$store.state.username}
                }}
            )
            .then(res => {
                this.goods = res.results
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err=>{
            })
        },
        /* 发送 PUT 请求修改购物车中某一商品的数量，参数为该商品的 objectId 和新的数量。 */
        changeQuantity(value, quantity){
            this.$axios.put(
                `/classes/cart/${value.objectId}`,
                {
                    quantity: quantity
                }
            )
            // eslint-disable-next-line no-unused-vars
            .then(res => {
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err=>{
            })
        },
        // 删除商品
        deleteGood (value) {
            this.$axios.delete(
                `/classes/cart/${value.objectId}`
            )
            // eslint-disable-next-line no-unused-vars
            .then(res => {
                this.getList()
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err=>{
            })
        },
        /* 判断是否全选，如果是，则将 checkedGoods 数组清空；否则将 goods 数组赋值给 checkedGoods。 */
        allChecked(){
            this.checkedGoods = this.goods.length === this.checkedGoods.length ? [] : this.goods
        },
        onSubmit() {
            Toast('暂无后续逻辑~')
        }
    },
    created () {
        this.getList()
    },
    watch: {
        // 当checkedGoods发生变化时，会执行函数。函数的作用是判断全部的商品是否被选中，若全部选中则将ifAllChecked属性设为true，否则设为false。
        checkedGoods: function () {
            this.ifAllChecked = this.goods.length === this.checkedGoods.length ? true : false
        }
    }
}
</script>

<style lang="less" scoped>
header{
    padding: 10px;
    background: white;
    position: fixed;
    top:0;
    z-index: 999;
    width: 100%;
    .title{
        margin-left: 30px;
    }
    h1{
        color: #1989fa;
        font-size: 20px;
        margin-bottom: 5px;
    }
    p{
        font-size: 14px
    }
    span{
        color: #1989fa;
        font-weight: bold      
    }
    .edit{
        color: #1989fa;
        margin-top:10px;
        border: none
    }
}
 /deep/ .card-goods{
    background-color: #fff;
    margin-top:65px;
    margin-bottom: 50px;
    &__item{
        position: relative;
        background-color: #fafafa;
        .van-card__header{
            margin-left: 20px
        }
        .van-card__title{
            width: 115px;
            margin-bottom: 10px;
        }
        .van-checkbox__label{
            width: 100%  !important;
            height: auto; // temp
            box-sizing: border-box;
            padding-left: 20px;
        }
        .van-checkbox__icon{
            top: 50%;
            z-index: 1;
            left:5px;
            position: absolute;
            margin-top: -10px;
        }
    }
    .van-swipe-cell{
        .van-button{
            height: 100px;
        }
    }
    /deep/.van-card__thumb{
        .van-image{
            height: 75px;
            width: 75px;
            img{
                object-fit:cover!important
            }
        }
    }
}
.van-submit-bar{
    bottom:50px;
}
.all-checked{
    margin-left: 10px;
}
</style>
