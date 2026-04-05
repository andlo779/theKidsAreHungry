import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/archived',
    name: 'ArchivedLists',
    component: () => import('../views/ArchivedListsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/lists/:id',
    name: 'ListDetails',
    component: () => import('../views/ListDetailsView.vue'),
    meta: { requiresAuth: true }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});
