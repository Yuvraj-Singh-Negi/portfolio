import {
  LayoutDashboard,
  Target,
  GraduationCap,
  FolderKanban,
  BrainCircuit,
  MessageSquare,
  Microscope,
  BookOpen,
  GitBranch,
  BarChart3,
  Award,
  Library,
  Calendar,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    label: "Home",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Today's Mission", href: "/mission", icon: Target },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Learning", href: "/learning", icon: GraduationCap },
      { label: "Projects", href: "/projects", icon: FolderKanban },
      { label: "Knowledge Graph", href: "/knowledge", icon: BrainCircuit },
      { label: "Research", href: "/research", icon: Microscope },
      { label: "AI Mentor", href: "/mentor", icon: MessageSquare },
      { label: "Notes", href: "/notes", icon: BookOpen },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "GitHub", href: "/github", icon: GitBranch, badge: 3 },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Achievements", href: "/achievements", icon: Award },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Library", href: "/library", icon: Library },
      { label: "Calendar", href: "/calendar", icon: Calendar },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/settings", icon: Settings }],
  },
];

export function findNavItem(href: string): NavItem | undefined {
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.href === href) return item;
    }
  }
  return undefined;
}
