import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// -----------------------------
// GET ALL PROJECTS
// -----------------------------
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "desc" },
    });
    res.json(projects);
  } catch (error) {
    console.error("GET /projects error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// -----------------------------
// CREATE PROJECT
// -----------------------------
app.post("/api/projects", async (req, res) => {
  const { title, description, techStack, link } = req.body;

  if (!title || !description || !techStack) {
    return res.status(400).json({
      error: "Title, description, and techStack are required.",
    });
  }

  try {
    const project = await prisma.project.create({
      data: { title, description, techStack, link },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("POST /projects error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// -----------------------------
// UPDATE PROJECT
// -----------------------------
app.put("/api/projects/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, techStack, link } = req.body;

  if (!title || !description || !techStack) {
    return res.status(400).json({
      error: "Title, description, and techStack are required.",
    });
  }

  try {
    const exists = await prisma.project.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { title, description, techStack, link },
    });

    res.json(updated);
  } catch (error) {
    console.error("PUT /projects error:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// -----------------------------
// DELETE PROJECT
// -----------------------------
app.delete("/api/projects/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const exists = await prisma.project.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    await prisma.project.delete({ where: { id } });

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("DELETE /projects error:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});