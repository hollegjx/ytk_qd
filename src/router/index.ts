import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
    },
    {
      path: '/user/login',
      name: 'login',
      component: () => import('../pages/user/UserLoginPage.vue'),
    },
    {
      path: '/user/register',
      name: 'register',
      component: () => import('../pages/user/UserRegisterPage.vue'),
    },
    {
      path: '/admin/userManage',
      name: 'admin-users',
      component: () => import('../pages/admin/UserManagePage.vue'),
    },
    {
      path: '/admin/pictureManage',
      name: 'admin-pictures',
      component: () => import('../pages/admin/PictureManagePage.vue'),
    },
    {
      path: '/picture/add',
      name: 'add-picture',
      component: () => import('../pages/AddPicturePage.vue'),
      meta: { requiresLogin: true },
    },
    {
      path: '/picture/mine',
      name: 'my-pictures',
      component: () => import('../pages/MyPicturePage.vue'),
      meta: { requiresLogin: true },
    },
    {
      path: '/picture/:id',
      name: 'picture-detail',
      component: () => import('../pages/PictureDetailPage.vue'),
      props: true,
    },
  ],
})

export default router
