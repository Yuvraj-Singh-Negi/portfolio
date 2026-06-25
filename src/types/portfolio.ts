export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  repoUrl?: string;
  featured: boolean;
  category: string;
  year: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface Education {
  school: string;
  location: string;
  qualification: string;
  year: string;
  description?: string;
}

export interface AcademicHighlight {
  title: string;
  description: string;
  category: string;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "design";
}

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  type: "education" | "achievement" | "journey";
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail";
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
}
