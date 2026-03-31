import { useState, useEffect } from "react";
import "../../styles/listEvent.css";
import uploadIcon from "../../assets/upload.png";

function CreateEvent() {
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    host: "",
    date: "",
    time: "",
    venue: "",
    duration: "",
    description: "",
    club: "",
    speaker: "",
    email: "",
    phones: [""],
    brochure: null,

    // NEW
    linkedin: "",
    github: "",
    showLinkedIn: false,
    showGithub: false,
  });

  // ✅ GET USER ROLE (simple demo using localStorage)
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  // ❌ BLOCK ACCESS
  if (role !== "organizer") {
    return (
      <div className="no-access">
        <h2>Access Denied</h2>
        <p>Only organizers can add events.</p>
      </div>
    );
  }

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // HANDLE PHONE
  const handlePhoneChange = (index, value) => {
    const updated = [...formData.phones];
    updated[index] = value;
    setFormData({ ...formData, phones: updated });
  };

  const addPhone = () => {
    setFormData({ ...formData, phones: [...formData.phones, ""] });
  };

  // FILE
  const handleFile = (e) => {
    setFormData({ ...formData, brochure: e.target.files[0] });
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "phones") {
        data.append("phones", JSON.stringify(formData.phones));
      } else {
        data.append(key, formData[key]);
      }
    });

    fetch("http://localhost:5000/events", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then(() => alert("Event Created!"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="create-event">
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit} className="event-form">
        <label className="file-upload">
          <input type="file" onChange={handleFile} required />

          <div className="upload-content">
            <img src={uploadIcon} alt="upload" className="upload-icon" />

            <span>
              {formData.brochure
                ? formData.brochure.name
                : "Add Event Brochure"}
            </span>
          </div>
        </label>
        <input
          name="name"
          placeholder="Event Name"
          onChange={handleChange}
          required
        />
        <input
          name="host"
          placeholder="Host Name"
          onChange={handleChange}
          required
        />
        <input type="date" name="date" onChange={handleChange} required />
        <input type="time" name="time" onChange={handleChange} required />
        <input
          name="venue"
          placeholder="Venue"
          onChange={handleChange}
          required
        />
        <input name="duration" placeholder="Duration" onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input name="club" placeholder="Club Name" onChange={handleChange} />
        {/* SPEAKER DETAILS */}
        <div className="speaker-section">
          <h3>Speaker Details (Optional)</h3>

          <input
            name="speaker"
            placeholder="Speaker Name"
            onChange={handleChange}
          />

          <div className="social-buttons">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showLinkedIn: true })}
              className="social-btn linkedin"
            >
              🔗 Add LinkedIn
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, showGithub: true })}
              className="social-btn github"
            >
              💻 Add GitHub
            </button>
          </div>

          {/* CONDITIONAL INPUTS */}

          {formData.showLinkedIn && (
            <input
              name="linkedin"
              placeholder="LinkedIn Profile URL"
              onChange={handleChange}
            />
          )}

          {formData.showGithub && (
            <input
              name="github"
              placeholder="GitHub Profile URL"
              onChange={handleChange}
            />
          )}
        </div>
        <input
          type="email"
          name="email"
          placeholder="Contact Email"
          onChange={handleChange}
        />
        {/* MULTIPLE PHONES */}
        {formData.phones.map((phone, index) => (
          <input
            key={index}
            placeholder={`Phone ${index + 1}`}
            value={phone}
            onChange={(e) => handlePhoneChange(index, e.target.value)}
          />
        ))}
        <button type="button" onClick={addPhone}>
          + Add Phone
        </button>
        <button type="submit" className="primary-btn">
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
