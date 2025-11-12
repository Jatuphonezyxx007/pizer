import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/Register.vue";

// 1. Import หน้า Home
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", name: "Home", component: Home },

  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  // 2. เพิ่มหน้าอื่นๆ (แบบ Placeholder ก่อน)
  {
    path: "/products",
    name: "Products",
    // ใช้การ lazy-load เพื่อประสิทธิภาพ
    component: () => import("../views/Products.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
