import { NextRequest } from "next/server";
import { z } from "zod";
import { success, paginated, handleAPIError } from "@/lib/api/errors";
import { validateBody, validateQuery, paginationSchema } from "@/lib/api/validate";

interface Project {
  id: string;
  name: string;
  description?: string;
  repository?: string | null;
  technologies: string[];
  complexity: number;
  health: "good" | "warning" | "critical";
  progress: number;
  branch: string;
  stars: number;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
}

const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  repository: z.string().url().optional().nullable(),
  technologies: z.array(z.string()).default([]),
  complexity: z.number().min(0).max(10).default(0),
});

const projectsStore: Map<string, Project> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = validateQuery(
      paginationSchema.extend({
        health: z.enum(["good", "warning", "critical"]).optional(),
      }),
      Object.fromEntries(searchParams.entries()),
    );

    let projects = Array.from(projectsStore.values());

    if (query.health) {
      projects = projects.filter((p) => p.health === query.health);
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const total = projects.length;
    const start = (page - 1) * pageSize;
    const paged = projects.slice(start, start + pageSize);

    return paginated(paged, total, page, pageSize);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateBody(createProjectSchema, body);

    const project = {
      id: `proj-${Date.now()}`,
      ...data,
      health: "good" as const,
      progress: 0,
      branch: "main",
      stars: 0,
      openIssues: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projectsStore.set(project.id, project);

    return success(project, 201);
  } catch (error) {
    return handleAPIError(error);
  }
}
