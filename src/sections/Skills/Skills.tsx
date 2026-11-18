import React from 'react';
import { Terminal, Cpu, Database, Sparkles, Wrench } from 'lucide-react';
import './Skills.css';

export const Skills: React.FC = () => {
  const skillCategories = [
    {
      category: 'Languages',
      icon: <Terminal size={18} aria-hidden="true" />,
      description: 'Core syntax and object-oriented foundations.',
      skills: ['Python', 'C++', 'JavaScript', 'HTML5', 'CSS'],
    },
    {
      category: 'Frameworks & Libraries',
      icon: <Cpu size={18} aria-hidden="true" />,
      description: 'Component architecture and backend service frameworks.',
      skills: ['React.js', 'FastAPI', 'Flask', 'Node.js'],
    },
    {
      category: 'Backend & Databases',
      icon: <Database size={18} aria-hidden="true" />,
      description: 'Relational persistence, auth flows, and payment API pipelines.',
      skills: [
        'REST APIs',
        'Authentication & Tokens',
        'PostgreSQL',
        'SQLite',
        'DBMS',
        'Stripe API (Test Mode)',
      ],
    },
    {
      category: 'AI / ML & LLMs',
      icon: <Sparkles size={18} aria-hidden="true" />,
      description: 'Generative AI integration and semantic ranking heuristics.',
      skills: [
        'Generative AI (GenAI)',
        'Large Language Models (LLM)',
        'Gemini API Integration',
        'Prompt Engineering',
        'Semantic-Similarity Ranking',
      ],
    },
    {
      category: 'Hardware & Edge Systems',
      icon: <Wrench size={18} aria-hidden="true" />,
      description: 'Microcontroller sensor interfacing and edge telemetry.',
      skills: [
        'Raspberry Pi Zero 2W',
        'Arduino Uno',
        'ESP32',
        'Thermal Matrix (MLX90640)',
        'Gas & Ultrasonic Sensors',
        'SSR Relays',
      ],
    },
    {
      category: 'Developer Tools & Platforms',
      icon: <Terminal size={18} aria-hidden="true" />,
      description: 'Version control, deployment pipelines, and AI accelerated workflows.',
      skills: [
        'Git & GitHub',
        'Vercel Deployment',
        'Netlify',
        'Bolt.new',
        'v0',
        'Lovable',
      ],
    },
  ];

  return (
    <section id="skills" className="section-spacing skills-section" aria-label="Technical Skills">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">Technical Proficiencies</div>
          <h2 className="section-title">VERIFIED TECHNICAL STACK</h2>
          <p className="section-desc">
            Directly referenced from completed academic coursework, engineering projects, and client deployments.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skillCategories.map((cat, index) => (
            <div key={index} className="skill-cat-card">
              <div className="skill-cat-header">
                <div className="skill-cat-title-wrap">
                  {cat.icon}
                  <h3 className="skill-cat-name">{cat.category}</h3>
                </div>
                <span className="skill-cat-count" aria-hidden="true">0{index + 1}</span>
              </div>

              <p className="skill-cat-desc">{cat.description}</p>

              <div className="skill-pill-wrap">
                {cat.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
