<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
  >
    <RouterLink :to="`/products/${product.id}`">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-48 object-cover"
      />

      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate">
          {{ product.name }}
        </h3>
        <p class="text-gray-600 font-bold">฿{{ product.price }}</p>
      </div>
    </RouterLink>

    <div class="px-4 pb-4">
      <button
        class="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
      >
        เพิ่มลงตะกร้า
      </button>
    </div>
  </div>
</template>
