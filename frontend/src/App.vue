<script setup>
import { RouterView } from "vue-router";
// import NavBar from "./components/NavBar/NavBar.vue";
// import Footer from "./components/Footer/Footer.vue"; // <-- Import Footer
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <!-- <NavBar /> -->

    <main class="flex-grow container mx-auto p-6">
      <RouterView />
    </main>

    <!-- <Footer /> -->
  </div>
</template>

<style scoped>
/* ลบ style เก่าทิ้งได้เลย */
</style>
