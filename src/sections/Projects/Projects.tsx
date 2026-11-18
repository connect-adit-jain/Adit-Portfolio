import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import projectsDataRaw from '../../data/projects.json';
import type { Project } from '../../types';
import './Projects.css';

const projectsData = projectsDataRaw as Project[];

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const categories = [
    { label: 'All Projects', value: 'ALL' },
    { label: 'Production & Client', value: 'PRODUCTION' },
    { label: 'Robotics & Hardware', value: 'ROBOTICS' },
    { label: 'AI & Systems', value: 'AI' },
    { label: 'Research & Forensics', value: 'RESEARCH' },
  ];

  const filteredProjects = projectsData.filter((project) => {
    if (filter === 'ALL') return true;
    if (filter === 'PRODUCTION') return project.status === 'PRODUCTION';
    if (filter === 'ROBOTICS')
      return (
        project.category.toLowerCase().includes('robotics') ||
        project.category.toLowerCase().includes('iot')
      );
    if (filter === 'AI')
      return (
        project.category.toLowerCase().includes('ai') ||
        project.category.toLowerCase().includes('backend')
      );
    if (filter === 'RESEARCH') return project.status === 'RESEARCH';
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PRODUCTION':
        return 'badge-production';
      case 'COMPLETED':
        return 'badge-completed';
      case 'PROTOTYPE':
        return 'badge-prototype';
      case 'RESEARCH':
        return 'badge-research';
      default:
        return 'badge-default';
    }
  };

  return (
    <section id="projects" className="section-spacing projects-section" aria-label="Projects Catalog">
      <div className="container">
        {/* Section Header */}
        <div className="section-header projects-header-row">
          <div>
            <div className="eyebrow">Technical Works</div>
            <h2 className="section-title">ENGINEERING CATALOG</h2>
            <p className="section-desc">
              Grounded solutions spanning deployed client platforms, edge robotics, and competitive hackathon systems.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="project-filter-bar" role="tablist" aria-label="Project category filter">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={filter === cat.value}
                className={`filter-btn ${filter === cat.value ? 'active' : ''}`}
                onClick={() => setFilter(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <article key={project.id} className="project-editorial-card">
              <div className="card-top-meta">
                <span className="card-index" aria-hidden="true">0{index + 1}</span>
                <div className="badge-group">
                  <span className={`status-pill ${getStatusBadgeClass(project.status)}`}>
                    <span className="status-indicator"></span>
                    {project.status}
                  </span>
                  {project.statusNote && (
                    <span className="status-note-tag">{project.statusNote}</span>
                  )}
                </div>
              </div>

              <div className="card-content">
                <span className="card-category">{project.category}</span>
                <h3 className="card-title">{project.name}</h3>
                <p className="card-subtitle">{project.subtitle}</p>

                <div className="card-problem-box">
                  <span className="box-label">Problem Addressed</span>
                  <p>{project.problem}</p>
                </div>

                <div className="card-solution-box">
                  <span className="box-label">Technical Solution</span>
                  <p>{project.solution}</p>
                </div>

                <div className="card-contribution-box">
                  <span className="box-label">My Contribution</span>
                  <p>{project.contribution}</p>
                </div>

                {project.recognition && (
                  <div className="card-recognition-box">
                    <span className="box-label">Recognition &amp; Submissions</span>
                    <p>{project.recognition}</p>
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="card-footer">
                <div className="card-tech-wrap">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="card-action-wrap">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-external-link"
                      aria-label={`Visit live site for ${project.name}`}
                    >
                      <span>Live Site</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                  <a
                    href={`#/work/${project.slug}`}
                    className="card-detail-link"
                    aria-label={`Read technical dossier for ${project.name}`}
                  >
                    <span>Dossier</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
