<script>
export default {
    name: 'BreadCrumbs',
    computed: {
        breadPath() {
            return this.$route.matched
        }
    },
    mounted() {
        console.log('routes =>', this.$route)
    }
}
</script>

<template>
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in breadPath" :key="item.path">
            <router-link v-if="index == 0" to="/welcome">{{ item.meta.title }}</router-link>
            <span v-else>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>