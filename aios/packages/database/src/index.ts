import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as authSchema from "./schema/auth";
import * as usersSchema from "./schema/users";
import * as skillsSchema from "./schema/skills";
import * as missionsSchema from "./schema/missions";
import * as knowledgeSchema from "./schema/knowledge";
import * as projectsSchema from "./schema/projects";

export const schema = {
  ...authSchema,
  ...usersSchema,
  ...skillsSchema,
  ...missionsSchema,
  ...knowledgeSchema,
  ...projectsSchema,
};

export type Schema = typeof schema;

export function createDatabase(connectionString: string) {
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDatabase>;
