<template>
<div class="user-wrapper">
    <div class="user-poster">
        <div class="user-info">
            <!-- 用户头像 -->
            <img src="@/assets/images/dandan.jpeg">
            <!-- 用户名 -->
            <p>{{username}}</p>
        </div>
    </div>
    <!--  使用了Vant组件库中的van-row和van-col组件的Vue组件。
    其中，用于创建一个水平排列的栅格布局，
    用于创建一个栅格布局的列。 -->
    <van-row class="user-links">
        <van-col span="8">
            <van-icon name="pending-payment" />
            待付款
        </van-col>
        <van-col span="8">
            <van-icon name="records"/>
            待发货
        </van-col>
        <van-col span="8">
            <van-icon name="logistics"/>
            已发货
        </van-col>
    </van-row>
    <!--   一个 van-cell-group 组件和四个 van-cell 组件，分别代表收藏、收货地址、个人设置和登出当前账户的功能按钮。
    其中，@click 属性为组件的点击事件处理函数，在点击对应的按钮时会触发相应的操作。 -->
    <van-cell-group>
        <!-- 暂时没写逻辑 -->
        <van-cell icon="star-o" title="收藏" is-link @click="other"/>
        <!-- 只有页面 -->
        <van-cell icon="location-o" title="收货地址" is-link @click="toLocation"/>
        <!-- 暂时没写逻辑 -->
        <van-cell icon="points" title="个人设置" is-link/>
        <!-- 有写逻辑 -->
        <van-cell icon="close" title="登出当前账户" @click="logout" is-link />
    </van-cell-group>
</div>
</template>

<script>
import { Row, Col, Cell, CellGroup, Dialog,  AddressList, Icon } from 'vant';

export default {
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [AddressList.name]: AddressList,
        [Icon.name]: Icon
    },
    data () {
        return {
            username: this.$store.state.username
        }
    },
    methods: {
        logout(){
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            this.$store.commit('setState', {key: 'token', value: null})
            this.$store.commit('setState', {key: 'username', value: null})
            Dialog({
                message: '登出成功'
            }).then(() => {
                this.$router.push('/index')
            })
        },
        other () {
            this.$router.push('/other')
        },
        toLocation () {
            this.$router.push('/location')
        }
    }
};
</script>

<style lang="less" scoped>
.user {
    &-poster {
        width: 100%;
        height: 53vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('~@/assets/images/background.jpg');
        background-size: cover;
    }
    &-info {
        text-align: center;
        img{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 5px;
        }
        p{
            font-size: 20px;
            margin-top: 10px;
        }
    }
    &-group {
        margin-bottom: 15px;
    }
    &-links {
        padding: 15px 0;
        font-size: 12px;
        text-align: center;
        background-color: #fff;
        .van-icon {
        display: block;
        font-size: 24px;
        }
    }
}
.van-cell-group {
    margin-top: 20px;
}
</style>
