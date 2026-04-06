import { useState, useEffect } from "react";
import "../../styles/clubs.css";

function Clubs() {
  const API = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("my");
  const [showRequestBox, setShowRequestBox] = useState(false);

  const [myClubs, setMyClubs] = useState([]);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedClub, setSelectedClub] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // LOAD DATA
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // ✅ MY CLUBS
      const myRes = await fetch(`${API}/club/joined`, {
        method: "get",
        credentials: "include",
      });
      const myData = await myRes.json();
      const my = myData?.data || myData || [];

      // ✅ AVAILABLE CLUBS
      const availRes = await fetch(`${API}/club/available`, {
        method: "get",
        credentials: "include",
      });
      const availData = await availRes.json();
      const available = availData?.data || availData || [];

      // ✅ HISTORY
      const histRes = await fetch(`${API}/club/history`, {
        method: "get",
        credentials: "include",
      });
      const histData = await histRes.json();
      console.log(histData);
      const hist = histData?.data || histData || [];

      setMyClubs(my);
      setAvailableClubs(available);
      setHistory(hist);

    } catch (err) {
      console.log("Error loading data:", err);

      // fallback (optional)
      setMyClubs([]);
      setAvailableClubs([]);
      setHistory([]);
    }
  };

  // HOST EVENT
  const handleHostEvent = (club) => {
    window.location.href = `/create-event?club=${club.name}`;
  };

  // STEP 1 — Open first modal
  const handleOpenRequestModal = (club) => {
    setSelectedClub(club);
    setShowRequestModal(true);
    setShowConfirmModal(false);
  };

  // STEP 2 — Move to second confirmation modal
  const handleSubmitRequest = () => {
    const alreadyRequested = history.some(
      (item) =>
        item.club === selectedClub.name &&
        item.status === "pending"
    );

    if (alreadyRequested) {
      alert("Request already pending!");
      return;
    }

    setShowRequestModal(false);
    setShowConfirmModal(true);
  };

  // STEP 3 — Call API
  const handleConfirmRequest = async () => {
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

      if (!data.success) {
        alert(data.message || "Failed to send request");
        return;
      }

      // ✅ update history instantly
      setHistory((prev) => [
        { club: selectedClub.name, status: "pending" },
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

  // CLOSE MODALS
  const handleCloseAll = () => {
    setShowRequestModal(false);
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
              Press confirm to send request to club head for{" "}
              <strong>{selectedClub?.name}</strong>.
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