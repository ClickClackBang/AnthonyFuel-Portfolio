import React, { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import DeleteModal from "../components/DeleteModal";
import "./AdminPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const emptyForm = {
  title: "",
  description: "",
  techStack: "",
  link: "",
  demoUrl: "",
  gifUrl: "",
  imageUrl: "",
};

function AdminPage() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("admin_token") || null
  );
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token) loadProjects();
  }, [token]);

  // ─── Auth helpers ────────────────────────────────────────
  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  }

  // ─── Load ────────────────────────────────────────────────
  async function loadProjects() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Form ────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(project) {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      techStack: project.techStack || "",
      link: project.link || "",
      demoUrl: project.demoUrl || "",
      gifUrl: project.gifUrl || "",
      imageUrl: project.imageUrl || "",
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingProject(null);
    setFormData(emptyForm);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.description || !formData.techStack) {
      setError("Title, Description, and Tech Stack are required.");
      return;
    }

    try {
      setLoading(true);
      const url = editingProject
        ? `${API_URL}/api/projects/${editingProject.id}`
        : `${API_URL}/api/projects`;
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.status === 401 || res.status === 403) {
        setError("Session expired. Please log in again.");
        handleLogout();
        return;
      }

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Something went wrong.");
        return;
      }

      setSuccess(editingProject ? "Project updated!" : "Project created!");
      setFormData(emptyForm);
      setEditingProject(null);
      await loadProjects();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Delete ──────────────────────────────────────────────
  async function handleConfirmDelete(project) {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        setError("Session expired. Please log in again.");
        handleLogout();
        return;
      }

      setDeleteTarget(null);
      setSuccess("Project deleted.");
      await loadProjects();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to delete project.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Gate ────────────────────────────────────────────────
  if (!token) {
    return <AdminLogin onSuccess={(t) => setToken(t)} />;
  }

  // ─── Admin Panel ─────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <span className="admin-badge">Admin</span>
          <h2 className="admin-title">Project Manager</h2>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div className="admin-layout">

        {/* ── FORM ── */}
        <section className="admin-form-section">
          <h3 className="admin-form-title">
            {editingProject ? `Editing: ${editingProject.title}` : "Add New Project"}
          </h3>

          {error   && <p className="admin-msg admin-msg-error">{error}</p>}
          {success && <p className="admin-msg admin-msg-success">{success}</p>}

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-field-group">
              <label className="admin-label">Title *</label>
              <input className="admin-input" type="text" name="title"
                value={formData.title} onChange={handleChange}
                placeholder="Project title" />
            </div>

            <div className="admin-field-group">
              <label className="admin-label">Description *</label>
              <textarea className="admin-input admin-textarea"
                name="description" value={formData.description}
                onChange={handleChange} rows={3}
                placeholder="Short description of the project" />
            </div>

            <div className="admin-field-group">
              <label className="admin-label">Tech Stack *</label>
              <input className="admin-input" type="text" name="techStack"
                value={formData.techStack} onChange={handleChange}
                placeholder="React, Node, Prisma, PostgreSQL" />
            </div>

            <div className="admin-field-row">
              <div className="admin-field-group">
                <label className="admin-label">GitHub Link</label>
                <input className="admin-input" type="url" name="link"
                  value={formData.link} onChange={handleChange}
                  placeholder="https://github.com/..." />
              </div>

              <div className="admin-field-group">
                <label className="admin-label">Live Demo URL</label>
                <input className="admin-input" type="url" name="demoUrl"
                  value={formData.demoUrl} onChange={handleChange}
                  placeholder="https://myapp.vercel.app" />
              </div>
            </div>

            <div className="admin-field-row">
              <div className="admin-field-group">
                <label className="admin-label">GIF Demo URL</label>
                <input className="admin-input" type="text" name="gifUrl"
                  value={formData.gifUrl} onChange={handleChange}
                  placeholder="/demos/myapp.gif or full URL" />
              </div>

              <div className="admin-field-group">
                <label className="admin-label">Screenshot URL</label>
                <input className="admin-input" type="text" name="imageUrl"
                  value={formData.imageUrl} onChange={handleChange}
                  placeholder="/images/myapp.png or full URL" />
              </div>
            </div>

            <div className="admin-form-hint">
              Demo priority: Live URL → GIF → Screenshot → Placeholder
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {editingProject ? "Save Changes" : "Create Project"}
              </button>
              {editingProject && (
                <button type="button" className="btn btn-secondary"
                  onClick={handleCancelEdit} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ── PROJECT LIST ── */}
        <section className="admin-list-section">
          <h3 className="admin-list-title">
            All Projects
            <span className="admin-project-count">{projects.length}</span>
          </h3>

          {loading && projects.length === 0 ? (
            <p className="admin-status">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="admin-status">No projects yet.</p>
          ) : (
            <div className="admin-project-list">
              {projects.map((project) => (
                <div key={project.id} className="admin-project-row">
                  <div className="admin-project-info">
                    <span className="admin-project-id">
                      #{String(project.id).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="admin-project-name">{project.title}</p>
                      <p className="admin-project-tech">{project.techStack}</p>
                    </div>
                  </div>
                  <div className="admin-project-row-actions">
                    <button className="btn btn-edit"
                      onClick={() => handleEdit(project)}>
                      Edit
                    </button>
                    <button className="btn btn-delete"
                      onClick={() => setDeleteTarget(project)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {deleteTarget && (
        <DeleteModal
          project={deleteTarget}
          onConfirm={() => handleConfirmDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default AdminPage;