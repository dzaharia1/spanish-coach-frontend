import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function authHeaders() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function fetchHistory({ search } = {}) {
  const headers = await authHeaders();
  const url = new URL(`${API_URL}/history`);
  if (search) url.searchParams.set("search", search);

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Failed to load history (${response.status})`);
  }
  const data = await response.json();
  return data.items || [];
}

export async function deleteHistoryItem(id) {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/history/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete translation (${response.status})`);
  }
  return response.json();
}
