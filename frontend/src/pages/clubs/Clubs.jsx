import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/clubs.css";

function Clubs() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("my");
  const [myClubs, setMyClubs] = useState([]);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedClub, setSelectedClub] = useState(null);
  const [showRequestBox, setShowRequestBox] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const myRes = await fetch(`${API}/club/joined`, {
        method: "GET",
        credentials: "include",
      });
      const myData = await myRes.json();

      const availRes = await fetch(`${API}/club/available`, {
        method: "GET",
        credentials: "include",
      });
      const availData = await availRes.json();

      const histRes = await fetch(`${API}/club/history`, {
        method: "GET",
        credentials: "include",
      });
      const histData = await histRes.json();

      setMyClubs(myData?.data || []);
      setAvailableClubs(availData?.data || []);
      setHistory(histData?.data || []);
    } catch (err) {
      setMyClubs([]);
      setAvailableClubs([]);
      setHistory([]);
    }
  };

  // ✅ FIXED: Proper club selection + safe navigation
  const handleHostEvent = async (club) => {
    try {
      const res = await fetch(`${API}/auth/select-club`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubId: club.id,
        }),
      });

      if (!res.ok) return;

      // ✅ ensure cookie is written before navigation
      await new Promise((resolve) => setTimeout(resolve, 200));

      navigate(`/create-event?club=${club.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteRequest = async (requestId) => {
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

  const handleOpenConfirmModal = (club) => {
    setSelectedClub(club);
    setShowConfirmModal(true);
  };

  const handleOpenRequestModal = (club) => {
    setSelectedClub(club);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    setShowRequestModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmRequest = async () => {
    const alreadyRequested = history.some(
      (item) =>
        item.club === selectedClub.name &&
        item.status === "pending"
    );

    if (alreadyRequested) {
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

      if (!data.success) return;

      setHistory((prev) => [
        {
          id: data.data.id,
          club: selectedClub.name,
          status: "pending",
        },
        ...prev,
      ]);

      setShowConfirmModal(false);
      setSelectedClub(null);
      setActiveTab("history");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseAll = () => {
    setShowRequestModal(false);
    setShowConfirmModal(false);
    setShowRequestBox(false);
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
        <div>
          <button
            className="open-request-btn"
            onClick={() => setShowRequestBox(true)}
          >
            + Create New Request
          </button>

          {showRequestBox && (
            <div className="request-box">
              <h3>Available Clubs</h3>

              {availableClubs.length > 0 ? (
                availableClubs.map((club) => (
                  <div className="request-card" key={club.id}>
                    <span>{club.name}</span>
                    <button onClick={() => handleOpenRequestModal(club)}>
                      Create Request
                    </button>
                  </div>
                ))
              ) : (
                <p>No clubs available</p>
              )}

              <button
                className="close-btn"
                onClick={() => setShowRequestBox(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <div className="history-list">
          {history.length > 0 ? (
            history.map((item, index) => (
              <div className="history-card" key={index}>
                <h4>{item.club}</h4>
                <span className={`status ${item.status}`}>
                  {item.status}
                </span>
              </div>
            ))
          ) : (
            <p>No requests yet</p>
          )}
        </div>
      )}

      {/* MODAL STEP 1 */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Send Request</h3>
            <p className="confirm-text">
              Send request to join{" "}
              <strong>{selectedClub?.name}</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={handleSubmitRequest}>
                Submit Request
              </button>
              <button className="cancel-btn" onClick={handleCloseAll}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL STEP 2 */}
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
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowRequestModal(true);
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clubs;