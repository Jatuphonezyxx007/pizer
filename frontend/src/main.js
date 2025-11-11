import { createApp } from "vue";
import { createPinia } from "pinia"; // <-- 1. Import Pinia

import App from "./App.vue";
import router from "./router"; // <-- 2. Import Router
import "./style.css"; // <-- 3. Import Tailwind CSS

const app = createApp(App);
const pinia = createPinia(); // <-- 4. สร้าง instance ของ Pinia

app.use(pinia); // <-- 5. บอกให้ Vue ใช้ Pinia
app.use(router); // <-- 6. บอกให้ Vue ใช้ Router

app.mount("#app");
