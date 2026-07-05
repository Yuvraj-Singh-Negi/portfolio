"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Calendar, ChevronLeft, ChevronRight, Circle } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const events = [
  { day: 15, title: "AI Mentor Session", time: "10:00 AM", color: "text-accent-purple" },
  { day: 17, title: "Project Review: API Gateway", time: "2:00 PM", color: "text-accent-blue" },
  { day: 19, title: "System Design Study Group", time: "4:00 PM", color: "text-accent-green" },
];

export default function CalendarPage() {
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const startOffset = 2; // Wednesday start

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Schedule and timeline</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button className="rounded-lg p-1.5 hover:bg-elevation-2 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold">July 2026</span>
              <button className="rounded-lg p-1.5 hover:bg-elevation-2 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-medium text-muted-foreground py-1"
                >
                  {d}
                </div>
              ))}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {daysInMonth.map((day) => (
                <button
                  key={day}
                  className={`aspect-square rounded-lg text-sm hover:bg-elevation-2 transition-colors relative ${
                    day === 16 ? "bg-accent-green/10 text-accent-green font-semibold" : ""
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-3">
          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.title} className="flex items-start gap-3">
                  <Circle className={`h-2 w-2 mt-1.5 shrink-0 ${event.color} fill-current`} />
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Day {event.day} · {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
