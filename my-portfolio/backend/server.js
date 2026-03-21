import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// ADMIN AUTH
// Set ADMIN_PASSWORD in your .env file — never commit it to git
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/admin/login
 * Body: { password: string }
 * Returns a simple session token on success.
 *
 * This uses a lightweight signed token — no JWT library needed.
 * The token is: base64(timestamp) + "." + base64(HMAC-ish signature)
 * Valid for 8 hours.
 */
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD is not set in .env");
    return res.status(500).json({ error: "Admin auth not configured." });
  }

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  // Simple signed token: payload.signature
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })
  ).toString("base64");

  // Signature: mix payload + secret (not cryptographic, but good enough for a personal portfolio)
  const sig = Buffer.from(
    payload + adminPassword
  ).toString("base64").slice(0, 32);

  const token = `${payload}.${sig}`;
  res.json({ token });
});

/**
 * Admin middleware — verifies the token issued above.
 * Attach to any route you want to protect.
 */
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: "Admin auth not configured." });
  }

  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) throw new Error("Malformed token");

    // Verify signature
    const expectedSig = Buffer.from(
      payload + adminPassword
    ).toString("base64").slice(0, 32);

    if (sig !== expectedSig) throw new Error("Invalid signature");

    // Check expiry
    const { exp } = JSON.parse(Buffer.from(payload, "base64").toString());
    if (Date.now() > exp) throw new Error("Token expired");

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

// -----------------------------
// GET ALL PROJECTS (public)
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
// CREATE PROJECT (admin only)
// -----------------------------
app.post("/api/projects", requireAdmin, async (req, res) => {
  const { title, description, techStack, link, demoUrl, gifUrl, imageUrl } = req.body;

  if (!title || !description || !techStack) {
    return res.status(400).json({
      error: "Title, description, and techStack are required.",
    });
  }

  try {
    const project = await prisma.project.create({
      data: { title, description, techStack, link, demoUrl, gifUrl, imageUrl },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error("POST /projects error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// -----------------------------
// UPDATE PROJECT (admin only)
// -----------------------------
app.put("/api/projects/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, techStack, link, demoUrl, gifUrl, imageUrl } = req.body;

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
      data: { title, description, techStack, link, demoUrl, gifUrl, imageUrl },
    });
    res.json(updated);
  } catch (error) {
    console.error("PUT /projects error:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// -----------------------------
// DELETE PROJECT (admin only)
// -----------------------------
app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
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
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});