// src/utils/auth.js

export async function getUserProfile() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/profile/`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;
    return await res.json(); // { username, email }
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}
