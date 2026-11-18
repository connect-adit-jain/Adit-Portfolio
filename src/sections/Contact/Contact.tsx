import React, { useState } from 'react';
import { Mail, Copy, Check, ArrowUpRight, Compass } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/Icons';
import profileData from '../../data/profile.json';
import './Contact.css';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(profileData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="section-spacing contact-section" aria-label="Contact Adit Jain">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">Direct Inquiries</div>
          <h2 className="section-title">COMMENCE DIALOGUE</h2>
          <p className="section-desc">
            Seeking software engineering, backend AI, and robotics internship opportunities.
          </p>
        </div>

        <div className="contact-editorial-layout">
          {/* Main Action Block */}
          <div className="contact-main-block">
            <span className="contact-channel-eyebrow">Verified Direct Communication</span>
            <div className="contact-email-row">
              <a
                href={`mailto:${profileData.email}`}
                className="contact-big-email"
                aria-label={`Send email to ${profileData.email}`}
              >
                {profileData.email}
              </a>
              <button
                type="button"
                className="copy-btn"
                onClick={copyEmail}
                aria-label={copied ? 'Email address copied' : 'Copy email address'}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="contact-lead-text">
              Available for technical interviews and engineering internship roles. Focused on full-stack web architectures, applied GenAI systems, and edge robotics firmware.
            </p>

            <div className="contact-cta-bar">
              <a
                href={`mailto:${profileData.email}?subject=Internship%20Inquiry%20-%20Adit%20Jain`}
                className="contact-mail-btn"
              >
                <Mail size={16} aria-hidden="true" />
                <span>Compose Mail</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <span className="contact-response-note">Typical response within 24 hours</span>
            </div>
          </div>

          {/* Sidebar Channels */}
          <div className="contact-channels-sidebar">
            <div className="channel-box">
              <span className="channel-box-title">Network Profiles</span>
              <ul className="channel-list">
                <li>
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-link"
                  >
                    <div className="channel-link-left">
                      <GithubIcon size={18} />
                      <div>
                        <strong>GitHub</strong>
                        <span>connect-adit-jain</span>
                      </div>
                    </div>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>

                <li>
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-link"
                  >
                    <div className="channel-link-left">
                      <LinkedinIcon size={18} />
                      <div>
                        <strong>LinkedIn</strong>
                        <span>adit-jain-177380370</span>
                      </div>
                    </div>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="channel-box location-box">
              <span className="channel-box-title">Geographic Availability</span>
              <div className="location-detail">
                <Compass size={18} aria-hidden="true" />
                <div>
                  <strong>{profileData.location}</strong>
                  <p>Open to on-site roles in Jaipur/Delhi-NCR and global remote internships.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
