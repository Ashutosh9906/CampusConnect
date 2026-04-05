import "../../styles/EventCard.css";
import { Link } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=900&q=80",
];

let counter = 0;

function EventCard({ id, title = "Tech Fest 2026" }) {
  const image = images[counter % images.length];
  counter++;

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={image} alt={title} />
      </div>
      <div className="event-content">
        <h3>{title}</h3>
        <Link to={`/event/${id || 1}`} className="event-btn">
          More Info
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
