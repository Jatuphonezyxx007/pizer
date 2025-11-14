<script setup>
import { ref, computed } from "vue"; // ⭐️ 1. Import ref และ computed
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore"; // ⭐️ 1. Import Store
import { getProfileImageUrl } from "../../utils/imageUrl";

const authStore = useAuthStore(); // ⭐️ 2. เรียกใช้ Store
const router = useRouter(); // ⭐️ 3. เรียกใช้ Router (สำหรับ Logout)

// ⭐️ 2. สร้าง state สำหรับเปิด/ปิด Dropdown
const isDropdownOpen = ref(false);

// ⭐️ 3. สร้าง computed property สำหรับเช็ค 'admin'
const isAdmin = computed(() => {
  return (
    authStore.isAuthenticated &&
    authStore.user?.roles?.some((role) => role.name === "admin")
  );
});

// ⭐️ 2. (เพิ่ม) Computed URL รูปภาพ
const profileImageUrl = computed(() => {
  const filename = authStore.user?.info_personal?.profile_image; //
  return getProfileImageUrl(filename);
});

// ⭐️ 4. สร้างฟังก์ชัน Logout
const handleLogout = () => {
  authStore.logout();
  router.push("/login"); // กลับไปหน้า Login
};
</script>

<template>
  <header class="sticky top-0 z-50 text-white bg-[#ae2121]">
    <div class="w-full text-xs">
      <div class="container py-1.5 flex justify-end items-center space-x-4">
        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/register" class="font-semibold hover:opacity-80">
            สมัครใหม่
          </RouterLink>
          <div class="h-3 w-px bg-white/40"></div>
          <RouterLink to="/login" class="font-semibold hover:opacity-80">
            เข้าสู่ระบบ
          </RouterLink>
        </template>

        <template v-else>
          <div class="relative">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="flex items-center space-x-1 font-semibold hover:opacity-80"
            >
              <img
                :src="profileImageUrl"
                alt="profile"
                class="w-5 h-5 rounded-full object-cover"
              />
              <span>สวัสดี, {{ authStore.user.username }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <div
              v-if="isDropdownOpen"
              @click="isDropdownOpen = false"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-black"
            >
              <RouterLink
                to="/account/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                บัญชีของฉัน
              </RouterLink>

              <RouterLink
                v-if="isAdmin"
                to="/admin"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                ภาพรวม (Dashboard)
              </RouterLink>
              <RouterLink
                v-else
                to="/my-orders"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                การซื้อของฉัน
              </RouterLink>

              <button
                @click="handleLogout"
                class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="container py-5">
      <div class="flex items-center justify-between space-x-8">
        <RouterLink
          to="/"
          class="text-4xl font-bold text-white flex-shrink-0 -mt-2"
        >
          Pizer
        </RouterLink>

        <div class="flex-grow">
          <div class="w-full flex rounded-sm overflow-hidden">
            <input
              type="text"
              placeholder="ค้นหาใน Pizer ..."
              class="w-full px-4 py-2.5 text-sm text-gray-900 focus:outline-none placeholder-gray-400"
            />
            <button class="bg-[#fb5533] text-white px-5 hover:bg-opacity-90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <div class="w-full flex space-x-3 text-white text-xs mt-1.5">
            <RouterLink to="/products" class="hover:opacity-80"
              >สินค้าทั้งหมด</RouterLink
            >
            <RouterLink to="/search/promotion" class="hover:opacity-80"
              >โปรโมชั่น</RouterLink
            >
            <RouterLink to="/search/new" class="hover:opacity-80"
              >รายการใหม่</RouterLink
            >
            <RouterLink to="/search/topper" class="hover:opacity-80"
              >โทรศัพท์มือถือ</RouterLink
            >
            <RouterLink to="/search/shoes" class="hover:opacity-80"
              >Flash Sale</RouterLink
            >
          </div>
        </div>

        <RouterLink
          to="/cart"
          class="flex items-center text-white hover:opacity-80 transition-colors relative flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
