# Anthony Fuel Ramos — Developer Portfolio

A full-stack personal portfolio application built to showcase projects, professional experience, and technical skills. Features a custom dark editorial UI with a futuristic aesthetic, live animated terminal widget, and full project CRUD functionality backed by a REST API.

**Live Site:** [your-vercel-url.vercel.app](#) ← replace with your URL

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Custom CSS design system — DM Serif Display, DM Mono, Oxanium fonts
- Animated terminal widget (no external dependencies)

**Backend**
- Node.js + Express
- REST API with full CRUD support
- Input validation and error handling

**Database**
- PostgreSQL (production via Render)
- SQLite (local development)
- Prisma ORM

---

## Project Structure

```
my-portfolio/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── server.js
│   ├── package.json
│   └── .env
└── src/
    ├── api/
    │   └── projectsApi.js
    ├── assets/
    │   └── profile.jpg
    ├── components/
    │   ├── Header.jsx / Header.css
    │   ├── Footer.jsx / Footer.css
    │   ├── ProjectCard.jsx / ProjectCard.css
    │   ├── DeleteModal.jsx / DeleteModal.css
    │   └── TerminalWidget.jsx / TerminalWidget.css
    ├── pages/
    │   ├── Home.jsx / Home.css
    │   └── ProjectsPage.jsx / ProjectsPage.css
    ├── App.jsx
    ├── App.css
    └── main.jsx
```

---

## Prisma Schema

```prisma
model Project {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  techStack   String
  link        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Returns all projects |
| POST | `/projects` | Creates a new project (requires `title`, `description`, `techStack`) |
| PUT | `/projects/:id` | Updates an existing project by ID |
| DELETE | `/projects/:id` | Deletes a project by ID |

---

## Running Locally

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
node server.js
# Runs at http://localhost:4000
```

### Frontend
```bash
cd my-portfolio
npm install
npm run dev
# Runs at http://localhost:5173
```

### Environment Variables

Create a `.env` file inside the `backend/` folder:

```
DATABASE_URL="file:./dev.db"   # SQLite for local development
PORT=4000
```

> Never commit your `.env` file. It is listed in `.gitignore`.

---

## Deployment

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Render PostgreSQL |

**Frontend (Vercel)**
- Import the GitHub repo
- Set environment variable: `VITE_API_URL` = your Render backend URL
- Vercel auto-deploys on every push to `main`

**Backend (Render)**
- New Web Service → connect GitHub repo
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate`
- Start Command: `node server.js`
- Set environment variables: `DATABASE_URL`, `NODE_ENV=production`

---

## Features

- **Home page** — Profile, about, career goal, professional experience, and an animated terminal cycling through real tech stack commands
- **Projects page** — Full CRUD: create, view, edit, and delete projects with a confirmation modal
- **Responsive design** — Mobile-friendly layouts across all pages
- **Consistent design system** — Shared CSS variables, typography, spacing, and animation across all components