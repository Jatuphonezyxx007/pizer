import { createApp } from "vue";
import { createPinia } from "pinia"; // <-- 1. Import Pinia

import App from "./App.vue";
import router from "./router"; // <-- 2. Import Router
import { VueReCaptcha } from "vue-recaptcha-v3";
import "./style.css"; // <-- 3. Import Tailwind CSS

const app = createApp(App);
const pinia = createPinia(); // <-- 4. สร้าง instance ของ Pinia

app.use(pinia); // <-- 5. บอกให้ Vue ใช้ Pinia
app.use(router); // <-- 6. บอกให้ Vue ใช้ Router

// 2. ⭐️ ติดตั้ง reCAPTCHA v3
app.use(VueReCaptcha, {
  siteKey: "6LdcfgosAAAAAFdX0oEitdbBPN6_EhiaosSlc-yu", // <-- ‼️ ใส่ Site Key v3 ของคุณที่นี่
  loaderOptions: {
    autoHideBadge: true, // ซ่อน Badge (ถ้าคุณต้องการ)
  },
});

app.mount("#app");
