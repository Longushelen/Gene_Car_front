import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import DefaultLayout from "../views/DefaultLayout.vue";

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/',
    component: DefaultLayout,
    meta: { authRequired: true },
    children: [
      {
        path: "",
        redirect: "main",
      },
      {
        path: "main",
        component: () =>
          import(
            "../views/main/MainView"
          ),
      },
      {
        path: "login",
        component: () =>
          import(
            "../views/member/MemberLogin"
          ),
      },      
    ],
  },

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

window.router = router;
export default router
