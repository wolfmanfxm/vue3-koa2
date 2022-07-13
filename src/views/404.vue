<template>
    <div class="not-found">
        404
        <button @click="goHome">返回首页</button>
    </div>
</template>

<script>
export default {
    name: 'notFound',
    methods: {
        goHome() {
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
.not-found {
    width: 100vw;
    height: 100vh;
    text-align: center;
    position: fixed;
    top: 50%;
}
</style>

















