<script>
export default {
    name: 'MenuTree',
    props: {
        userMenu: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {

        }
    }
}
</script>

<template>
    <template v-for="menu in userMenu">
        <el-sub-menu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1" :key="menu._id" :index="menu.path">
            <template #title>
                <el-icon>
                    <component :is="menu.icon" />
                </el-icon>
                <span>{{ menu.menuName }}</span>
            </template>
            <menu-tree :userMenu="menu.children" />
        </el-sub-menu>
        <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu._id">{{ menu.menuName }}</el-menu-item>
    </template>
</template>