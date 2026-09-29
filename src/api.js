const API_BASE = "/api";

export const authStorage = {
  getToken: () => localStorage.getItem("studysync_token") || "",
  setToken: (token) => localStorage.setItem("studysync_token", token),
  clearToken: () => localStorage.removeItem("studysync_token"),
  getApiKey: () => localStorage.getItem("studysync_openrouter_key") || "",
  setApiKey: (key) => localStorage.setItem("studysync_openrouter_key", key),
  getModel: () => localStorage.getItem("studysync_ai_model") || "meta-llama/llama-3.3-70b-instruct:free",
  setModel: (model) => localStorage.setItem("studysync_ai_model", model),
};

async function request(path, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // If body is not FormData, add default json Content-Type
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // System & Health
  health: () => request("/health"),
  bootstrap: () => request("/bootstrap"),

  // Authentication
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  signup: (userData) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  getMe: () => request("/auth/me"),
  updateUser: (user) =>
    request("/users/me", {
      method: "PUT",
      body: JSON.stringify(user),
    }),

  // Tasks
  getTasks: () => request("/tasks"),
  createTask: (task) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),
  updateTask: (id, patch) =>
    request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),

  // Study Plans
  getStudyPlan: () => request("/study-plans/current"),
  saveStudyPlan: (plan) =>
    request("/study-plans/current", {
      method: "PUT",
      body: JSON.stringify(plan),
    }),
  togglePlanItem: (id, completed) =>
    request(`/study-plans/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    }),

  // Documents & RAG Knowledge Base
  getDocuments: (subjectId = "") =>
    request(`/documents${subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : ""}`),
  uploadDocument: (formData) =>
    request("/documents/upload", {
      method: "POST",
      body: formData,
    }),
  deleteDocument: (id) =>
    request(`/documents/${id}`, {
      method: "DELETE",
    }),

  // OpenRouter & RAG AI
  getModels: () => request("/openrouter/models"),
  sendChat: (payload) =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  askRag: (payload) =>
    request("/rag/ask", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  generateRagPlan: (payload) =>
    request("/rag/generate-plan", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Miscellaneous
  getHistory: () => request("/history"),
  getNotifications: () => request("/notifications"),
  markNotification: (id) =>
    request(`/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
    }),
  getAnalytics: () => request("/analytics/weekly"),
  getBadges: () => request("/badges"),
  getTestimonials: () => request("/testimonials"),
};
