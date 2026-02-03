import "../../styles/carousel3d.css";

function EventCard({ event, position }) {
  return (
    <div className={`event-card-3d ${position}`}>
      <img src={event.image} alt={event.title} />
      <div className="event-overlay">
        <h3>{event.title}</h3>
        <button>View Details</button>
      </div>
    </div>
  );
}

export default EventCard;
