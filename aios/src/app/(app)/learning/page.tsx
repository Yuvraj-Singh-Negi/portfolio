"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { curriculum, type CurriculumTopic } from "@/features/learning/curriculum";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronRight,
  BookOpen,
  FileText,
  Beaker,
  ClipboardCheck,
  Bookmark,
  GraduationCap,
} from "lucide-react";

const quickLinks = [
  { label: "Roadmap", icon: BookOpen },
  { label: "Resources", icon: FileText },
  { label: "Projects", icon: Beaker },
  { label: "Quizzes", icon: ClipboardCheck },
  { label: "Notes", icon: Bookmark },
  { label: "Revision", icon: GraduationCap },
];

function TopicCard({ topic, index }: { topic: CurriculumTopic; index: number }) {
  const percentage = Math.round((topic.completed / topic.modules) * 100);
  const Icon = topic.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <GlassCard className="p-4" hover>
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              `${topic.color.replace("text-", "bg-")}/10`,
            )}
          >
            <Icon className={cn("h-4.5 w-4.5", topic.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">{topic.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{topic.description}</p>
          </div>
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-elevation-3"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 19}
                initial={{ strokeDashoffset: 2 * Math.PI * 19 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 19 * (1 - percentage / 100) }}
                transition={{ duration: 0.8, delay: index * 0.03 }}
                className={topic.color}
              />
            </svg>
            <span className={cn("absolute text-xs font-bold", topic.color)}>{percentage}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" size="sm">
            {topic.completed}/{topic.modules} modules
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            {topic.modules - topic.completed} remaining
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {topic.topics.map((t) => (
            <Badge key={t} variant="default" size="sm">
              {t}
            </Badge>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function LearningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filtered = searchQuery
    ? curriculum.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.topics.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : curriculum;

  const activeTopic = selectedTopic ? curriculum.find((t) => t.id === selectedTopic) : null;

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Learning</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete engineering curriculum — {curriculum.reduce((a, t) => a + t.completed, 0)}/
              {curriculum.reduce((a, t) => a + t.modules, 0)} modules
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-elevation-1 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-elevation-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-border-light transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map((topic, i) => (
            <button key={topic.id} className="text-left" onClick={() => setSelectedTopic(topic.id)}>
              <TopicCard topic={topic} index={i} />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeTopic && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-l border-border overflow-hidden"
          >
            <div className="w-[360px] h-full overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="rounded-lg p-1.5 hover:bg-elevation-2 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>
                <Badge variant="default" size="sm">
                  {activeTopic.completed}/{activeTopic.modules}
                </Badge>
              </div>

              <div>
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg mb-3",
                    `${activeTopic.color.replace("text-", "bg-")}/10`,
                  )}
                >
                  <activeTopic.icon className={cn("h-5 w-5", activeTopic.color)} />
                </div>
                <h2 className="text-lg font-bold">{activeTopic.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{activeTopic.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Overall progress</span>
                  <span>{Math.round((activeTopic.completed / activeTopic.modules) * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-elevation-3">
                  <motion.div
                    className={cn("h-full rounded-full", activeTopic.color.replace("text-", "bg-"))}
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeTopic.completed / activeTopic.modules) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Topics
                </h3>
                {activeTopic.topics.map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-elevation-2 transition-colors cursor-pointer"
                  >
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        activeTopic.color.replace("text-", "bg-"),
                      )}
                    />
                    <span className="text-sm">{t}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Roadmap", icon: BookOpen },
                    { label: "Resources", icon: FileText },
                    { label: "Projects", icon: Beaker },
                    { label: "Practice", icon: ClipboardCheck },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        className="flex items-center gap-1.5 rounded-lg border border-card-border bg-elevation-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-border-light transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
