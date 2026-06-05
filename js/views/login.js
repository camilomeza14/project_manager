// login.js - Vista de inicio de sesión
import { loginUser } from "../services/auth.js";
import { saveSession } from "../utils/session.js";

export function renderLogin(navigate) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>ProjectManager</h1>
          <p>Ingresa a tu cuenta</p>
        </div>
        <form id="loginForm" novalidate>
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" placeholder="correo@ejemplo.com" required />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" placeholder="••••••" required />
          </div>
          <div id="loginError" class="error-msg hidden"></div>
          <button type="submit" class="btn btn-primary btn-full">Ingresar</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("loginError");

    if (!email || !password) {
      errorDiv.textContent = "Todos los campos son obligatorios.";
      errorDiv.classList.remove("hidden");
      return;
    }

    try {
      const user = await loginUser(email, password);
      saveSession(user);
      navigate("/dashboard");
    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove("hidden");
    }
  });
}