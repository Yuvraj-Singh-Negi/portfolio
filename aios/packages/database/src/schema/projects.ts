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

export const projectHealthEnum = pgEnum("project_health", ["good", "warning", "critical"]);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  repository: text("repository"),
  deployment: text("deployment"),
  technologies: jsonb("technologies").$type<string[]>(),
  complexity: integer("complexity").default(0),
  health: projectHealthEnum("health").default("good"),
  progress: integer("progress").default(0),
  branch: varchar("branch", { length: 100 }).default("main"),
  stars: integer("stars").default(0),
  openIssues: integer("open_issues").default(0),
  lastCommit: timestamp("last_commit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
}));
