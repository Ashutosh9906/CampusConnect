// import { Routes, Route } from "react-router-dom";

// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import Navbar from "./components/layout/Navbar";
// import Landing from "./pages/landing/Landing";
// import CompleteProfile from "./pages/auth/CompleteProfile";
// import Clubs from "./pages/clubs/Clubs";
// import EventsPage from "./pages/events/EventsPage";
// import GoogleSuccessLogin from "./pages/auth/GoogleSuccessLogin";
// import GoogleSuccessRegister from "./pages/auth/GoogleSuccessRegister";
// import VerifyOTP from "./pages/auth/VerifyOTP";
// import ClubRequestsPage from "./pages/clubs/ClubRequestsPage";
// import ListEvent from "./pages/events/ListEvent";
// import EventDetails from "./components/events/EventDetails.jsx";
// import RoleModal from "./components/common/RoleModal";

// import "./styles/App.css";

// function GoogleFailure() {
//   const params = new URLSearchParams(window.location.search);
//   const message = params.get("message");

//   return (
//     <div style={{ padding: "40px", fontSize: "18px" }}>
//       <h2>Google login failed</h2>
//       <p>{message}</p>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Routes>
//       {/* HOME */}
//       <Route
//         path="/"
//         element={
//           <>
//             <Navbar />
//             <Landing />
//           </>
//         }
//       />
// const [user, setUser] = useState(() => {
//   const stored = localStorage.getItem("user");
//   return stored ? JSON.parse(stored) : null;
// });

// const [showRoleModal, setShowRoleModal] = useState(false);
//       {/* CLUBS */}
//       <Route
//         path="/clubs"
//         element={
//           <>
//             <Navbar />
//             <Clubs />
//           </>
//         }
//       />
//       <Route
//         path="/club-requests"
//         element={
//           <>
//             <Navbar />
//             <ClubRequestsPage />
//           </>
//         }
//       />
//       {/* EVENTS */}
//       <Route path="/event/:id" element={<EventDetails />} />
//       <Route
//         path="/events"
//         element={
//           <>
//             <Navbar />
//             <EventsPage />
//           </>
//         }
//       />
//       <Route
//         path="/create-event"
//         element={
//           <>
//             <Navbar />
//             <ListEvent />
//           </>
//         }
//       />

//       {/* AUTH (NO NAVBAR) */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/complete-profile" element={<CompleteProfile />} />
//       <Route path="/verify-otp" element={<VerifyOTP />} />

//       {/* GOOGLE */}
//       <Route path="/auth/success-login" element={<GoogleSuccessLogin />} />
//       <Route
//         path="/auth/success-register"
//         element={<GoogleSuccessRegister />}
//       />
//       <Route path="/auth/failure" element={<GoogleFailure />} />
//     </Routes>
//   );
// }
// export default App;

// import { Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react"; // ✅ ADDED

// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import Navbar from "./components/layout/Navbar";
// import Landing from "./pages/landing/Landing";
// import CompleteProfile from "./pages/auth/CompleteProfile";
// import Clubs from "./pages/clubs/Clubs";
// import EventsPage from "./pages/events/EventsPage";
// import GoogleSuccessLogin from "./pages/auth/GoogleSuccessLogin";
// import GoogleSuccessRegister from "./pages/auth/GoogleSuccessRegister";
// import VerifyOTP from "./pages/auth/VerifyOTP";
// import ClubRequestsPage from "./pages/clubs/ClubRequestsPage";
// import Profile from "./pages/profile/Profile.jsx";
// import Footer from "./components/Footer";
// import { Outlet } from "react-router-dom";
// import ListEvent from "./pages/events/ListEvent";
// import EventDetails from "./components/events/EventDetails.jsx";

// import RoleModal from "./components/common/RoleModal"; // ✅ ADDED

// import "./styles/App.css";

// function GoogleFailure() {
//   const params = new URLSearchParams(window.location.search);
//   const message = params.get("message");

//   return (
//     <div style={{ padding: "40px", fontSize: "18px" }}>
//       <h2>Google login failed</h2>
//       <p>{message}</p>
//     </div>
//   );
// }

// function App() {
//   // ✅ ADDED STATE
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const [showRoleModal, setShowRoleModal] = useState(false);

//   // ✅ ADDED EFFECT
//   useEffect(() => {
//     if (user && !user.role) {
//       setShowRoleModal(true);
//     }
//   }, [user]);

//   // ✅ ADDED HANDLER
//   const handleRoleSelected = (role) => {
//     const updatedUser = { ...user, role };

//     localStorage.setItem("user", JSON.stringify(updatedUser));
//     setUser(updatedUser);
//     setShowRoleModal(false);

