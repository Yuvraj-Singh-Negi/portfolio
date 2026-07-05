"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { resources, getResourceCount } from "@/features/learning/resources";
import { Search, Book, Video, FileText, ExternalLink, Code2 } from "lucide-react";

const typeIcons: Record<string, typeof Book> = {
  book: Book,
  course: Video,
  article: FileText,
  video: Video,
  paper: FileText,
  tool: Code2,
  documentation: FileText,
};

const typeColors: Record<string, string> = {
  book: "bg-accent-blue/10 text-accent-blue",
  course: "bg-accent-purple/10 text-accent-purple",
  article: "bg-accent-amber/10 text-accent-amber",
  video: "bg-accent-cyan/10 text-accent-cyan",
  paper: "bg-accent-green/10 text-accent-green",
  tool: "bg-accent-red/10 text-accent-red",
  documentation: "bg-accent-blue/10 text-accent-blue",
};

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  const filtered = resources.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topics.some((t) => t.includes(searchQuery.toLowerCase()));
    const matchesType = !filterType || r.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Library</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {getResourceCount()} curated engineering resources
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-elevation-1 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {["book", "course", "article", "paper", "tool", "documentation"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? null : type)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filterType === type
                  ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                  : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((r) => {
            const Icon = typeIcons[r.type] ?? FileText;
            const colorClass = typeColors[r.type] ?? "bg-accent-blue/10 text-accent-blue";
            return (
              <GlassCard key={r.id} className="p-4" hover>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      colorClass,
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold truncate">{r.title}</h3>
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">{r.author}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="knowledge" size="sm">
                        {r.type}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {r.difficulty}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{r.duration}</span>
                      {r.topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="default" size="sm">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
