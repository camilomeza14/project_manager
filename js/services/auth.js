// auth.js - Comunicación con la API de usuarios
const API_URL = "http://localhost:3000";

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Error al conectar con el servidor");

  const users = await response.json();
  
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) throw new Error("Credenciales incorrectas");

  return user;
}