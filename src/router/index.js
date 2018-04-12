import Vue from 'vue'
import Router from 'vue-router'

import index from '@/pages/index'
import login from '@/pages/login'
import register from '@/pages/register'
import logout from '@/pages/logout'
import search from '@/pages/search'
import strategyView from '@/pages/strategy/view'
import strategyEdit from '@/pages/strategy/edit'
import newStrategy from '@/pages/strategy/new'
import account from '@/pages/account'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: index },
    { path: '/login', component: login },
    { path: '/logout', component: logout },
    { path: '/register', component: register },
    { path: '/account', component: account },
    { path: '/search', component: search },
    { path: '/strategy/new', component: newStrategy },
    { path: '/strategy/:code', component: strategyView },
    { path: '/strategy/:code/edit', component: strategyEdit }
  ]
})
