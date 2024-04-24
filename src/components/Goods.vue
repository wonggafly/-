<template>
    <div class="item" @click="sendDataToParent">
        <div class="shopImg">
            <img v-lazy="data.img_url" alt="">
        </div>
        <div class="shopContent">{{ data.title }}</div>
        <div class="shopPrice">
            <slot name="footer">
                <span>￥ {{ data.sell_price }}</span>
                <span>{{ data.buy }} 购买</span>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        sendDataToParent(event) {
            this.$emit('click', this.data, event);
        }
    }
}
</script>

<style lang="less" scoped>
.item {
    width: 48%;
    box-sizing: border-box;
    margin-bottom: 5px;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    background-color: #fff;
    border-radius: 8px;
    padding: 5px;

    .shopImg {
        width: 100%;
        height: 140px;

        img {
            width: 100%;
            height: 100%;
            border-radius: 8px 8px 0 0;
        }
    }

    .shopContent {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 5px 0;
        font-size: 14px;
    }

    .shopPrice {
        width: 100%;
        display: flex;
        font-size: 14px;
        justify-content: space-between;
        align-items: center;

        :nth-of-type(1) {
            color: #ff8d85;
        }

        :nth-of-type(2) {
            color: #9c9c9e;
            font-size: 12px;
        }
    }
}
</style>