<template>
<div class="login">
    <div class="login-poster">
        <div class="login-info">
            <img src="@/assets/images/login.jpg">
        </div>
    </div>
    <!--  使用了Vant组件库中的van-cell-group和van-field组件的Vue组件。其中，用于创建一个包含多个输入字段的表单组，
    用于创建一个单独的输入字段。这个表单组包含了两个输入字段，分别为“用户名”和“密码”，使用v-model绑定了Vue实例中的对应数据。
    同时，这两个字段均为必填项（required），且输入内容会被标签所描述
    （label）的名称提示。其中，密码输入框使用了type="password"属性，会将用户的输入内容隐藏。 -->
    <van-cell-group>
        <van-field
            v-model="username"
            required
            label="用户名"
            placeholder="请输入用户名"
        />
        <van-field
            v-model="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
        />
    </van-cell-group>
    <div class="button">
        <!-- 登录注册事件 -->
        <van-button type="default" @click="login">登录</van-button>
        <van-button type="info" @click="register">注册</van-button>
    </div>
</div>
</template>

<script>
/* 导入vant组件 */
import { CellGroup, Field, Button, Dialog } from 'vant';
// import AsyncValidator from 'async-validator'

export default {
    /* vant组件 */
    components: {
        [Field.name]: Field,
        [CellGroup.name]: CellGroup,
        [Button.name]: Button,
    },
    data () {
        return {
            username: '', // 用户名
            password: '',   // 密码
        }
    },
    methods: {
        /* 将用户凭证保存到本地存储和 Vuex store 中。res 包含从服务器返回的用户登录成功后的凭证信息，
        如 sessionToken 和 username。localStorage.setItem() 用于将这些信息保存到浏览器的本地存储中以便在
        不同的浏览器窗口和页面间共享。 */
        savaUser (res) {
            localStorage.setItem('token', res.sessionToken)
            localStorage.setItem('username', res.username)
            this.$store.commit('setState', {key: 'token', value: res.sessionToken})
            this.$store.commit('setState', {key: 'username', value: res.username})
        },
        /* 调用$axios实例的get方法发送了一个GET请求到/login接口 */
        login () {
            this.$axios.get(
                '/login',
                {params:{ 
                    'username': this.username,
                    'password': this.password
                }}
            )
            .then(res => {
                this.savaUser(res)
                Dialog({
                    message: '登录成功'
                }).then(() => {
                    this.$router.push('/index')
                })
            })
            .catch(err => {
                switch (err.code) {
                    case 210:
                        Dialog({
                            message: '用户名和密码不匹配'
                        })                
                        break
                    case 211:
                        Dialog.confirm({
                            message: '用户名不存在，是否自动注册？'
                        }).then(() => {
                            this.register()
                        })
                        break
                    default:
                        Dialog({
                            message: '登录失败。'
                        }) 
                        break
                }
            })
        },
        /* 调用$axios实例的post方法发送了一个post请求到/register接口 */
        register () {
            this.$axios.post(
                '/users',
                {
                    'username': this.username,
                    'password': this.password,
                }
            )
            .then(res => {
                this.savaUser(res),
                this.username = ''; // 清空用户名输入框的值
                this.password  = ''; // 清空密码输入框的值
                Dialog({
                    message: '注册成功',
                })
                // .then(() => {
                //     this.$router.push('/index')
                // })
            })
            .catch(err => {
                switch (err.code) {
                    case 217:
                        Dialog({
                            message: '注册失败，请输入用户名。'
                        })
                        break;
                    case 218:
                        Dialog({
                            message: '注册失败，请输入密码。'
                        })
                        break;
                    case 202:
                        Dialog({
                            message: '注册失败，用户名已存在。'
                        })
                        break;
                    default:
                        Dialog({
                            message: '注册失败。'
                        })
                        break;
                }
            })
        }
    }
};
</script>

<style lang="less" scoped>
.login {
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
        width: 100px;
        height: 100px;
        text-align: center;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            margin-bottom: 5px;
        }
    }
}
.van-cell-group {
    margin-top: 20px;
}
.tip{
    color: red;
    text-align: center;
    p{
        display: inline-block;
    }
}
.button{
    margin: 50px 0;
    text-align: center;
    .van-button{
        width: 100px;
        &:first-child{
            margin-right: 40px
        }
    }
}
</style>