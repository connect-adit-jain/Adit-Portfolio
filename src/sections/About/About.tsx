import React from 'react';
import { BookOpen, Code2, Bot, Rocket, ShieldCheck } from 'lucide-react';
import './About.css';

export const About: React.FC = () => {
  return (
    <section id="about" className="section-spacing about-section" aria-label="About Adit Jain">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">Background &amp; Philosophy</div>
          <h2 className="section-title">ENGINEERING WITH EMPIRICAL RIGOR</h2>
          <p className="section-desc">
            Combining academic software engineering depth with practical edge robotics and commercial production deployment.
          </p>
        </div>

        {/* Asymmetric Story Grid */}
        <div className="about-editorial-grid">
          {/* Main Story Narrative */}
          <div className="about-narrative-col">
            <p className="narrative-lead">
              I am a second-year Software Engineering student at{' '}
              <strong>NIAT Jaipur — Vivekananda Global University</strong>, maintaining an{' '}
              <strong>8.65 CGPA</strong> in my third semester following an <strong>86.6%</strong> Class XII performance.
            </p>

            <div className="narrative-body">
              <p>
                My work is driven by building real, testable systems rather than conceptual mockups. Through{' '}
                <strong>Maggieaurcode</strong>, a web development studio I co-founded, I deliver live production websites
                for commercial businesses, integrating custom Gemini-powered AI advisors and performant architectures.
              </p>
              <p>
                In robotics, I lead <strong>Team RoboLyte</strong>, designing subterranean inspection rovers like{' '}
                <strong>MinerBot / PipeGuard</strong> that combine thermal vision, multi-gas telemetry, and dual-microcontroller
                architectures for dangerous underground environments.
              </p>
              <p>
                Whether building high-throughput billing engines during my <strong>FlyRank AI Internship</strong> or competing
                in national hackathons like <strong>SKIT IEEE 26 (1st Place, ₹35,000)</strong>, every claim here is grounded
                in tangible code and verified results.
              </p>
            </div>

            <div className="academic-snapshot-bar">
              <div className="snapshot-item">
                <BookOpen size={18} aria-hidden="true" />
                <div>
                  <span className="snapshot-title">B.Tech Software Engineering</span>
                  <span className="snapshot-sub">NIAT Jaipur — 3rd Semester</span>
                </div>
              </div>
              <div className="snapshot-item">
                <ShieldCheck size={18} aria-hidden="true" />
                <div>
                  <span className="snapshot-title">Academic Standing</span>
                  <span className="snapshot-sub">CGPA: 8.65 | XII: 86.6%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Three Engineering Strands */}
          <div className="about-strands-col">
            <div className="strand-card">
              <div className="strand-header">
                <Code2 size={20} aria-hidden="true" />
                <span className="strand-index">Strand 01</span>
              </div>
              <h3 className="strand-title">Full-Stack &amp; Applied AI</h3>
              <p className="strand-text">
                Developing live production web platforms with React and Python backends. Integrating Google Gemini API for intelligent recommendation systems such as the AI Stone Advisor at K.V Stone.
              </p>
              <span className="strand-tag">Production Deployed</span>
            </div>

            <div className="strand-card">
              <div className="strand-header">
                <Bot size={20} aria-hidden="true" />
                <span className="strand-index">Strand 02</span>
              </div>
              <h3 className="strand-title">Edge Robotics &amp; Sensors</h3>
              <p className="strand-text">
                Prototyping physical inspection rovers using Raspberry Pi Zero 2W, Arduino Uno, thermal matrices (MLX90640), and multi-threaded Flask live telemetry dashboards for hazardous spaces.
              </p>
              <span className="strand-tag">Hardware &amp; Firmware</span>
            </div>

            <div className="strand-card">
              <div className="strand-header">
                <Rocket size={20} aria-hidden="true" />
                <span className="strand-index">Strand 03</span>
              </div>
              <h3 className="strand-title">Entrepreneurship &amp; Grants</h3>
              <p className="strand-text">
                Co-founder of a revenue-generating web studio. Recipient of ₹20,000 VGU startup funding as team leader and finalist in the BRAVE entrepreneurship accelerator at NIAT Hyderabad.
              </p>
              <span className="strand-tag">Venture &amp; Leadership</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
