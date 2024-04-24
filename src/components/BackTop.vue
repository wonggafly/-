<template>
    <div v-show="isshow" id="top" class="top_container">
        <slot>Top</slot>
    </div>
</template>

<script>
export default {
    props: {
        num: {
            type: Number,
            default: 150
        }
    },
    data() {
        return {
            isshow: false
        }
    },
    mounted() {
        let top = document.getElementById('top');
        document.addEventListener('scroll', () => {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > this.num) {
                this.isshow = true
            } else {
                this.isshow = false
            }
        });
        top.onclick = function () {
            document.documentElement.scrollTop = document.body.scrollTop = 0
        }
    },
}
</script>

<style lang="less" scoped>
.top_container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 14px;
    background-color: rgb(173, 171, 171);
    color: rgb(250, 250, 250);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 30px;
    bottom: 100px;
}
</style>