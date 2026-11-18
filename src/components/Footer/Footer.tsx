import React from 'react';
import { ArrowUp, Mail, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../Icons';
import profileData from '../../data/profile.json';
import './Footer.css';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="editorial-footer" role="contentinfo">
      <div className="container">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <span className="footer-monogram">AJ</span>
            <h3 className="footer-name">{profileData.name}</h3>
            <p className="footer-tagline">
              Software Engineering Student, Full-Stack &amp; AI Developer, and Robotics Enthusiast based in Jaipur, Rajasthan.
            </p>
            <div className="footer-status-pill">
              <span className="footer-status-dot"></span>
              <span>NIAT Jaipur — Vivekananda Global University</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-nav-list">
              <li><a href="#projects">Projects Catalog</a></li>
              <li><a href="#about">Academic &amp; Technical Story</a></li>
              <li><a href="#experience">Work &amp; Internships</a></li>
              <li><a href="#skills">Technical Proficiencies</a></li>
              <li><a href="#achievements">Verified Achievements</a></li>
              <li><a href="#education">Academics &amp; CGPA</a></li>
              <li><a href="#contact">Contact &amp; Inquiries</a></li>
            </ul>
          </div>

          <div className="footer-social-col">
            <h4 className="footer-col-title">Direct Channels</h4>
            <ul className="footer-social-list">
              <li>
                <a
                  href={`mailto:${profileData.email}`}
                  className="footer-social-link"
                  aria-label="Send direct email"
                >
                  <Mail size={16} aria-hidden="true" />
                  <span>{profileData.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Adit Jain GitHub Profile"
                >
                  <GithubIcon size={16} />
                  <span>github.com/connect-adit-jain</span>
                  <ExternalLink size={12} className="external-hint" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Adit Jain LinkedIn Profile"
                >
                  <LinkedinIcon size={16} />
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={12} className="external-hint" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={profileData.studioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Maggieaurcode Live Studio"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  <span>Maggieaurcode Studio Portfolio</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-meta">
            <p className="copyright">
              © {new Date().getFullYear()} {profileData.name}. Designed &amp; engineered with Charcoal (#1E1E1C) &amp; Sand (#D8CBB3).
            </p>
            <p className="veracity-notice">
              Strictly verified facts from resume and validated materials.
            </p>
          </div>

          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
          >
            <span>Top</span>
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
