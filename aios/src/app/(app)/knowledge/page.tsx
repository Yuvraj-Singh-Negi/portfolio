"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bookmark,
  BookOpen,
  ExternalLink,
  FileText,
  Beaker,
  Network,
  Filter,
  ChevronRight,
} from "lucide-react";

interface KnowledgeNode {
  id: string;
  label: string;
  type: "concept" | "pattern" | "framework" | "language";
  description: string;
  connections: string[];
  resources: number;
  projects: number;
  color: string;
}

const nodes: KnowledgeNode[] = [
  {
    id: "rust-ownership",
    label: "Rust Ownership",
    type: "concept",
    description: "Memory management through ownership, borrowing, and lifetimes",
    connections: ["memory-safety", "concurrency", "systems-programming"],
    resources: 5,
    projects: 2,
    color: "text-accent-green",
  },
  {
    id: "distributed-consensus",
    label: "Distributed Consensus",
    type: "pattern",
    description: "Algorithms for agreement in distributed systems",
    connections: ["raft", "paxos", "fault-tolerance", "system-design"],
    resources: 8,
    projects: 1,
    color: "text-accent-purple",
  },
  {
    id: "reactive-streams",
    label: "Reactive Streams",
    type: "pattern",
    description: "Async stream processing with backpressure",
    connections: ["event-driven", "backpressure", "rxjava", "webflux"],
    resources: 3,
    projects: 2,
    color: "text-accent-cyan",
  },
  {
    id: "zero-trust",
    label: "Zero Trust Networks",
    type: "framework",
    description: "Security architecture assuming no implicit trust",
    connections: ["security", "network-policies", "authentication", "microsegmentation"],
    resources: 6,
    projects: 1,
    color: "text-accent-blue",
  },
  {
    id: "event-sourcing",
    label: "Event Sourcing",
    type: "pattern",
    description: "Storing state as a sequence of events",
    connections: ["cqrs", "distributed-systems", "data-modeling"],
    resources: 4,
    projects: 2,
    color: "text-accent-amber",
  },
  {
    id: "system-design",
    label: "System Design",
    type: "concept",
    description: "Architecture and design of large-scale systems",
    connections: ["distributed-consensus", "event-sourcing", "caching", "load-balancing"],
    resources: 12,
    projects: 4,
    color: "text-accent-green",
  },
  {
    id: "raft",
    label: "Raft Consensus",
    type: "concept",
    description: "Understandable consensus algorithm",
    connections: ["distributed-consensus", "fault-tolerance", "leader-election"],
    resources: 4,
    projects: 1,
    color: "text-accent-purple",
  },
  {
    id: "memory-safety",
    label: "Memory Safety",
    type: "concept",
    description: "Eliminating memory bugs at compile time",
    connections: ["rust-ownership", "systems-programming", "security"],
    resources: 3,
    projects: 1,
    color: "text-accent-green",
  },
];

const typeColors: Record<string, string> = {
  concept: "text-accent-green border-accent-green/20",
  pattern: "text-accent-purple border-accent-purple/20",
  framework: "text-accent-blue border-accent-blue/20",
  language: "text-accent-cyan border-accent-cyan/20",
};

