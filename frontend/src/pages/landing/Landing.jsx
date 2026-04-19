import { useEffect, useState } from "react"; // ✅ added useState
import { useLocation } from "react-router-dom";
import "../../styles/landing.css";
import EventCard from "../../components/events/EventCard";

function Landing() {
  const location = useLocation();

  const [events, setEvents] = useState([]); // ✅ added state

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("scroll");

    if (section) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }

    // ✅ FETCH EVENTS (added)
    const API = import.meta.env.VITE_API_URL;

    fetch(`${API}/event`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setEvents(res.data);
        }
      })
      .catch((err) => console.log(err));

  }, [location]);

  return (
    <div className="landing">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Campus Events Effortlessly</h1>
          <p>
            Explore live and upcoming college events. Register instantly and
            never miss an opportunity.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() =>
                document.getElementById("events").scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Events
            </button>
          </div>
        </div>
      </section>

      {/*EVENTS */}
      <section className="events-section" id="events">
        <h2>Events</h2>

        <div className="carousel-wrapper">
          {/* LEFT ARROW */}
          <button
            className="carousel-arrow left"
            onClick={() =>
              document.getElementById("live-carousel").scrollBy({
                left: -300,
                behavior: "smooth",
              })
            }
          >
            ‹
          </button>

          {/* CAROUSEL */}
          <div className="events-carousel" id="live-carousel">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.name}
                brochureUrl={event.brochureUrl}  // ✅ add this
                hostName={event.hostName}
                email={event.contactEmail}
                phones={event.contactPhones}
              />
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            className="carousel-arrow right"
            onClick={() =>
              document.getElementById("live-carousel").scrollBy({
                left: 300,
                behavior: "smooth",
              })
            }
          >
            ›
          </button>
        </div>
      </section>

      {/* WHY CAMPUS CONNECT */}
      <section className="why-us">
        <h2>Why Campus Connect?</h2>

        <div className="why-grid">
          <div className="why-card">Centralized Event Platform</div>
          <div className="why-card">Instant Registration</div>
          <div className="why-card">Live Updates</div>
          <div className="why-card">Student Friendly</div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="about-us" id="about">
        <h2>About Us</h2>
        <p>
          Campus Connect is a platform built for students to easily discover,
          explore, and register for college events. We aim to simplify event
          management and participation by bringing everything into one place.
        </p>
      </section>

      {/* CONTACT US */}
      <section className="contact-us" id="contact">
        <div className="contact-box">
          <h2>Contact Us</h2>
          <p>
            Feel free to contact us and we will get back to you as soon as
            possible.
          </p>

          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();

              const formData = {
                name: e.target.name.value,
                phone: e.target.phone.value,
                email: e.target.email.value,
                message: e.target.message.value,
              };

              fetch("http://localhost:5000/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              })
                .then((res) => res.json())
                .then(() => {
                  alert("Message sent!");
                  e.target.reset();
                });
            }}
          >
            <input type="text" name="name" placeholder="Name" required />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
            />
            <input type="email" name="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message" rows="4" required />

            <button type="submit" className="primary-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Landing;