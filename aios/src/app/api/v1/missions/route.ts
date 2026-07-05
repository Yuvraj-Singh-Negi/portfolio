import { NextRequest } from "next/server";
import { z } from "zod";
import { success, paginated, handleAPIError } from "@/lib/api/errors";
import { validateBody, validateQuery, paginationSchema } from "@/lib/api/validate";
import type { Mission, MissionState, MissionType } from "@/features/mission/types";
import { getMissionCategory } from "@/features/mission/engine";

// Validation schemas
const createMissionSchema = z.object({
  type: z.enum([
    "learning",
    "coding",
    "research",
    "debugging",
    "system-design",
    "reading",
    "writing",
    "architecture",
    "deployment",
    "review",
    "revision",
    "reflection",
    "interview-prep",
    "open-source",
    "deep-work",
  ]),
  name: z.string().min(1).max(200),
  objective: z.string().min(1).max(2000),
  whyItMatters: z.string().max(2000).optional(),
  estimatedTime: z.number().positive().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  priority: z.enum(["critical", "high", "medium", "low"]).default("medium"),
});

// In-memory store (replace with database when connected)
const missionsStore: Map<string, Mission> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = validateQuery(
      paginationSchema.extend({
        state: z.string().optional(),
        type: z.string().optional(),
        priority: z.string().optional(),
      }),
      Object.fromEntries(searchParams.entries()),
    );

    let missions = Array.from(missionsStore.values());

    if (query.state) {
      missions = missions.filter((m) => m.state === query.state);
    }
    if (query.type) {
      missions = missions.filter((m) => m.type === query.type);
    }
    if (query.priority) {
      missions = missions.filter((m) => m.priority === query.priority);
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const total = missions.length;
    const start = (page - 1) * pageSize;
    const paged = missions.slice(start, start + pageSize);

    return paginated(paged, total, page, pageSize);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateBody(createMissionSchema, body);

    const mission: Mission = {
      id: `msn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: data.type,
      priority: data.priority,
      state: "pending" as MissionState,
      progress: 0,
      totalPausedTime: 0,
      category: getMissionCategory(data.type as MissionType),
      dependencies: [],
      template: {
        name: data.name,
        objective: data.objective,
        whyItMatters: data.whyItMatters ?? "",
        estimatedTime: data.estimatedTime ?? 60,
        difficulty: data.difficulty ?? "intermediate",
        expectedOutput: "",
        resources: [],
        checklist: [],
        successCriteria: [],
        aiHints: [],
        reflection: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    missionsStore.set(mission.id, mission);

    return success(mission, 201);
  } catch (error) {
    return handleAPIError(error);
  }
}
