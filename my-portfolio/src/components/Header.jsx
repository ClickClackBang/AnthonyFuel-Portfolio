import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const resumePath = "/resume/Fuel-Anthony-BSSE.pdf";

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">
          Anthony Fuel Ramos
        </Link>
      </div>

      <nav className="header-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link-active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link-active" : "nav-link"
          }
        >
          Projects
        </NavLink>

        <a
          href="https://github.com/ClickClackBang"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/anthony-fuel/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          LinkedIn
        </a>

        <a href="mailto:afuelramos@gmail.com" className="nav-link">
          Email
        </a>
      </nav>

      <div className="header-right">
        <a href={resumePath} download className="resume-button">
          Download Resume
        </a>
      </div>
    </header>
  );
};

export default Header;