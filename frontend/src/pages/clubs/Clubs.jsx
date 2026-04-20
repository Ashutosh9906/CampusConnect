import { useState, useEffect } from "react";
import "../../styles/clubs.css";

function Clubs() {
  const API = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("my");

  const [myClubs, setMyClubs] = useState([]);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedClub, setSelectedClub] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // LOAD DATA
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const myRes = await fetch(`${API}/club/joined`, {
        method: "get",
        credentials: "include",
      });
      const myData = await myRes.json();
      const my = myData?.data || myData || [];

      const availRes = await fetch(`${API}/club/available`, {
        method: "get",
        credentials: "include",
      });
      const availData = await availRes.json();
      const available = availData?.data || availData || [];

      const histRes = await fetch(`${API}/club/history`, {
        method: "get",
        credentials: "include",
      });
      const histData = await histRes.json();
      const hist = histData?.data || histData || [];

      setMyClubs(my);
      setAvailableClubs(available);
      setHistory(hist);

    } catch (err) {
      console.log("Error loading data:", err);
      setMyClubs([]);
      setAvailableClubs([]);
      setHistory([]);
    }
  };

  // HOST EVENT
  const handleHostEvent = (club) => {
    window.location.href = `/#/create-event?club=${club.name}`;
  };

  // 🆕 DELETE REQUEST (added logic)
  const handleDeleteRequest = async (requestId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this request?`
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API}/club/request/${requestId}`, {
        method: "DELETE",
        credentials: "include",
      });

      setHistory((prev) => prev.filter((item) => item.id !== requestId));
    } catch (err) {
      console.log(err);
    }
  };

  // OPEN CONFIRM MODAL
  const handleOpenConfirmModal = (club) => {
    setSelectedClub(club);
    setShowConfirmModal(true);
  };

  // CONFIRM REQUEST
  const handleConfirmRequest = async () => {
    const alreadyRequested = history.some(
      (item) =>
        item.club === selectedClub.name &&
        item.status === "pending"
    );

    if (alreadyRequested) {
      alert("Request already pending!");
      setShowConfirmModal(false);
      setSelectedClub(null);
      return;
    }

    try {
      const res = await fetch(`${API}/club/request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubId: selectedClub.id,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        alert(data.message || "Failed to send request");
        return;
      }

      setHistory((prev) => [
        {
          id: data.data.id,   // 🔥 IMPORTANT
          club: selectedClub.name,
          status: "pending"
        },
        ...prev,
      ]);

      setShowConfirmModal(false);
      setSelectedClub(null);
      setActiveTab("history");

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const handleCloseAll = () => {
    setShowConfirmModal(false);
    setSelectedClub(null);
  };

  return (
    <div className="clubs-page">
      <h2>Clubs</h2>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "my" ? "active" : ""}
          onClick={() => setActiveTab("my")}
        >
          My Clubs
        </button>

        <button
          className={activeTab === "request" ? "active" : ""}
          onClick={() => setActiveTab("request")}
        >
          Request Clubs
        </button>

        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* MY CLUBS */}
      {activeTab === "my" && (
        <div className="club-grid">
          {myClubs.length > 0 ? (
            myClubs.map((club) => (
              <div className="club-card" key={club.id}>
                <h3>{club.name}</h3>
                <button onClick={() => handleHostEvent(club)}>
                  Host Event
                </button>
              </div>
            ))
          ) : (
            <p>No clubs joined yet</p>
          )}
        </div>
      )}

      {/* REQUEST TAB */}
      {activeTab === "request" && (
        <div className="request-box">
          <h3>Available Clubs</h3>

          {availableClubs.length > 0 ? (
            availableClubs.map((club) => (
              <div className="request-card" key={club.id}>
                <span>{club.name}</span>
                <button onClick={() => handleOpenConfirmModal(club)}>
                  Create Request
                </button>
              </div>
            ))
          ) : (
            <p>No clubs available</p>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="history-list">
          {history.length > 0 ? (
            history.map((item, index) => (
              <div className="history-card" key={index}>
                <h4>{item.club}</h4>

                {/* 🔥 STATUS + DELETE INLINE */}
                <span className={`status ${item.status}`}>
                  {item.status}
                </span>

                {item.status === "pending" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteRequest(item.id)}
                    style={{ marginLeft: "10px" }} // keeps it beside status
                  >
                    ✖
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No requests yet</p>
          )}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Request</h3>
            <p className="confirm-text">
              Are you sure you want to request to join{" "}
              <strong>{selectedClub?.name}</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={handleConfirmRequest}>
                Confirm Request
              </button>
              <button className="cancel-btn" onClick={handleCloseAll}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clubs;