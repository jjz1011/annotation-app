
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Annotate from '../pages/Annotate.vue'
import Admin from '../pages/Admin.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/annotate', component: Annotate },
  { path: '/admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
