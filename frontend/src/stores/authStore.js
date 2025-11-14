import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import axios from "axios";
import { getProfileImageUrl } from "../utils/imageUrl"; // ⭐️ 1. Import helper

const API_URL = "http://localhost:3000/api/v1";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  // --- State ---
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const returnUrl = ref(null); // (สำหรับ redirect หลัง login)

  // --- Getters ---
  const isAuthenticated = computed(() => !!token.value);
  const avatarUrl = computed(() => {
    return getProfileImageUrl(user.value?.info_personal?.profile_image);
  });
  const username = computed(() => user.value?.username || "Guest");
  const userRoles = computed(() => user.value?.roles?.map((r) => r.name) || []);

  // --- Actions ---

  async function login(identifier, password, recaptchaToken) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        identifier,
        password,
        recaptchaToken, // (ส่ง Token ไปด้วย)
      });

      const { access_token, user: userData } = response.data;

      // 1. Set state
      token.value = access_token;
      user.value = userData;

      // 2. Set axios default header (สำหรับ request ครั้งต่อไป)
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // 3. Store in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      // 4. Redirect
      router.push(returnUrl.value || "/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error.response.data; // (ส่ง error กลับไปให้ Component)
    }
  }

  function logout() {
    // 1. Clear state
    token.value = null;
    user.value = null;

    // 2. Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 3. Clear axios header
    delete axios.defaults.headers.common["Authorization"];

    // 4. Redirect
    if (router.currentRoute.value.path !== "/") {
      router.push("/");
    }
  }

  async function fetchProfile() {
    if (!token.value) {
      return; // (ถ้าไม่มี token ก็ไม่ต้องยิง)
    }
    try {
      // (ตั้งค่า Header อีกครั้ง เผื่อมีการ Refresh หน้า)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

      const response = await axios.get(`${API_URL}/users/profile`);
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      if (error.response && error.response.status === 401) {
        // ⭐️ (นี่คือจุดที่ทำให้เด้งออก ถ้า Guard ไม่ทำงาน)
        logout();
      }
      throw error; // (ส่งต่อให้ Component)
    }
  }

  async function updateProfile(profileData) {
    try {
      const response = await axios.patch(
        `${API_URL}/users/profile`,
        profileData
      );
      // (Backend ตอบกลับเป็น info_personal)
      if (user.value) {
        user.value.info_personal = response.data;
        localStorage.setItem("user", JSON.stringify(user.value));
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  }

  // ⭐️ 2. (เพิ่ม) Action สำหรับอัปโหลด Avatar
  async function uploadAvatar(formData) {
    try {
      // Axios จะตั้งค่า Content-Type เป็น multipart/form-data ให้อัตโนมัติ
      const response = await axios.post(
        `${API_URL}/users/profile/avatar`,
        formData
      );

      // ⭐️ 3. อัปเดต user state ด้วยข้อมูลใหม่จาก Backend
      // (Backend ควรส่ง info_personal ที่อัปเดตแล้วกลับมา)
      if (response.data && response.data.profile_image) {
        // ⭐️ 4. อัปเดตข้อมูลใน Store
        if (user.value && user.value.info_personal) {
          user.value.info_personal.profile_image = response.data.profile_image;
          user.value.info_personal.profile_image_mimetype =
            response.data.profile_image_mimetype;
        }
        // ⭐️ 5. อัปเดต LocalStorage
        localStorage.setItem("user", JSON.stringify(user.value));
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      throw error; // ⭐️ ส่ง Error กลับไปให้ Component จัดการ
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    avatarUrl, // (ส่ง avatarUrl ไปให้ Navbar ใช้)
    username,
    userRoles,
    login,
    logout,
    fetchProfile,
    updateProfile,
    uploadAvatar, // ⭐️ 6. Export action ใหม่
  };
});
