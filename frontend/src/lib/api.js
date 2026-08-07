const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

let authToken = null;
let onUnauthorized = null;

export function setAuthToken(token) {
  authToken = token;
}

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok || !body?.success) {
    if (res.status === 401 && onUnauthorized) onUnauthorized();
    throw new ApiError(body?.error || "Something went wrong. Please try again.", res.status);
  }

  return body.data;
}

export const api = {
  auth: {
    login: (email, password) =>
      request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  },
  volunteers: {
    list: () => request("/volunteers"),
    get: (id) => request(`/volunteers/${id}`),
    create: (payload) => request("/volunteers", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/volunteers/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/volunteers/${id}`, { method: "DELETE" }),
    byAgeRange: (minAge, maxAge) =>
      request("/volunteers/report", { method: "POST", body: JSON.stringify({ minAge, maxAge }) }),
  },
  events: {
    list: () => request("/events"),
    create: (payload) => request("/events", { method: "POST", body: JSON.stringify(payload) }),
    volunteersFor: (eventId) => request(`/events/${eventId}/volunteers`),
    registerVolunteer: (eventId, volunteerId) =>
      request(`/events/${eventId}/volunteers`, {
        method: "POST",
        body: JSON.stringify({ volunteer_id: volunteerId }),
      }),
    removeVolunteer: (eventId, volunteerId) =>
      request(`/events/${eventId}/volunteers/${volunteerId}`, { method: "DELETE" }),
  },
};

export { ApiError };
