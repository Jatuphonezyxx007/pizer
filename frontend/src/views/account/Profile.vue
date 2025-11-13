<script setup>
import { ref, onMounted } from "vue"; // ⭐️ 1. Import onMounted
import { useAuthStore } from "../../stores/authStore"; // ⭐️ 2. Import Store

const authStore = useAuthStore();

// ⭐️ 3. ตั้งค่า state เริ่มต้นเป็นค่าว่าง (รอรับข้อมูลจริง)
const profile = ref({
  username: "",
  firstName: "", // (ไฟล์เดิมคุณคือ 'name')
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  birthdate: "",
  avatarUrl: "https://placehold.co/200x200", // (Avatar ยังใช้ mock data)
});

// State สำหรับจัดการการโหลดและ Error
const isLoading = ref(false);
const isDataLoading = ref(true); // ⭐️ (เพิ่ม) state สำหรับตอนโหลดข้อมูล (ตั้งเป็น true)
const errorMessage = ref(null);
const successMessage = ref(null);

// ⭐️ 4. (สำคัญ) ฟังก์ชันดึงข้อมูลเมื่อเปิดหน้า
onMounted(async () => {
  isDataLoading.value = true;
  errorMessage.value = null;
  try {
    // ⭐️ 5. สั่งให้ Store ไปดึงข้อมูลโปรไฟล์ (ยิง API GET /api/v1/users/profile)
    // (เราจะเรียก fetchProfile เสมอ เพื่อให้ได้ข้อมูลล่าสุด)
    await authStore.fetchProfile();

    // ⭐️ 6. แยกข้อมูลจาก Store (ที่เพิ่งอัปเดต) มาใส่ใน form
    const userData = authStore.user;
    const infoData = userData.info_personal; //

    if (userData && infoData) {
      profile.value = {
        username: userData.username,
        email: userData.email,
        firstName: infoData.first_name, // ⭐️ แมปชื่อ field (first_name -> firstName)
        lastName: infoData.last_name,
        phone: infoData.phone || "", // ใช้ || '' เพื่อป้องกันค่า null
        gender: infoData.gender || "",
        // ⭐️ แปลง Date ให้เป็น format YYYY-MM-DD
        birthdate: infoData.birth_date ? infoData.birth_date.split("T")[0] : "",
        avatarUrl: infoData.profile_image || "https://placehold.co/200x200",
      };
    } else {
      throw new Error("ไม่พบข้อมูลผู้ใช้");
    }
  } catch (error) {
    errorMessage.value = "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้";
    console.error(error);
  } finally {
    isDataLoading.value = false;
  }
});

// ⭐️ 7. ฟังก์ชัน "บันทึก" (อัปเดตแล้ว)
const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    // ⭐️ 8. ส่งข้อมูล (เฉพาะที่ฟอร์มมี) ไปให้ Store (ยิง API PATCH /api/v1/users/profile)
    await authStore.updateProfile({
      username: profile.value.username,
      email: profile.value.email,
      firstName: profile.value.firstName, // ⭐️ ส่งเป็น firstName
      lastName: profile.value.lastName,
      phone: profile.value.phone,
      gender: profile.value.gender,
      birthdate: profile.value.birthdate,
    });
    successMessage.value = "บันทึกข้อมูลเรียบร้อย!";
  } catch (error) {
    // ⭐️ 9. แสดง Error ที่ Backend ส่งกลับมา (เช่น "Email already exists")
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
    <div v-if="isDataLoading" class="p-6 text-center text-gray-500">
      กำลังโหลดข้อมูล...
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3">
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
              disabled
              class="w-full px-3 py-2 border rounded-sm text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <label class="text-gray-500 text-sm text-right">
            ชื่อ - นามสกุล
          </label>

          <div class="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="firstName"
                v-model="profile.firstName"
                placeholder="ชื่อ"
                class="w-full px-3 py-2 border rounded-sm text-sm"
              />
            </div>

            <div>
              <input
                type="text"
                id="lastName"
                v-model="profile.lastName"
                placeholder="นามสกุล"
                class="w-full px-3 py-2 border rounded-sm text-sm"
              />
            </div>
          </div>
        </div>
        <!-- <div class="grid grid-cols-3 items-center gap-4">
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
        </div> -->

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="email" class="text-gray-500 text-sm text-right">
            อีเมล
          </label>
          <div class="col-span-2">
            <input
              type="email"
              id="email"
              v-model="profile.email"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="phone" class="text-gray-500 text-sm text-right">
            เบอร์โทรศัพท์
          </label>
          <div class="col-span-2">
            <input
              type="text"
              id="phone"
              v-model="profile.phone"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label class="text-gray-500 text-sm text-right">เพศ</label>
          <div class="col-span-2 flex space-x-4">
            <label class="flex items-center">
              <input
                type="radio"
                value="male"
                v-model="profile.gender"
                class="mr-1"
              />
              ชาย
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                value="female"
                v-model="profile.gender"
                class="mr-1"
              />
              หญิง
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                value="other"
                v-model="profile.gender"
                class="mr-1"
              />
              อื่น ๆ
            </label>
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="birthdate" class="text-gray-500 text-sm text-right"
            >วันเดือนปีเกิด</label
          >
          <div class="col-span-2">
            <input
              type="date"
              id="birthdate"
              v-model="profile.birthdate"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div></div>
          <div class="col-span-2">
            <button
              type="submit"
              :disabled="isLoading || isDataLoading"
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
