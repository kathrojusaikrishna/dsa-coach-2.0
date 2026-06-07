import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <h3>DSA Coach 2.0</h3>

      <p>Track. Retain. Improve.</p>

      <div className="footer-links">
        <a
          href="https://github.com/kathrojusaikrishna"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
        </a>

        <a
          href="https://www.linkedin.com/in/kathroju-saikrishna/"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>

        <a href="mailto:saik71460@gmail.com">
          <FaEnvelope />
        </a>
      </div>

      <p className="footer-copyright">
        Built by Sai Krishna © 2026 DSA Coach 2.0
      </p>
    </footer>
  );
}