//     // future backend call
//     // updateUserRole(role);
//   };

//   return (
//     <>
//       {/* ✅ ROLE MODAL (ADDED) */}
//       {showRoleModal && <RoleModal onRoleSelected={handleRoleSelected} />}

//       <Routes>
//         {/* HOME */}
//         <Route
//           path="/"
//           element={
//             <>
//               <Navbar />
//               <Landing />
//             </>
//           }
//         />

//         {/* CLUBS */}
//         <Route
//           path="/clubs"
//           element={
//             <>
//               <Navbar />
//               <Clubs />
//             </>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <>
//               <Navbar />
//               <Profile />
//             </>
//           }
//         />
//         <Route
//           path="/club-requests"
//           element={
//             <>
//               <Navbar />
//               <ClubRequestsPage />
//             </>
//           }
//         />

//         {/* EVENTS */}
//         <Route path="/event/:id" element={<EventDetails />} />

//         <Route
//           path="/events"
//           element={
//             <>
//               <Navbar />
//               <EventsPage />
//             </>
//           }
//         />

//         <Route
//           path="/create-event"
//           element={
//             <>
//               <Navbar />
//               <ListEvent />
//             </>
//           }
//         />

//         {/* AUTH (NO NAVBAR) */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/complete-profile" element={<CompleteProfile />} />
//         <Route path="/verify-otp" element={<VerifyOTP />} />

//         {/* GOOGLE */}
//         <Route path="/auth/success-login" element={<GoogleSuccessLogin />} />
//         <Route
//           path="/auth/success-register"
//           element={<GoogleSuccessRegister />}
//         />
//         <Route path="/auth/failure" element={<GoogleFailure />} />
//       </Routes>
//       <Footer />
//     </>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/layout/Navbar";
import Landing from "./pages/landing/Landing";
import CompleteProfile from "./pages/auth/CompleteProfile";
import Clubs from "./pages/clubs/Clubs";
import EventsPage from "./pages/events/EventsPage";
import GoogleSuccessLogin from "./pages/auth/GoogleSuccessLogin";
import GoogleSuccessRegister from "./pages/auth/GoogleSuccessRegister";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ClubRequestsPage from "./pages/clubs/ClubRequestsPage";
import Profile from "./pages/profile/Profile.jsx";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import ListEvent from "./pages/events/ListEvent";
import EventDetails from "./components/events/EventDetails.jsx";
import RoleModal from "./components/common/RoleModal";

import "./styles/App.css";

function GoogleFailure() {
  const params = new URLSearchParams(window.location.search);
  const message = params.get("message");

  return (
    <div style={{ padding: "40px", fontSize: "18px" }}>
      <h2>Google login failed</h2>
      <p>{message}</p>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (user && !user.role) {
      setShowRoleModal(true);
    }
  }, [user]);

  const handleRoleSelected = (role) => {
    const updatedUser = { ...user, role };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowRoleModal(false);
  };

  return (
    <>
      {showRoleModal && <RoleModal onRoleSelected={handleRoleSelected} />}

      {/* MODIFIED — app-wrapper now exists in DOM so CSS flex layout works */}
      <div className="app-wrapper">
        {/* MODIFIED — content div now exists in DOM so flex: 1 works */}
        <div className="content">
          <Routes>
            {/* HOME */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Landing />
                </>
              }
            />

            {/* CLUBS */}
            <Route
              path="/clubs"
              element={
                <>
                  <Navbar />
                  <Clubs />
                </>
              }
            />

            {/* PROFILE */}
            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              }
            />

            {/* CLUB REQUESTS */}
            <Route
              path="/club-requests"
              element={
                <>
                  <Navbar />
                  <ClubRequestsPage />
                </>
              }
            />

            {/* EVENTS */}
            <Route path="/event/:id" element={<EventDetails />} />

            <Route
              path="/events"
              element={
                <>
                  <Navbar />
                  <EventsPage />
                </>
              }
            />

            <Route
              path="/create-event"
              element={
                <>
                  <Navbar />
                  <ListEvent />
                </>
              }
            />

            {/* AUTH — NO NAVBAR */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* GOOGLE */}
            <Route
              path="/auth/success-login"
              element={<GoogleSuccessLogin />}
            />
            <Route
              path="/auth/success-register"
              element={<GoogleSuccessRegister />}
            />
            <Route path="/auth/failure" element={<GoogleFailure />} />
          </Routes>
        </div>

        {/* MODIFIED — Footer now inside app-wrapper so flex layout controls it */}
        <Footer />
      </div>
    </>
  );
}

export default App;
