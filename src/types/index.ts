export interface Project {
  name: string;
  description: string;
  techUsed: string[];
  image: string;
  link: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  image: string;
}

export interface SkillCategory {
  [category: string]: string[];
}

export interface ContactLink {
  email: string;
  github: string;
  linkedin: string;
}