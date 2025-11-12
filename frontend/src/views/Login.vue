<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useReCaptcha } from "vue-recaptcha-v3";
// import axios from "axios";
import { useAuthStore } from "../stores/authStore"; // ⭐️ 2. Import Store

const router = useRouter();
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();
const authStore = useAuthStore(); // ⭐️ 3. เรียกใช้ Store

// 1. ⭐️ สร้าง state สำหรับฟอร์ม Login
const identifier = ref(""); // รับ Email / Username / Phone
const password = ref("");

// 2. ⭐️ state สำหรับสลับการแสดงผลรหัสผ่าน
const passwordFieldType = ref("password");

// 3. ⭐️ state สำหรับ Error และ Loading
const errorMessage = ref(null);
const isLoading = ref(false);

// 4. ⭐️ ฟังก์ชันสำหรับสลับการมองเห็น (เหมือนเดิม)
const togglePasswordVisibility = () => {
  passwordFieldType.value =
    passwordFieldType.value === "password" ? "text" : "password";
};

// 5. ⭐️ ฟังก์ชันสำหรับ "เข้าสู่ระบบ"
// ⭐️ 4. อัปเกรด handleLogin
// ⭐️ 4. อัปเกรด handleLogin
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    await recaptchaLoaded();
    const recaptchaToken = await executeRecaptcha("login");

    // ⭐️ 5. เรียกใช้ authStore.login
    await authStore.login(identifier.value, password.value, recaptchaToken);

    // ⭐️ 6. ถ้าสำเร็จ ให้ไปหน้า Home
    router.push("/");
  } catch (error) {
    // ⭐️ 7. จัดการ Error (จาก Backend หรือ Store)
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "เกิดข้อผิดพลาด ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
    }
    console.error("เกิดข้อผิดพลาด:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col mt-12 bg-gray-100">
    <main class="w-full flex-grow bg-white flex items-center">
      <div class="container">
        <div
          class="bg-white sm:p-8 rounded-md shadow-lg w-full max-w-lg mx-auto"
        >
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">เข้าสู่ระบบ</h2>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <input
                v-model="identifier"
                type="text"
                placeholder="อีเมล์ / Username / หมายเลขโทรศัพท์"
                required
                class="w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div class="relative">
              <input
                v-model="password"
                :type="passwordFieldType"
                placeholder="รหัสผ่าน"
                required
                class="w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 pr-10"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                <span
                  v-show="passwordFieldType === 'text'"
                  class="material-symbols-outlined text-xl"
                >
                  visibility_off
                </span>
                <span
                  v-show="passwordFieldType === 'password'"
                  class="material-symbols-outlined text-xl"
                >
                  visibility
                </span>
              </button>
            </div>

            <div
              v-if="errorMessage"
              class="text-red-600 text-sm text-center py-2"
            >
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[#f94d2f] text-white py-2.5 rounded-sm hover:bg-opacity-90 transition-colors font-semibold mt-6 disabled:opacity-50"
            >
              {{ isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
            </button>
          </form>

          <div class="flex items-center my-6">
            <hr class="flex-grow border-t" />
            <span class="px-4 text-sm text-gray-400">หรือ</span>
            <hr class="flex-grow border-t" />
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              class="flex-1 flex items-center justify-center gap-2 border rounded-sm py-2.5 px-4 text-sm hover:bg-gray-50"
            >
              <svg
                class="w-5 h-5 text-[#1877F2]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"
                />
              </svg>
              Facebook
            </button>
            <button
              class="flex-1 flex items-center justify-center gap-2 border rounded-sm py-2.5 px-4 text-sm hover:bg-gray-50"
            >
              <svg class="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Google
            </button>
          </div>

          <p class="text-sm text-center text-gray-500 mt-4">
            ยังไม่มีบัญชี?
            <RouterLink
              to="/register"
              class="text-[#f94d2f] font-semibold hover:text-opacity-80"
              >สมัครใหม่</RouterLink
            >
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
