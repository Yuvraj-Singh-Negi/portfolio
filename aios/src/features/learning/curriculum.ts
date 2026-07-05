import {
  Code2,
  FunctionSquare,
  Monitor,
  Globe,
  Server,
  Cloud,
  Container,
  Brain,
  Network,
  Cpu,
  Bot,
  Workflow,
  Shield,
  Building2,
  type LucideIcon,
} from "lucide-react";

export interface CurriculumTopic {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  progress: number;
  modules: number;
  completed: number;
  description: string;
  topics: string[];
}

export const curriculum: CurriculumTopic[] = [];
