// import { useState } from "react";
// import "../../styles/listEvent.css";
// import uploadIcon from "../../assets/upload.png";

// function CreateEvent() {
//   // 🔥 GET CLUB FROM URL
//   const params = new URLSearchParams(window.location.search);
//   const clubFromURL = params.get("club");

//   // ❌ BLOCK ACCESS IF NOT FROM CLUBS PAGE
//   if (!clubFromURL) {
//     return (
//       <div className="no-access">
//         <h2>Access Denied</h2>
//         <p>Please select a club from My Clubs to host an event.</p>
//       </div>
//     );
//   }

//   const [formData, setFormData] = useState({
//     name: "",
//     host: "",
//     date: "",
//     time: "",
//     venue: "",
//     duration: "",
//     description: "",
//     club: clubFromURL, // ✅ AUTO-FILLED
//     speaker: "",
//     email: "",
//     phones: [""],
//     brochure: null,
//     linkedin: "",
//     github: "",
//     showLinkedIn: false,
//     showGithub: false,
//     registrationLink: "",
//   });

//   // INPUT HANDLER
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // PHONE HANDLER
//   const handlePhoneChange = (index, value) => {
//     const updated = [...formData.phones];
//     updated[index] = value;
//     setFormData({ ...formData, phones: updated });
//   };

//   const addPhone = () => {
//     setFormData({ ...formData, phones: [...formData.phones, ""] });
//   };

//   // FILE HANDLER
//   const handleFile = (e) => {
//     setFormData({ ...formData, brochure: e.target.files[0] });
//   };

//   // SUBMIT
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const data = new FormData();

//     Object.keys(formData).forEach((key) => {
//       if (key === "phones") {
//         data.append("phones", JSON.stringify(formData.phones));
//       } else {
//         data.append(key, formData[key]);
//       }
//     });

//     const API = import.meta.env.VITE_API_URL;

//     fetch(`${API}/events`, {
//       method: "POST",
//       body: data,
//     })
//       .then((res) => res.json())
//       .then(() => alert("Event Created Successfully!"))
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="create-event">
//       <h2>Create Event</h2>

//       <form onSubmit={handleSubmit} className="event-form">
//         {/* FILE */}
//         <label className="file-upload">
//           <input type="file" onChange={handleFile} required />
//           <div className="upload-content">
//             <img src={uploadIcon} alt="upload" className="upload-icon" />
//             <span>
//               {formData.brochure
//                 ? formData.brochure.name
//                 : "Add Event Brochure"}
//             </span>
//           </div>
//         </label>

//         {/* BASIC DETAILS */}
//         <input
//           name="name"
//           placeholder="Event Name"
//           onChange={handleChange}
//           required
//         />

//         <input
//           name="host"
//           placeholder="Host Name"
//           onChange={handleChange}
//           required
//         />

//         <input type="date" name="date" onChange={handleChange} required />
//         <input type="time" name="time" onChange={handleChange} required />

//         <input
//           name="venue"
//           placeholder="Venue"
//           onChange={handleChange}
//           required
//         />

//         <input name="duration" placeholder="Duration" onChange={handleChange} />

//         <textarea
//           name="description"
//           placeholder="Description"
//           onChange={handleChange}
//         />
//         <input
//           name="registrationLink"
//           placeholder="Registration Link"
//           onChange={handleChange}
//           type="url"
//         />

//         {/* ✅ CLUB AUTO-FILLED */}
//         <input name="club" value={formData.club} readOnly />

//         {/* SPEAKER */}
//         <div className="speaker-section">
//           <h3>Speaker Details (Optional)</h3>

//           <input
//             name="speaker"
//             placeholder="Speaker Name"
//             onChange={handleChange}
//           />

//           <div className="social-buttons">
//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, showLinkedIn: true })}
//               className="social-btn linkedin"
//             >
//               🔗 Add LinkedIn
//             </button>

