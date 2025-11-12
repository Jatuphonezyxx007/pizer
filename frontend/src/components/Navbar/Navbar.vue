<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="sticky top-0 z-50 text-white bg-[#ae2121]">
    <!-- <div class="w-full text-xs border-b border-white/20">
      <div class="container mx-auto px-6 py-1.5 flex justify-end items-center">
        <RouterLink to="/register" class="font-semibold hover:opacity-80"
          >สมัครใหม่</RouterLink
        >
        <div class="h-3 w-px bg-white/40"></div>
        <RouterLink to="/login" class="font-semibold hover:opacity-80"
          >เข้าสู่ระบบ</RouterLink
        >
      </div>
    </div> -->
    <div class="w-full text-xs">
      <div class="container py-1.5 flex justify-end items-center space-x-4">
        <RouterLink to="/register" class="font-semibold hover:opacity-80">
          สมัครใหม่
        </RouterLink>

        <div class="h-3 w-px bg-white/40"></div>

        <RouterLink to="/login" class="font-semibold hover:opacity-80">
          เข้าสู่ระบบ
        </RouterLink>
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
