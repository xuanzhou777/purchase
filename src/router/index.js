import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { title: "用户登录"}
  },
  {
    path: '/mine',
    name: 'Mine',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Mine.vue'),
    meta: { title: '个人中心'}
  },
  {
    path: '/AddApply',
    name: 'addApply',
    component: () => import( '../views/AddApply.vue'),
    meta: { title: '新建采购申请'}
  },
  {
    path: '/Modify',
    name: 'modify',
    component: () => import( '../views/Modify.vue'),
    meta: { title: '修改采购申请'}
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import( '../views/Detail.vue'),
    meta: { title: '采购申请详情'}
  },
  {
    path: '/all',
    name: 'All',
    component: () => import( '../views/All.vue'),
    meta: { title: '采购申请查询'}
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,form,next) =>{
  /*路由变化修改title*/
  if(to.meta.title){
    document.title=to.meta.title
  }
  next();
})

export default router
