import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
import Dashboard from '../views/dashboard/index.vue'
import Admin from '../views/auth/admin/index.vue'
import Group from '../views/auth/group/index.vue'
import Staff from '../views/vppz/staff/index.vue'
import Order from '../views/vppz/order/index.vue'
import store from '../store'
// import { useStore } from 'vuex'

const routeData = JSON.parse(localStorage.getItem('pz'))

const findFirstRoute = (routeLocal) =>{
    if(routeLocal){
        // 如果有子菜单的情况
        const child = routeLocal.menu.routerList[0].children
        if(child){
            // 递归
            return findFirstRoute(child[0])
        }else{
            // 没有子菜单
            if(routeLocal.menu.routerList[0].meta.path == '/dashboard'){
                store.commit('updateMenuUpdate', '1-1')
            }
            return routeLocal.menu.routerList[0].meta.path
        }
    }else{
        return '/'
    }
    
}


const routes = [
    {
        path: '/',
        component: Layout,
        name: 'main',
        redirect: to =>{
            return findFirstRoute(routeData)
        },
        children: [
            // {
            //     path: 'dashboard',
            //     meta: { id: '1', name: '控制台', icon: 'Platform', path: '/dashboard', describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据' },
            //     component: Dashboard
            // },
            // {
            //     path: 'auth',
            //     meta: { id: '2', name: '权限管理', icon: 'Grid' },
            //     children: [
            //         {
            //             path: '',
            //             alias: ['admin'],
            //             meta: { id: '1', name: '账号管理', icon: 'Avatar', path: '/auth/admin', describe: '管理员可以进行编辑，权限修改后需要登出才会生效' },
            //             component: Admin
            //         },
            //         {
            //             path: 'group',
            //             meta: { id: '2', name: '菜单管理', icon: 'Menu', path: '/auth/group', describe: '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取' },
            //             component: Group
            //         }
            //     ]
            // },
            // {
            //     path: 'vppz',
            //     meta: { id: '3', name: 'DIDI陪诊', icon: 'BellFilled' },
            //     children: [
            //         {
            //             path: '',
            //             alias: ['staff'],
            //             meta: { id: '1', name: '陪护管理', icon: 'Checked', path: '/vppz/staff', describe: '陪护师可以进行创建和修改，设置对应生效状态控制C端选择' },
            //             component: Staff
            //         },
            //         {
            //             path: 'order',
            //             meta: { id: '2', name: '订单管理', icon: 'List', path: '/vppz/order', describe: 'C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改' },
            //             component: Order
            //         }
            //     ]
            // }
        ]
    },
    {
        path: '/login',
        component: Login
    },
]



const router = createRouter({
    routes,
    history: createWebHashHistory()
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('pz_token')
    // 非登录页面token不存在
    if(!token && to.path !== '/login') {
        next('/login')
        // console.log('未登录')
    }else if(token && to.path === '/login') {//有token（已经登录），但是想去登录页
        next('/')
        // console.log('已登录')
    }else {
        next()
        // console.log('正常')
    }

})

// 刷新后的动态路由添加（防止刷新后路由消失，因为是用addRoute方法动态添加的）
const localRoute = localStorage.getItem('pz')
if(localRoute){
    store.commit('dynamicsMenu',JSON.parse(localRoute).menu.routerList)
    store.state.menu.routerList.forEach(item=>{
        router.addRoute('main',item)
    })
}


export default router