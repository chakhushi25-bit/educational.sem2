const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  health: () => request("/health"),
  bootstrap: () => request("/bootstrap"),
  updateUser: (user) => request("/users/me", { method: "PUT", body: JSON.stringify(user) }),
  createTask: (task) => request("/tasks", { method: "POST", body: JSON.stringify(task) }),
  updateTask: (id, patch) => request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  saveStudyPlan: (plan) => request("/study-plans/current", { method: "PUT", body: JSON.stringify(plan) }),
  togglePlanItem: (id, completed) =>
    request(`/study-plans/items/${id}`, { method: "PATCH", body: JSON.stringify({ completed }) }),
  markNotification: (id) =>
    request(`/notifications/${id}`, { method: "PATCH", body: JSON.stringify({ read: true }) }),
  sendChat: (text) => request("/chat", { method: "POST", body: JSON.stringify({ text }) }),
};
