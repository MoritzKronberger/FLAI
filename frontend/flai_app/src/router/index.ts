import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TestComponents from '../views/BasicComponentsTest.vue'
import ShowStore from '../views/ShowStore.vue'
import LearningExercise from '../views/LearningExercise.vue'
import ProfilePage from '../views/ProfilePage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import LoginPage from '../views/LoginPage.vue'
import ComingSoon from '../views/ComingSoon.vue'
import TestFont from '../views/TestFont.vue'
import DebugPage from '../views/DebugPage.vue'
import {
  authenticateFromSessionStorage,
  initExerciseRound,
} from '../ressources/ts/methods'
import store from '../store'

const tryReAuthentication = async () => {
  await authenticateFromSessionStorage()
}

// fetch statistic on every HomePage enter to be updated with i.e. the current learning time
const fetchStatistic = async () => {
  await store.statisticdata.actions.getUserStatistic()
}

async function startSession() {
  // try re-autheticating
  const authenticated = await authenticateFromSessionStorage()
  if (!authenticated) return '/login'

  // get initial data and start new session if authenticated
  await store.exercisedata.actions.postNewExerciseSession(
    store.exercisedata.exercises[0].id
  )
  await initExerciseRound()
}

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    beforeEnter: [tryReAuthentication, fetchStatistic],
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
    // authRequired is true, but implemented in startSession
    beforeEnter: [startSession],
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
    path: '/testfont',
    name: 'TestFont',
    component: TestFont,
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

// from https://next.router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeResolve(async (to) => {
  if (to.matched.some((record) => record.meta.authRequired)) {
    const authenticated = await authenticateFromSessionStorage()
    if (!authenticated) return '/login'
  }
})

export default router
