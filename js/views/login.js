import { loginUser } from "../services/auth.js";
import { saveSession } from "../utils/session.js";

export function renderLogin(navigate) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Reservations Manager</h1>
          <p>Log in to your account</p>
        </div>
        <form id="loginForm" novalidate>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="email@example.com" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="••••••" required />
          </div>
          <div id="loginError" class="error-msg hidden"></div>
          <button type="submit" class="btn btn-primary btn-full">Log in</button>
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
      errorDiv.textContent = "All fields are required.";
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
