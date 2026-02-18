Here is your full README rewritten in plain text only, with no Markdown formatting, no symbols, no code fences, and no special characters. You can copy and paste this directly into GitHub.

READ ME FILE (PLAIN TEXT VERSION)
Anthony Fuel Ramos – Software Engineering Portfolio
This project is a full‑stack personal portfolio built with React, Express, and Prisma/SQLite. It includes a complete Projects CRUD system, polished UI components, and professional branding. The portfolio was developed as part of my Software Engineering Capstone to demonstrate end‑to‑end system design, frontend and backend integration, database management, and deployment readiness.

PROJECT OVERVIEW
The portfolio showcases my work as a software engineer and includes a fully functional Projects CRUD feature. Users can:
• Add new projects
• Edit existing projects
• Delete projects with a confirmation modal
• View all projects in a responsive grid layout
• Persist all data using a SQLite database through Prisma ORM
Additional features include:
• A polished navigation bar
• A professional footer with external links
• A working Download Resume button
• A clean Home page with an About Me section
• A consistent deep navy and metallic silver theme

TECH STACK
Frontend: React (Vite) React Router Custom UI components (ProjectCard, DeleteModal) CSS modules Fetch-based API integration
Backend: Node.js Express REST API with full CRUD support Input validation and error handling
Database: SQLite Prisma ORM Auto-generated schema and migrations

DATABASE SCHEMA (FINAL)
model Project { id Int @id @default(autoincrement()) title String description String techStack String link String? createdAt DateTime @default(now()) updatedAt DateTime @updatedAt }

API ENDPOINTS (FINAL)
POST /projects – Create a new project
GET /projects – Get all projects
GET /projects/:id – Get a single project
PUT /projects/:id – Update a project
DELETE /projects/:id – Delete a project
Correct Base URL for frontend to backend communication: http://localhost:4000/projects

WEEK 5 ENHANCEMENTS
1. 	Secondary Features Added • New navigation bar with Home, Projects, GitHub, LinkedIn, Email, and Resume Download
• New footer with external links
• Resume download button added to the Home page
• Resume file added to public/resume/Fuel-Anthony-BSSE.pdf
2. 	Data Handling and Stability Improvements • Strengthened frontend validation (title, description, and tech stack required)
• Centralized API error handling
• Corrected API base URL
• Improved loading states and error messages
• Safer delete flow with modal confirmation
• Reset form and state after edits
• Improved backend validation and error responses
3. 	External Integration • GitHub and LinkedIn external links integrated into the UI
4. 	End-to-End Functionality The system demonstrates full communication from frontend to backend to database and back to the frontend. All CRUD operations update the UI immediately and persist in the database.

TESTING AND VERIFICATION
CRUD Tests: All CRUD operations were tested using Postman and Thunder Client.
Screenshots were captured showing successful POST, GET, PUT, and DELETE requests with correct status codes and JSON responses.
Database Proof: Prisma Studio screenshots include: • Two projects created
• One project deleted
• Final database state

PROJECT STRUCTURE
src
api
projectsApi.js
components
Header.jsx
Header.css
Footer.jsx
Footer.css
ProjectCard.jsx
DeleteModal.jsx
pages
Home.jsx
Home.css
ProjectsPage.jsx
ProjectsPage.css
public
resume
Fuel-Anthony-BSSE.pdf
backend
server.js
prisma/schema.prisma

RUNNING THE PROJECT LOCALLY
Backend: cd backend
npm install
npx prisma migrate dev
npm start
Backend runs at: http://localhost:4000
Frontend: cd frontend
npm install
npm run dev
Frontend runs at: http://localhost:5173

CONTACT
Anthony Fuel Ramos
Email: afuelramos@gmail.com
LinkedIn: https://www.linkedin.com/in/anthony-fuel/
GitHub: https://github.com/ClickClackBang
