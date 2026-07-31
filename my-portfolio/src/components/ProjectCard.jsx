import React, { useRef, useEffect, useState } from "react";
import "./ProjectCard.css";

function ProjectCard({ project, onClick, isPlaying }) {
  const imgRef = useRef(null);
  const [gifLoaded, setGifLoaded] = useState(false);

  const techItems = project.techStack
    ? project.techStack.split(",").map((t) => t.trim())
    : [];

  // Swap between static and animated GIF src to control autoplay
  const staticSrc = project.imageUrl || null;
  const gifSrc = project.gifUrl || null;

  useEffect(() => {
    if (!imgRef.current || !gifSrc) return;
    if (isPlaying) {
      imgRef.current.src = gifSrc + "?t=" + Date.now(); // force gif restart
    } else {
      // Pause by switching to static screenshot or reloading to first frame
      if (staticSrc) {
        imgRef.current.src = staticSrc;
      } else {
        // No static — clone trick to freeze GIF
        imgRef.current.src = "";
        setTimeout(() => {
          if (imgRef.current) imgRef.current.src = gifSrc;
        }, 0);
      }
    }
  }, [isPlaying, gifSrc, staticSrc]);

  function renderMedia() {
    if (gifSrc) {
      return (
        <div className="card-media-wrapper">
          <img
            ref={imgRef}
            className={`card-media-gif ${isPlaying ? "playing" : "paused"}`}
            src={isPlaying ? gifSrc : (staticSrc || gifSrc)}
            alt={`${project.title} preview`}
            onLoad={() => setGifLoaded(true)}
          />
          {!isPlaying && (
            <div className="card-media-overlay">
              <span className="card-media-play-hint">▶</span>
            </div>
          )}
        </div>
      );
    }

    if (project.imageUrl) {
      return (
        <div className="card-media-wrapper">
          <img
            className="card-media-gif"
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
          />
        </div>
      );
    }

    return null;
  }

  return (
    <div
      className={`project-card ${project.featured ? "project-card--featured" : ""} ${isPlaying ? "project-card--playing" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Featured award ribbon */}
      {project.featured && (
        <div className="card-award-ribbon" title="Featured Project" aria-label="Featured project">
          <svg viewBox="0 0 60 92" width="42" height="64" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`ribbonTail-${project.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE8A0" />
                <stop offset="50%" stopColor="#E8B429" />
                <stop offset="100%" stopColor="#A9770E" />
              </linearGradient>
              <radialGradient id={`medallion-${project.id}`} cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#FFF7DC" />
                <stop offset="55%" stopColor="#F3C542" />
                <stop offset="100%" stopColor="#B9860F" />
              </radialGradient>
            </defs>

            {/* Ribbon tails */}
            <path
              d="M17 33 L8 88 L30 74 L52 88 L43 33 Z"
              fill={`url(#ribbonTail-${project.id})`}
              stroke="#8a6710"
              strokeWidth="1"
            />
            {/* Tail center crease */}
            <path d="M30 36 L30 74" stroke="#8a6710" strokeWidth="1" opacity="0.35" />

            {/* Medallion */}
            <circle cx="30" cy="25" r="23" fill={`url(#medallion-${project.id})`} stroke="#8a6710" strokeWidth="1.5" />
            <circle cx="30" cy="25" r="23" fill="none" stroke="#fff6d8" strokeWidth="1" opacity="0.45" />

            {/* Star */}
            <path
              d="M30 12 L33.2 21 L42 21 L34.8 26.5 L37.5 35.5 L30 30 L22.5 35.5 L25.2 26.5 L18 21 L26.8 21 Z"
              fill="#8a6710"
            />
          </svg>
        </div>
      )}

      {/* Media preview */}
      {renderMedia()}

      <div className="project-card-inner">
        <div className="project-card-top">
          <span className="project-card-index">
            {String(project.id).padStart(2, "0")}
          </span>
          {project.pinned && <span className="card-pinned-badge">📌 Pinned</span>}
          <span className="project-card-expand-hint">click to explore →</span>
        </div>

        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-description">{project.description}</p>

        <div className="project-card-footer">
          <div className="project-card-tech-tags">
            {techItems.slice(0, 4).map((tech) => (
              <span key={tech} className="tech-tag">{tech}</span>
            ))}
            {techItems.length > 4 && (
              <span className="tech-tag tech-tag-more">+{techItems.length - 4}</span>
            )}
          </div>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="project-card-github"
              onClick={(e) => e.stopPropagation()}
              title="View on GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;