import { Github, Linkedin, Mail } from "lucide-react";
import { personalInfo, socialLinks } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-12">
      <Container>
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-5">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] text-zinc-600 transition-all duration-300 hover:border-white/[0.15] hover:text-zinc-300 hover:bg-white/[0.03]"
                  aria-label={link.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-small text-zinc-600">
              &copy; {new Date().getFullYear()} {personalInfo.name}
            </p>
            <p className="text-xs text-zinc-700">
              Built with Next.js &amp; Tailwind CSS
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
