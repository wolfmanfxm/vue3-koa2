import { createRouter, createWebHashHistory } from "vue-router";
import Home from '@/components/Home.vue';


const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Home,
        redirect: 'welcome',
        children: [
            {
                name: 'welcome',
                path: 'welcome',    // 子路由路径前面不用加 / ，与父级拼接会自动添加，若加了 / ，就为 // ，该 path 会变为绝对路径（一级路由）
                meta: {
                    title: '欢迎'
                },
                component: () => import('@/views/Welcome.vue'),
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登陆'
        },
        component: () => import('@/views/Login.vue')
    },
    {
        name: 'system',
        path: '/system',
        meta: {
            title: '系统管理'
        },
        component: Home,
        children: [
            {
                name: 'user',
                path: 'user',    // 子路由路径前面不用加 / ，与父级拼接会自动添加，若加了 / ，就为 // ，该 path 会变为绝对路径（一级路由）
                meta: {
                    title: '用户管理'
                },
                component: () => import('@/views/User.vue'),
            },
            {
                name: 'menu',
                path: 'menu',
                meta: {
                    title: '菜单管理'
                },
                component: () => import('@/views/Menu.vue'),
            },
            {
                name: 'role',
                path: 'role',
                meta: {
                    title: '角色管理'
                },
                component: () => import('@/views/Role.vue'),
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router