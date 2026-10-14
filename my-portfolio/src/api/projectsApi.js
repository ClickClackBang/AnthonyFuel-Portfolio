const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

/* ------------------------------
   Shared Response Handler
------------------------------ */
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

/* ------------------------------
   Basic Frontend Validation
------------------------------ */
const validateProjectPayload = (project) => {
  if (!project.title || !project.description || !project.techStack) {
    throw new Error("Title, description, and tech stack are required.");
  }
};

/* ------------------------------
   CRUD FUNCTIONS
------------------------------ */
const CACHE_KEY = "projects_cache_v1";

export const getCachedProjects = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

let inflight = null;

export const fetchProjects = () => {
  if (inflight) return inflight;
  inflight = fetch(API_BASE_URL)
    .then(handleResponse)
    .then((data) => {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
      return data;
    })
    .finally(() => { inflight = null; });
  return inflight;
};

export const createProject = async (project) => {
  validateProjectPayload(project);

  const res = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  return handleResponse(res);
};

export const updateProject = async (id, project) => {
  validateProjectPayload(project);

  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  return handleResponse(res);
};

export const deleteProject = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(res);
};