//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, showGithub: true })}
//               className="social-btn github"
//             >
//               💻 Add GitHub
//             </button>
//           </div>

//           {formData.showLinkedIn && (
//             <input
//               name="linkedin"
//               placeholder="LinkedIn URL"
//               onChange={handleChange}
//             />
//           )}

//           {formData.showGithub && (
//             <input
//               name="github"
//               placeholder="GitHub URL"
//               onChange={handleChange}
//             />
//           )}
//         </div>

//         {/* CONTACT */}
//         <input
//           type="email"
//           name="email"
//           placeholder="Contact Email"
//           onChange={handleChange}
//         />

//         {/* MULTIPLE PHONES */}
//         {formData.phones.map((phone, index) => (
//           <input
//             key={index}
//             placeholder={`Phone ${index + 1}`}
//             value={phone}
//             onChange={(e) => handlePhoneChange(index, e.target.value)}
//           />
//         ))}

//         <button type="button" onClick={addPhone}>
//           + Add Phone
//         </button>

//         {/* SUBMIT */}
//         <button type="submit" className="primary-btn">
//           Create Event
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CreateEvent;

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
    speakers: [
      {
        name: "",
        linkedin: "",
        github: "",
        showLinkedIn: false,
        showGithub: false,
      },
    ],
  });

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
    return; // disabled
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 VALIDATION
    if (!formData.email) {
      alert("Contact email is required");
      return;
    }

    const validPhones = formData.phones.filter(p => p.trim() !== "");

    if (validPhones.length === 0) {
      alert("At least one phone number is required");
      return;
    }

    const data = {
      ...formData,
      phones: validPhones // ✅ cleaned phones
    };

    // NEW: SPEAKERS SUBMISSION
    data.append("speakers", JSON.stringify(formData.speakers));

    const API = import.meta.env.VITE_API_URL;

    fetch(`${API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include"
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert("Event Created Successfully!");
          window.location.href = "/clubs"; // 🔥 redirect
        } else {
          alert(res.message || "Failed to create event");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="create-event">
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit} className="event-form">
        {/* FILE */}
        <label className="file-upload">
          <input type="file" onChange={handleFile} disabled />
          <div className="upload-content">
            <img src={uploadIcon} alt="upload" className="upload-icon" />
            <span>Add Event Brochure (Disabled)</span>
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

        {/* CLUB AUTO-FILLED */}
        <input name="club" value={formData.club} readOnly />

        {/* NEW: MULTIPLE SPEAKERS */}
        <div className="speaker-section">
          <h3>Speaker Details (Optional)</h3>

          {formData.speakers.map((speaker, index) => (
            <div key={index} className="speaker-block">
              <input
                placeholder="Speaker Name"
                value={speaker.name}
                onChange={(e) =>
                  handleSpeakerChange(index, "name", e.target.value)
                }
              />

              <div className="social-buttons">
                <button
                  type="button"
                  onClick={() =>
                    handleSpeakerChange(index, "showLinkedIn", true)
                  }
                  className="social-btn linkedin"
                >
                  🖇️Add LinkedIn
                </button>

                <button
                  type="button"
                  onClick={() => handleSpeakerChange(index, "showGithub", true)}
                  className="social-btn github"
                >
                  💻Add GitHub
                </button>
              </div>

              {speaker.showLinkedIn && (
                <input
                  placeholder="LinkedIn URL"
                  value={speaker.linkedin}
                  onChange={(e) =>
                    handleSpeakerChange(index, "linkedin", e.target.value)
                  }
                />
              )}

              {speaker.showGithub && (
                <input
                  placeholder="GitHub URL"
                  value={speaker.github}
                  onChange={(e) =>
                    handleSpeakerChange(index, "github", e.target.value)
                  }
                />
              )}

              {index !== 0 && (
                <button type="button" onClick={() => removeSpeaker(index)}>
                  - Remove Speaker
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addSpeaker}>
            + Add Speaker
          </button>
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
        <button type="submit" className="primary-btn">
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;