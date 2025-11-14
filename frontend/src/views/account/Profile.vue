<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { getProfileImageUrl } from "../../utils/imageUrl"; // ⭐️ (เพิ่ม)

const authStore = useAuthStore();

// (State สำหรับ Form)
const profile = ref({
  first_name: "",
  last_name: "",
  email: "", // (Email จะแสดงเฉยๆ, แก้ไขไม่ได้)
  phone: "",
  gender: "",
  birth_date: "",
  // ⭐️ (ลบ) avatarUrl ออกจากที่นี่ เพราะเราจะใช้ computed
});

// (State สำหรับการโหลด/Error ของ Form)
const isLoading = ref(false); // (สำหรับปุ่ม Save)
const isDataLoading = ref(true); // (สำหรับตอนโหลดข้อมูล)
const errorMessage = ref(null);
const successMessage = ref(null);

// ⭐️ (เพิ่ม) State สำหรับการอัปโหลด
const fileInput = ref(null); // (สำหรับ <input type="file">)
const isUploading = ref(false);
const uploadError = ref(null);
const uploadSuccess = ref(null);

// ⭐️ (เพิ่ม) Computed property สำหรับ Avatar URL (เพื่อให้ reactive)
const avatarUrl = computed(() => {
  // (ใช้ authStore.user โดยตรง)
  const filename = authStore.user?.info_personal?.profile_image;
  return getProfileImageUrl(filename);
});

// (ฟังก์ชันดึงข้อมูลเมื่อเปิดหน้า)
onMounted(async () => {
  isDataLoading.value = true;
  errorMessage.value = null;
  try {
    // (ถ้า user ใน store ยังไม่มีข้อมูล ให้ fetch)
    if (!authStore.user?.info_personal) {
      await authStore.fetchProfile();
    }

    // (Map ข้อมูลจาก store มาใส่ form)
    const userData = authStore.user;
    if (userData) {
      profile.value.email = userData.email || "";
      const infoData = userData.info_personal;
      if (infoData) {
        profile.value.first_name = infoData.first_name || "";
        profile.value.last_name = infoData.last_name || "";
        profile.value.phone = infoData.phone || "";
        profile.value.gender = infoData.gender || "not_specified";
        // (แปลง Date format 2024-01-01T00:00:00.000Z -> 2024-01-01)
        profile.value.birth_date = infoData.birth_date
          ? infoData.birth_date.split("T")[0]
          : "";
      }
    } else {
      throw new Error("ไม่พบข้อมูลผู้ใช้");
    }
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 401) {
      // (ถ้า Guard ทำงานไม่ทัน, store จะ logout ให้อยู่ดี)
      errorMessage.value = "เซสชั่นหมดอายุ, กรุณาเข้าสู่ระบบใหม่";
    } else {
      errorMessage.value = "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้";
    }
  } finally {
    isDataLoading.value = false;
  }
});

// (ฟังก์ชันบันทึกการแก้ไขโปรไฟล์)
const handleUpdateProfile = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;
  uploadError.value = null; // (เคลียร์ error ของ upload)
  uploadSuccess.value = null;

  try {
    // (คัดลอกเฉพาะ field ที่ต้องการส่ง)
    const dataToUpdate = {
      first_name: profile.value.first_name,
      last_name: profile.value.last_name,
      phone: profile.value.phone,
      gender: profile.value.gender,
      // (ส่ง null ถ้าวันเกิดเป็น "" เพื่อล้างค่าใน DB)
      birth_date: profile.value.birth_date || null,
    };

    await authStore.updateProfile(dataToUpdate);
    successMessage.value = "บันทึกข้อมูลเรียบร้อยแล้ว";
  } catch (error) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึก";
  } finally {
    isLoading.value = false;
  }
};

// ⭐️ (เพิ่ม) ฟังก์ชันเมื่อคลิกปุ่ม "เลือกรูป"
const triggerFileInput = () => {
  fileInput.value.click();
};

