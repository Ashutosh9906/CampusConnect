function StudentDetailsForm() {
  return (
    <div className="auth-container">
      <h2>Student Details</h2>

      <input type="text" placeholder="Student Name" />
      <input type="text" placeholder="Roll Number" />
      <input type="text" placeholder="PRN Number" />
      <input type="text" placeholder="Division" />

      <button>Complete Registration</button>
    </div>
  );
}

export default StudentDetailsForm;
