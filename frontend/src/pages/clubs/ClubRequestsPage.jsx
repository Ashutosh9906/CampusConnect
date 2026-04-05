import React, { useState } from "react";

import "../../styles/clubRequests.css";

const INITIAL_REQUESTS = [
  {
    id: 1,
    title: "React Summit 2025",
    club: "Dev Club",
    date: "2025-04-18",
    description:
      "A full-day summit covering React 19, server components, and modern frontend architecture with live coding sessions.",
    status: "pending",
    rejectionReason: "",
    requesterName: "Aryan Mehta",
    requesterEmail: "aryan.mehta@college.edu",
    requesterPhone: "+91 98201 34567",
  },
  {
    id: 2,
    title: "Design Thinking Workshop",
    club: "Design Society",
    date: "2025-04-22",
    description:
      "Hands-on workshop introducing design thinking principles, user research, and rapid prototyping techniques.",
    status: "pending",
    rejectionReason: "",
    requesterName: "Priya Sharma",
    requesterEmail: "priya.sharma@college.edu",
    requesterPhone: "+91 91234 56780",
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    club: "Entrepreneurship Cell",
    date: "2025-04-25",
    description:
      "Students pitch their startup ideas to a panel of mentors and investors. Open to all departments.",
    status: "pending",
    rejectionReason: "",
    requesterName: "Rohan Kulkarni",
    requesterEmail: "rohan.k@college.edu",
    requesterPhone: "+91 87654 32109",
  },
  {
    id: 4,
    title: "Cybersecurity CTF",
    club: "Cyber Club",
    date: "2025-05-02",
    description:
      "Capture the Flag competition testing skills in web exploitation, reverse engineering, and cryptography.",
    status: "pending",
    rejectionReason: "",
    requesterName: "Sneha Patil",
    requesterEmail: "sneha.patil@college.edu",
    requesterPhone: "+91 99887 76655",
  },
  {
    id: 5,
    title: "Open Mic Night",
    club: "Cultural Club",
    date: "2025-05-08",
    description:
      "An evening of student performances — poetry, stand-up comedy, music, and spoken word.",
    status: "pending",
    rejectionReason: "",
    requesterName: "Aditya Joshi",
    requesterEmail: "aditya.j@college.edu",
    requesterPhone: "+91 70011 22334",
  },
  {
    id: 6,
    title: "AI & Ethics Panel",
    club: "AI Society",
    date: "2025-05-12",
    description:
      "A panel discussion on the ethical implications of AI in healthcare, law, and social media.",
    status: "pending",
    rejectionReason: "",
    requesterName: "Meera Nair",
    requesterEmail: "meera.nair@college.edu",
    requesterPhone: "+91 82233 44556",
  },
];

const STATUS_META = {
  pending: { label: "Pending", className: "crp-badge-pending" },
  approved: { label: "Approved", className: "crp-badge-approved" },
  rejected: { label: "Rejected", className: "crp-badge-rejected" },
};