// ⭐️ (เพิ่ม) ฟังก์ชันเมื่อเลือกไฟล์
const onFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  uploadError.value = null;
  uploadSuccess.value = null;
  errorMessage.value = null; // (เคลียร์ error เก่าของ Form)
  successMessage.value = null;

  try {
    const formData = new FormData();
    formData.append("avatar", file); // 'avatar' ต้องตรงกับ FileInterceptor

    // เรียก action ใหม่ใน store
    await authStore.uploadAvatar(formData);

    uploadSuccess.value = "อัปโหลดรูปสำเร็จ!";
    // ⭐️ ไม่ต้องเซ็ต profile.avatarUrl เพราะ avatarUrl เป็น computed
    // ⭐️ ที่ผูกกับ authStore.user อยู่แล้ว มันจะอัปเดตเอง
  } catch (error) {
    if (error.response && error.response.data) {
      uploadError.value =
        error.response.data.message || "เกิดข้อผิดพลาดในการอัปโหลด";
    } else {
      uploadError.value = "เกิดข้อผิดพลาดในการอัปโหลด";
    }
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = ""; // (เคลียร์ input)
  }
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">บัญชีของฉัน</h1>

    <div
      class="bg-white rounded-sm border border-gray-200 lg:grid lg:grid-cols-3"
    >
      <div
        v-if="isDataLoading"
        class="lg:col-span-3 flex justify-center items-center h-64"
      >
        <svg
          class="animate-spin h-8 w-8 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <div vif="!isDataLoading && errorMessage" class="lg:col-span-3 p-6">
        <p class="text-red-600 text-center">{{ errorMessage }}</p>
      </div>

      <form
        v-if="!isDataLoading && !errorMessage"
        @submit.prevent="handleUpdateProfile"
        class="p-6 lg:col-span-2"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-500"
              >ชื่อผู้ใช้ (Username)</label
            >
            <input
              type="text"
              id="username"
              :value="authStore.user?.username || ''"
              disabled
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-sm shadow-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-500"
              >อีเมล</label
            >
            <input
              type="email"
              id="email"
              v-model="profile.email"
              disabled
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-sm shadow-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label
              for="first_name"
              class="block text-sm font-medium text-gray-500"
              >ชื่อจริง</label
            >
            <input
              type="text"
              id="first_name"
              v-model="profile.first_name"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <div>
            <label
              for="last_name"
              class="block text-sm font-medium text-gray-500"
              >นามสกุล</label
            >
            <input
              type="text"
              id="last_name"
              v-model="profile.last_name"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-500"
              >เบอร์โทรศัพท์</label
            >
            <input
              type="text"
              id="phone"
              v-model="profile.phone"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <div>
            <label
              for="birth_date"
              class="block text-sm font-medium text-gray-500"
              >วันเกิด</label
            >
            <input
              type="date"
              id="birth_date"
              v-model="profile.birth_date"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <div class="md:col-span-2">
            <label for="gender" class="block text-sm font-medium text-gray-500"
              >เพศ</label
            >
            <select
              id="gender"
              v-model="profile.gender"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="not_specified">ไม่ระบุ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่น ๆ</option>
            </select>
          </div>
        </div>

        <div class="mt-8">
          <p v-if="successMessage" class="text-green-600 text-sm mb-2">
            {{ successMessage }}
          </p>
          <button
            type="submit"
            :disabled="isLoading || isUploading"
            class="w-full md:w-auto bg-gray-800 text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-gray-700 disabled:bg-gray-400"
          >
            {{ isLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง" }}
          </button>
        </div>
      </form>

      <div
        v-if="!isDataLoading && !errorMessage"
        class="lg:col-span-1 p-6 border-t lg:border-t-0 lg:border-l border-gray-200"
      >
        <div class="flex flex-col items-center">
          <label class="text-gray-500 text-sm mb-4">รูปโปรไฟล์</label>
          <img
            :src="avatarUrl"
            alt="Avatar"
            class="w-40 h-40 rounded-full object-cover border-4 border-gray-200 mb-4 bg-gray-100"
          />
          <input
            type="file"
            @change="onFileSelected"
            accept="image/png, image/jpeg, image/webp"
            class="hidden"
            ref="fileInput"
          />
          <button
            @click="triggerFileInput"
            :disabled="isUploading || isLoading"
            class="w-full bg-gray-700 text-white px-4 py-2 rounded-sm text-sm hover:bg-gray-800 disabled:bg-gray-400"
          >
            {{ isUploading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปภาพ" }}
          </button>
          <p class="text-xs text-gray-500 mt-2 text-center">
            อนุญาต: JPG, PNG, WEBP (สูงสุด 5MB)
          </p>
          <p v-if="uploadError" class="text-red-600 text-sm mt-3 text-center">
            {{ uploadError }}
          </p>
          <p
            v-if="uploadSuccess"
            class="text-green-600 text-sm mt-3 text-center"
          >
            {{ uploadSuccess }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
