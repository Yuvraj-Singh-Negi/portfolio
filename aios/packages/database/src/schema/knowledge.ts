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

export const nodeTypeEnum = pgEnum("node_type", [
  "concept",
  "pattern",
  "framework",
  "language",
  "tool",
]);

export const knowledgeNodes = pgTable("knowledge_nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 200 }).notNull(),
  type: nodeTypeEnum("type").notNull(),
  description: text("description"),
  connections: text("connections").array(),
  resources: integer("resources").default(0),
  completed: boolean("completed").default(false),
  proficiency: integer("proficiency").default(0),
  lastReviewed: timestamp("last_reviewed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const knowledgeEdges = pgTable("knowledge_edges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => knowledgeNodes.id, { onDelete: "cascade" }),
  targetId: uuid("target_id")
    .notNull()
    .references(() => knowledgeNodes.id, { onDelete: "cascade" }),
  weight: integer("weight").default(1),
  label: text("label"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const knowledgeRelations = relations(knowledgeNodes, ({ one, many }) => ({
  user: one(users, { fields: [knowledgeNodes.userId], references: [users.id] }),
  outgoingEdges: many(knowledgeEdges, { relationName: "outgoing" }),
  incomingEdges: many(knowledgeEdges, { relationName: "incoming" }),
}));
