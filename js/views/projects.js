import { getSession, isManager } from "../utils/session.js";
import {
  getAllProjects,
  getProjectsByUser,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projects.js";

const STATUSES = ["Pending", "In Progress", "Completed"];

export async function renderProjects() {
  const app = document.getElementById("app");
  const user = getSession();

  let projects = isManager()
    ? await getAllProjects()
    : await getProjectsByUser(user.id);

  app.innerHTML = `
    <div class="projects-container">
      <div class="projects-header">
        <h2>Booking</h2>
        ${isManager() ? `<button id="btnNewProject" class="btn btn-primary">+ New Booking</button>` : ""}
      </div>
      <div id="projectsList" class="projects-grid"></div>
      <div id="projectModal" class="modal hidden"></div>
    </div>
  `;

  renderProjectCards(projects);

  if (isManager()) {
    document.getElementById("btnNewProject").addEventListener("click", () => {
      openProjectModal(null);
    });
  }
}

function renderProjectCards(projects) {
  const list = document.getElementById("projectsList");
  const user = getSession();

  if (projects.length === 0) {
    list.innerHTML = `<p class="empty-msg">No reservations available</p>`;
    return;
  }

  list.innerHTML = projects
    .map(
      (p) => `
    <div class="project-card" data-id="${p.id}">
      <div class="card-header">
        <h3>${p.name}</h3>
        <span class="status-badge ${p.status.replace(" ", "-").toLowerCase()}">${p.status}</span>
      </div>
      <p class="card-desc">${p.description}</p>
      <p class="card-date">Creado: ${p.createdAt}</p>
      <div class="card-actions">
        <button class="btn btn-sm btn-secondary btn-detail" data-id="${p.id}">View</button>
        ${
          isManager()
            ? `<button class="btn btn-sm btn-warning btn-edit" data-id="${p.id}">Edit</button>
               <button class="btn btn-sm btn-danger btn-delete" data-id="${p.id}">Delete</button>`
            : `<button class="btn btn-sm btn-warning btn-status" data-id="${p.id}" data-status="${p.status}">Change status</button>`
        }
      </div>
    </div>
  `
    )
    .join("");

  
  list.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("¿Delete this reservation")) {
        await deleteProject(btn.dataset.id);
        renderProjects();
      }
    });
  });

  list.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const project = projects.find((p) => p.id == btn.dataset.id);
      openProjectModal(project);
    });
  });

  list.querySelectorAll(".btn-status").forEach((btn) => {
    btn.addEventListener("click", () => {
      openStatusModal(btn.dataset.id, btn.dataset.status);
    });
  });

  list.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.addEventListener("click", () => {
      const project = projects.find((p) => p.id == btn.dataset.id);
      openDetailModal(project);
    });
  });
}

function openProjectModal(project) {
  const modal = document.getElementById("projectModal");
  const isEditing = project !== null;

  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>${isEditing ? "Edit Reservation" : "New Reservation"}</h3>
        <form id="projectForm">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="pName" value="${isEditing ? project.name : ""}" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="pDesc" rows="3">${isEditing ? project.description : ""}</textarea>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="pStatus">
              ${STATUSES.map(
                (s) =>
                  `<option value="${s}" ${isEditing && project.status === s ? "selected" : ""}>${s}</option>`
              ).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Responsable (ID user)</label>
            <input type="number" id="pAssigned" value="${isEditing ? project.assignedTo : 2}" />
          </div>
          <div class="modal-footer">
            <button type="button" id="btnCancelModal" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">${isEditing ? "Save" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");

  document.getElementById("btnCancelModal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("pName").value.trim(),
      description: document.getElementById("pDesc").value.trim(),
      status: document.getElementById("pStatus").value,
      assignedTo: parseInt(document.getElementById("pAssigned").value),
      createdAt: isEditing ? project.createdAt : new Date().toISOString().split("T")[0],
    };
    if (isEditing) {
      await updateProject(project.id, data);
    } else {
      await createProject(data);
    }
    modal.classList.add("hidden");
    renderProjects();
  });
}

function openStatusModal(projectId, currentStatus) {
  const modal = document.getElementById("projectModal");

  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>Update Status</h3>
        <div class="form-group">
          <label>New status</label>
          <select id="newStatus">
            ${STATUSES.map(
              (s) => `<option value="${s}" ${s === currentStatus ? "selected" : ""}>${s}</option>`
            ).join("")}
          </select>
        </div>
        <div class="modal-footer">
          <button id="btnCancelStatus" class="btn btn-secondary">Cancel</button>
          <button id="btnSaveStatus" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");

  document.getElementById("btnCancelStatus").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  document.getElementById("btnSaveStatus").addEventListener("click", async () => {
    const newStatus = document.getElementById("newStatus").value;
    await updateProject(projectId, { status: newStatus });
    modal.classList.add("hidden");
    renderProjects();
  });
}

function openDetailModal(project) {
  const modal = document.getElementById("projectModal");

  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>${project.name}</h3>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Status:</strong> ${project.status}</p>
        <p><strong>Created:</strong> ${project.createdAt}</p>
        <p><strong>Responsible ID:</strong> ${project.assignedTo}</p>
        <div class="modal-footer">
          <button id="btnCloseDetail" class="btn btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");

  document.getElementById("btnCloseDetail").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}
