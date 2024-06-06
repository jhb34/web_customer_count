import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/',
    name: 'mainpage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/1_firstView.vue')
  },
  {
    path: '/palletscan',
    name: 'scanpage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/2_SecondView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
