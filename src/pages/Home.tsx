import React, { useState, useEffect } from 'react';
import { Hero } from '../sections/Hero/Hero';
import { Recognition } from '../sections/Recognition/Recognition';
import { Projects } from '../sections/Projects/Projects';
import { About } from '../sections/About/About';
import { Experience } from '../sections/Experience/Experience';
import { Skills } from '../sections/Skills/Skills';
import { Achievements } from '../sections/Achievements/Achievements';
import { Education } from '../sections/Education/Education';
import { Contact } from '../sections/Contact/Contact';
import './Home.css';

export const Home: React.FC = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    // Listen for preloader completion event
    const handlePreloaderDone = () => setPreloaderDone(true);
    window.addEventListener('preloader-complete', handlePreloaderDone);
    return () => window.removeEventListener('preloader-complete', handlePreloaderDone);
  }, []);

  return (
    <main id="main-content" className="home-page" tabIndex={-1}>
      <Hero portraitSettled={preloaderDone} />
      <Recognition />
      <Projects />
      <About />
      <Experience />
      <Skills />
      <Achievements />
      <Education />
      <Contact />
    </main>
  );
};
