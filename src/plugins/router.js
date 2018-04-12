import Vue from 'vue'
import VueRouter from 'vue-router'

import index from '@/pages/index'
import login from '@/pages/login'
import register from '@/pages/register'
import logout from '@/pages/logout'
import search from '@/pages/search'
import account from '@/pages/account'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/', component: index },
    { path: '/login', component: login },
    { path: '/register', component: register },
    { path: '/search', component: search },
  ]
})