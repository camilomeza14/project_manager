import { isLoggedIn } from "./utils/session.js";
import { renderLogin } from "./views/login.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderProjects } from "./views/projects.js";

let renderLayoutFn = null;

const routes = {
  "#/login": renderLogin,
  "#/dashboard": renderDashboard,
  "#/projects": renderProjects,
};

export function navigate(path) {
  if (!isLoggedIn() && path !== "#/login") {
    window.location.hash = "#/login";
    return;
  }
  window.location.hash = path;
}

function handleRoute() {
  const hash = window.location.hash || "#/login";
  const render = routes[hash];

  if (!render) {
    navigate(isLoggedIn() ? "#/dashboard" : "#/login");
    return;
  }

  if (renderLayoutFn) renderLayoutFn();
  render(navigate);
}

export function initRouter(layoutFn) {
  renderLayoutFn = layoutFn;
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}
