import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api/projectsApi";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import "./ProjectsPage.css";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProjects();
      setProjects(data || []);
    } catch (err) {
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  function handleCardClick(project) {
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  }

  function handleCloseModal() {
    setSelectedProject(null);
    document.body.style.overflow = "";
  }

  return (
    <div className="projects-page">
      <h2 className="projects-title">Projects</h2>

      <div className="projects-layout">
        <section className="projects-list-section">
          {loading ? (
            <div className="projects-loading">
              <span /><span /><span />
            </div>
          ) : error ? (
            <p className="status-text status-error">{error}</p>
          ) : projects.length === 0 ? (
            <p className="status-text">No projects yet.</p>
          ) : (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => handleCardClick(project)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ProjectsPage;