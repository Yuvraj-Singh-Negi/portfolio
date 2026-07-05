import { pgTable, uuid, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { skills } from "./skills";
import { missions } from "./missions";
import { knowledgeNodes } from "./knowledge";
import { projects } from "./projects";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 20 }).notNull().default("engineer"),
  hashedPassword: text("hashed_password"),
  githubId: varchar("github_id", { length: 255 }).unique(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  northStar: text("north_star"),
  currentWeek: integer("current_week").default(1),
  totalWeeks: integer("total_weeks").default(24),
  learningVelocity: integer("learning_velocity").default(50),
  retentionScore: integer("retention_score").default(50),
  totalXp: integer("total_xp").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  preferredLearningStyle: varchar("preferred_learning_style", { length: 20 }).default("mixed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  skills: many(skills),
  missions: many(missions),
  knowledgeNodes: many(knowledgeNodes),
  projects: many(projects),
}));
