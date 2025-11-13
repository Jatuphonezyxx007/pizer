<script setup>
// 1. ⭐️ Import เพิ่ม: useRoute (จาก vue-router), ref และ computed (จาก vue)
import { RouterLink, useRoute } from "vue-router";
import { ref, computed, watch } from "vue";

// 2. ⭐️ รับ Event 'close-menu' (เหมือนเดิม)
const emit = defineEmits(["close-menu"]);

const user = {
  username: "jatt_ezyxx",
  avatarUrl: "https://via.placeholder.com/100", // Placeholder
};

// 3. ⭐️ สร้างฟังก์ชันที่จะเรียกใช้เมื่อคลิก (เหมือนเดิม)
const onLinkClick = () => {
  emit("close-menu"); // สั่งให้ Layout ปิดเมนู
};

// --- 4. ⭐️ Logic ใหม่สำหรับ Dropdown ---

// 4.1) ดึงข้อมูล route ปัจจุบัน
const route = useRoute();

// 4.2) สร้าง computed เพื่อเช็คว่า route ปัจจุบัน อยู่ในกลุ่ม "บัญชีของฉัน" หรือไม่
const isAccountMenuActive = computed(() => {
  return (
    route.path.startsWith("/account/profile") ||
    route.path.startsWith("/account/payments") ||
    route.path.startsWith("/account/addresses") ||
    route.path.startsWith("/account/password")
  );
});

// 4.3) สร้าง state สำหรับการเปิด/ปิด (ให้เปิดอัตโนมัติถ้าหน้าลูก active)
const isAccountMenuOpen = ref(isAccountMenuActive.value);

// 4.4) สร้างฟังก์ชันสำหรับ Toggle
const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value;
};

// 4.5) (Bonus) ถ้าเราเปลี่ยนหน้า (เช่น กด "การซื้อของฉัน")
// แล้วเมนู "บัญชีของฉัน" ไม่ได้ active แล้ว ก็ให้มันหุบกลับ
watch(isAccountMenuActive, (newValue) => {
  if (!newValue) {
    isAccountMenuOpen.value = false;
  } else {
    isAccountMenuOpen.value = true;
  }
});
</script>

<template>
  <aside class="w-full">
    <div class="flex items-center justify-between gap-4 p-4 border-b">
      <div class="flex items-center gap-4">
        <img
          :src="user.avatarUrl"
          alt="User Avatar"
          class="w-12 h-12 rounded-full object-cover border"
        />
        <div class="row">
          <h3 class="font-bold text-gray-900">{{ user.username }}</h3>
        </div>
      </div>
      <button
        @click="onLinkClick"
        class="lg:hidden text-gray-500 hover:text-gray-800 p-1"
      >
        <span class="material-symbols-outlined text-2xl"> close </span>
      </button>
    </div>

    <nav class="py-4">
      <ul>
        <li>
          <button
            type="button"
            @click="toggleAccountMenu"
            class="nav-link group w-full"
            :class="{ 'active-link': isAccountMenuActive }"
          >
            <span
              class="material-symbols-outlined text-[#ae2121] group-hover:text-[#ae2121]"
            >
              person
            </span>
            <span class="flex-grow text-left">บัญชีของฉัน</span>

            <span
              class="material-symbols-outlined transition-transform duration-300"
              :class="{ 'rotate-180': isAccountMenuOpen }"
            >
              expand_more
            </span>
          </button>

          <ul v-show="isAccountMenuOpen" class="pl-12 text-sm mt-1 space-y-1">
            <li>
              <RouterLink
                to="/account/profile"
                class="sub-nav-link"
                active-class="active-sub-link"
                @click="onLinkClick"
              >
                ประวัติ
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/account/payments"
                class="sub-nav-link"
                active-class="active-sub-link"
                @click="onLinkClick"
              >
                การชำระเงินของฉัน
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/account/addresses"
                class="sub-nav-link"
                active-class="active-sub-link"
                @click="onLinkClick"
              >
                ที่อยู่
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/account/password"
                class="sub-nav-link"
                active-class="active-sub-link"
                @click="onLinkClick"
              >
                เปลี่ยนรหัสผ่าน
              </RouterLink>
            </li>
          </ul>
        </li>
        <li>
          <RouterLink
            to="/account/purchases"
            class="nav-link group"
            active-class="active-link"
            @click="onLinkClick"
          >
            <span
              class="material-symbols-outlined text-blue-600 group-hover:text-blue-600"
            >
              receipt_long
            </span>
            <span>การซื้อของฉัน</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors;
}

/* ⭐️ 1. แก้ไขตรงนี้ */
.active-link {
  @apply font-semibold text-[#ae2121]; /* <-- เปลี่ยนจาก text-orange-600 */
}

.sub-nav-link {
  @apply block text-gray-600 hover:text-[#ae2121] py-1; /* ⭐️ 2. (แนะนำ) ปรับสี hover ที่นี่ด้วย */
}

/* ⭐️ 3. แก้ไขตรงนี้ */
.active-sub-link {
  @apply text-[#ae2121] font-medium; /* <-- เปลี่ยนจาก text-orange-600 */
}
</style>
