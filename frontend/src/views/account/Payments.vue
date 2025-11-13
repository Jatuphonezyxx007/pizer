<script setup>
// (ในอนาคตคุณสามารถเพิ่ม Logic สำหรับหน้านี้ได้ที่นี่)
</script>

<template>
  <div class="bg-white rounded-md shadow-sm">
    <div class="p-6 border-b">
      <h1 class="text-xl font-semibold text-gray-900">การชำระเงินของฉัน</h1>
      <p class="text-sm text-gray-600 mt-1">
        จัดการบัญชีธนาคารและบัตรเครดิตของคุณ
      </p>
    </div>

    <div class="p-6">
      <div class="text-center text-gray-500 py-12">
        <span class="material-symbols-outlined text-6xl text-gray-300">
          credit_card
        </span>
        <p class="mt-4">คุณยังไม่ได้เพิ่มบัญชีธนาคารหรือบัตรเครดิต</p>
        <button
          class="mt-4 bg-[#f94d2f] text-white px-5 py-2 rounded-sm text-sm"
        >
          + เพิ่มบัญชีธนาคาร
        </button>
      </div>
    </div>
  </div>
</template>
