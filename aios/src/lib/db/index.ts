import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "@aios/database/schema/auth";
import * as usersSchema from "@aios/database/schema/users";
import * as skillsSchema from "@aios/database/schema/skills";
import * as missionsSchema from "@aios/database/schema/missions";
import * as knowledgeSchema from "@aios/database/schema/knowledge";
import * as projectsSchema from "@aios/database/schema/projects";

const schema = {
  ...authSchema,
  ...usersSchema,
  ...skillsSchema,
  ...missionsSchema,
  ...knowledgeSchema,
  ...projectsSchema,
};

const connectionString = process.env.DATABASE_URL || "";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDatabase() {
  if (!db && connectionString) {
    const sql = neon(connectionString);
    db = drizzle(sql, { schema });
  }
  return db;
}
