<script setup>
import { ref } from "vue";

// 1. ⭐️ อัปเดต ref ให้รองรับ 'lastName' และเปลี่ยน 'birthdate' เป็น format ที่ input:date ใช้ได้
const profile = ref({
  username: "jatt_ezyxx",
  name: "Jatuphon",
  lastName: "", // ⭐️ เพิ่ม field นามสกุล
  email: "no*********@gmail.com",
  phone: "********71",
  gender: "male",
  birthdate: "2003-01-01", // ⭐️ เปลี่ยน format เพื่อให้ <input type="date"> ทำงาน
  avatarUrl: "https://via.placeholder.com/200",
});

// 2. ⭐️ เพิ่มฟังก์ชันสำหรับปุ่ม "บันทึก"
const handleSubmit = () => {
  // (ในอนาคตคุณจะยิง API ที่นี่)
  console.log("กำลังบันทึกข้อมูล:", profile.value);
  alert("บันทึกข้อมูลเรียบร้อย!");
};
</script>

<template>
  <div class="bg-white rounded-md shadow-sm">
    <div class="p-6 border-b">
      <h1 class="text-xl font-semibold text-gray-900">ข้อมูลของฉัน</h1>
      <p class="text-sm text-gray-600 mt-1">
        จัดการข้อมูลส่วนตัวเพื่อความปลอดภัยของบัญชีผู้ใช้
      </p>
    </div>

    <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form class="lg:col-span-2 space-y-6" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-3 items-center gap-4">
          <label for="username" class="text-gray-500 text-sm text-right"
            >ชื่อผู้ใช้</label
          >
          <div class="col-span-2">
            <input
              type="text"
              id="username"
              v-model="profile.username"
              class="w-full px-3 py-2 border rounded-sm text-sm bg-gray-100"
              disabled
            />
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label class="text-gray-500 text-sm text-right">ชื่อ - นามสกุล</label>

          <div class="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="name"
                v-model="profile.name"
                placeholder="ชื่อ"
                class="w-full px-3 py-2 border rounded-sm text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                id="lastName"
                v-model="profile.lastName"
                placeholder="นามสกุล"
                class="w-full px-3 py-2 border rounded-sm text-sm"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="email" class="text-gray-500 text-sm text-right"
            >อีเมล</label
          >
          <div class="col-span-2">
            <input
              type="email"
              id="email"
              v-model="profile.email"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="phone" class="text-gray-500 text-sm text-right"
            >หมายเลขโทรศัพท์</label
          >
          <div class="col-span-2">
            <input
              type="tel"
              id="phone"
              v-model="profile.phone"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label class="text-gray-500 text-sm text-right">เพศ</label>
          <div class="col-span-2 flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="profile.gender"
                value="male"
                class="text-orange-600"
              />
              ชาย
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="profile.gender"
                value="female"
                class="text-orange-600"
              />
              หญิง
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="profile.gender"
                value="other"
                class="text-orange-600"
              />
              อื่น ๆ
            </label>
          </div>
        </div>

        <div class="grid grid-cols-3 items-center gap-4">
          <label for="birthdate" class="text-gray-500 text-sm text-right"
            >วันเดือนปีเกิด</label
          >
          <div class="col-span-2">
            <input
              type="date"
              id="birthdate"
              v-model="profile.birthdate"
              class="w-full px-3 py-2 border rounded-sm text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div></div>
          <div class="col-span-2">
            <button
              type="submit"
              class="bg-[#f94d2f] text-white px-6 py-2 rounded-sm hover:bg-opacity-90"
            >
              บันทึก
            </button>
          </div>
        </div>
      </form>

      <div class="lg:col-span-1 flex flex-col items-center pt-8 lg:border-l">
        <img
          :src="profile.avatarUrl"
          alt="Profile Picture"
          class="w-28 h-28 rounded-full object-cover border"
        />
        <button
          type="button"
          class="border px-4 py-2 text-sm mt-4 hover:bg-gray-50"
        >
          เลือกรูป
        </button>
        <div class="text-xs text-gray-400 mt-3 text-center">
          <p>ขนาดไฟล์: สูงสุด 1 MB</p>
          <p>ไฟล์ที่รองรับ: .JPEG, .PNG</p>
        </div>
      </div>
    </div>
  </div>
</template>
