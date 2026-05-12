const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function auditRecaptcha(token, action) {
  try {
    const response = await fetch(`${API_URL}/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action }),
    });
    if (!response.ok) return { success: false, score: 0 };
    return response.json();
  } catch {
    return { success: false, score: 0 };
  }
}
