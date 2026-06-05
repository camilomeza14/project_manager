# ProjectManager

Internal project management SPA for Riwi performance assessment.

## Description

A Single Page Application (SPA) that allows a software company to manage internal projects. It includes authentication, role-based access control (Manager / Collaborator), and full CRUD operations via a simulated API using json-server.

## Technologies

- Vanilla JavaScript (ES Modules)
- HTML5 / CSS3
- json-server (mock REST API)
- localStorage (session persistence)

## Installation

```bash
# Install json-server globally
npm install -g json-server
```

## Running the Project

1. Open `index.html` with a local server (e.g. Live Server in VS Code).
2. In a separate terminal, start the JSON server:

```bash
json-server --watch db.json --port 3000
```

## Running JSON Server

```bash
json-server --watch db.json --port 3000
```

The API will be available at `http://localhost:3000`

## Test Users

| Name         | Email              | Password | Role         |
|--------------|--------------------|----------|--------------|
| Manager      | manager@test.com   | 123456   | manager      |
| Collaborator | user@test.com      | 123456   | collaborator |

## Project Structure

```
project-manager/
├── index.html
├── db.json
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── app.js          # Entry point, layout rendering
    ├── router.js       # SPA routing and view protection
    ├── services/
    │   ├── auth.js     # Authentication API calls
    │   └── projects.js # Projects CRUD API calls
    ├── utils/
    │   └── session.js  # localStorage session management
    └── views/
        ├── login.js    # Login view
        ├── dashboard.js# Dashboard view (role-aware)
        └── projects.js # Projects CRUD view
```

## Role Permissions

| Action             | Manager | Collaborator |
|--------------------|---------|--------------|
| View all projects  | ✅      | ❌           |
| View own projects  | ✅      | ✅           |
| Create project     | ✅      | ❌           |
| Edit project       | ✅      | ❌           |
| Delete project     | ✅      | ❌           |
| Update own status  | ❌      | ✅           |

## Technical Decisions

- **ES Modules**: Each file is a module. Functions are explicitly imported/exported, keeping concerns separated.
- **SPA Router**: Manual hash-free router using `history.pushState`. No frameworks needed.
- **localStorage**: Chosen for session persistence across browser restarts (vs sessionStorage which clears on tab close).
- **json-server**: Provides a real REST API (GET, POST, PATCH, DELETE) from a simple JSON file — ideal for prototyping without a backend.
- **Role-based rendering**: Views check `getSession().role` to conditionally render actions, preventing unauthorized UI access.