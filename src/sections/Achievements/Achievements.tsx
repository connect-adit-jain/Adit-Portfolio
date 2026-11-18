import React from 'react';
import { Users } from 'lucide-react';
import achievementsData from '../../data/achievements.json';
import './Achievements.css';

export const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="section-spacing achievements-section" aria-label="Achievements and Accolades">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">Awards &amp; Competitions</div>
          <h2 className="section-title">VERIFIED HONORS &amp; FUNDING</h2>
          <p className="section-desc">
            Competitive hackathon victories, institutional venture grants, and national challenge entries.
          </p>
        </div>

        {/* Achievements Ledger */}
        <div className="achievements-ledger">
          {achievementsData.map((item, index) => (
            <div key={item.id} className="achievement-row">
              <div className="ach-index-col">
                <span className="ach-num">0{index + 1}</span>
                <span className="ach-year">{item.year}</span>
              </div>

              <div className="ach-main-col">
                <div className="ach-header">
                  <h3 className="ach-title">{item.title}</h3>
                  <span className="ach-award-badge">{item.award}</span>
                </div>
                <h4 className="ach-competition">{item.competition}</h4>
                <p className="ach-org">{item.organization}</p>
                <p className="ach-desc">{item.description}</p>
              </div>

              <div className="ach-role-col">
                <div className="ach-role-badge">
                  <Users size={14} aria-hidden="true" />
                  <span>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
