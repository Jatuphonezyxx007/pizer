import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export const useAuthStore = defineStore("auth", () => {
  // 1. State: ⭐️ เพิ่ม user และดึงจาก localStorage
  const token = ref(localStorage.getItem("token"));
  const user = ref(JSON.parse(localStorage.getItem("user"))); // ⭐️

  // ⭐️ (เพิ่ม) ถ้ามี Token ตอนโหลดหน้า ให้ตั้งค่า axios ไว้เลย
  if (token.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }

  // 2. Getter: (เหมือนเดิม)
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // 3. Action: ฟังก์ชัน Login (อัปเกรด)
  async function login(identifier, password, recaptchaToken) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      identifier,
      password,
      recaptchaToken,
    });

    // 3.1 ⭐️ แยก Token และ User ออกจาก response
    const { access_token, user: userData } = response.data;

    // 3.2 ⭐️ เก็บ Token
    token.value = access_token;
    localStorage.setItem("token", access_token);

    // 3.3 ⭐️ เก็บ User
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData)); // ⭐️

    // 3.4 ⭐️ ตั้งค่า axios (เหมือนเดิม)
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  }

  // 4. Action: ฟังก์ชัน Logout (อัปเกรด)
  function logout() {
    // ⭐️ เคลียร์ Token
    token.value = null;
    localStorage.removeItem("token");

    // ⭐️ เคลียร์ User
    user.value = null;
    localStorage.removeItem("user"); // ⭐️

    // ⭐️ เคลียร์ Header ของ axios
    delete axios.defaults.headers.common["Authorization"];
  }

  // ⭐️ 1. (เพิ่ม) Action สำหรับดึงข้อมูลโปรไฟล์เต็มๆ
  async function fetchProfile() {
    if (!token.value) return; // ถ้าไม่มี token ก็ไม่ต้องทำ
    try {
      const response = await axios.get(`${API_URL}/users/profile`); // ⭐️ ยิงไป Endpoint ใหม่
      user.value = response.data; // ⭐️ อัปเดต user state
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // อาจจะต้อง logout ถ้า Token หมดอายุ (401)
      if (error.response.status === 401) {
        logout();
      }
    }
  }

  // ⭐️ 2. (เพิ่ม) Action สำหรับอัปเดตโปรไฟล์
  async function updateProfile(profileData) {
    try {
      const response = await axios.patch(
        `${API_URL}/users/profile`, // ⭐️ ยิงไป Endpoint ใหม่
        profileData
      );
      // ⭐️ อัปเดต Store ด้วยข้อมูลใหม่ที่ Backend ส่งกลับมา
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to update profile:", error);
      // ⭐️ ส่ง error กลับไปให้ Component แสดงผล
      throw error;
    }
  }

  // ⭐️ ส่ง user ออกไปด้วย
  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchProfile,
    updateProfile,
  };
});
