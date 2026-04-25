import { useEffect, useState } from "react";
import "../../styles/roleModal.css";

const API = import.meta.env.VITE_API_URL;

// ─── RoleModal Component ──────────────────────────────────────────────────────
export default function RoleModal({ onRoleSelected }) {
  const [roles, setRoles] = useState([]); // ✅ dynamic roles
  const [selectedRole, setSelectedRole] = useState(null); // ✅ object instead of string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch roles (Student + clubs)
  useEffect(() => {
  async function fetchRoles() {
    try {
      const res = await fetch(`${API}/auth/my-clubs`, {
        credentials: "include"
      });

      const data = await res.json();

      // ✅ SAFE fallback
      const clubs = data?.data || [];

      const clubRoles = clubs.map((item) => ({
        label: item.club.name,
        clubId: item.club.id,
        clubRole: item.role,
      }));

      // ✅ ALWAYS include Student
      setRoles([
        { label: "Student", clubId: null, clubRole: "STUDENT" },
        ...clubRoles
      ]);

    } catch (err) {
      console.error(err);

      // ✅ Even if API fails → still show Student
      setRoles([{ label: "Student", clubId: null }]);
    }
  }

  fetchRoles();
}, []);

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

      // 2. Call backend
      await fetch(`${API}/auth/select-club`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          clubId: selectedRole.clubId
        })
      });

      // 3. Persist role in localStorage
      const updatedUser = {
        ...user,
        role: selectedRole.label,
        clubRole: selectedRole.clubRole,
        activeClubId: selectedRole.clubId,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));

      // 4. Notify parent
      onRoleSelected(selectedRole.label);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
          {roles.map((role) => (
            <button
              key={role.label}
              className={`rm-option ${
                selectedRole?.label === role.label ? "rm-option-selected" : ""
              }`}
              onClick={() => {
                setSelectedRole(role);
                setError("");
              }}
              disabled={loading}
            >
              <span className="rm-option-radio">
                {selectedRole?.label === role.label && (
                  <span className="rm-option-dot" />
                )}
              </span>
              <span className="rm-option-label">{role.label}</span>
              {selectedRole?.label === role.label && (
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