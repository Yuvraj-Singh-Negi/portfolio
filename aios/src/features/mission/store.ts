import { create } from "zustand";
import type { Mission, MissionState, TimelineEvent, MissionAnalytics } from "./types";
import { generateMissionId, northStar } from "./engine";

interface FocusSession {
  active: boolean;
  startedAt?: string;
  type: "focus" | "break";
  duration: number;
  remaining: number;
}

interface MissionStore {
  currentMission: Mission | null;
  missions: Mission[];
  timeline: TimelineEvent[];
  focusSession: FocusSession;
  northStar: typeof northStar;
  analytics: MissionAnalytics[];

  setCurrentMission: (mission: Mission | null) => void;
  transitionState: (newState: MissionState) => void;
  updateProgress: (progress: number) => void;
  toggleChecklistItem: (id: string) => void;
  addMission: (mission: Mission) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  startFocusSession: (type: "focus" | "break") => void;
  stopFocusSession: () => void;
  tickFocusTimer: () => void;
  addAnalytics: (entry: MissionAnalytics) => void;
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  currentMission: null,
  missions: [],
  timeline: [],
  focusSession: { active: false, type: "focus", duration: 25 * 60, remaining: 25 * 60 },
  northStar,
  analytics: [],

  setCurrentMission: (mission) => set({ currentMission: mission }),

  transitionState: (newState) => {
    const current = get().currentMission;
    if (!current) return;
    set({
      currentMission: {
        ...current,
        state: newState,
        pausedAt: newState === "paused" ? new Date().toISOString() : current.pausedAt,
        completedAt: newState === "completed" ? new Date().toISOString() : current.completedAt,
        startedAt:
          current.startedAt || (newState === "in-progress" ? new Date().toISOString() : undefined),
      },
    });
  },

  updateProgress: (progress) => {
    const current = get().currentMission;
    if (!current) return;
    set({ currentMission: { ...current, progress: Math.min(100, Math.max(0, progress)) } });
  },

  toggleChecklistItem: (id) => {
    const current = get().currentMission;
    if (!current) return;
    const checklist = current.template.checklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item,
    );
    const completed = checklist.filter((i) => i.done).length;
    const progress = Math.round((completed / checklist.length) * 100);
    set({ currentMission: { ...current, template: { ...current.template, checklist }, progress } });
  },

  addMission: (mission) => set((state) => ({ missions: [...state.missions, mission] })),

  addTimelineEvent: (event) => set((state) => ({ timeline: [...state.timeline, event] })),

  startFocusSession: (type) =>
    set({
      focusSession: {
        active: true,
        startedAt: new Date().toISOString(),
        type,
        duration: type === "focus" ? 25 * 60 : 5 * 60,
        remaining: type === "focus" ? 25 * 60 : 5 * 60,
      },
    }),

  stopFocusSession: () =>
    set((state) => ({
      focusSession: { ...state.focusSession, active: false },
    })),

  tickFocusTimer: () =>
    set((state) => {
      if (!state.focusSession.active) return state;
      const remaining = state.focusSession.remaining - 1;
      if (remaining <= 0) {
        return {
          focusSession: {
            ...state.focusSession,
            active: false,
            remaining: 0,
          },
        };
      }
      return {
        focusSession: { ...state.focusSession, remaining },
      };
    }),

  addAnalytics: (entry) => set((state) => ({ analytics: [...state.analytics, entry] })),
}));
