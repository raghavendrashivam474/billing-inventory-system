# Sprint 0 — Project Setup & Development Environment

## Objective

The goal of this sprint is **not to build any Billing & Inventory features**.

This sprint exists solely to prepare a clean, production-ready development environment that the team will build upon throughout the project.

By the end of this sprint, every developer should be able to clone the repository, install dependencies, and successfully run both the frontend and backend with their default starter applications.

---

# Scope

This sprint focuses only on project initialization.

Do **not** implement authentication, database models, APIs, business logic, or UI specific to the Billing & Inventory Management System.

---

# Tasks

## 1. Create Project Workspace

Create the main project directory.

Example:

```
billing-inventory-system/
```

---

## 2. Create Project Structure

Inside the main directory, create the initial folders.

```
billing-inventory-system/

frontend/

backend/

docs/

database/

scripts/

shared/
```

No business code is required yet.

---

## 3. Initialize Git Repository

* Initialize Git.
* Create the initial commit.
* Add an appropriate `.gitignore`.

---

## 4. Verify Development Prerequisites

Ensure the following tools are installed and working correctly:

* Node.js (LTS)
* npm
* Git
* VS Code
* PostgreSQL (installation only, configuration later)

Verify versions using terminal commands.

---

## 5. Frontend Initialization

Inside the `frontend` folder:

* Create a new React application using Vite.
* Use TypeScript.
* Install project dependencies.

Do not install project-specific libraries yet.

Run the default Vite application successfully.

Expected result:

The default React + Vite page loads successfully in the browser.

---

## 6. Backend Initialization

Inside the `backend` folder:

* Initialize a Node.js project.
* Configure TypeScript.
* Create a simple Express server.
* Add a default route.

Example response:

```
GET /

Hello from Backend
```

Run the server successfully.

---

## 7. Verify Independent Execution

Confirm that:

Frontend runs independently.

Backend runs independently.

No connection between them is required in this sprint.

---

## 8. Basic Documentation

Inside the `docs` folder create:

```
Project Overview

Folder Structure

Setup Instructions
```

Document how another developer can set up the project from scratch.

---

# Deliverables

At the end of Sprint 0, the following should exist:

* Project folder structure
* Git repository initialized
* Frontend default application running
* Backend default server running
* Development prerequisites verified
* Initial documentation created

---

# Out of Scope

Do not implement:

* Authentication
* Database
* Prisma
* PostgreSQL connection
* API architecture
* UI design
* Business modules
* Billing features
* Inventory features
* Customer management
* Supplier management

These belong to later sprints.

---

# Definition of Done

Sprint 0 is complete when:

* The repository has the agreed folder structure.
* All prerequisites are installed.
* The frontend launches successfully.
* The backend starts successfully.
* Another developer can clone the repository, follow the documentation, and run both applications without additional guidance.
