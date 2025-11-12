<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 1. กำหนด Props
// เราจะรับ array ของ 'slides' จาก Parent component
// แต่ละ slide ควรมี: id, imageUrl, title, description, link
const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
  // ตั้งค่า Autoplay (เป็นวินาที) ถ้าไม่ส่งมา, ค่าเริ่มต้นคือ 5
  autoplayDuration: {
    type: Number,
    default: 5,
  },
});

// 2. State
const currentIndex = ref(0); // state เพื่อเก็บว่ากำลังแสดงสไลด์ไหน
let autoplayInterval = null;

// 3. Functions
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.slides.length) % props.slides.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

// 4. Autoplay Lifecycle
onMounted(() => {
  if (props.autoplayDuration > 0) {
    autoplayInterval = setInterval(nextSlide, props.autoplayDuration * 1000);
  }
});

onUnmounted(() => {
  clearInterval(autoplayInterval);
});
</script>

<template>
  <div class="relative w-full aspect-video overflow-hidden shadow-xl">
    <div
      class="flex h-full transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="slide in slides"
        :key="slide.id"
        class="w-full h-full flex-shrink-0 relative"
      >
        <!-- <img
          :src="slide.imageUrl"
          :alt="slide.title"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-linear"
          :class="{ 'scale-110': currentIndex === slide.id - 1 }"
        /> -->
        <img
          :src="slide.imageUrl"
          :alt="slide.title"
          class="w-full h-full object-cover"
        />

        <div class="absolute inset-0 bg-black/40"></div>

        <div
          class="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8"
        >
          <transition
            enter-active-class="transition-all duration-700 ease-out"
            enter-from-class="opacity-0 translate-y-5"
            enter-to-class="opacity-100 translate-y-0"
            mode="out-in"
          >
            <div :key="currentIndex" class="max-w-xl">
              <h2 class="text-3xl md:text-5xl font-bold drop-shadow-md mb-4">
                {{ slide.title }}
              </h2>
              <p class="text-lg md:text-xl drop-shadow-sm mb-6">
                {{ slide.description }}
              </p>
              <RouterLink
                :to="slide.link"
                class="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                ดูรายละเอียด
              </RouterLink>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <button
      @click="prevSlide"
      class="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 text-white rounded-full p-2 hover:bg-white/40 transition-colors"
      aria-label="Previous Slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="3"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <button
      @click="nextSlide"
      class="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 text-white rounded-full p-2 hover:bg-white/40 transition-colors"
      aria-label="Next Slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="3"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
      <button
        v-for="(slide, index) in slides"
        :key="`dot-${slide.id}`"
        @click="goToSlide(index)"
        class="h-2 rounded-full transition-all duration-300"
        :class="{
          'bg-white w-6': currentIndex === index,
          'bg-white/50 w-2': currentIndex !== index,
        }"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>
