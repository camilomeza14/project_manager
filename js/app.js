import { initRouter, navigate } from "./router.js";
import { isLoggedIn, clearSession, getSession } from "./utils/session.js";

function renderLayout() {
  document.getElementById("navbar").innerHTML = isLoggedIn()
    ? `
    <div class="nav-brand">ProjectManager</div>
    <nav class="nav-links">
      <a href="#" data-route="#/dashboard">Dashboard</a>
      <a href="#" data-route="#/projects">Reservations</a>
    </nav>
    <div class="nav-user">
      <span>${getSession().name} · <em>${getSession().role}</em></span>
      <button id="btnLogout" class="btn btn-sm btn-danger">Log out</button>
    </div>
  `
    : `<div class="nav-brand">ProjectManager</div>`;

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(link.dataset.route);
    });
  });

  const logoutBtn = document.getElementById("btnLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      renderLayout();
      navigate("/login");
    });
  }
}

renderLayout();
initRouter(renderLayout);
