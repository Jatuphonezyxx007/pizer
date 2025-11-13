import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore"; // ⭐️ 1. Import Store
import Home from "../views/Home.vue"; //

import AccountLayout from "../views/account/AccountLayout.vue";
import Payments from "../views/account/Payments.vue";
import Profile from "../views/account/Profile.vue";
import Addresses from "../views/account/Addresses.vue"; // ⭐️ เพิ่ม
import Password from "../views/account/Password.vue"; // ⭐️ เพิ่ม
import Purchases from "../views/account/Purchases.vue"; // ⭐️ เพิ่ม
// (สร้างไฟล์เปล่าๆ ไว้ก่อนก็ได้)
const AccountAddresses = { template: "<div>หน้าจัดการที่อยู่</div>" };
const AccountPurchases = { template: "<div>หน้าการซื้อของฉัน</div>" };

const routes = [
  // --- หน้าที่ไม่มี Sidebar ---
  // { path: '/', name: 'Home', component: Home },
  // { path: '/register', name: 'Register', component: Register },
  // { path: '/login', name: 'Login', component: Login },

  {
    path: "/",
    name: "Home",
    component: Home, //
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"), //
  },

  // // ⭐️ 2. เพิ่มหน้าสำหรับ User ที่ Login แล้ว (ตัวอย่าง)
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   component: () => import("../views/Profile.vue"), // (สร้างไฟล์เปล่าๆ ไว้ก็ได้)
  //   meta: {
  //     requiresAuth: true, // ⭐️ บอกว่าหน้านี้ "ต้อง" Login
  //     roles: ["admin", "user"], // ⭐️ Admin หรือ User ก็ได้
  //   },
  // },
  // {
  //   path: "/my-orders",
  //   name: "MyOrders",
  //   component: () => import("../views/MyOrders.vue"), // (สร้างไฟล์เปล่าๆ ไว้ก็ได้)
  //   meta: {
  //     requiresAuth: true,
  //     roles: ["user"], // ⭐️ เฉพาะ User
  //   },
  // },

  // // ⭐️ 3. เพิ่มหน้าสำหรับ Admin
  // {
  //   path: "/admin",
  //   name: "AdminDashboard",
  //   component: () => import("../views/AdminDashboard.vue"), // (สร้างไฟล์เปล่าๆ ไว้ก็ได้)
  //   meta: {
  //     requiresAuth: true,
  //     roles: ["admin"], // ⭐️ เฉพาะ Admin
  //   },
  // },
  {
    path: "/account",
    component: AccountLayout,
    children: [
      {
        path: "profile",
        name: "Profile",
        component: Profile,
      },
      {
        path: "addresses",
        name: "Addresses",
        component: Addresses,
      },
      {
        path: "password",
        name: "AccountPassword",
        component: Password, // ⭐️ แก้ไข
      },
      {
        path: "payments",
        name: "Payments",
        component: Payments,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ⭐️ 4. สร้าง "ยาม" (Navigation Guard)
router.beforeEach((to, from, next) => {
  // ‼️ ต้องเรียกใช้ Store "ข้างใน" Guard นี้เท่านั้น
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const requiredRoles = to.meta.roles;

  // 4.1 ตรวจสอบว่าหน้านั้น "ต้อง" Login หรือไม่
  if (requiresAuth && !authStore.isAuthenticated) {
    // ถ้า "ต้อง" Login แต่ "ยังไม่" Login -> เตะไปหน้า Login
    next({ name: "Login" });
  }
  // 4.2 ตรวจสอบว่าหน้านั้น "ต้อง" ใช้ Role พิเศษหรือไม่
  else if (requiresAuth && requiredRoles && requiredRoles.length > 0) {
    // ⭐️ ดึง Role ของ User จาก Store (แปลงเป็น ['user', 'admin'])
    // เราใช้ ?. (Optional Chaining) เพื่อป้องกัน Error ถ้า user หรือ roles เป็น null
    const userRoles = authStore.user?.roles?.map((role) => role.name) || [];

    // ⭐️ ตรวจสอบว่า Role ของ User มี "อย่างน้อย 1" Role ที่หน้านี้ต้องการหรือไม่
    const hasPermission = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (hasPermission) {
      // ถ้ามีสิทธิ์ -> ไปต่อ
      next();
    } else {
      // ถ้าไม่มีสิทธิ์ (เช่น user ธรรมดา พยายามเข้า /admin) -> เตะกลับหน้า Home
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      next({ name: "Home" });
    }
  }
  // 4.3 ถ้าเป็นหน้าทั่วไป (เช่น /) หรือหน้าที่ไม่ต้อง Login
  else {
    next();
  }
});

export default router;
