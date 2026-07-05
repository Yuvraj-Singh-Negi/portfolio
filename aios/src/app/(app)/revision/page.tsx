"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  revisionDecks,
  type RevisionCard,
  type ReviewQuality,
  scheduleReview,
  getDueCards,
  getCardStats,
} from "@/features/learning/revision";
import { GraduationCap, RefreshCw, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

const qualityLabels: { quality: ReviewQuality; label: string; color: string }[] = [
  { quality: 0, label: "Blackout", color: "bg-accent-red" },
  { quality: 1, label: "Wrong", color: "bg-accent-red/70" },
  { quality: 2, label: "Forgot", color: "bg-accent-amber" },
  { quality: 3, label: "Hard", color: "bg-accent-amber/70" },
  { quality: 4, label: "Good", color: "bg-accent-green/70" },
  { quality: 5, label: "Perfect", color: "bg-accent-green" },
];

export default function RevisionPage() {
  const [deckId, setDeckId] = useState<string>("system-design");
  const [cards, setCards] = useState<RevisionCard[]>(() => revisionDecks[deckId] ?? []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [history, setHistory] = useState<{ cardId: string; quality: ReviewQuality }[]>([]);

  const deck = revisionDecks[deckId] ?? [];
  const dueCards = getDueCards(cards);
  const current = cards[currentIndex];
  const stats = getCardStats(cards);

  const switchDeck = useCallback((id: string) => {
    setDeckId(id);
    setCards(revisionDecks[id] ?? []);
    setCurrentIndex(0);
    setShowAnswer(false);
    setShowHint(false);
    setHistory([]);
  }, []);

  const rateCard = useCallback(
    (quality: ReviewQuality) => {
      if (!current) return;
      const updated = scheduleReview(current, quality);
      setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setHistory((prev) => [...prev, { cardId: current.id, quality }]);
      setShowAnswer(false);
      setShowHint(false);
      setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
    },
    [current, cards.length],
  );

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setShowHint(false);
    setHistory([]);
  }, []);

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Revision</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Spaced repetition · {stats.total} cards · {stats.due} due · {stats.mastered} mastered
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-border bg-elevation-1 px-3 py-1.5 text-xs">
              Avg ease: {stats.avgEase.toFixed(1)}
            </div>
            <Button size="sm" variant="secondary" onClick={restart}>
              <RefreshCw className="h-3.5 w-3.5" />
              Restart
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {Object.entries(revisionDecks).map(([id, deckCards]) => (
            <button
              key={id}
              onClick={() => switchDeck(id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                deckId === id
                  ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                  : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
              )}
            >
              {id.replace("-", " ")} ({deckCards.length})
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex flex-col items-center"
            >
              <GlassCard className="w-full max-w-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="knowledge" size="sm">
                    {current.topic}
                  </Badge>
                  {current.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-base font-medium mb-6">{current.question}</p>

                <AnimatePresence>
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-3 mb-4">
                        <p className="text-sm">{current.answer}</p>
                      </div>

                      {current.hint && showHint && (
                        <div className="rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-3 mb-4">
                          <div className="flex items-center gap-1.5 text-xs text-accent-amber mb-1">
                            <Lightbulb className="h-3 w-3" />
                            Hint
                          </div>
                          <p className="text-xs">{current.hint}</p>
                        </div>
                      )}

                      {!current.hint && showHint && (
                        <p className="text-xs text-muted-foreground mb-4">No hint available</p>
                      )}

                      <p className="text-xs text-muted-foreground mb-3">Rate your recall:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {qualityLabels.map((ql) => (
                          <button
                            key={ql.quality}
                            onClick={() => rateCard(ql.quality)}
                            className={cn(
                              "rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all hover:scale-105",
                              ql.color,
                            )}
                          >
                            {ql.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showAnswer && (
                  <div className="flex gap-2">
                    <Button onClick={() => setShowAnswer(true)}>Show answer</Button>
                    {current.hint && (
                      <Button variant="secondary" onClick={() => setShowHint(true)}>
                        <Lightbulb className="h-3.5 w-3.5" />
                        Hint
                      </Button>
                    )}
                  </div>
                )}
              </GlassCard>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                  disabled={currentIndex === 0}
                  className="rounded-lg border border-border bg-elevation-1 p-1.5 text-muted-foreground disabled:opacity-30 hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {cards.length}
                </span>
                <button
                  onClick={() => setCurrentIndex((p) => Math.min(cards.length - 1, p + 1))}
                  disabled={currentIndex === cards.length - 1}
                  className="rounded-lg border border-border bg-elevation-1 p-1.5 text-muted-foreground disabled:opacity-30 hover:text-foreground transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-12"
            >
              <GraduationCap className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">No cards in this deck</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="hidden w-72 shrink-0 border-l border-border p-5 space-y-4 lg:block overflow-y-auto">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Session Stats
        </h3>

        <GlassCard className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total cards</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Due now</span>
              <span className="font-medium text-accent-amber">{stats.due}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Reviewed</span>
              <span className="font-medium">{stats.reviewed}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Mastered (≥21d)</span>
              <span className="font-medium text-accent-green">{stats.mastered}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">This session</span>
              <span className="font-medium">{history.length}</span>
            </div>
            {history.length > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg quality</span>
                <span className="font-medium">
                  {(history.reduce((s, h) => s + h.quality, 0) / history.length).toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h4 className="text-xs font-semibold mb-2">Recent reviews</h4>
          <div className="space-y-1">
            {history
              .slice(-5)
              .reverse()
              .map((h, i) => {
                const ql = qualityLabels.find((l) => l.quality === h.quality);
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={cn("h-2 w-2 rounded-full", ql?.color)} />
                    <span className="text-muted-foreground">{ql?.label}</span>
                  </div>
                );
              })}
            {history.length === 0 && (
              <p className="text-xs text-muted-foreground">No reviews yet</p>
            )}
          </div>
        </GlassCard>
      </aside>
    </div>
  );
}
