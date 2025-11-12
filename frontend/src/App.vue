<script setup>
import NavBar from "./components/Navbar/Navbar.vue";
import Footer from "./components/Footer/Footer.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <NavBar />

    <main class="flex-grow">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* ไฟล์นี้ไม่จำเป็นต้องมี style scoped แล้ว เพราะเราใช้ Tailwind */
</style>
