import type { Metadata } from "next";
import { BackgroundEffects } from "@/components/dashboard/background-effects";
import { HeroSection } from "@/components/dashboard/hero-section";
import { MissionCard } from "@/components/dashboard/mission-card";
import { EngineeringProgress } from "@/components/dashboard/engineering-progress";
import { CurrentProjects } from "@/components/dashboard/current-projects";
import { VelocityChart } from "@/components/dashboard/velocity-chart";
import { GitHubPanel } from "@/components/dashboard/github-panel";
import { KnowledgePreview } from "@/components/dashboard/knowledge-preview";
import { RightSidebar } from "@/components/dashboard/right-sidebar";

export const metadata: Metadata = {
  title: "Dashboard — AIOS",
  description: "Mission Control — your engineering operating system dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex h-full gap-5 p-6">
        <div className="flex-1 min-w-0 space-y-5 overflow-y-auto">
          <HeroSection />
          <MissionCard />
          <EngineeringProgress />
          <CurrentProjects />
          <VelocityChart />
          <GitHubPanel />
          <KnowledgePreview />
        </div>

        <RightSidebar />
      </div>
    </>
  );
}
