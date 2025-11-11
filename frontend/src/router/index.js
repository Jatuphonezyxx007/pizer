import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue"; // <-- 1. Import หน้า Home

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home, // <-- 2. ลงทะเบียนหน้า Home
  },

  // (เราจะสร้างหน้าเหล่านี้ทีหลัง)
  // { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  // { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  // { path: '/products/:id', name: 'ProductDetail', component: () => import('../views/ProductDetail.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
