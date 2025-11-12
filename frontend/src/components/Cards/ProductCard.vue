<script setup>
import { RouterLink } from "vue-router";

// 1. กำหนด Props
// เราบอกว่า Component นี้จะรับข้อมูล 'product'
// ซึ่งเป็น Object เข้ามา
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article
    class="bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group"
  >
    <RouterLink :to="`/products/${product.id}`">
      <div class="relative overflow-hidden">
        <img
          :src="
            product.imageUrl ||
            'https://via.placeholder.com/400x300?text=Pizer+Product'
          "
          :alt="product.name"
          class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </RouterLink>

    <div class="p-4 flex flex-col h-40">
      <h3
        class="text-lg font-semibold text-gray-900 mb-2 truncate"
        :title="product.name"
      >
        <RouterLink :to="`/products/${product.id}`" class="hover:text-blue-600">
          {{ product.name }}
        </RouterLink>
      </h3>

      <p class="text-sm text-gray-600 mb-3 flex-grow line-clamp-2 truncate">
        {{ product.description }}
      </p>

      <div class="flex justify-between items-center mt-auto">
        <span class="text-xl font-bold text-[#ae2121]">
          ฿{{ product.price.toLocaleString() }}
        </span>
      </div>
    </div>
  </article>
</template>
