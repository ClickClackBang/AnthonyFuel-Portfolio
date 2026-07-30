import React, { useEffect, useState, useRef } from "react";
import { fetchProjects } from "../api/projectsApi";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import "./ProjectsPage.css";

/**
 * Diagonal autoplay pairs for a 2-column grid:
 *
 * Grid positions (0-indexed):
 *   [0] [1]
 *   [2] [3]
 *   [4] [5]  ...
 *
 * Round 1: positions 0, 3  (top-left + second-row-right)
 * Round 2: positions 1, 2  (top-right + second-row-left)
 * Round 3: positions 4, 7  (next group diagonal 1)
 * Round 4: positions 5, 6  (next group diagonal 2)
 * ...repeating in groups of 4
 */
function getDiagonalPairs(count) {
  const pairs = [];
  for (let base = 0; base < count; base += 4) {
    // Pair A: top-left of group + bottom-right of group
    const pairA = [base, base + 3].filter(i => i < count);
    // Pair B: top-right of group + bottom-left of group
    const pairB = [base + 1, base + 2].filter(i => i < count);
    if (pairA.length) pairs.push(pairA);
    if (pairB.length) pairs.push(pairB);
  }
  return pairs;
}

const GIF_ROUND_DURATION = 4000; // 4 seconds per round
const PAUSE_BETWEEN = 1000;      // 1 second pause between rounds

function ProjectsPage() {
  const [projects, setProjects]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [playingIndices, setPlayingIndices]   = useState(new Set());
  const [currentRound, setCurrentRound]       = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProjects();

      // Sort: pinned first, then featured, then alphabetical
      const sorted = (data || []).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.title.localeCompare(b.title);
      });

      setProjects(sorted);
    } catch (err) {
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  // ── Diagonal autoplay rotation ──────────────────────────
  useEffect(() => {
    if (projects.length === 0) return;

    const pairs = getDiagonalPairs(projects.length);
    if (pairs.length === 0) return;

    function playRound(roundIndex) {
      const pair = pairs[roundIndex % pairs.length];
      setPlayingIndices(new Set(pair));

      timerRef.current = setTimeout(() => {
        // 1 second pause
        setPlayingIndices(new Set());
        timerRef.current = setTimeout(() => {
          setCurrentRound(r => r + 1);
          playRound(roundIndex + 1);
        }, PAUSE_BETWEEN);
      }, GIF_ROUND_DURATION);
    }

    playRound(currentRound);

    return () => clearTimeout(timerRef.current);
  }, [projects]);

  // ── Modal ────────────────────────────────────────────────
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