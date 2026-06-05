// session.js - Maneja la persistencia de sesión con localStorage
const SESSION_KEY = "pm_session";

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession() {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn() {
  return getSession() !== null;
}

export function isManager() {
  const session = getSession();
  return session && session.role === "manager";
}