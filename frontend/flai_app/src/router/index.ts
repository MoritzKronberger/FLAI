import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TestComponents from '../views/BasicComponentsTest.vue'
import ShowStore from '../views/ShowStore.vue'
import LearningExercise from '../views/LearningExercise.vue'
import FlaiNetTest from '../views/FlaiNetTest.vue'
import ProfilePage from '../views/ProfilePage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import LoginPage from '../views/LoginPage.vue'
import ComingSoon from '../views/ComingSoon.vue'
import DebugPage from '../views/DebugPage.vue'
import { computed } from 'vue'
import store from '../store'

async function startSession() {
  await store.exercisedata.actions.postNewExerciseSession(
    store.exercisedata.exercises[0].id
  )
  await store.exercisedata.actions.getFullExerciseForUser(
    store.exercisedata.exercises[0].id
  )
}

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
    meta: { authRequired: true },
    beforeEnter: [startSession],
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
    meta: { authRequired: true },
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/comingsoon',
    name: 'ComingSoon',
    component: ComingSoon,
    meta: { authRequired: true },
  },
  {
    path: '/debug',
    name: 'DebugPage',
    component: DebugPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const isAuth = computed(() => store.authdata.auth.isAuth)

// from https://next.router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach((to) => {
  if (to.matched.some((record) => record.meta.authRequired)) {
    if (!isAuth.value) return '/login'
  }
})

export default router
