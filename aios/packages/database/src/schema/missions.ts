import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const missionStateEnum = pgEnum("mission_state", [
  "pending",
  "ready",
  "in_progress",
  "paused",
  "blocked",
  "review",
  "completed",
  "archived",
]);
export const missionPriorityEnum = pgEnum("mission_priority", [
  "critical",
  "high",
  "medium",
  "low",
]);
export const missionTypeEnum = pgEnum("mission_type", [
  "learning",
  "coding",
  "research",
  "debugging",
  "system_design",
  "reading",
  "writing",
  "architecture",
  "deployment",
  "review",
  "revision",
  "reflection",
  "interview_prep",
  "open_source",
  "deep_work",
  "creative_building",
]);
export const difficultyEnum = pgEnum("difficulty", [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

export const missions = pgTable("missions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: missionTypeEnum("type").notNull(),
  state: missionStateEnum("state").notNull().default("pending"),
  priority: missionPriorityEnum("priority").notNull().default("medium"),

  // Template fields stored as JSON
  name: text("name").notNull(),
  objective: text("objective").notNull(),
  whyItMatters: text("why_it_matters"),
  estimatedTime: integer("estimated_time"),
  difficulty: difficultyEnum("difficulty"),
  expectedOutput: text("expected_output"),
  resources: jsonb("resources").$type<string[]>(),
  checklist:
    jsonb("checklist").$type<{ id: string; label: string; duration: string; done: boolean }[]>(),
  successCriteria: jsonb("success_criteria").$type<string[]>(),
  aiHints: jsonb("ai_hints").$type<string[]>(),
  reflection: jsonb("reflection").$type<string[]>(),
  category: text("category"),

  // Progress
  progress: integer("progress").notNull().default(0),
  focusScore: integer("focus_score"),
  distractions: integer("distractions"),
  xpEarned: integer("xp_earned").default(0),

  // Timing
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  pausedAt: timestamp("paused_at"),
  totalPausedTime: integer("total_paused_time").default(0),

  // Dependencies
  dependencies:
    jsonb("dependencies").$type<{ id: string; name: string; required: boolean; met: boolean }[]>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const missionsRelations = relations(missions, ({ one }) => ({
  user: one(users, { fields: [missions.userId], references: [users.id] }),
}));
