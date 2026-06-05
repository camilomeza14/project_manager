// dashboard.js - Vista del dashboard según rol
import { getSession } from "../utils/session.js";
import { getAllProjects, getProjectsByUser } from "../services/projects.js";

export async function renderDashboard() {
  const app = document.getElementById("app");
  const user = getSession();

  let projects = [];
  if (user.role === "manager") {
    projects = await getAllProjects();
  } else {
    projects = await getProjectsByUser(user.id);
  }

  const total = projects.length;
  const active = projects.filter((p) => p.status === "In Progress").length;
  const completed = projects.filter((p) => p.status === "Completed").length;

  let statsHTML = "";
  if (user.role === "manager") {
    statsHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">${total}</span>
          <span class="stat-label">Total proyectos</span>
        </div>
        <div class="stat-card active">
          <span class="stat-number">${active}</span>
          <span class="stat-label">En progreso</span>
        </div>
        <div class="stat-card done">
          <span class="stat-number">${completed}</span>
          <span class="stat-label">Finalizados</span>
        </div>
      </div>
    `;
  } else {
    statsHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">${total}</span>
          <span class="stat-label">Proyectos asignados</span>
        </div>
        <div class="stat-card active">
          <span class="stat-number">${active}</span>
          <span class="stat-label">En progreso</span>
        </div>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="dashboard-container">
      <h2>Bienvenido, ${user.name} <span class="role-badge ${user.role}">${user.role}</span></h2>
      <p class="dashboard-subtitle">Resumen de tus proyectos</p>
      ${statsHTML}
    </div>
  `;
}