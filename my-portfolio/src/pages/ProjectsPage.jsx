import React, { useEffect, useState } from "react";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectsApi";
import ProjectCard from "../components/ProjectCard";
import DeleteModal from "../components/DeleteModal";
import "./ProjectsPage.css";

const emptyForm = {
  title: "",
  description: "",
  techStack: "",
  link: "",
};

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description || !formData.techStack) {
      setError("Title, Description, and Tech Stack are required.");
      return;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await createProject(formData);
      }
      setFormData(emptyForm);
      setEditingProject(null);
      await loadProjects();
    } catch {
      setError("Something went wrong saving the project.");
    }
  }

  function handleEdit(project) {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      link: project.link || "",
    });
  }

  function handleCancelEdit() {
    setEditingProject(null);
    setFormData(emptyForm);
    setError("");
  }

  async function handleConfirmDelete(project) {
    try {
      await deleteProject(project.id);
      setDeleteTarget(null);
      await loadProjects();
    } catch {
      setError("Failed to delete project.");
    }
  }

  return (
    <div className="projects-page">
      <h2 className="projects-title">Projects</h2>

      <div className="projects-layout">

  {/* PROJECT CARDS GRID */}
  <section className="projects-list-section">
    {loading ? (
      <p className="status-text">Loading projects...</p>
    ) : projects.length === 0 ? (
      <p className="status-text">No projects yet. Add your first one!</p>
    ) : (
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        ))}
      </div>
    )}
  </section>

  {/* ADD / EDIT FORM BELOW */}
  <section className="projects-form-section">
    <h3 className="form-title">
      {editingProject ? "Edit Project" : "Add New Project"}
    </h3>

    {error && <p className="form-error">{error}</p>}

    <form className="project-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project title"
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short description of the project"
          rows={3}
        />
      </label>

      <label>
        Tech Stack
        <input
          type="text"
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          placeholder="React, Node, Prisma, etc."
        />
      </label>

      <label>
        GitHub Link (optional)
        <input
          type="url"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="https://github.com/ClickClackBang/..."
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingProject ? "Save Changes" : "Create Project"}
        </button>

        {editingProject && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </section>

</div>

      <DeleteModal
        project={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default ProjectsPage;