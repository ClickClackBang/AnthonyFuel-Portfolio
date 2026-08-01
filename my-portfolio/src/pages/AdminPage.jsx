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
  featured: false,
  pinned: false,
};

/* ── Small inline icons (keep the list compact & consistent) ──
   Styles are set inline (not via SVG attributes) so nothing in the
   site's global CSS — e.g. a `svg { fill: ... }` reset — can blank
   these out. Inline style beats any external stylesheet rule that
   isn't using !important. */
function PinIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M12 17v5M8 3h8l-1 6 3 4H6l3-4z"
        style={{
          fill: active ? "currentColor" : "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}

function StarIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20.1l1.4-6.3-4.8-4.3 6.4-.6z"
        style={{
          fill: active ? "currentColor" : "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M6 15l6-6 6 6"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2.4,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M6 9l6 6 6-6"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2.4,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}

function AdminPage() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("admin_token") || null
  );
  const [projects, setProjects]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [formData, setFormData]         = useState(emptyForm);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");

  useEffect(() => { if (token) loadProjects(); }, [token]);

  function authHeaders() {
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  }

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");
      const res  = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data || []);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleEdit(project) {
    setEditingProject(project);
    setFormData({
      title:       project.title       || "",
      description: project.description || "",
      techStack:   project.techStack   || "",
      link:        project.link        || "",
      demoUrl:     project.demoUrl     || "",
      gifUrl:      project.gifUrl      || "",
      imageUrl:    project.imageUrl    || "",
      featured:    project.featured    || false,
      pinned:      project.pinned      || false,
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
      const url    = editingProject
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
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete(project) {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        setError("Session expired.");
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

  async function handleQuickToggle(project, field) {
    try {
      const updated = { ...project, [field]: !project[field] };
      await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(updated),
      });
      await loadProjects();
    } catch {
      setError("Failed to update project.");
    }
  }

  // Moves a project up or down and re-numbers EVERY project's `order`
  // to match the new sequence (1, 2, 3...). Re-indexing the whole list
  // (rather than swapping just two values) is what makes this reliable:
  // brand-new/migrated projects all start at order = 0, so swapping two
  // tied zeros does nothing. Re-numbering the full list guarantees every
  // project has a distinct order value from the very first click.
  async function handleReorder(project, direction) {
    const currentIndex = projects.findIndex((p) => p.id === project.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const renumbered = reordered.map((p, idx) => ({ ...p, order: idx + 1 }));

    try {
      await Promise.all(
        renumbered.map((p) =>
          fetch(`${API_URL}/api/projects/${p.id}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(p),
          })
        )
      );
      await loadProjects();
    } catch {
      setError("Failed to reorder.");
    }
  }

  if (!token) return <AdminLogin onSuccess={(t) => setToken(t)} />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <span className="admin-badge">Admin</span>
          <h2 className="admin-title">Project Manager</h2>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="admin-layout">

        {/* ═══════════════ LEFT: FORM ═══════════════ */}
        <section className="admin-form-section">
          <h3 className="admin-form-title">
            {editingProject ? `Editing: ${editingProject.title}` : "Add New Project"}
          </h3>

          {error   && <p className="admin-msg admin-msg-error">{error}</p>}
          {success && <p className="admin-msg admin-msg-success">{success}</p>}

          <form className="admin-form" onSubmit={handleSubmit}>

            {/* ── Section: Basic Info ── */}
            <div className="admin-fieldset">
              <p className="admin-section-label">Basic Info</p>

              <div className="admin-field-group">
                <label className="admin-label">Title *</label>
                <input className="admin-input" type="text" name="title"
                  value={formData.title} onChange={handleChange} placeholder="Project title" />
              </div>

              <div className="admin-field-group">
                <label className="admin-label">Description *</label>
                <textarea className="admin-input admin-textarea" name="description"
                  value={formData.description} onChange={handleChange} rows={3}
                  placeholder="Short description of the project" />
              </div>

              <div className="admin-field-group">
                <label className="admin-label">Tech Stack *</label>
                <input className="admin-input" type="text" name="techStack"
                  value={formData.techStack} onChange={handleChange}
                  placeholder="React, Node, Prisma, PostgreSQL" />
              </div>
            </div>

            {/* ── Section: Links & Media ── */}
            <div className="admin-fieldset">
              <p className="admin-section-label">Links &amp; Media</p>

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
            </div>

            {/* ── Section: Visibility ── */}
            <div className="admin-fieldset">
              <p className="admin-section-label">Visibility</p>

              <div className="admin-toggles">
                <label className="admin-toggle-label">
                  <div className={`admin-toggle ${formData.featured ? "on" : ""}`}
                    onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))}>
                    <span className="admin-toggle-knob" />
                  </div>
                  <div>
                    <span className="admin-toggle-name">Featured</span>
                    <span className="admin-toggle-desc">Gold award ribbon on card</span>
                  </div>
                </label>

                <label className="admin-toggle-label">
                  <div className={`admin-toggle ${formData.pinned ? "on" : ""}`}
                    onClick={() => setFormData(p => ({ ...p, pinned: !p.pinned }))}>
                    <span className="admin-toggle-knob" />
                  </div>
                  <div>
                    <span className="admin-toggle-name">Pinned</span>
                    <span className="admin-toggle-desc">Shows a pin badge (use ↑↓ to set position)</span>
                  </div>
                </label>
              </div>
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

        {/* ═══════════════ RIGHT: CONCISE LIST ═══════════════ */}
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
              {projects.map((project, idx) => (
                <div key={project.id} className="admin-row">
                  <div className="admin-reorder-stack">
                    <button
                      className="admin-reorder-btn"
                      onClick={() => handleReorder(project, "up")}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      <ChevronUpIcon />
                    </button>
                    <button
                      className="admin-reorder-btn"
                      onClick={() => handleReorder(project, "down")}
                      disabled={idx === projects.length - 1}
                      title="Move down"
                    >
                      <ChevronDownIcon />
                    </button>
                  </div>

                  <div className="admin-row-main">
                    <span className="admin-row-id">
                      {String(project.id).padStart(2, "0")}
                    </span>
                    <span className="admin-row-title">
                      {project.title}
                    </span>
                    {project.pinned && (
                      <span className="admin-row-flag admin-row-flag--pin" title="Pinned">
                        <PinIcon active />
                      </span>
                    )}
                    {project.featured && (
                      <span className="admin-row-flag admin-row-flag--star" title="Featured">
                        <StarIcon active />
                      </span>
                    )}
                  </div>

                  <div className="admin-row-actions">
                    <button
                      className={`admin-icon-btn ${project.pinned ? "on" : ""}`}
                      onClick={() => handleQuickToggle(project, "pinned")}
                      title={project.pinned ? "Remove pin badge" : "Add pin badge"}
                    >
                      <PinIcon active={project.pinned} />
                    </button>
                    <button
                      className={`admin-icon-btn ${project.featured ? "on" : ""}`}
                      onClick={() => handleQuickToggle(project, "featured")}
                      title={project.featured ? "Remove featured" : "Mark as featured"}
                    >
                      <StarIcon active={project.featured} />
                    </button>
                    <span className="admin-row-divider" />
                    <button
                      className="admin-icon-btn"
                      onClick={() => handleEdit(project)}
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="admin-icon-btn admin-icon-btn--danger"
                      onClick={() => setDeleteTarget(project)}
                      title="Delete"
                    >
                      <TrashIcon />
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