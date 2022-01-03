import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TestComponents from '../views/BasicComponentsTest.vue'
import ShowStore from '../views/ShowStore.vue'
import LearningExercise from '../views/LearningExercise.vue'
import HandposeTest from '../views/HandposeTest.vue'
import FlaiNetTest from '../views/FlaiNetTest.vue'

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
    path: '/handpose',
    name: 'HandposeTest',
    component: HandposeTest,
  },
  {
    path: '/flainet',
    name: 'TestFlaiNet',
    component: FlaiNetTest,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
