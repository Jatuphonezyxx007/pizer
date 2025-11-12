<script setup>
import { RouterLink } from "vue-router";
import Carousel from "../components/Carousel/Carousel.vue"; // <-- Component สไลด์
import ProductCard from "../components/Cards/ProductCard.vue"; // <-- Component การ์ดสินค้า

// --- 1. ข้อมูลสำหรับ Carousel (เหมือนเดิม) ---
const carouselSlides = [
  {
    id: 1,
    title: "พิซซ่าหน้าใหม่! ลด 50%",
    description: "ลองเลยวันนี้ กับหน้าซีฟู้ดเดอลุกซ์ สูตรพิเศษจาก Pizer",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=675&fit=crop",
    link: "/products/4",
  },
  {
    id: 2,
    title: "ซื้อ 1 แถม 1",
    description: "เมื่อสั่งพิซซ่าถาดใหญ่หน้าใดก็ได้ แถมฟรี! ถาดเล็ก",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=675&fit=crop",
    link: "/promotions",
  },
  {
    id: 3,
    title: "ส่งฟรี! ทั่วไทย",
    description: "เพียงสั่งซื้อครบ 500 บาทขึ้นไป ส่งฟรีถึงหน้าบ้านคุณ",
    imageUrl:
      "https://images.unsplash.com/photo-1593504049359-c16c606a6c9e?w=1200&h=675&fit=crop",
    link: "/products",
  },
];

// --- 2. ข้อมูลสำหรับสินค้าแนะนำ (เหมือนเดิม) ---
const featuredProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "ชิป A17 Pro, หน้าจอ Super Retina XDR 6.1 นิ้ว, กล้อง 48MP",
    price: 42900,
    imageUrl:
      "https://images.unsplash.com/photo-1695049303037-fb63f856bfb6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    description: "Snapdragon 8 Gen 3, กล้อง 200MP, หน้าจอ 6.8 นิ้ว QHD+",
    price: 39900,
    imageUrl:
      "https://images.unsplash.com/photo-1611224902178-6c9f6a9c9b4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Xiaomi 14",
    description: "กล้อง Leica, Snapdragon 8 Gen 3, หน้าจอ AMOLED 120Hz",
    price: 29900,
    imageUrl:
      "https://images.unsplash.com/photo-1629904853691-7f5a28d3e87a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "OnePlus 12",
    description: "Snapdragon 8 Gen 3, จอ AMOLED 120Hz, แบต 5400mAh",
    price: 32900,
    imageUrl:
      "https://images.unsplash.com/photo-1615572760053-0c7f3f0a6b6a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Google Pixel 8 Pro",
    description: "ชิป Google Tensor G3, กล้อง AI สุดล้ำ, Android 14",
    price: 34900,
    imageUrl:
      "https://images.unsplash.com/photo-1603898037225-9b21a3e6b04b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "OPPO Find X7 Ultra",
    description: "กล้อง Sony LYT-900, ชิป Snapdragon 8 Gen 3",
    price: 30900,
    imageUrl:
      "https://images.unsplash.com/photo-1618230715076-7e0b70a8b9b8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "vivo X100 Pro",
    description: "กล้อง Zeiss, ชิป Dimensity 9300, ชาร์จไว 120W",
    price: 28900,
    imageUrl:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    name: "Nothing Phone (2)",
    description: "ดีไซน์ใสพร้อมไฟ Glyph, Snapdragon 8+ Gen 1",
    price: 25900,
    imageUrl:
      "https://images.unsplash.com/photo-1693257959894-5a9f28d902d3?auto=format&fit=crop&w=800&q=80",
  },
];
</script>

<template>
  <div>
    <section class="container pt-8">
      <div class="row">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div class="lg:col-span-2">
            <Carousel :slides="carouselSlides" :autoplay-duration="7" />
          </div>

          <div class="lg:col-span-1 flex flex-col gap-2 h-full">
            <RouterLink
              to="/promo/1"
              class="group block overflow-hidden shadow-lg relative transition-all duration-300 hover:shadow-xl flex-1"
            >
              <img
                src="https://images.unsplash.com/photo-1542845347-9099a443315a?w=400&h=250&fit=crop"
                alt="Special Deal 1"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              ></div>
              <h3
                class="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-lg"
              >
                ลดล้างสต็อก!
              </h3>
            </RouterLink>

            <RouterLink
              to="/promo/2"
              class="group block overflow-hidden shadow-lg relative transition-all duration-300 hover:shadow-xl flex-1"
            >
              <img
                src="https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?w=400&h=250&fit=crop"
                alt="Special Deal 2"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              ></div>
              <h3
                class="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-lg"
              >
                เมนูใหม่ต้องลอง
              </h3>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
    <section class="container py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
        เมนูแนะนำของเรา
      </h2>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3"
      >
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>
  </div>
</template>
