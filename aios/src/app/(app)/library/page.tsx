"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Library, Book, Video, FileText, ExternalLink } from "lucide-react";

const resources = [
  {
    title: "Designing Data-Intensive Applications",
    type: "Book",
    author: "Martin Kleppmann",
    tags: ["distributed-systems", "architecture"],
    icon: Book,
  },
  {
    title: "MIT 6.824: Distributed Systems",
    type: "Course",
    author: "MIT",
    tags: ["distributed-systems", "academic"],
    icon: Video,
  },
  {
    title: "Rust Programming Language Book",
    type: "Book",
    author: "Mozilla",
    tags: ["rust", "beginner"],
    icon: Book,
  },
  {
    title: "System Design Interview Guide",
    type: "Article",
    author: "Alex Xu",
    tags: ["system-design", "interviews"],
    icon: FileText,
  },
];

export default function LibraryPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated engineering resources and references
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {resources.map((r) => {
          const Icon = r.icon;
          return (
            <GlassCard key={r.title} className="p-4" hover>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10">
                  <Icon className="h-4.5 w-4.5 text-accent-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold truncate">{r.title}</h3>
                    <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">{r.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="knowledge" size="sm">
                      {r.type}
                    </Badge>
                    {r.tags.map((tag) => (
                      <Badge key={tag} variant="default" size="sm">
                        {tag}
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
  );
}
