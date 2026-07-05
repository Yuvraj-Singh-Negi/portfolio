import { NextRequest } from "next/server";
import { z } from "zod";
import { success, handleAPIError } from "@/lib/api/errors";
import { validateBody } from "@/lib/api/validate";

interface KnowledgeNode {
  id: string;
  label: string;
  type: string;
  description?: string;
  connections: string[];
  resources: number;
  completed: boolean;
  proficiency: number;
  createdAt: string;
}

const createNodeSchema = z.object({
  label: z.string().min(1).max(200),
  type: z.enum(["concept", "pattern", "framework", "language", "tool"]),
  description: z.string().max(2000).optional(),
});

const nodesStore: Map<string, KnowledgeNode> = new Map();

export async function GET() {
  try {
    const nodes = Array.from(nodesStore.values());
    const edges: { source: string; target: string; weight: number }[] = [];

    nodes.forEach((node) => {
      node.connections?.forEach((connId: string) => {
        edges.push({ source: node.id, target: connId, weight: 1 });
      });
    });

    return success({ nodes, edges, stats: { totalNodes: nodes.length, totalEdges: edges.length } });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateBody(createNodeSchema, body);

    const node = {
      id: `node-${Date.now()}`,
      ...data,
      connections: [],
      resources: 0,
      completed: false,
      proficiency: 0,
      createdAt: new Date().toISOString(),
    };

    nodesStore.set(node.id, node);

    return success(node, 201);
  } catch (error) {
    return handleAPIError(error);
  }
}
