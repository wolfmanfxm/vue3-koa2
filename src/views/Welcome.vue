<script >
export default {
    name: 'welcome',
    props: [
        'msg'
    ]
}
</script>

<!-- <script setup>
defineProps({
    msg: String
})
</script> -->

<template>
    <div class="welcome">
        <div class="content">
            <div class="sub-title">欢迎使用</div>
            <div class="title">后台管理系统</div>
            <div class="desc">Vue3+ElementPlus+Koa2+MongoDB</div>
        </div>
        <div class="img"></div>
    </div>
</template>

<style lang="scss">
.welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #fff;
    .content {
        position: relative;
        bottom: 40px;
        .sub-title {
            font-size: 30px;
            line-height: 42px;
            color:#333;
        }
        .title {
            font-size: 40px;
            line-height: 62px;
            color:#409eff;
        }
        .desc {
            text-align: right;
            font-size: 14px;
            color: #999;
        }
    }
    .img {
        margin-left: 100px;
        background-image: url('@/assets/images/welcome.png');
        width: 371px;
        height: 438px;
    }
}
</style>
