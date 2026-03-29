/**
 * Core TypeScript interfaces for ML Engineer Portfolio
 */

export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  caption?: string;
}

export interface DetailedDescription {
  overview: string;
  coreConcept: string;
  technicalApproach: string;
  prototype: string;
  learningOutcomes: string;
  problem?: string;
  solution?: string;
  architecture?: string;
}

export interface FlowImage {
  src: string;
  alt: string;
  caption: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  coverImage: string;
  images: ProjectImage[];
  description: string;
  technologies?: string[];
  slug: string;
  detailedDescription?: DetailedDescription;
  flowImages?: FlowImage[];
  liveUrl?: string;
  client?: string;
  camera?: string;
  location?: string;
  fullTitle?: string;
  rank?: string;
  difficulty?: string;
}

export interface EngineerInfo {
  name: string;
  tagline: string;
  headline: string;
  heroIntroduction: string;
  biography: string;
  status: string;
  location: string;
  email: string;
  availability: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
  };
}

export type PhotographerInfo = EngineerInfo;

export interface ContactSubmission {
  name: string;
  email: string;
  inquiryType: 'freelance' | 'fulltime' | 'collaboration' | 'other';
  message: string;
  timestamp: Date;
}

export interface TechCategory {
  name: string;
  items: string[];
}
