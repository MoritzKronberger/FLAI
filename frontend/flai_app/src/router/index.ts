import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TestComponents from '../views/BasicComponentsTest.vue'
import ShowStore from '../views/ShowStore.vue'
import LearningExercise from '../views/LearningExercise.vue'

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
  {
    path: '/exercise',
    name: 'LearningExercise',
    component: LearningExercise,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
