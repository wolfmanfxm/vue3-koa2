<script >
import Welcome from './Welcome.vue'; // vite 项目引用一定要加 .vue 后缀，否则无法识别

export default {
    name: 'login',
    components: {
        Welcome
    },
    methods: {
        goHome() {
            this.$router.push('/welcome')
        }
    }
}
</script>

<!-- <script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => {
    router.push('/welcome')
}
</script> -->

<template>
    <h1>login</h1>
    <Welcome msg="propMsg" />

    <el-button @click="goHome">go welcome</el-button>
</template>

<style >
</style>
