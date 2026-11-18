import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './NotFound.css';

export const NotFound: React.FC = () => {
  return (
    <main className="not-found-page section-spacing" id="main-content">
      <div className="container">
        <div className="not-found-card">
          <span className="not-found-code">404</span>
          <h1 className="not-found-title">DOSSIER NOT LOCATED</h1>
          <p className="not-found-text">
            The requested resource or page route does not exist within this engineering portfolio.
          </p>
          <Link to="/" className="not-found-home-btn">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Return to Portfolio Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
};
