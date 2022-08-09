import { createRouter, createWebHashHistory } from "vue-router";
import Home from '@/components/Home.vue';
import storage from '@/utils/storage'
import utils from '@/utils/utils'
import API from '@/api'

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
        name: '404',
        path: '/404',
        meta: {
            title: '404'
        },
        component: () => import('@/views/404.vue')
    },
    // {
    //     name: 'system',
    //     path: '/system',
    //     meta: {
    //         title: '系统管理'
    //     },
    //     component: Home,
    //     children: [
    //         {
    //             name: 'user',
    //             path: 'user',    // 子路由路径前面不用加 / ，与父级拼接会自动添加，若加了 / ，就为 // ，该 path 会变为绝对路径（一级路由）
    //             meta: {
    //                 title: '用户管理'
    //             },
    //             component: () => import('@/views/User.vue'),
    //         },
    //         {
    //             name: 'menu',
    //             path: 'menu',
    //             meta: {
    //                 title: '菜单管理'
    //             },
    //             component: () => import('@/views/Menu.vue'),
    //         },
    //         {
    //             name: 'role',
    //             path: 'role',
    //             meta: {
    //                 title: '角色管理'
    //             },
    //             component: () => import('@/views/Role.vue'),
    //         },
    //         {
    //             name: 'dept',
    //             path: 'dept',
    //             meta: {
    //                 title: '部门管理'
    //             },
    //             component: () => import('@/views/Dept.vue'),
    //         }
    //     ]
    // }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 添加路由列表     （此处也需要添加，否则页面刷新后项目重新加载，无路由表）
async function loadRoutes() {
    let userInfo = storage.getItem('userInfo') || {}
    if (userInfo.token) {
        try {
            const menuList = await API.menuAccessList()
            let routes = utils.getRouteList(menuList)
            routes.map(route => {
                let url = `./../views/${route.component}.vue`
                route.component = () => import(url)
                router.addRoute('home', route)
            })
        } catch (error) {
            console.log('routes error =>', error)
        }
    }
}

await loadRoutes()


// 路由守卫
router.beforeEach((to, from, next) => {
    // getRoutes: 获取所有路由 ; hasRoute: 是否存在路由
    // let hasRoute = router.getRoutes().filter(route => route.path == to.path).length
    let hasRoute = router.hasRoute(to.name)
    if (hasRoute) {
        document.title = to.meta.title
        next()
    } else {
        next('/404')
    }
})


export default router