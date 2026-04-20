import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Clubs() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("my");
  const [myClubs, setMyClubs] = useState([]);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedClub, setSelectedClub] = useState(null);
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
    setShowConfirmModal(false);
    setSelectedClub(null);
  };

  return null; // UI intentionally removed as requested
}

export default Clubs;