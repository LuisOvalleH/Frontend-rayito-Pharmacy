import api from "./axios";

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";
const ADMIN_FLAG_KEY = "is_admin";
const ROLE_KEY = "role";

export async function login(username, password) {
  const { data } = await api.post("/auth/login/", { username, password });
  localStorage.setItem(ACCESS_KEY, data.access);
  localStorage.setItem(REFRESH_KEY, data.refresh);

  const me = await getCurrentUser();
  if (!me?.is_staff) {
    logout();
    throw new Error("Tu usuario no tiene permisos de administrador.");
  }

  const role = me.role || (me.is_superuser ? "superadmin" : "admin");
  localStorage.setItem(ADMIN_FLAG_KEY, "1");
  localStorage.setItem(ROLE_KEY, role);
  return { ...data, me };
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export async function getCurrentUser() {
  try {
    const { data } = await api.get("/current-user/");
    return data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const { data } = await api.get("/auth/me/");
      return data;
    }
    throw err;
  }
}

export function logout() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ADMIN_FLAG_KEY);
  localStorage.removeItem(ROLE_KEY);
}

function decodePayload(token) {
  if (!token || token.split(".").length < 2) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isTokenValid() {
  const token = localStorage.getItem(ACCESS_KEY);
  if (!token) return false;
  const payload = decodePayload(token);
  if (!payload?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function isAuthed() {
  return isTokenValid() && localStorage.getItem(ADMIN_FLAG_KEY) === "1";
}
