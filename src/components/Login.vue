<script >
import Welcome from './Welcome.vue'; // vite 项目引用一定要加 .vue 后缀，否则无法识别

export default {
    name: 'login',
    components: {
        Welcome
    },
    mounted() {
        this.$request({
            method: 'get',
            url: '/login',
            data: {
                name: 'fang'
            }
        }).then((res) => {
            console.log(1, res)
        })

        // 部分项目组人员习惯此种使用方式，可给 request 函数增加属性，拓展使用
        // this.$request.get('/login', {name: 'fang'}, {mock: true, loading: true}).then((res) => {
        //     console.log(2, res)
        // })
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
