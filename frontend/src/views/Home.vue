<script setup>
import { ref, onMounted } from "vue";
import ProductCard from "../components/Cards/ProductCard.vue";

// *** ข้อมูลจำลอง (Mock Data) ***
// (เนื่องจากเรายังไม่ได้สร้าง Service เพื่อยิง API
// เราจะใช้ข้อมูลจำลองนี้ไปก่อน)
const products = ref([
  {
    id: 1,
    name: "สินค้ารายการที่ 1",
    price: "100.00",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    name: "สินค้ารายการที่ 2",
    price: "150.00",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    name: "สินค้ารายการที่ 3",
    price: "200.00",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 4,
    name: "สินค้ารายการที่ 4",
    price: "250.00",
    image: "https://via.placeholder.com/300",
  },
]);

// onMounted(() => {
//   // ในอนาคต เราจะยิง API ที่นี่
//   // const response = await axios.get('http://localhost:3000/api/v1/products')
//   // products.value = response.data
// })
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">สินค้าทั้งหมด</h1>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
