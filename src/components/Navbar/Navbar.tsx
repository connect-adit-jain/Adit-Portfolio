import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import profileData from '../../data/profile.json';
import './Navbar.css';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Achievements', href: '#achievements', id: 'achievements' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`editorial-nav-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#hero" className="brand-lockup" aria-label="Adit Jain Home">
          <span className="brand-name">{profileData.name}</span>
          <span className="brand-role">Software & Robotics</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions / Status */}
        <div className="nav-actions">
          <a href="#contact" className="status-indicator-badge">
            <span className="pulse-dot" aria-hidden="true"></span>
            <span className="status-text">Seeking Internship</span>
          </a>
          <a href="#contact" className="nav-contact-btn">
            Connect
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <div className="mobile-drawer-content">
          <nav aria-label="Mobile Navigation">
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="mobile-nav-link"
                    onClick={handleLinkClick}
                  >
                    <span className="mobile-link-num">{link.id}</span>
                    <span className="mobile-link-text">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobile-drawer-footer">
            <p className="mobile-contact-line">connect.aditjain@gmail.com</p>
            <p className="mobile-location">Jaipur, Rajasthan, India</p>
          </div>
        </div>
      </div>
    </header>
  );
};
