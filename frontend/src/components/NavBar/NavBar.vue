<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
      <RouterLink to="/" class="text-2xl font-bold text-gray-800">
        Pizer
      </RouterLink>

      <div class="flex space-x-4">
        <RouterLink to="/" class="text-gray-600 hover:text-gray-800"
          >หน้าแรก</RouterLink
        >
        <RouterLink to="/products" class="text-gray-600 hover:text-gray-800"
          >สินค้าทั้งหมด</RouterLink
        >
      </div>

      <div class="flex items-center space-x-4">
        <RouterLink to="/cart" class="text-gray-600 hover:text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
            />
          </svg>
        </RouterLink>
        <RouterLink
          to="/login"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          เข้าสู่ระบบ
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
