import type { GenerationTemplate } from "@/providers/types";

export interface ProjectTemplate {
  id: GenerationTemplate;
  name: string;
  description: string;
  systemPrompt: string;
  starterFiles: Record<string, string>;
}

const basePrompt = `You are an expert software engineer. Generate complete, production-ready code files.
All files must be valid, compilable, and follow best practices.
Return ONLY valid JSON in the following format, with no markdown formatting:
{ "files": [{ "path": "relative/file/path", "content": "file content here" }] }`;

export const TEMPLATES: Record<GenerationTemplate, ProjectTemplate> = {
  "nextjs": {
    id: "nextjs",
    name: "Next.js App",
    description: "Full Next.js 15+ project with App Router and TypeScript",
    systemPrompt: `${basePrompt}

Generate a Next.js 15+ project with:
- App Router with TypeScript strict mode
- Tailwind CSS for styling
- src/ directory structure
- Root layout with metadata
- At least 3 pages (home, about, contact)
- A shared components directory
- Proper SEO with metadata exports
- Responsive design`,
    starterFiles: {
      "package.json": JSON.stringify({
        name: "nextjs-app",
        private: true,
        scripts: { dev: "next dev", build: "next build", start: "next start" },
        dependencies: { next: "^15.0.0", react: "^19.0.0", "react-dom": "^19.0.0" },
        devDependencies: { typescript: "^5.0.0", tailwindcss: "^4.0.0" },
      }, null, 2),
    },
  },
  "react-vite": {
    id: "react-vite",
    name: "React + Vite",
    description: "React 19+ project with Vite and TypeScript",
    systemPrompt: `${basePrompt}

Generate a React 19+ project with Vite:
- TypeScript strict mode
- Tailwind CSS for styling
- src/ directory structure
- Main App component with routing
- At least 3 pages/components
- Custom hooks directory
- Responsive design`,
    starterFiles: {
      "package.json": JSON.stringify({
        name: "vite-app",
        private: true,
        scripts: { dev: "vite", build: "tsc && vite build", preview: "vite preview" },
        dependencies: { react: "^19.0.0", "react-dom": "^19.0.0" },
        devDependencies: { typescript: "^5.0.0", vite: "^6.0.0", "@vitejs/plugin-react": "^4.0.0", tailwindcss: "^4.0.0" },
      }, null, 2),
    },
  },
  "landing-page": {
    id: "landing-page",
    name: "Landing Page",
    description: "Modern marketing landing page with animations",
    systemPrompt: `${basePrompt}

Generate a modern landing page with:
- Next.js 15+ with App Router
- Tailwind CSS for styling
- Framer Motion animations
- Hero section with CTA
- Features/benefits section
- Pricing section (3 tiers)
- FAQ accordion
- Footer with links
- Responsive mobile-first design
- SEO optimized with metadata`,
    starterFiles: {},
  },
  "dashboard": {
    id: "dashboard",
    name: "Dashboard",
    description: "Analytics dashboard with charts and data tables",
    systemPrompt: `${basePrompt}

Generate a data dashboard with:
- Next.js 15+ App Router
- TypeScript strict mode
- Tailwind CSS styling
- Sidebar navigation
- Multiple dashboard pages (overview, analytics, settings)
- Data tables with sorting
- Charts using recharts
- Dark theme
- Responsive layout`,
    starterFiles: {},
  },
  "custom": {
    id: "custom",
    name: "Custom Project",
    description: "Generate from scratch based on your prompt",
    systemPrompt: basePrompt,
    starterFiles: {},
  },
};

export function getTemplate(id: GenerationTemplate): ProjectTemplate {
  return TEMPLATES[id] ?? TEMPLATES["custom"];
}

export function getTemplateSystemPrompt(
  template: GenerationTemplate,
  customPrompt?: string
): string {
  if (template === "custom" && customPrompt) {
    return `${basePrompt}\n\n${customPrompt}`;
  }
  return TEMPLATES[template]?.systemPrompt ?? TEMPLATES["custom"].systemPrompt;
}
