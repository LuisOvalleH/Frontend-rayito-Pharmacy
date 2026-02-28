import api from "./axios";

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";
const ADMIN_FLAG_KEY = "is_admin";

export async function login(username, password) {
  const { data } = await api.post("/auth/login/", { username, password });
  localStorage.setItem(ACCESS_KEY, data.access);
  localStorage.setItem(REFRESH_KEY, data.refresh);

  const me = await getMe();
  if (!me?.is_staff) {
    logout();
    throw new Error("Tu usuario no tiene permisos de administrador.");
  }

  localStorage.setItem(ADMIN_FLAG_KEY, "1");
  return { ...data, me };
}

export async function getMe() {
  const { data } = await api.get("/auth/me/");
  return data;
}

export function logout() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ADMIN_FLAG_KEY);
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
