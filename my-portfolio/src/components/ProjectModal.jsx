import React, { useEffect } from "react";

/**
 * ProjectModal
 *
 * Each project in your DB can have these optional fields (add them to
 * your Prisma schema when ready):
 *   - demoUrl   (string) → deployed app URL → renders as iframe
 *   - gifUrl    (string) → path or URL to a GIF/video demo
 *   - imageUrl  (string) → static screenshot fallback
 *
 * Until you add those columns, the modal shows a stylish placeholder
 * in the demo area and still shows all existing fields.
 */
function ProjectModal({ project, onClose }) {

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const techItems = project.techStack
    ? project.techStack.split(",").map((t) => t.trim())
    : [];

  function renderDemo() {
    // 1. Deployed app → live iframe
    if (project.demoUrl) {
      return (
        <div className="modal-demo">
          <div className="modal-demo-bar">
            <span className="demo-bar-dot" />
            <span className="demo-bar-dot" />
            <span className="demo-bar-dot" />
            <span className="demo-bar-url">{project.demoUrl}</span>
          </div>
          <iframe
            className="modal-demo-iframe"
            src={project.demoUrl}
            title={`${project.title} demo`}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      );
    }

    // 2. GIF demo
    if (project.gifUrl) {
      return (
        <div className="modal-demo">
          <img
            className="modal-demo-media"
            src={project.gifUrl}
            alt={`${project.title} demo`}
          />
        </div>
      );
    }

    // 3. Static screenshot
    if (project.imageUrl) {
      return (
        <div className="modal-demo">
          <img
            className="modal-demo-media"
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
          />
        </div>
      );
    }

    // 4. Placeholder
    return (
      <div className="modal-demo">
        <div className="modal-demo-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>Demo coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-panel" role="dialog" aria-modal="true"
        aria-labelledby="modal-title">

        {/* ── Header ── */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-project-number">
              Project #{String(project.id).padStart(2, "0")}
            </span>
            <h2 className="modal-title" id="modal-title">{project.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="modal-body">

          {/* Demo area */}
          {renderDemo()}

          {/* Description */}
          <p className="modal-description">{project.description}</p>

          {/* Tech stack */}
          {techItems.length > 0 && (
            <div>
              <p className="modal-section-label">Tech Stack</p>
              <div className="modal-tech-tags">
                {techItems.map((tech) => (
                  <span key={tech} className="modal-tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                Open Full App ↗
              </a>
            )}
            <button className="btn btn-secondary" onClick={onClose}
              style={{ marginLeft: "auto" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;