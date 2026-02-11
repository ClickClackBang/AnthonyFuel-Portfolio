import React from "react";
import "./ProjectCard.css";

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="project-card">
      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-description">{project.description}</p>
      <p className="project-card-tech">
        <span className="project-card-tech-label">Tech Stack:</span>{" "}
        {project.techStack}
      </p>

      <div className="project-card-actions">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-github"
          >
            View on GitHub
          </a>
        )}
        <button className="btn btn-edit" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(project)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;