import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users/users.vue'
import roles from '../components/rights/roles.vue'
import rights from '../components/rights/rights.vue'
import goods from '../components/goods/goods.vue'
import params from '../components/goods/params.vue'
import categories from '../components/goods/categories.vue'
import orders from '../components/orders/orders.vue'
import reports from '../components/reports/reports.vue'

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: home,
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/roles', component: roles },
      { path: '/rights', component: rights },
      { path: '/goods', component: goods },
      { path: '/params', component: params },
      { path: '/categories', component: categories },
      { path: '/orders', component: orders },
      { path: '/reports', component: reports },
    ],
    redirect: '/welcome'
  },
  { path: '/login', component: login },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
