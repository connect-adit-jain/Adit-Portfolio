import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Award, Layers, ShieldAlert } from 'lucide-react';
import projectsDataRaw from '../data/projects.json';
import type { Project } from '../types';
import './ProjectDetail.css';

const projectsData = projectsDataRaw as Project[];

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projectsData.find((p) => p.slug === slug || p.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <main className="project-detail-page section-spacing" id="main-content">
        <div className="container">
          <div className="not-found-dossier">
            <h2>PROJECT NOT FOUND</h2>
            <p>The requested engineering dossier could not be located.</p>
            <Link to="/" className="back-link">
              <ArrowLeft size={16} /> Return to Portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="project-detail-page section-spacing" id="main-content">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Return to Portfolio</span>
          </Link>
          <span className="crumb-slash">/</span>
          <span className="crumb-current">{project.name}</span>
        </nav>

        {/* Header Block */}
        <header className="detail-header">
          <div className="detail-meta-top">
            <span className="detail-category">{project.category}</span>
            <div className="badge-group">
              <span className="status-pill">
                <span className="status-indicator"></span>
                {project.status}
              </span>
              {project.statusNote && (
                <span className="status-note-tag">{project.statusNote}</span>
              )}
            </div>
          </div>

          <h1 className="detail-title">{project.name}</h1>
          <p className="detail-subtitle">{project.subtitle}</p>

          <div className="detail-spec-bar">
            <div className="spec-item">
              <span className="spec-label">Team / Organization</span>
              <span className="spec-value">{project.team}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Timeline</span>
              <span className="spec-value">{project.timeline}</span>
            </div>
            {project.liveUrl && (
              <div className="spec-item">
                <span className="spec-label">Live Deployment</span>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spec-link"
                >
                  Visit Production Site
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Dossier Content Grid */}
        <div className="detail-content-grid">
          {/* Main Column */}
          <div className="detail-main-col">
            <section className="dossier-section">
              <h2 className="dossier-section-title">01. Problem Analysis</h2>
              <p className="dossier-text">{project.problem}</p>
            </section>

            <section className="dossier-section">
              <h2 className="dossier-section-title">02. Engineering Solution</h2>
              <p className="dossier-text">{project.solution}</p>
            </section>

            <section className="dossier-section">
              <h2 className="dossier-section-title">03. Personal Contribution</h2>
              <p className="dossier-text">{project.contribution}</p>
            </section>

            {project.architecture && (
              <section className="dossier-section">
                <h2 className="dossier-section-title">04. System Architecture &amp; Dataflow</h2>
                <div className="architecture-schema-box">
                  <div className="schema-header">
                    <Layers size={16} aria-hidden="true" />
                    <span>Pipeline Architecture</span>
                  </div>
                  <p className="schema-flow">{project.architecture}</p>
                </div>
              </section>
            )}

            {project.recognition && (
              <section className="dossier-section">
                <h2 className="dossier-section-title">05. Recognition &amp; Submissions</h2>
                <div className="recognition-detail-box">
                  <Award size={18} aria-hidden="true" />
                  <p>{project.recognition}</p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="detail-sidebar-col">
            <div className="sidebar-box">
              <h3 className="sidebar-box-title">Technologies &amp; Protocols</h3>
              <div className="detail-tech-stack">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="sidebar-box veracity-box">
              <div className="veracity-header">
                <ShieldAlert size={16} aria-hidden="true" />
                <span>Fact-Checking Notice</span>
              </div>
              <p>
                All specifications, architectural pipelines, and team roles documented in this dossier are directly referenced from validated resume credentials.
              </p>
            </div>

            <div className="sidebar-box cta-box">
              <h3 className="sidebar-box-title">Technical Discussion</h3>
              <p>Interested in inspecting the schematics or codebases for this project?</p>
              <a
                href={`mailto:connect.aditjain@gmail.com?subject=Inquiry%20regarding%20${encodeURIComponent(project.name)}`}
                className="sidebar-inquiry-btn"
              >
                Inquire via Email
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
