import React from "react";

function DeleteModal({ project, onConfirm, onCancel }) {
  if (!project) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Delete Project</h3>
        <p>
          Are you sure you want to delete{" "}
          <span className="modal-project-name">{project.title}</span>?
        </p>
        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-delete" onClick={() => onConfirm(project)}>
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;