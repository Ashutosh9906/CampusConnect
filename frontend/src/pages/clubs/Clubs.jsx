// import { useState, useEffect } from "react";
// import "../../styles/clubs.css";

// function Clubs() {
//   const API = import.meta.env.VITE_API_URL;

//   const [activeTab, setActiveTab] = useState("my");
//   // const [showRequestBox, setShowRequestBox] = useState(false);

//   const [myClubs, setMyClubs] = useState([]);
//   const [availableClubs, setAvailableClubs] = useState([]);
//   const [history, setHistory] = useState([]);

//   const [selectedClub, setSelectedClub] = useState(null);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   // LOAD DATA
//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const myRes = await fetch(`${API}/clubs/my`, { credentials: "include" });
//       const my = await myRes.json();

//       const availRes = await fetch(`${API}/clubs/available`, {
//         credentials: "include",
//       });
//       const available = await availRes.json();

//       const histRes = await fetch(`${API}/clubs/history`, {
//         credentials: "include",
//       });
//       const hist = await histRes.json();

//       setMyClubs(
//         my?.length
//           ? my
//           : [
//               { id: 1, name: "Tech Club" },
//               { id: 2, name: "Music Club" },
//             ],
//       );

//       setAvailableClubs(
//         available?.length
//           ? available
//           : [
//               { id: 3, name: "Dance Club" },
//               { id: 4, name: "Drama Club" },
//             ],
//       );

//       setHistory(
//         hist?.length
//           ? hist
//           : [
//               { club: "Dance Club", status: "pending" },
//               { club: "Drama Club", status: "approved" },
//               { club: "Art Club", status: "expired" },
//             ],
//       );
//     } catch {
//       setMyClubs([
//         { id: 1, name: "Tech Club" },
//         { id: 2, name: "Music Club" },
//       ]);

//       setAvailableClubs([
//         { id: 3, name: "Dance Club" },
//         { id: 4, name: "Drama Club" },
//       ]);

//       setHistory([
//         { club: "Dance Club", status: "pending" },
//         { club: "Drama Club", status: "approved" },
//         { club: "Art Club", status: "expired" },
//       ]);
//     }
//   };

//   // HOST EVENT
//   const handleHostEvent = (club) => {
//     window.location.href = `/create-event?club=${club.name}`;
//   };

//   // STEP 1 — Open first modal
//   const handleOpenRequestModal = (club) => {
//     setSelectedClub(club);
//     setShowRequestModal(true);
//     setShowConfirmModal(false);
//   };

//   // STEP 2 — Move to second confirmation modal (no API call yet)
//   const handleSubmitRequest = () => {
//     // DUPLICATE CHECK
//     const alreadyRequested = history.some(
//       (item) => item.club === selectedClub.name && item.status === "pending",
//     );

//     if (alreadyRequested) {
//       alert("Request already pending!");
//       return;
//     }

//     // Close first modal, open second
//     setShowRequestModal(false);
//     setShowConfirmModal(true);
//   };

//   // STEP 3 — Actually call API
//   const handleConfirmRequest = async () => {
//     try {
//       await fetch(`${API}/clubs/request`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           clubId: selectedClub.id,
//         }),
//       });

//       // ADD TO HISTORY
//       setHistory((prev) => [
//         { club: selectedClub.name, status: "pending" },
//         ...prev,
//       ]);

//       // CLOSE ALL MODALS
//       setShowConfirmModal(false);
//       setSelectedClub(null);

//       // SWITCH TAB
//       setActiveTab("history");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // CLOSE ALL MODALS
//   const handleCloseAll = () => {
//     setShowRequestModal(false);
//     setShowConfirmModal(false);
//     setSelectedClub(null);
//   };

//   return (
//     <div className="clubs-page">
//       <h2>Clubs</h2>

//       {/* TABS */}
//       <div className="tabs">
//         <button
//           className={activeTab === "my" ? "active" : ""}
//           onClick={() => setActiveTab("my")}
//         >
//           My Clubs
//         </button>

//         <button
//           className={activeTab === "request" ? "active" : ""}
//           onClick={() => setActiveTab("request")}
//         >
//           Request Clubs
//         </button>

//         <button
//           className={activeTab === "history" ? "active" : ""}
//           onClick={() => setActiveTab("history")}
//         >
//           History
//         </button>
//       </div>

