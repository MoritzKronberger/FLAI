import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ShowStore from '../views/ShowStore.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  /*
  {
    path: '/store',
    name: 'ShowStore',
    component: ShowStore,
  },*/
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
