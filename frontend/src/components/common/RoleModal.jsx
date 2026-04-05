import React, { useState } from "react";
import "../../styles/roleModal.css";

// ─── Sample role options (replace or fetch from backend later) ───────────────
const ROLE_OPTIONS = ["Student", "Coding Club", "Dance Club", "AI Club"];

// ─── Backend integration point ───────────────────────────────────────────────
// When your backend is ready, replace the body of this function.
// The rest of the component calls this function and does NOT need to change.
async function updateUserRole(userId, role) {
  // TODO: Replace with real API call
  // const response = await fetch("/api/user/role", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ userId, role }),
  // });
  // if (!response.ok) throw new Error("Failed to update role");
  // return await response.json();

  // Temporary: simulate a successful async call
  return Promise.resolve({ success: true, role });
}

// ─── RoleModal Component ──────────────────────────────────────────────────────
// Props:
//   onRoleSelected(role) — called after role is saved; parent should hide modal
export default function RoleModal({ onRoleSelected }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!selectedRole) {
      setError("Please select a role to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Read current user from localStorage
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : {};

      // 2. Call backend (placeholder until API is ready)
      await updateUserRole(user.id, selectedRole);

      // 3. Persist role in localStorage
      const updatedUser = { ...user, role: selectedRole };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 4. Notify parent — parent decides what to do next (redirect, re-render, etc.)
      onRoleSelected(selectedRole);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Intentionally no click-outside-to-close — user must pick a role
  return (
    <div
      className="rm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rm-title"
    >
      <div className="rm-modal">
        {/* Header */}
        <div className="rm-header">
          <div className="rm-icon-wrap">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="rm-title" id="rm-title">
            What is your Role?
          </h2>
          <p className="rm-subtitle">
            Choose the role that best describes you. This helps us personalise
            your experience.
          </p>
        </div>

        {/* Role Options */}
        <div className="rm-options">
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role}
              className={`rm-option ${selectedRole === role ? "rm-option-selected" : ""}`}
              onClick={() => {
                setSelectedRole(role);
                setError("");
              }}
              disabled={loading}
            >
              <span className="rm-option-radio">
                {selectedRole === role && <span className="rm-option-dot" />}
              </span>
              <span className="rm-option-label">{role}</span>
              {selectedRole === role && (
                <svg
                  className="rm-check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <p className="rm-error">{error}</p>}

        {/* Confirm */}
        <button
          className={`rm-confirm ${loading ? "rm-confirm-loading" : ""}`}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="rm-spinner" />
              Saving...
            </>
          ) : (
            "Confirm Role"
          )}
        </button>
      </div>
    </div>
  );
}
