import "./Footer.css";

const Footer = () => {
  const resumePath = "/resume/Fuel-Anthony-BSSE.pdf";

  return (
    <footer className="footer">
      <span className="footer-name">
        © {new Date().getFullYear()} Anthony Fuel Ramos
      </span>

      <div className="footer-links">
        <a
          href="https://github.com/ClickClackBang"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/anthony-fuel/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          LinkedIn
        </a>

        <a href="mailto:afuelramos@gmail.com" className="footer-link">
          Email
        </a>

        <a href={resumePath} download className="footer-link">
          Resume
        </a>
      </div>
    </footer>
  );
};

export default Footer;