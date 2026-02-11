# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Week 4 added

This project is a full‑stack personal portfolio application built with React, Express, Prisma, and SQLite.
The Week 4 milestone focuses on implementing a complete Projects CRUD feature that works end‑to‑end across the frontend, backend, and database.

TECH STACK
Frontend:
- React (Vite)
- React Router
- Custom UI with deep navy + metallic silver theme
- Project cards with edit/delete actions
- Form for creating and updating projects
Backend:
- Node.js + Express
- REST API with full CRUD support
- Input validation and error handling
Database:
- SQLite (local development)
- Prisma ORM
- Prisma Studio for database visualization

PROJECT STRUCTURE
my-portfolio/ backend/ prisma/ schema.prisma dev.db migrations/ server.js package.json .env
src/ api/ projectsApi.js components/ ProjectCard.jsx ProjectCard.css DeleteModal.jsx pages/ Home.jsx ProjectsPage.jsx ProjectsPage.css App.jsx main.jsx
README.md

PRISMA SCHEMA
model Project { 
    id          Int      @id @default(autoincrement()) 
    title       String 
    description String 
    techStack   String 
    link        String? 
    createdAt   DateTime @default(now()) 
    updatedAt   DateTime @updatedAt
    }

API ENDPOINTS (CRUD)
GET /projects
Returns all projects.
POST /projects
Creates a new project.
Required fields: title, description, techStack.
PUT /projects/:id
Updates an existing project.
DELETE /projects/:id
Deletes a project by ID.

HOW TO RUN THE BACKEND
cd backend
npm install
npx prisma migrate dev
node server.js
Backend runs at:
http://localhost:4000

HOW TO RUN THE FRONTEND
cd my-portfolio
npm install
npm run dev
Frontend runs at:
http://localhost:5173
