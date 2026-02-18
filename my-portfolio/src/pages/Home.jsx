import "./Home.css";

export default function Home() {
  const resumePath = "/resume/Fuel-Anthony-BSSE.pdf";

  return (
    <div className="home-container">

      {/* Profile Picture */}
      <div className="profile-section">
        <div className="profile-picture"></div>
        <p className="profile-label">Profile Picture Placeholder</p>
      </div>

      {/* About Me Box */}
      <div className="about-box">
        <h2 className="about-title">Anthony Fuel Ramos</h2>
        <p className="about-text">Short summary about background</p>
        <p className="about-text">Short summary about profession</p>
        <p className="about-text">Career goal</p>
      </div>

      {/* Resume + Projects Buttons */}
      <div className="home-actions">
        <a href="/projects" className="home-primary-button">
          View Projects
        </a>

        <a href={resumePath} download className="home-secondary-button">
          Download Resume
        </a>
      </div>
    </div>
  );
}