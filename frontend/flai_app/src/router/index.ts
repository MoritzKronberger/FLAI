import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TestComponents from '../views/BasicComponentsTest.vue'
import ShowStore from '../views/ShowStore.vue'
import LearningExercise from '../views/LearningExercise.vue'
import FlaiNetTest from '../views/FlaiNetTest.vue'
import ProfilePage from '../views/ProfilePage.vue'

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
  {
    path: '/flainet',
    name: 'TestFlaiNet',
    component: FlaiNetTest,
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
