/**
 * TypeScript Interfaces for Adit Jain Portfolio Architecture
 * Strictly grounded in verified resume & project-notes credentials
 */

export interface StatItem {
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  role: string;
  shortRole: string;
  institution: string;
  degree: string;
  cgpa: string;
  classXII: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  studioUrl: string;
  statusNotice: string;
  headline: string;
  heroDescription: string;
  aboutText: string[];
  stats: StatItem[];
}

export type ProjectStatus =
  | 'PRODUCTION'
  | 'COMPLETED'
  | 'PROTOTYPE'
  | 'RESEARCH'
  | 'STATUS NEEDS CONFIRMATION';

export interface Project {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  status: ProjectStatus;
  statusNote: string;
  featured: boolean;
  team: string;
  timeline: string;
  problem: string;
  solution: string;
  contribution: string;
  technologies: string[];
  recognition?: string;
  architecture?: string;
  liveUrl?: string;
  repositoryUrl?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  timeline: string;
  type: string;
  status: string;
  summary: string;
  deliverables: string[];
  skills: string[];
  link?: string | null;
}

export interface AchievementItem {
  id: string;
  title: string;
  competition: string;
  organization: string;
  year: string;
  role: string;
  award: string;
  description: string;
}
