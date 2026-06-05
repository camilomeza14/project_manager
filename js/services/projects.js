// projects.js - CRUD de proyectos contra json-server
const API_URL = "http://localhost:3000";

export async function getAllProjects() {
  const res = await fetch(`${API_URL}/projects`);
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}

export async function getProjectsByUser(userId) {
  const res = await fetch(`${API_URL}/projects?assignedTo=${userId}`);
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error("Error al crear proyecto");
  return res.json();
}

export async function updateProject(id, projectData) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error("Error al actualizar proyecto");
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar proyecto");
  return true;
}