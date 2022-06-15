import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../Layout'

Vue.use(Router)

const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/Login/index'),
    },
    {
        path:'/register',
        component:() =>import('@/views/Register/index')
    },
    {
        path:'/management',
        component:Layout,
        children:[
            {
                path:'goodsmag',
                name:'GoodsMag',
                component:()=>import('@/views/GoodsMag'),
            },
            {
                path:'ordersmag',
                name:'OrdersMag',
                component:()=>import('@/views/OrdersMag')
            },
            {
                path:'brandsmag',
                name:'BrandsMage',
                component:()=>import('@/views/BrandsMag')
            },
            {
                path:'addGood',
                name:'AddGood',
                component:()=>import('@/views/GoodsMag/views/AddGood')
            },
            {
                path:'orderbackmag',
                name:'OrderBackMag',
                component:()=>import('@/views/OrderBackMag')
            },
            {
                path:'purchaseinfo',
                name:'PurchaseInfo',
                component:()=>import('@/views/PurchaseInfo')
            },
            {
                path:'commactivities',
                name:'Commactivities',
                component:()=>import('@/views/CommActivities')
            },
            {
                path:'insetactivity',
                name:'InsetActitvity',
                component:()=>import('@/views/CommActivities/insertActivity')
            },
            {
                path:'categorymag',
                name:'CategoryMag',
                component:()=>import('@/views/CategoryMag')

            }
        ]
    },
    {
        path: '/',
        component: Layout,
        redirect:'/finance',
        children:[
            {
                path:'finance',
                component:()=>import('@/views/Finance')
            }
        ]
    },
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})
const router = createRouter()
export default router
