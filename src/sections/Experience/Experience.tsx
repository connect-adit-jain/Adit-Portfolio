import React from 'react';
import { Calendar, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';
import experienceData from '../../data/experience.json';
import './Experience.css';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="section-spacing experience-section" aria-label="Work Experience">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">Professional History</div>
          <h2 className="section-title">EXPERIENCE &amp; INTERNSHIPS</h2>
          <p className="section-desc">
            Direct commercial client web delivery and intensive backend AI engineering internships.
          </p>
        </div>

        {/* Experience Ledger Timeline */}
        <div className="experience-ledger">
          {experienceData.map((exp, index) => (
            <div key={exp.id} className="experience-item">
              <div className="exp-meta-col">
                <span className="exp-index">0{index + 1}</span>
                <span className="exp-type">{exp.type}</span>
                <div className="exp-time-location">
                  <span className="exp-time">
                    <Calendar size={13} aria-hidden="true" />
                    {exp.timeline}
                  </span>
                  <span className="exp-location">
                    <MapPin size={13} aria-hidden="true" />
                    {exp.location}
                  </span>
                </div>
                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="exp-portfolio-link"
                    aria-label={`Visit ${exp.organization} studio site`}
                  >
                    <span>Live Studio</span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                )}
              </div>

              <div className="exp-content-col">
                <div className="exp-header-row">
                  <div>
                    <h3 className="exp-role">{exp.role}</h3>
                    <h4 className="exp-org">{exp.organization}</h4>
                  </div>
                  <span className="exp-status-pill">{exp.status}</span>
                </div>

                <p className="exp-summary">{exp.summary}</p>

                <div className="exp-deliverables-box">
                  <span className="deliverables-title">Verified Deliverables</span>
                  <ul className="deliverables-list">
                    {exp.deliverables.map((item, i) => (
                      <li key={i}>
                        <CheckCircle2 size={15} className="deliverable-icon" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="exp-skills-row">
                  {exp.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="exp-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
