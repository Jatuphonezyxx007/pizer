// ตั้งค่า API URL หลัก
const API_BASE_URL = "http://localhost:3000";

/**
 * สร้าง URL ที่ถูกต้องสำหรับรูปโปรไฟล์
 * @param {string} filename - ชื่อไฟล์จาก DB (เช่น 'somyimg.png')
 * @returns {string} - URL เต็ม
 */
export const getProfileImageUrl = (filename) => {
  if (!filename) {
    // ⭐️ รูป Default ถ้า user ไม่มีรูป
    return "https://placehold.co/100x100";
  }
  // ⭐️ URL จะเป็น: http://localhost:3000/assets/uploads/users/profiles/somyimg.png
  return `${API_BASE_URL}/assets/uploads/users/profiles/${filename}`;
};
