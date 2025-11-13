<script setup>
import { ref } from "vue";
import AccountSidebar from "../../components/Sidebar/Sidebar.vue";

// State สำหรับเปิด/ปิดเมนูบนมือถือ
const isMobileMenuOpen = ref(false);

// ฟังก์ชันสำหรับปิดเมนู (เราจะส่งอันนี้ไปให้ Sidebar ใช้)
const closeMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <div class="bg-gray-100">
    <div class="container py-8">
      <div
        class="lg:hidden flex items-center justify-between bg-white p-4 rounded-md shadow-sm mb-4"
      >
        <h2 class="text-lg font-semibold text-gray-800">บัญชีของฉัน</h2>
        <button @click="isMobileMenuOpen = true" class="text-gray-700 p-1">
          <span class="material-symbols-outlined text-3xl"> menu </span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
        <div
          v-if="isMobileMenuOpen"
          @click="closeMenu"
          class="lg:hidden fixed inset-0 bg-black/50 z-20"
        ></div>

        <div
          class="fixed lg:static top-0 left-0 w-72 h-full bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out lg:col-span-1 lg:rounded-md lg:shadow-sm lg:h-fit lg:transform-none"
          :class="{
            'translate-x-0': isMobileMenuOpen,
            '-translate-x-full': !isMobileMenuOpen,
          }"
        >
          <AccountSidebar @close-menu="closeMenu" />
        </div>

        <div class="lg:col-span-3">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
