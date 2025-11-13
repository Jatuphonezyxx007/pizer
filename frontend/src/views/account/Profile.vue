<script setup>
import { ref, onMounted } from "vue"; // ⭐️ 1. Import onMounted
import { useAuthStore } from "../stores/authStore"; // ⭐️ 2. Import Store

const authStore = useAuthStore();
const profile = ref({
  // ⭐️ 3. ตั้งค่า state เริ่มต้นเป็นค่าว่าง
  username: "",
  firstName: "", // (ไฟล์เดิมคุณคือ 'name')
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  birthdate: "",
  avatarUrl: "https://via.placeholder.com/200", // (Avatar ยังใช้ mock data)
});

const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

// ⭐️ 4. (เพิ่ม) ฟังก์ชันดึงข้อมูลเมื่อเปิดหน้า
onMounted(async () => {
  // ⭐️ ถ้าข้อมูลใน Store ยังไม่ครบ (เช่น user เพิ่งเปิด browser ใหม่)
  if (!authStore.user || !authStore.user.info_personal) {
    await authStore.fetchProfile(); // ⭐️ ดึงข้อมูลเต็มๆ จาก API
  }

  // ⭐️ 5. แยกข้อมูลจาก Store มาใส่ใน form
  const userData = authStore.user;
  const infoData = userData.info_personal; //

  profile.value = {
    username: userData.username,
    email: userData.email,
    firstName: infoData.first_name, // ⭐️ แมปชื่อ field
    lastName: infoData.last_name,
    phone: infoData.phone || "",
    gender: infoData.gender || "",
    // ⭐️ แปลง Date ให้เป็น format YYYY-MM-DD
    birthdate: infoData.birth_date ? infoData.birth_date.split("T")[0] : "",
    avatarUrl: infoData.profile_image || "https://via.placeholder.com/200",
  };
});

// ⭐️ 6. (อัปเกรด) ฟังก์ชัน "บันทึก"
const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    // ⭐️ 7. ส่งข้อมูล (เฉพาะที่ฟอร์มมี) ไปให้ Store
    await authStore.updateProfile({
      username: profile.value.username,
      email: profile.value.email,
      firstName: profile.value.firstName, // (ไฟล์เดิมคุณคือ 'name')
      lastName: profile.value.lastName,
      phone: profile.value.phone,
      gender: profile.value.gender,
      birthdate: profile.value.birthdate,
    });
    successMessage.value = "บันทึกข้อมูลเรียบร้อย!";
  } catch (error) {
    // ⭐️ 8. แสดง Error ที่ Backend ส่งกลับมา
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "เกิดข้อผิดพลาด ไม่สามารถเชื่อมต่อได้";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white rounded-md shadow-sm">
    <div class="p-6 border-b">
      <h1 class="text-xl font-semibold text-gray-900">ข้อมูลของฉัน</h1>
      <p class="text-sm text-gray-600 mt-1">
        จัดการข้อมูลส่วนตัวเพื่อความปลอดภัยของบัญชีผู้ใช้
      </p>
    </div>

    <div classs="grid grid-cols-1 lg:grid-cols-3">
      <form @submit.prevent="handleSubmit" class="lg:col-span-2 p-6 space-y-4">
        <div
          v-if="successMessage"
          class="p-3 bg-green-100 text-green-700 rounded-lg"
        >
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-3 bg-red-100 text-red-700 rounded-lg">
          {{ errorMessage }}
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="username" class="text-gray-500 text-sm text-right">
            ชื่อผู้ใช้
          </label>
          <div class="col-span-2">
            <input
              type="text"
              id="username"
              v-model="profile.username"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="firstName" class="text-gray-500 text-sm text-right">
            ชื่อจริง
          </label>
          <div class="col-span-2">
            <input
              type="text"
              id="firstName"
              v-model="profile.firstName"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="lastName" class="text-gray-500 text-sm text-right">
            นามสกุล
          </label>
          <div class="col-span-2">
            <input
              type="text"
              id="lastName"
              v-model="profile.lastName"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div></div>
          <div class="col-span-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-[#f94d2f] text-white px-6 py-2 rounded-sm hover:bg-opacity-90 disabled:bg-gray-400"
            >
              {{ isLoading ? "กำลังบันทึก..." : "บันทึก" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
