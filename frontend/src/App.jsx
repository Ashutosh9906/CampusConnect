import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Landing from "./pages/landing/Landing";
import CompleteProfile from "./pages/auth/CompleteProfile";
import GoogleSuccess from "./pages/auth/GoogleSuccess";

import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/home" element={<Landing />} />

        {/* Google OAuth routes */}
        <Route path="/auth/success" element={<GoogleSuccess />} />
        <Route path="/auth/failure" element={<div>Google login failed</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
