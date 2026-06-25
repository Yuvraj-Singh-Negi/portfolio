import type { PersonalInfo, Education, AcademicHighlight, Project, Skill, TimelineItem, NavLink } from "@/types/portfolio";

export const personalInfo: PersonalInfo = {
  name: "Yuvraj Singh Negi",
  title: "Full-Stack Developer",
  email: "yuvrajsinghnegi001@gmail.com",
  phone: "+91 70889 32008",
  location: "Uttarakhand, India",
  linkedin: "Yuvraj Singh Negi",
  github: "https://github.com/yuvraj001q",
};

export const education: Education = {
  school: "Nirmala Convent Senior Secondary School",
  location: "Kathgodam",
  qualification: "Intermediate",
  year: "2026",
};

export const academicHighlight: AcademicHighlight = {
  title: "Physics Investigatory Project",
  description:
    "Experimental application of Coulomb's Law using induced charge measurements to validate electrostatic force principles through controlled laboratory apparatus.",
};

export const navLinks: NavLink[] = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const skills: Skill[] = [
  { name: "HTML", category: "frontend" },
  { name: "CSS", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "GitHub", category: "tools" },
  { name: "Vercel", category: "tools" },
  { name: "Railway", category: "tools" },
  { name: "Netlify", category: "tools" },
  { name: "UI/UX Design", category: "design" },
];

export const projects: Project[] = [
  {
    id: "matrix-dopers",
    title: "Matrix Dopers",
    description:
      "An interactive platform exploring matrix simulations with real-time data visualization and dynamic UI components built for educational engagement.",
    image: "/projects/matrix-dopers.jpg",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://matrix-dopers.vercel.app/",
    featured: true,
    category: "Interactive",
  },
  {
    id: "mayo-clinic",
    title: "Mayo Clinic Healthcare Platform",
    description:
      "A comprehensive healthcare management platform featuring patient dashboards, appointment scheduling, and medical record visualization tools.",
    image: "/projects/mayo-clinic.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    liveUrl: "https://mayo-clinic-healthcare-production.up.railway.app/",
    featured: true,
    category: "Healthcare",
  },
  {
    id: "kimberley-store",
    title: "Kimberley General Store",
    description:
      "Full-featured e-commerce platform for a general retail store with product catalog, cart management, and secure checkout flow.",
    image: "/projects/kimberley-store.jpg",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://kimberley-general-store.up.railway.app/",
    featured: true,
    category: "E-Commerce",
  },
  {
    id: "hidden-leaf-cafe",
    title: "Hidden Leaf Cafe",
    description:
      "A visually crafted cafe website with immersive menu displays, atmosphere galleries, and location-based service information.",
    image: "/projects/hidden-leaf-cafe.jpg",
    technologies: ["React", "CSS", "JavaScript"],
    liveUrl: "https://thahiddenleafcafe.netlify.app/",
    featured: false,
    category: "Restaurant",
  },
  {
    id: "blus-cafe",
    title: "The Blu's Cafe",
    description:
      "Modern cafe brand site featuring a curated menu presentation, ambiance storytelling, and responsive design for mobile-first customers.",
    image: "/projects/blus-cafe.jpg",
    technologies: ["React", "CSS", "JavaScript", "Netlify"],
    liveUrl: "https://thebluscafe.netlify.app/",
    featured: false,
    category: "Restaurant",
  },
  {
    id: "cafe-co",
    title: "Cafe Co. Bakes & Beans",
    description:
      "Artisan bakery and coffee shop website showcasing fresh daily offerings, seasonal menus, and an inviting brand narrative.",
    image: "/projects/cafe-co.jpg",
    technologies: ["React", "CSS", "JavaScript", "Netlify"],
    liveUrl: "https://cafecobakenbeans.netlify.app/",
    featured: false,
    category: "Restaurant",
  },
  {
    id: "onyx-coffee",
    title: "Onyx Coffee Lab",
    description:
      "Premium coffee brand platform with product catalog, brewing guides, and a refined visual identity reflecting specialty coffee culture.",
    image: "/projects/onyx-coffee.jpg",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://onyxcoffeelab.netlify.app/",
    featured: false,
    category: "Brand",
  },
  {
    id: "golds-gym",
    title: "Gold's Gym Venice",
    description:
      "Iconic fitness brand website reimagined with modern UI patterns, class schedules, membership flows, and trainer profiles.",
    image: "/projects/golds-gym.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://golds-gym-venice.vercel.app/",
    featured: true,
    category: "Fitness",
  },
  {
    id: "level-up",
    title: "Level Up",
    description:
      "A gamified skill development platform tracking progress, achievements, and learning pathways through interactive challenges.",
    image: "/projects/level-up.jpg",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://level-up-theta-tawny.vercel.app/",
    featured: false,
    category: "Education",
  },
  {
    id: "codelingo",
    title: "CodeLingo",
    description:
      "Language learning platform tailored for programmers, featuring syntax-driven lessons, code challenges, and progress analytics.",
    image: "/projects/codelingo.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://codelingo-alpha.vercel.app/",
    featured: false,
    category: "Education",
  },
  {
    id: "funngrow",
    title: "FunnGrow",
    description:
      "An educational entertainment platform for children combining interactive games with growth-focused learning modules.",
    image: "/projects/funngrow.jpg",
    technologies: ["React", "CSS", "JavaScript", "Netlify"],
    liveUrl: "https://funngrowapp.netlify.app/",
    featured: false,
    category: "Education",
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "education-1",
    title: "Nirmala Convent Senior Secondary School",
    subtitle: "Intermediate (Science)",
    date: "2026",
    description:
      "Pursuing higher secondary education with a focus on Physics, Chemistry, and Mathematics, building a strong analytical foundation for software engineering.",
    type: "education",
  },
  {
    id: "achievement-1",
    title: "Physics Investigatory Project",
    subtitle: "Coulomb's Law Experimental Study",
    date: "2025",
    description:
      "Designed and executed a controlled experiment validating Coulomb's Law through induced charge measurements, demonstrating rigorous scientific methodology.",
    type: "achievement",
  },
  {
    id: "journey-1",
    title: "Self-Driven Development Journey",
    subtitle: "React, Next.js, TypeScript",
    date: "2024 — Present",
    description:
      "Independently mastered modern web development through building 11+ production-grade applications using React, Next.js, TypeScript, and modern deployment platforms including Vercel, Railway, and Netlify.",
    type: "journey",
  },
];

export const siteConfig = {
  title: "Yuvraj Singh Negi — Full-Stack Developer",
  description:
    "Frontend engineer and product designer building modern web experiences with React, Next.js, and TypeScript. Based in Uttarakhand, India.",
  url: "https://yuvrajsinghnegi.dev",
  ogImage: "/og.jpg",
  keywords: [
    "Yuvraj Singh Negi",
    "Full-Stack Developer",
    "Frontend Engineer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Uttarakhand",
    "India",
    "Web Developer",
    "Portfolio",
  ],
};
