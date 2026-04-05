import React, { useState } from "react";

import "../../styles/profile.css";

const ROLE_OPTIONS = ["Student", "Coding Club", "Dance Club", "AI Club"];

const ROLE_ICONS = {
  Student: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  "Coding Club": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  "Dance Club": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v6l-3 3M12 13l3 3M9 17l-2 3M15 17l2 3" />
    </svg>
  ),
  "AI Club": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  ),
};

const getInitials = (name) => {
  if (typeof name !== "string") return "U";

  const cleaned = name.trim();

  if (!cleaned) return "U";

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw
      ? JSON.parse(raw)
      : {
          name: "Aarav Shah",
          prn: "PRN2024001",
          rollNumber: "CS-42",
          division: "B",
          role: "Student",
          email: "aarav@college.edu",
        };
  } catch {
    return {
      name: "Aarav Shah",
      prn: "PRN2024001",
      rollNumber: "CS-42",
      division: "B",
      role: "Student",
      email: "aarav@college.edu",
    };
  }
}

export default function Profile() {
  const [user, setUser] = useState(getStoredUser);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showRoleList, setShowRoleList] = useState(false);
  const [pendingRole, setPendingRole] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  // ── Edit profile ────────────────────────────────────────────────────────────
  function handleEditClick() {
    setEditForm({
      name: user.name,
      prn: user.prn,
      rollNumber: user.rollNumber,
      division: user.division,
    });
    setShowRoleList(false);
    setEditMode(true);
  }

  function handleEditChange(e) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    const updated = { ...user, ...editForm };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    window.dispatchEvent(new Event("userUpdated"));
    setEditMode(false);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  }

  function handleCancelEdit() {
    setEditMode(false);
  }

  // ── Role change ─────────────────────────────────────────────────────────────
  function handleRoleSelect(role) {
    if (role === user.role) return;
    setPendingRole(role);
    setShowConfirm(true);
  }

  function handleConfirmRole() {
    const updated = { ...user, role: pendingRole };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setShowConfirm(false);
    setShowRoleList(false);
    setPendingRole("");
  }

  function handleCancelRole() {
    setShowConfirm(false);
    setPendingRole("");
  }

  const isClub = user.role !== "Student";

  return (
    <div className="pf-root">
      {/* Ambient orbs */}
      <div className="pf-orbs" aria-hidden="true">
        <div className="pf-orb pf-orb-1" />
        <div className="pf-orb pf-orb-2" />
      </div>

      <main className="pf-main">
        {/* ── PROFILE HEADER ── */}
        <section className="pf-header">
          <div className="pf-avatar-wrap">
            <div className="pf-avatar">{getInitials(user.name)}</div>
            <div className="pf-avatar-ring" />
          </div>

          <div className="pf-header-info">
            <h1 className="pf-name">{user.name}</h1>
            <div className="pf-role-badge-wrap">
              <span
                className={`pf-role-badge ${isClub ? "pf-role-club" : "pf-role-student"}`}
              >
                <span className="pf-role-badge-icon">
                  {ROLE_ICONS[user.role] || ROLE_ICONS["Student"]}
                </span>
                {user.role}
              </span>
            </div>
            {user.email && <p className="pf-email">{user.email}</p>}
          </div>

          {!editMode && (
            <button className="pf-btn pf-btn-edit" onClick={handleEditClick}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>
          )}
        </section>

        {/* Save flash */}
        {saveFlash && (
          <div className="pf-save-toast">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Profile saved successfully
          </div>
        )}

        <div className="pf-body">
          {/* ── PROFILE DETAILS CARD ── */}
          <div className="pf-card">
            <div className="pf-card-header">
              <h2 className="pf-card-title">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile Details
              </h2>
              {editMode && <span className="pf-editing-badge">Editing</span>}
            </div>

            <div className="pf-fields">
              {/* Name */}
              <div className="pf-field">
                <label className="pf-field-label">Full Name</label>
                {editMode ? (
                  <input
                    className="pf-input"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Enter full name"
                    autoFocus
                  />
                ) : (
                  <p className="pf-field-value">{user.name}</p>
                )}
              </div>

              {/* PRN */}
              <div className="pf-field">
                <label className="pf-field-label">PRN Number</label>
                {editMode ? (
                  <input
                    className="pf-input"
                    name="prn"
                    value={editForm.prn}
                    onChange={handleEditChange}
                    placeholder="Enter PRN"
                  />
                ) : (
                  <p className="pf-field-value pf-field-mono">{user.prn}</p>
                )}
              </div>

              {/* Roll Number */}
              <div className="pf-field">
                <label className="pf-field-label">Roll Number</label>
                {editMode ? (
                  <input
                    className="pf-input"
                    name="rollNumber"
                    value={editForm.rollNumber}
                    onChange={handleEditChange}
                    placeholder="Enter roll number"
                  />
                ) : (
                  <p className="pf-field-value pf-field-mono">
                    {user.rollNumber}
                  </p>
                )}
              </div>

              {/* Division */}
              <div className="pf-field">
                <label className="pf-field-label">Division</label>
                {editMode ? (
                  <input
                    className="pf-input"
                    name="division"
                    value={editForm.division}
                    onChange={handleEditChange}
                    placeholder="e.g. A, B, C"
                  />
                ) : (
                  <p className="pf-field-value">{user.division}</p>
                )}
              </div>
            </div>

            {/* Edit mode action buttons */}
            {editMode && (
              <div className="pf-edit-actions">
                <button className="pf-btn pf-btn-save" onClick={handleSave}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save Changes
                </button>
                <button
                  className="pf-btn pf-btn-cancel"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* ── ROLE CARD ── */}
          <div className="pf-card">
            <div className="pf-card-header">
              <h2 className="pf-card-title">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                </svg>
                Role & Access
              </h2>
            </div>

            <p className="pf-role-current-label">Current Role</p>
            <div className="pf-current-role-box">
              <span className="pf-current-role-icon">
                {ROLE_ICONS[user.role] || ROLE_ICONS["Student"]}
              </span>
              <span className="pf-current-role-name">{user.role}</span>
              <span className="pf-current-role-active">Active</span>
            </div>

            {!editMode && (
              <button
                className={`pf-btn pf-btn-change-role ${showRoleList ? "pf-btn-active" : ""}`}
                onClick={() => setShowRoleList((v) => !v)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 2.1l4 4-4 4" />
                  <path d="M3 12.2v-2a4 4 0 0 1 4-4h14" />
                  <path d="M7 21.9l-4-4 4-4" />
                  <path d="M21 11.8v2a4 4 0 0 1-4 4H3" />
                </svg>
                {showRoleList ? "Cancel" : "Change Role"}
              </button>
            )}

            {/* Role list */}
            {showRoleList && !editMode && (
              <div className="pf-role-list">
                <p className="pf-role-list-hint">Select a new role below</p>
                {ROLE_OPTIONS.map((role) => {
                  const isCurrent = role === user.role;
                  return (
                    <button
                      key={role}
                      className={`pf-role-option ${isCurrent ? "pf-role-option-current" : ""}`}
                      onClick={() => handleRoleSelect(role)}
                      disabled={isCurrent}
                    >
                      <span className="pf-role-option-icon">
                        {ROLE_ICONS[role]}
                      </span>
                      <span className="pf-role-option-name">{role}</span>
                      {isCurrent && (
                        <span className="pf-role-option-tag">Current</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── CONFIRM ROLE MODAL ── */}
      {showConfirm && (
        <div className="pf-overlay" onClick={handleCancelRole}>
          <div
            className="pf-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pf-confirm-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="pf-confirm-title">Change Role?</h3>
            <p className="pf-confirm-body">
              Are you sure you want to change your role from{" "}
              <strong>{user.role}</strong> to <strong>{pendingRole}</strong>?
            </p>
            <div className="pf-confirm-actions">
              <button className="pf-btn pf-btn-yes" onClick={handleConfirmRole}>
                Yes, Change
              </button>
              <button className="pf-btn pf-btn-no" onClick={handleCancelRole}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
