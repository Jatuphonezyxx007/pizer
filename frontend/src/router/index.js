import { createRouter, createWebHistory } from "vue-router";

// เราจะสร้างหน้าเหล่านี้ในขั้นตอนต่อไป
// import Home from '../views/Home.vue'
// import Login from '../views/Login.vue'
// import Register from '../views/Register.vue'

const routes = [
  // { path: '/', name: 'Home', component: Home },
  // { path: '/login', name: 'Login', component: Login },
  // { path: '/register', name: 'Register', component: Register },
  // (เราจะมาเพิ่มหน้าอื่นๆ ทีหลัง)
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
