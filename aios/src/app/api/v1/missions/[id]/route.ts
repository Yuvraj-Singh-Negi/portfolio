import { NextRequest } from "next/server";
import { success, handleAPIError, APIError } from "@/lib/api/errors";
import { validateBody } from "@/lib/api/validate";
import { z } from "zod";
import type { Mission } from "@/features/mission/types";

const updateMissionSchema = z.object({
  state: z
    .enum([
      "pending",
      "ready",
      "in-progress",
      "paused",
      "blocked",
      "review",
      "completed",
      "archived",
    ])
    .optional(),
  progress: z.number().min(0).max(100).optional(),
  focusScore: z.number().min(0).max(100).optional(),
  checklist: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        duration: z.string(),
        done: z.boolean(),
      }),
    )
    .optional(),
});

const missionsStore: Map<string, Mission> = new Map();

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const mission = missionsStore.get(id);
    if (!mission) {
      throw new APIError("Mission not found", 404, "NOT_FOUND");
    }
    return success(mission);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const mission = missionsStore.get(id);
    if (!mission) {
      throw new APIError("Mission not found", 404, "NOT_FOUND");
    }

    const body = await request.json();
    const data = validateBody(updateMissionSchema, body);

    const updated = { ...mission, ...data, updatedAt: new Date().toISOString() };
    missionsStore.set(id, updated);

    return success(updated);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const mission = missionsStore.get(id);
    if (!mission) {
      throw new APIError("Mission not found", 404, "NOT_FOUND");
    }
    missionsStore.delete(id);
    return success({ deleted: true });
  } catch (error) {
    return handleAPIError(error);
  }
}
