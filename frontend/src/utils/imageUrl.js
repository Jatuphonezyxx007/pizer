// (Base URL ของ Backend)
const API_BASE_URL = "http://localhost:3000";

// (Path ที่เรา Serve Static)
const AVATAR_PATH = "/assets/uploads/users/profiles/";

// (รูป Default)
const DEFAULT_AVATAR = "https://placehold.co/200x200/EFEFEF/AAAAAA&text=P";

export function getProfileImageUrl(filename) {
  if (filename) {
    // (ป้องกันกรณี filename เป็น URL เต็มอยู่แล้ว)
    if (filename.startsWith("http")) {
      return filename;
    }
    return `${API_BASE_URL}${AVATAR_PATH}${filename}`;
  }
  return DEFAULT_AVATAR;
}
