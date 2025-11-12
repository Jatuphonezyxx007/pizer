import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

// ⭐️ ตั้งค่า URL ของ Backend ที่นี่
const API_URL = "http://localhost:3000/api/v1";

export const useAuthStore = defineStore("auth", () => {
  // 1. State: ดึง token จาก localStorage (ถ้ามี)
  const token = ref(localStorage.getItem("token"));
  // (เราจะเพิ่ม user data ทีหลัง)

  // 2. Getter: ตรวจสอบว่า Login หรือยัง
  const isAuthenticated = computed(() => !!token.value);

  // 3. Action: ฟังก์ชัน Login
  async function login(identifier, password, recaptchaToken) {
    // 3.1 ยิง API
    const response = await axios.post(`${API_URL}/auth/login`, {
      identifier,
      password,
      recaptchaToken,
    });

    // 3.2 เก็บ Token
    const accessToken = response.data.access_token;
    token.value = accessToken;
    localStorage.setItem("token", accessToken);

    // 3.3 ⭐️ ตั้งค่า axios ให้ส่ง Token นี้ไปกับทุก Request
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  // 4. Action: ฟังก์ชัน Logout
  function logout() {
    token.value = null;
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    // (เราจะ redirect ที่นี่ทีหลัง)
  }

  return { token, isAuthenticated, login, logout };
});
