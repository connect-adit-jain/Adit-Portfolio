import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './Recognition.css';

export const Recognition: React.FC = () => {
  const accolades = [
    { title: '1st Place Winner', event: 'SKIT IEEE 26 Hackathon', detail: '₹35,000 First Prize' },
    { title: 'Startup Grantee', event: 'VGU Startup Funding', detail: '₹20,000 Awarded (Team Leader)' },
    { title: 'Best Oral Presentation', event: 'Shodh Prayas TDP Conclave', detail: '1st Place (Team Leader)' },
    { title: 'National Finalist', event: 'Makers Conclave Physical AI', detail: '14th Place (Team RoboLyte)' },
    { title: 'Accelerator Finalist', event: 'BRAVE Entrepreneurship', detail: 'NIAT Hyderabad (Team Leader)' },
    { title: 'National Challenge Submissions', event: 'Smart India Hackathon 2026', detail: 'SIH26039 & SIH26183' },
  ];

  return (
    <section id="recognition" className="recognition-strip" aria-label="Verified Accolades">
      <div className="container">
        <div className="recognition-header">
          <div className="recognition-eyebrow">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Verified Track Record</span>
          </div>
          <span className="recognition-note">100% Verified Hackathons &amp; Institutional Grants</span>
        </div>

        <div className="recognition-grid">
          {accolades.map((item, index) => (
            <div key={index} className="recognition-item">
              <div className="recognition-badge">
                <span className="rec-index" aria-hidden="true">0{index + 1}</span>
                <span className="rec-title">{item.title}</span>
              </div>
              <h3 className="rec-event">{item.event}</h3>
              <p className="rec-detail">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
