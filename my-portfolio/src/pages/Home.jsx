import "./Home.css";
import profilePic from "../assets/profile.jpg";

export default function Home() {
  const resumePath = "/resume/Fuel-Anthony-BSSE.pdf";

  return (
    <div className="home-container">

      {/* Profile Picture */}
      <div className="profile-section">
        <img src={profilePic} alt="Profile" className="profile-picture" />
      </div>

      {/* About Me Box */}
      <div className="about-box">
        <h2 className="about-title">Anthony Fuel Ramos</h2>

        <p className="about-text">
          Graduated summa cum laude (GPA 3.97), passionate about building user‑focused software that blends intuitive design with reliable functionality.
          As a U.S. Marine Corps veteran, I bring a disciplined, mission‑driven mindset along with strong problem‑solving, teamwork, and technical skills
          to deliver impactful and innovative solutions.
        </p>
      </div>

      {/* Two Column Section */}
      <div className="two-column-section">

        {/* Career Goal Box */}
        <div className="about-box left-box">
          <h2 className="about-title">Career Goal</h2>

          <p className="about-text">
            With growing experience in software engineering, I’m looking to further develop my expertise by applying strong problem‑solving abilities and a
            solid foundation in building reliable, high‑performance applications. I’m committed to advancing technologies that create meaningful impact for
            end users and stakeholders, including leveraging AI‑driven solutions to enhance user experiences, improve efficiency, and support long‑term
            organizational success.
          </p>
        </div>

        {/* Professional Experience Box */}
        <div className="about-box right-box">
          <h2 className="about-title">Professional Experience</h2>

          <div className="experience-section">

            <h3 className="experience-role">Software Developer</h3>
            <p className="experience-dates">May 2025 – Oct 2025</p>
            <p className="about-text">
              Developed an all‑in‑one football statistics platform for the Melbourne Club football team, integrating multiple sports data APIs to deliver
              real‑time player performance analytics. Designed algorithms that improved statistical accuracy by over 50%, enabling more precise insights
              and supporting predictive game analysis to enhance coaching strategy and player evaluation.
            </p>

            <h3 className="experience-role">Digital Sales Engineer — CordaRoy’s</h3>
            <p className="experience-dates">Feb 2022 – Mar 2024</p>
            <p className="about-text">
              Designed and launched a new online sales channel, integrating marketing tools and analytics to increase engagement and boost add‑on sales.
              Developed features to enhance the user experience and collaborated with cross‑functional teams to align technical solutions with business
              goals. Monitored performance metrics and implemented data‑driven improvements to maximize efficiency and drive growth.
            </p>

          </div>
        </div>

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