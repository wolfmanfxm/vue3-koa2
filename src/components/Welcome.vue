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
    <h1>welcome !</h1>
    <h2>{{ msg }}</h2>
    <!-- <el-button >to login</el-button> -->
    <router-link to="/login">to login</router-link>
</template>

<style >
</style>