export default function KnowledgePage() {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? nodes.filter((n) => n.type === filter) : nodes;

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Knowledge Graph</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {nodes.length} nodes · {nodes.reduce((a, n) => a + n.connections.length, 0)}{" "}
              connections
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm" variant="secondary">
              <Maximize2 className="h-3.5 w-3.5" />
              Full screen
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {["concept", "pattern", "framework", "language"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(filter === type ? null : type)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === type
                  ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                  : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative h-[400px] rounded-xl border border-border bg-elevation-1 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <BrainCircuit className="h-16 w-16 text-muted-foreground/10" />
          </div>

          <svg className="absolute inset-0 h-full w-full opacity-20">
            {filtered.map((node, i) =>
              node.connections.map((connId) => {
                const target = filtered.find((n) => n.id === connId);
                if (!target) return null;
                const sourceIdx = filtered.indexOf(node);
                const targetIdx = filtered.indexOf(target);
                const angle1 = (sourceIdx / filtered.length) * Math.PI * 2;
                const angle2 = (targetIdx / filtered.length) * Math.PI * 2;
                const r = 150;
                const cx = 400;
                const cy = 200;
                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={cx + r * Math.cos(angle1)}
                    y1={cy + r * Math.sin(angle1)}
                    x2={cx + r * Math.cos(angle2)}
                    y2={cy + r * Math.sin(angle2)}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-border-light"
                  />
                );
              }),
            )}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            {filtered.map((node, i) => {
              const angle = (i / filtered.length) * Math.PI * 2;
              const r = 150;
              const cx = 400;
              const cy = 200;
              return (
                <motion.button
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    position: "absolute",
                    left: cx + r * Math.cos(angle) - 60,
                    top: cy + r * Math.sin(angle) - 20,
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                    "transition-all hover:scale-110 hover:shadow-lg",
                    selectedNode?.id === node.id
                      ? `${node.color} border-current bg-background shadow-glow-green`
                      : "border-border bg-elevation-2 text-muted-foreground hover:text-foreground",
                  )}
                  whileHover={{ scale: 1.1 }}
                >
                  <Bookmark className={cn("h-3 w-3", node.color)} />
                  {node.label}
                </motion.button>
              );
            })}
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            <button className="rounded-lg border border-border bg-elevation-2 p-1.5 hover:bg-elevation-3 transition-colors">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button className="rounded-lg border border-border bg-elevation-2 p-1.5 hover:bg-elevation-3 transition-colors">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {filtered.map((node) => {
            const Icon =
              node.type === "concept" ? BookOpen : node.type === "pattern" ? Network : FileText;
            return (
              <button key={node.id} onClick={() => setSelectedNode(node)} className="text-left">
                <GlassCard className="p-3" hover>
                  <div className="flex items-center gap-2 mb-1">
                    <Bookmark className={cn("h-3.5 w-3.5", node.color)} />
                    <span className="text-sm font-medium truncate">{node.label}</span>
                    <Badge variant="default" size="sm" className="ml-auto">
                      {node.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{node.resources} resources</span>
                    <span>·</span>
                    <span>{node.projects} projects</span>
                    <span>·</span>
                    <span>{node.connections.length} connections</span>
                  </div>
                </GlassCard>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-border overflow-hidden"
          >
            <div className="w-[360px] h-full overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-lg p-1.5 hover:bg-elevation-2 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>
                <Badge variant="default" size="sm">
                  {selectedNode.type}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Bookmark className={cn("h-6 w-6", selectedNode.color)} />
                <h2 className="text-lg font-bold">{selectedNode.label}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{selectedNode.description}</p>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Resources",
                    value: selectedNode.resources,
                    icon: FileText,
                    color: "text-accent-blue",
                  },
                  {
                    label: "Projects",
                    value: selectedNode.projects,
                    icon: Beaker,
                    color: "text-accent-green",
                  },
                  {
                    label: "Connections",
                    value: selectedNode.connections.length,
                    icon: Network,
                    color: "text-accent-purple",
                  },
                ].map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-card-border bg-elevation-1 p-2.5 text-center"
                    >
                      <StatIcon className={cn("h-4 w-4 mx-auto mb-1", stat.color)} />
                      <p className="text-sm font-bold">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Connected Nodes
                </h3>
                {selectedNode.connections.map((connId) => {
                  const conn = nodes.find((n) => n.id === connId);
                  if (!conn) return null;
                  return (
                    <button
                      key={connId}
                      onClick={() => setSelectedNode(conn)}
                      className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-elevation-2 transition-colors"
                    >
                      <Bookmark className={cn("h-3 w-3", conn.color)} />
                      <span className="text-sm">{conn.label}</span>
                      <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground" />
                    </button>
                  );
                })}
              </div>

              <Button variant="secondary" size="sm" className="w-full">
                <ExternalLink className="h-3.5 w-3.5" />
                View all resources
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
