import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchProjects } from "../api/projectsApi";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import "./ProjectsPage.css";

/**
 * Checkerboard autoplay grouping
 * ────────────────────────────────
 * Cards are grouped like a checkerboard based on their actual row/col
 * position in the CSS grid (not a fixed assumption). For a 3-column
 * grid of 6 cards:
 *
 *   [1] [2] [3]      row0: col0,col1,col2
 *   [4] [5] [6]      row1: col0,col1,col2
 *
 *   Group A (row+col is even): 1, 3, 5
 *   Group B (row+col is odd) : 2, 4, 6
 *
 * This generalizes automatically to any column count the grid actually
 * renders at (columns can change on resize/breakpoints), so the pattern
 * stays correct on mobile, tablet, and desktop without hardcoding a
 * column number.
 */
function getCheckerboardGroups(count, columns) {
  const groupA = [];
  const groupB = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / columns);
    const col = i % columns;
    if ((row + col) % 2 === 0) groupA.push(i);
    else groupB.push(i);
  }
  return [groupA, groupB].filter((g) => g.length > 0);
}

const GIF_ROUND_DURATION = 4000; // ms per round
const PAUSE_BETWEEN = 1000;      // ms pause between rounds

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [playingIndices, setPlayingIndices] = useState(new Set());
  const [columns, setColumns] = useState(1);

  const gridRef = useRef(null);
  const roundTimerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const roundIndexRef = useRef(0);

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");
      // The backend already returns projects sorted by the manual
      // `order` field you control from the admin panel's up/down
      // arrows — no client-side re-sorting needed here.
      const data = await fetchProjects();
      setProjects(data || []);
    } catch (err) {
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  // ── Measure actual rendered column count ────────────────
  const measureColumns = useCallback(() => {
    if (!gridRef.current) return;
    const style = window.getComputedStyle(gridRef.current);
    const template = style.getPropertyValue("grid-template-columns");
    const count = template.split(" ").filter(Boolean).length || 1;
    setColumns((prev) => (prev !== count ? count : prev));
  }, []);

  useEffect(() => {
    measureColumns();
    const handleResize = () => measureColumns();
    window.addEventListener("resize", handleResize);

    let observer;
    if (gridRef.current && "ResizeObserver" in window) {
      observer = new ResizeObserver(measureColumns);
      observer.observe(gridRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer) observer.disconnect();
    };
  }, [measureColumns, projects.length]);

  // ── Checkerboard autoplay rotation ───────────────────────
  useEffect(() => {
    clearTimeout(roundTimerRef.current);
    clearTimeout(pauseTimerRef.current);

    if (projects.length === 0 || columns < 1) return;

    const groups = getCheckerboardGroups(projects.length, columns);
    if (groups.length === 0) return;

    roundIndexRef.current = 0;

    function playRound() {
      const group = groups[roundIndexRef.current % groups.length];
      setPlayingIndices(new Set(group));

      roundTimerRef.current = setTimeout(() => {
        setPlayingIndices(new Set());
        pauseTimerRef.current = setTimeout(() => {
          roundIndexRef.current += 1;
          playRound();
        }, PAUSE_BETWEEN);
      }, GIF_ROUND_DURATION);
    }

    playRound();

    return () => {
      clearTimeout(roundTimerRef.current);
      clearTimeout(pauseTimerRef.current);
    };
  }, [projects, columns]);

  // ── Modal ─────────────────────────────────────────────────
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
            <div className="projects-grid" ref={gridRef}>
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isPlaying={playingIndices.has(index)}
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