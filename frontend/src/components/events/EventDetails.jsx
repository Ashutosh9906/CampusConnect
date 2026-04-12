import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import "../../styles/eventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL;

    fetch(`${API}/event/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const e = res.data;

          // 🔥 map backend → frontend structure
          const mappedEvent = {
            id: e.id,
            title: e.name,
            bannerUrl:
              "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80",

            date: new Date(e.date).toLocaleDateString(),
            time: new Date(e.date).toLocaleTimeString(),

            venue: e.venue,
            category: e.club?.name || "Event",

            description: e.description,
            registrationLink: e.registrationLink,

            organizer: {
              name: e.hostName || e.club?.name || "Club",   // 🔥 FIX
              email: e.contactEmail,
              phones: e.contactPhones,                     // 🔥 ADD
            },

            // 🔥 handle speakers (array → single for UI)
            speaker: e.speakers?.length
              ? {
                name: e.speakers[0].name,
                role: "Speaker",
                linkedin: e.speakers[0].linkedin,
                github: e.speakers[0].github,
              }
              : null,
          };

          setEvent(mappedEvent);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!event) {
    return <p style={{ padding: "40px" }}>Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="event-page">
        {/* Banner */}
        <div className="event-banner">
          <img src={event.bannerUrl} alt="Event Banner" />
        </div>

        {/* Layout */}
        <div className="event-layout">
          {/* LEFT */}
          <div className="event-left">
            <div className="box">
              <h1>{event.title}</h1>

              <div className="meta-row">
                <span>{event.date}</span>
                <span>{event.time}</span>
                <span>{event.venue}</span>
                <span>{event.category}</span>
              </div>
            </div>

            <div className="box">
              <h2>About Event</h2>
              <p>{event.description}</p>
            </div>

            <div className="box">
              <h2>Organizer</h2>
              <p><strong>Host:</strong> {event.organizer.name}</p>
              <p><strong>Email:</strong> {event.organizer.email}</p>
              <p><strong>Contact:</strong> {event.organizer.phones?.join(", ")}</p>
            </div>

            {event.speaker && (
              <div className="box">
                <h2>Speaker</h2>
                <p>{event.speaker.name}</p>
                <p>{event.speaker.role}</p>

                <div className="social-links">
                  {event.speaker.linkedin && (
                    <a href={event.speaker.linkedin} target="_blank">
                      LinkedIn
                    </a>
                  )}
                  {event.speaker.github && (
                    <a href={event.speaker.github} target="_blank">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="event-right">
            <div className="register-card">
              <h3>Register</h3>

              <div className="reg-row">
                <span>Date</span>
                <span>{event.date}</span>
              </div>

              <div className="reg-row">
                <span>Time</span>
                <span>{event.time}</span>
              </div>

              <div className="reg-row">
                <span>Venue</span>
                <span>{event.venue}</span>
              </div>

              {event.registrationLink ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="register-btn"
                >
                  Register Now
                </a>
              ) : (
                <button className="register-btn disabled">
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetails;