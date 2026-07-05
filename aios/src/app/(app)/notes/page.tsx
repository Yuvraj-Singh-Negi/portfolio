"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, FileText, Tag, Clock } from "lucide-react";

const notes = [
  {
    title: "Rust Async Patterns",
    tags: ["rust", "async"],
    updated: "2h ago",
    preview: "Understanding async/await, futures, and tokio...",
  },
  {
    title: "K8s Network Policies",
    tags: ["kubernetes", "networking"],
    updated: "1d ago",
    preview: "Calico, Cilium, and network segmentation...",
  },
  {
    title: "gRPC vs REST",
    tags: ["api", "architecture"],
    updated: "3d ago",
    preview: "Comparative analysis for microservices...",
  },
  {
    title: "Redis Caching Strategies",
    tags: ["redis", "performance"],
    updated: "5d ago",
    preview: "Cache aside, read through, write through...",
  },
];

export default function NotesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your engineering knowledge base</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New note
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {notes.map((note) => (
          <GlassCard key={note.title} className="p-4" hover>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-amber/10">
                <FileText className="h-4 w-4 text-accent-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{note.preview}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                    <Clock className="h-3 w-3" />
                    {note.updated}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
