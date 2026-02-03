import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import EventCard from "../../components/events/EventCard";
import "../../styles/landing.css";
import "../../styles/carousel3d.css";

const events = [
  {
    id: 1,
    title: "Web Dev Bootcamp",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  },
  {
    id: 2,
    title: "Career Guidance",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
  },
  {
    id: 3,
    title: "AI & ML Workshop",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
  },
  {
    id: 4,
    title: "Cyber Security Seminar",
    image: "https://images.unsplash.com/photo-1600267165503-1f7e5e6a1c4d",
  },
  {
    id: 5,
    title: "Startup Talk",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
  },
];

function Landing() {
  const [active, setActive] = useState(2);

  const prev = () => {
    setActive((i) => (i === 0 ? events.length - 1 : i - 1));
  };

  const next = () => {
    setActive((i) => (i === events.length - 1 ? 0 : i + 1));
  };

  const getPosition = (index) => {
    const diff = index - active;
    if (diff === 0) return "center";
    if (diff === -1 || diff === events.length - 1) return "left";
    if (diff === 1 || diff === -(events.length - 1)) return "right";
    if (diff === -2 || diff === events.length - 2) return "far-left";
    if (diff === 2 || diff === -(events.length - 2)) return "far-right";
    return "far-right";
  };

  return (
    <>
      <Navbar />

      {/* COMPACT HERO */}
      <section className="landing-hero">
        <h1>
          One Platform.
          <br />
          All Campus Events.
        </h1>
        <p>
          Campus Connect helps students discover, register, and track college
          events, expert sessions, and club activities — all in one place.
        </p>
      </section>

      {/* EVENTS (PRIMARY FOCUS) */}
      <section className="featured-events">
        <div className="events-meta">
          <span className="live-badge">LIVE / FEATURED EVENTS</span>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-btn left" onClick={prev}>
            ‹
          </button>

          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              position={getPosition(index)}
            />
          ))}

          <button className="carousel-btn right" onClick={next}>
            ›
          </button>
        </div>
      </section>
    </>
  );
}

export default Landing;