//       {/* MY CLUBS */}
//       {activeTab === "my" && (
//         <div className="club-grid">
//           {myClubs.map((club) => (
//             <div className="club-card" key={club.id}>
//               <h3>{club.name}</h3>
//               <button onClick={() => handleHostEvent(club)}>Host Event</button>
//             </div>
//           ))}
//         </div>
//       )}
//       {/* REQUEST TAB */}
//       {activeTab === "request" && (
//         <div className="request-box">
//           <h3>Available Clubs</h3>

//           {availableClubs.map((club) => (
//             <div className="request-card" key={club.id}>
//               <span>{club.name}</span>
//               <button onClick={() => handleOpenRequestModal(club)}>
//                 Request
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//       {/* HISTORY TAB */}
//       {activeTab === "history" && (
//         <div className="history-list">
//           {history.map((item, index) => (
//             <div className="history-card" key={index}>
//               <h4>{item.club}</h4>
//               <span className={`status ${item.status}`}>{item.status}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* MODAL STEP 1 — Send Request */}
//       {showRequestModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>Send Request</h3>
//             <p className="confirm-text">
//               Send request to join <strong>{selectedClub?.name}</strong>?
//             </p>
//             <div className="modal-actions">
//               <button onClick={handleSubmitRequest}>Submit Request</button>
//               <button className="cancel-btn" onClick={handleCloseAll}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MODAL STEP 2 — Confirm Request */}
//       {showConfirmModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>Confirm Request</h3>
//             <p className="confirm-text">
//               Press confirm to send request to club head for{" "}
//               <strong>{selectedClub?.name}</strong>.
//             </p>
//             <div className="modal-actions">
//               <button onClick={handleConfirmRequest}>Confirm Request</button>
//               <button
//                 className="cancel-btn"
//                 onClick={() => {
//                   setShowConfirmModal(false);
//                   setShowRequestModal(true);
//                 }}
//               >
//                 Back
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Clubs;

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
  //handle delete
  const handleDeleteRequest = async (clubName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete request for ${clubName}?`,
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API}/clubs/request`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubName,
        }),
      });

      // Update UI instantly
      setHistory((prev) => prev.filter((item) => item.club !== clubName));
    } catch (err) {
      console.log(err);
    }
  };
  // STEP 1 — Open confirm modal directly
  const handleOpenConfirmModal = (club) => {
    setSelectedClub(club);
    setShowConfirmModal(true);
  };

  // CONFIRM REQUEST — with duplicate check moved here
  const handleConfirmRequest = async () => {
    // DUPLICATE CHECK
    const alreadyRequested = history.some(
      (item) => item.club === selectedClub.name && item.status === "pending",
    );

    if (alreadyRequested) {
      alert("Request already pending!");
      setShowConfirmModal(false);
      setSelectedClub(null);
      return;
    }

    try {
      await fetch(`${API}/clubs/request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubId: selectedClub.id,
        }),
      });

      // ADD TO HISTORY
      setHistory((prev) => [
        { club: selectedClub.name, status: "pending" },
        ...prev,
      ]);

      // CLOSE MODAL
      setShowConfirmModal(false);
      setSelectedClub(null);

      // SWITCH TAB
      setActiveTab("history");
    } catch (err) {
      console.log(err);
    }
  };

  // CLOSE MODAL
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
          {myClubs.map((club) => (
            <div className="club-card" key={club.id}>
              <h3>{club.name}</h3>
              <button onClick={() => handleHostEvent(club)}>Host Event</button>
            </div>
          ))}
        </div>
      )}

      {/* REQUEST TAB */}
      {activeTab === "request" && (
        <div className="request-box">
          <h3>Available Clubs</h3>

          {availableClubs.map((club) => (
            <div className="request-card" key={club.id}>
              <span>{club.name}</span>
              <button onClick={() => handleOpenConfirmModal(club)}>
                Request
              </button>
            </div>
          ))}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <div className="history-list">
          {history.map((item, index) => (
            // <div className="history-card" key={index}>
            //   <h4>{item.club}</h4>
            //   <span className={`status ${item.status}`}>{item.status}</span>
            // </div>
            <div className="history-card" key={index}>
              <div className="history-card-left">
                <h4>{item.club}</h4>
                <span className={`status ${item.status}`}>{item.status}</span>
              </div>

              {item.status === "pending" && (
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRequest(item.club)}
                >
                  ✖ Delete Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SINGLE CONFIRM MODAL */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Request</h3>
            <p className="confirm-text">
              Are you sure you want to request to join{" "}
              <strong>{selectedClub?.name}</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={handleConfirmRequest}>Confirm Request</button>
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