export default function ClubRequestsPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [rejectingId, setRejectingId] = useState(null);
  const [reasonInput, setReasonInput] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function handleViewDetails(req) {
    setSelectedRequest(req);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setTimeout(() => setSelectedRequest(null), 250);
  }

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const visible =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  function handleApprove(id) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved", rejectionReason: "" } : r,
      ),
    );
    if (rejectingId === id) {
      setRejectingId(null);
      setReasonInput("");
      setReasonError(false);
    }
  }

  function handleRejectClick(id) {
    if (rejectingId === id) {
      setRejectingId(null);
      setReasonInput("");
      setReasonError(false);
    } else {
      setRejectingId(id);
      setReasonInput("");
      setReasonError(false);
    }
  }

  function handleRejectSubmit(id) {
    if (!reasonInput.trim()) {
      setReasonError(true);
      return;
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "rejected", rejectionReason: reasonInput.trim() }
          : r,
      ),
    );
    setRejectingId(null);
    setReasonInput("");
    setReasonError(false);
  }

  function handleUndo(id) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "pending", rejectionReason: "" } : r,
      ),
    );
  }

  return (
    <div className="crp-root">
      <div className="crp-bg-orbs">
        <div className="crp-orb crp-orb-1" />
        <div className="crp-orb crp-orb-2" />
      </div>

      <main className="crp-main">
        {/* HEADER */}
        <header className="crp-header">
          <div className="crp-header-left">
            <p className="crp-eyebrow">Club Head Dashboard</p>
            <h1 className="crp-title">
              Event <span className="crp-gradient-text">Requests</span>
            </h1>
            <p className="crp-subtitle">
              Manage and review event hosting requests from clubs
            </p>
          </div>

          <div className="crp-stat-chips">
            <div className="crp-stat-chip crp-stat-pending">
              <span className="crp-stat-num">{counts.pending}</span>
              <span className="crp-stat-lbl">Pending</span>
            </div>
            <div className="crp-stat-chip crp-stat-approved">
              <span className="crp-stat-num">{counts.approved}</span>
              <span className="crp-stat-lbl">Approved</span>
            </div>
            <div className="crp-stat-chip crp-stat-rejected">
              <span className="crp-stat-num">{counts.rejected}</span>
              <span className="crp-stat-lbl">Rejected</span>
            </div>
          </div>
        </header>

        {/* FILTER TABS */}
        <div className="crp-filter-tabs">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              className={`crp-filter-tab ${filter === f ? "crp-filter-tab-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="crp-filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* REQUEST CARDS */}
        {visible.length === 0 ? (
          <div className="crp-empty">
            <div className="crp-empty-icon">📭</div>
            <p className="crp-empty-title">No requests here</p>
            <p className="crp-empty-sub">
              Switch filters to see other requests.
            </p>
          </div>
        ) : (
          <div className="crp-list">
            {visible.map((req) => {
              const isRejecting = rejectingId === req.id;
              const meta = STATUS_META[req.status];

              return (
                <div
                  key={req.id}
                  className={`crp-card ${req.status !== "pending" ? "crp-card-settled" : ""}`}
                >
                  <div className="crp-card-top">
                    <div className="crp-card-info">
                      <div className="crp-card-title-row">
                        <h2 className="crp-card-title">{req.title}</h2>
                        <span className={`crp-badge ${meta.className}`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="crp-card-meta">
                        <span className="crp-meta-item">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {req.club}
                        </span>
                        <span className="crp-meta-dot">·</span>
                        <span className="crp-meta-item">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {new Date(req.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="crp-card-desc">{req.description}</p>

                      {req.status === "rejected" && req.rejectionReason && (
                        <div className="crp-rejection-note">
                          <span className="crp-rejection-label">
                            Rejection reason:
                          </span>
                          <span className="crp-rejection-text">
                            {req.rejectionReason}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  {req.status === "pending" && (
                    <div className="crp-actions">
                      <div className="crp-action-btns">
                        <button
                          className="crp-btn crp-btn-approve"
                          onClick={() => handleApprove(req.id)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Approve
                        </button>
                        <button
                          className={`crp-btn crp-btn-reject ${isRejecting ? "crp-btn-reject-active" : ""}`}
                          onClick={() => handleRejectClick(req.id)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          {isRejecting ? "Cancel" : "Reject"}
                        </button>
                        <button
                          className="crp-btn crp-btn-details"
                          onClick={() => handleViewDetails(req)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          View Details
                        </button>
                      </div>

                      {isRejecting && (
                        <div className="crp-reject-panel">
                          <textarea
                            className={`crp-reject-textarea ${reasonError ? "crp-textarea-error" : ""}`}
                            placeholder="Enter reason for rejection..."
                            value={reasonInput}
                            rows={3}
                            onChange={(e) => {
                              setReasonInput(e.target.value);
                              setReasonError(false);
                            }}
                          />
                          {reasonError && (
                            <p className="crp-error-msg">
                              Please enter a reason before submitting.
                            </p>
                          )}
                          <button
                            className="crp-btn crp-btn-submit-reject"
                            onClick={() => handleRejectSubmit(req.id)}
                          >
                            Submit Rejection
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {req.status !== "pending" && (
                    <div className="crp-settled-row">
                      <span
                        className={`crp-settled-msg ${req.status === "approved" ? "crp-settled-approved" : "crp-settled-rejected"}`}
                      >
                        {req.status === "approved"
                          ? "✓ This request has been approved."
                          : "✕ This request has been rejected."}
                      </span>
                      <div className="crp-settled-actions">
                        <button
                          className="crp-btn crp-btn-details"
                          onClick={() => handleViewDetails(req)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          View Details
                        </button>
                        <button
                          className="crp-undo-btn"
                          onClick={() => handleUndo(req.id)}
                        >
                          Undo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* DETAILS MODAL */}
      {selectedRequest && (
        <div
          className={`crp-modal-overlay ${showModal ? "crp-modal-visible" : ""}`}
          onClick={handleCloseModal}
        >
          <div
            className={`crp-modal ${showModal ? "crp-modal-in" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="crp-modal-header">
              <div>
                <p className="crp-modal-eyebrow">Request Details</p>
                <h2 className="crp-modal-title">{selectedRequest.title}</h2>
              </div>
              <button
                className="crp-modal-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Status + Club */}
            <div className="crp-modal-meta">
              <span
                className={`crp-badge ${STATUS_META[selectedRequest.status].className}`}
              >
                {STATUS_META[selectedRequest.status].label}
              </span>
              <span className="crp-modal-club">{selectedRequest.club}</span>
              <span className="crp-meta-dot">·</span>
              <span className="crp-modal-date">
                {new Date(selectedRequest.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="crp-modal-divider" />

            {/* Requester Info */}
            <div className="crp-modal-section">
              <p className="crp-modal-section-label">Requester Information</p>
              <div className="crp-modal-fields">
                <div className="crp-modal-field">
                  <span className="crp-modal-field-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <div>
                    <p className="crp-modal-field-label">Full Name</p>
                    <p className="crp-modal-field-value">
                      {selectedRequest.requesterName}
                    </p>
                  </div>
                </div>
                <div className="crp-modal-field">
                  <span className="crp-modal-field-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <div>
                    <p className="crp-modal-field-label">Email Address</p>
                    <p className="crp-modal-field-value">
                      {selectedRequest.requesterEmail}
                    </p>
                  </div>
                </div>
                <div className="crp-modal-field">
                  <span className="crp-modal-field-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <div>
                    <p className="crp-modal-field-label">Phone Number</p>
                    <p className="crp-modal-field-value">
                      {selectedRequest.requesterPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="crp-modal-divider" />

            {/* Event Description */}
            <div className="crp-modal-section">
              <p className="crp-modal-section-label">Event Description</p>
              <p className="crp-modal-desc">{selectedRequest.description}</p>
            </div>

            {/* Rejection reason if present */}
            {selectedRequest.status === "rejected" &&
              selectedRequest.rejectionReason && (
                <>
                  <div className="crp-modal-divider" />
                  <div className="crp-modal-section">
                    <p className="crp-modal-section-label crp-modal-label-red">
                      Rejection Reason
                    </p>
                    <p className="crp-modal-reject-reason">
                      {selectedRequest.rejectionReason}
                    </p>
                  </div>
                </>
              )}

            {/* Footer */}
            <div className="crp-modal-footer">
              <button
                className="crp-btn crp-btn-details"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
