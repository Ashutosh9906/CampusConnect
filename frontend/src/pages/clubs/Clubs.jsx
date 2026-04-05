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
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  // LOAD DATA
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const myRes = await fetch(`${API}/clubs/my`, { credentials: "include" });
      const my = await myRes.json();

      const availRes = await fetch(`${API}/clubs/available`, {
        credentials: "include",
      });
      const available = await availRes.json();

      const histRes = await fetch(`${API}/clubs/history`, {
        credentials: "include",
      });
      const hist = await histRes.json();

      setMyClubs(
        my?.length
          ? my
          : [
              { id: 1, name: "Tech Club" },
              { id: 2, name: "Music Club" },
            ],
      );

      setAvailableClubs(
        available?.length
          ? available
          : [
              { id: 3, name: "Dance Club" },
              { id: 4, name: "Drama Club" },
            ],
      );

      setHistory(
        hist?.length
          ? hist
          : [
              { club: "Dance Club", status: "pending" },
              { club: "Drama Club", status: "approved" },
              { club: "Art Club", status: "expired" },
            ],
      );
    } catch {
      // fallback
      setMyClubs([
        { id: 1, name: "Tech Club" },
        { id: 2, name: "Music Club" },
      ]);

      setAvailableClubs([
        { id: 3, name: "Dance Club" },
        { id: 4, name: "Drama Club" },
      ]);

      setHistory([
        { club: "Dance Club", status: "pending" },
        { club: "Drama Club", status: "approved" },
        { club: "Art Club", status: "expired" },
      ]);
    }
  };

  // HOST EVENT
  const handleHostEvent = (club) => {
    window.location.href = `/create-event?club=${club.name}`;
  };

  // INPUT
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // SUBMIT REQUEST
  const handleRequestSubmit = async () => {
    // 🚫 PREVENT DUPLICATE
    const alreadyRequested = history.some(
      (item) => item.club === selectedClub.name && item.status === "pending",
    );

    if (alreadyRequested) {
      alert("Request already pending!");
      return;
    }

    try {
      await fetch(`${API}/clubs/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubId: selectedClub.id,
          ...formData,
        }),
      });

      alert("Request sent successfully!");

      // ✅ ADD TO HISTORY
      setHistory((prev) => [
        { club: selectedClub.name, status: "pending" },
        ...prev,
      ]);

      setShowForm(false);
      setFormData({ name: "", email: "", phone: "" });

      // 🔥 SWITCH TAB
      setActiveTab("history");
    } catch (err) {
      console.log(err);
    }
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
          {myClubs.map((club) => (
            <div className="club-card" key={club.id}>
              <h3>{club.name}</h3>
              <button onClick={() => handleHostEvent(club)}>Host Event</button>
            </div>
          ))}
        </div>
      )}

      {/* REQUEST */}
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

              {availableClubs.map((club) => (
                <div className="request-card" key={club.id}>
                  <span>{club.name}</span>

                  <button
                    onClick={() => {
                      setSelectedClub(club);
                      setShowForm(true);
                    }}
                  >
                    Create Request
                  </button>
                </div>
              ))}

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

      {/* HISTORY */}
      {activeTab === "history" && (
        <div className="history-list">
          {history.map((item, index) => (
            <div className="history-card" key={index}>
              <h4>{item.club}</h4>
              <span className={`status ${item.status}`}>{item.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Request to List {selectedClub?.name} Event</h3>

            <input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInput}
            />

            <input
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInput}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInput}
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleInput}
            />
            <div className="modal-actions">
              <button onClick={handleRequestSubmit}>Submit Request</button>

              <button className="cancel-btn" onClick={() => setShowForm(false)}>
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
