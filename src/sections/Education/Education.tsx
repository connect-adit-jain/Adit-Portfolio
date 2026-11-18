import React from 'react';
import { MapPin } from 'lucide-react';
import profileData from '../../data/profile.json';
import './Education.css';

export const Education: React.FC = () => {
  return (
    <section id="education" className="section-spacing education-section" aria-label="Academic Qualifications">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">Academic Background</div>
          <h2 className="section-title">EDUCATION &amp; PERFORMANCE</h2>
          <p className="section-desc">
            Formal engineering foundations and consistent academic achievement.
          </p>
        </div>

        {/* Education Grid */}
        <div className="education-grid">
          {/* Degree 1: B.Tech Software Engineering */}
          <div className="education-card current-study">
            <div className="edu-top">
              <span className="edu-status-pill">Current Degree</span>
              <span className="edu-time">2nd Year / 3rd Semester</span>
            </div>

            <h3 className="edu-degree">B.Tech, Software Engineering</h3>
            <h4 className="edu-institution">{profileData.institution}</h4>

            <div className="edu-location">
              <MapPin size={14} aria-hidden="true" />
              <span>Jaipur, Rajasthan, India</span>
            </div>

            <div className="edu-metric-box">
              <div className="metric-item">
                <span className="metric-label">Current Academic Standing</span>
                <span className="metric-val">{profileData.cgpa} CGPA</span>
              </div>
              <p className="metric-note">
                Focus on algorithms, distributed data systems, AI engineering, and embedded firmware.
              </p>
            </div>
          </div>

          {/* Degree 2: Senior Secondary */}
          <div className="education-card">
            <div className="edu-top">
              <span className="edu-status-pill completed">Completed</span>
              <span className="edu-time">Senior Secondary</span>
            </div>

            <h3 className="edu-degree">Senior Secondary (Class XII)</h3>
            <h4 className="edu-institution">Science &amp; Mathematics Foundation</h4>

            <div className="edu-metric-box">
              <div className="metric-item">
                <span className="metric-label">Board Examination Score</span>
                <span className="metric-val">{profileData.classXII}</span>
              </div>
              <p className="metric-note">
                Core foundation in mathematics, physics, and computational thinking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
