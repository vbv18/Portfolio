export interface NavLink {
  label: string;
  href: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  eyebrow: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  tech: string[];
  overview: string;
  highlights: string[];
  impact: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  org: string;
  location: string;
  period: string;
  points: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institute: string;
  score: string;
  period: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  href?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  detail?: string;
  href?: string;
}

export interface AboutCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}
