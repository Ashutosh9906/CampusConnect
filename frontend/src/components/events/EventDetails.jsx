import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import "../../styles/eventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  // Later: replace with API call
  useEffect(() => {
    const mockEvent = {
      id: id,
      title: "Tech Fest 2026",
      bannerUrl:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80",
      date: "28 March 2026",
      time: "10:00 AM",
      venue: "Main Auditorium",
      category: "Technical",
      description:
        "National level technical festival featuring workshops, competitions and guest lectures.",
      organizer: {
        name: "Coding Club - ABC College",
        email: "codingclub@college.edu",
      },
      speaker: {
        name: "John Doe",
        role: "Senior Software Engineer",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        leetcode: "https://leetcode.com",
      },
    };

    setEvent(mockEvent);
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
              <p>{event.organizer.name}</p>
              <p>{event.organizer.email}</p>
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
                  {event.speaker.leetcode && (
                    <a href={event.speaker.leetcode} target="_blank">
                      LeetCode
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

              <button className="register-btn">Register Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetails;
