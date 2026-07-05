import { pgTable, uuid, text, varchar, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const strengthEnum = pgEnum("skill_strength", [
  "weak",
  "developing",
  "competent",
  "strong",
  "expert",
]);
export const categoryEnum = pgEnum("skill_category", [
  "programming",
  "frontend",
  "backend",
  "foundations",
  "ai",
  "architecture",
  "devops",
  "security",
  "cloud",
]);

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  category: categoryEnum("category").notNull(),
  level: integer("level").notNull().default(0),
  progress: integer("progress").notNull().default(0),
  hoursInvested: integer("hours_invested").notNull().default(0),
  projectsCompleted: integer("projects_completed").notNull().default(0),
  lastPracticed: timestamp("last_practiced"),
  strength: strengthEnum("strength").notNull().default("weak"),
  prerequisites: text("prerequisites").array(),
  children: text("children").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, { fields: [skills.userId], references: [users.id] }),
}));
