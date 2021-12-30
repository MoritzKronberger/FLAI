import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TestComponents from '../views/BasicComponentsTest.vue'
import ShowStore from '../views/ShowStore.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/components',
    name: 'TestComponents',
    component: TestComponents,
  },
  {
    path: '/store',
    name: 'ShowStore',
    component: ShowStore,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
