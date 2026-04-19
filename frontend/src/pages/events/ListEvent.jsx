import { useState } from "react";
import "../../styles/listEvent.css";
import uploadIcon from "../../assets/upload.png";


function CreateEvent() {
  const params = new URLSearchParams(window.location.search);
  const clubFromURL = params.get("club");

  if (!clubFromURL) {
    return (
      <div className="no-access">
        <h2>Access Denied</h2>
        <p>Please select a club from My Clubs to host an event.</p>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: "",
    host: "",
    date: "",
    time: "",
    venue: "",
    duration: "",
    description: "",
    club: clubFromURL,
    speaker: "",
    email: "",
    phones: [""],
    brochure: null,
    linkedin: "",
    github: "",
    showLinkedIn: false,
    showGithub: false,
    registrationLink: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (index, value) => {
    const updated = [...formData.phones];
    updated[index] = value;
    setFormData({ ...formData, phones: updated });
  };

  const addPhone = () => {
    setFormData({ ...formData, phones: [...formData.phones, ""] });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, brochure: file });
    // Optional: show preview
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validPhones = formData.phones.filter(p => p.trim() !== "");
    if (!formData.email) return alert("Contact email is required");
    if (validPhones.length === 0) return alert("At least one phone number is required");

    // ✅ Use FormData instead of JSON
    const data = new FormData();
    data.append("name", formData.name);
    data.append("hostName", formData.host);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("venue", formData.venue);
    data.append("duration", formData.duration);
    data.append("description", formData.description);
    data.append("club", formData.club);
    data.append("registrationLink", formData.registrationLink);
    data.append("contactEmail", formData.email);
    data.append("contactPhones", JSON.stringify(validPhones)); // stringify array
    data.append("speaker", formData.speaker);
    data.append("linkedin", formData.linkedin);
    data.append("github", formData.github);

    if (formData.brochure) {
      data.append("brochure", formData.brochure); // ✅ actual file
    }

    const API = import.meta.env.VITE_API_URL;

    setLoading(true);

    fetch(`${API}/event`, {
      method: "POST",
      body: data,              // ✅ NO Content-Type header — browser sets it with boundary
      credentials: "include",
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          alert("Event Created Successfully!");
          window.location.href = "/clubs";
        } else {
          alert(res.message || "Failed to create event");
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="create-event">
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit} className="event-form">
        {/* FILE */}
        <label className="file-upload">
          <input type="file" onChange={handleFile} accept="image/*,application/pdf" />
          <div className="upload-content">
            {preview ? (
              <img src={preview} alt="preview" className="upload-icon" style={{ objectFit: "cover", borderRadius: "8px" }} />
            ) : (
              <img src={uploadIcon} alt="upload" className="upload-icon" />
            )}
            <span>{preview ? formData.brochure?.name : "Add Event Brochure"}</span>
          </div>
        </label>

        {/* EVERYTHING BELOW UNCHANGED */}

        {/* rest remains EXACTLY SAME */}

        {/* BASIC DETAILS */}
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
        <input
          name="registrationLink"
          placeholder="Registration Link"
          onChange={handleChange}
          type="url"
        />

        {/* ✅ CLUB AUTO-FILLED */}
        <input name="club" value={formData.club} readOnly />

        {/* SPEAKER */}
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

          {formData.showLinkedIn && (
            <input
              name="linkedin"
              placeholder="LinkedIn URL"
              onChange={handleChange}
            />
          )}

          {formData.showGithub && (
            <input
              name="github"
              placeholder="GitHub URL"
              onChange={handleChange}
            />
          )}
        </div>

        {/* CONTACT */}
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

        {/* SUBMIT */}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? (
            <span className="btn-spinner" />
          ) : (
            "Create Event"
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;