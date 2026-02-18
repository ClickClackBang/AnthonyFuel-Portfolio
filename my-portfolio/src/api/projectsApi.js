const API_BASE_URL = "http://localhost:4000/projects";

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
export const fetchProjects = async () => {
  const res = await fetch(`${API_BASE_URL}`);
  return handleResponse(res);
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