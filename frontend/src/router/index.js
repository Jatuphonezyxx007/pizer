import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

// Layouts
import AccountLayout from "../views/account/AccountLayout.vue";

// Views
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Products from "../views/Products.vue";
import Cart from "../views/Cart.vue";
import AdminDashboard from "../views/AdminDashboard.vue";

// Account Views
import Profile from "../views/account/Profile.vue";
import Purchases from "../views/account/Purchases.vue";
import Addresses from "../views/account/Addresses.vue";
import Password from "../views/account/Password.vue";
import Payments from "../views/account/Payments.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true }, // (ถ้ายังไม่ Login เท่านั้น)
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true }, // (ถ้ายังไม่ Login เท่านั้น)
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: { requiresAuth: true }, // (ต้อง Login ก่อนดูตะกร้า)
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ["admin"] }, // (ต้อง Login และเป็น Admin)
  },
  {
    // ⭐️⭐️⭐️ แก้ไขจุดนี้ ⭐️⭐️⭐️
    path: "/account",
    component: AccountLayout,
    meta: {
      requiresAuth: true, // เพิ่ม Guard ให้กับ Layout แม่
    },
    children: [
      {
        path: "profile",
        name: "AccountProfile",
        component: Profile,
        meta: { requiresAuth: true, roles: ["admin", "user"] }, // (Guard เดิมมีอยู่แล้ว ดีแล้ว)
      },
      {
        path: "purchases",
        name: "AccountPurchases",
        component: Purchases,
        meta: { requiresAuth: true, roles: ["admin", "user"] },
      },
      {
        path: "addresses",
        name: "AccountAddresses",
        component: Addresses,
        meta: { requiresAuth: true, roles: ["admin", "user"] },
      },
      {
        path: "password",
        name: "AccountPassword",
        component: Password,
        meta: { requiresAuth: true, roles: ["admin", "user"] },
      },
      {
        path: "payments",
        name: "AccountPayments",
        component: Payments,
        meta: { requiresAuth: true, roles: ["admin", "user"] },
      },
      // (Redirect /account ไป /account/profile)
      {
        path: "",
        redirect: "/account/profile",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // (เพิ่ม) ให้เลื่อนขึ้นบนสุดเมื่อเปลี่ยนหน้า
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// ⭐️ (ใน main.js ควรมี Guard นี้อยู่แล้ว) ⭐️
// (ถ้าไม่มี ให้เพิ่มใน main.js)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRoles = authStore.user
    ? authStore.user.roles.map((r) => r.name)
    : [];

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 1. ถ้าหน้านี้ต้อง Login แต่ยังไม่ Login
    next("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // 2. ถ้าหน้านี้สำหรับ Guest แต่ดัน Login อยู่
    next("/");
  } else if (to.meta.roles) {
    // 3. ถ้าหน้านี้ต้องการ Role เฉพาะ
    const hasRole = to.meta.roles.some((role) => userRoles.includes(role));
    if (isAuthenticated && hasRole) {
      next(); // มี Role
    } else if (isAuthenticated) {
      next("/"); // ไม่มี Role, ส่งกลับหน้าแรก
    } else {
      next("/login"); // ไม่มี Role และยังไม่ Login
    }
  } else {
    // 4. หน้าทั่วไป
    next();
  }
});

export default router;
