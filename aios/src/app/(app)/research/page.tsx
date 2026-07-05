"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Microscope, ExternalLink, BookOpen, FileText } from "lucide-react";

const papers = [
  {
    title: "Attention Is All You Need",
    author: "Vaswani et al.",
    year: 2017,
    tags: ["deep-learning", "transformers"],
  },
  {
    title: "Distributed Systems Reading Group",
    author: "Various",
    year: 2024,
    tags: ["distributed-systems", "consensus"],
  },
  {
    title: "Rust Ownership Model",
    author: "Mozilla Research",
    year: 2015,
    tags: ["rust", "memory-safety"],
  },
];

export default function ResearchPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Research</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Curated papers, articles, and technical resources
          </p>
        </div>
        <Button size="sm" variant="secondary">
          <BookOpen className="h-3.5 w-3.5" />
          Add resource
        </Button>
      </div>

      <div className="space-y-3">
        {papers.map((paper) => (
          <GlassCard key={paper.title} className="p-4" hover>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-purple/10">
                <FileText className="h-4 w-4 text-accent-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold truncate">{paper.title}</h3>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {paper.author} · {paper.year}
                </p>
                <div className="flex gap-1.5 mt-2">
                  {paper.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
