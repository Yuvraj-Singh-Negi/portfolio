import { createVercelClient } from "./vercel";
import { prisma } from "@/lib/prisma";
import type { DeploymentStatus } from "@prisma/client";

const POLL_INTERVAL = 2000;
const MAX_POLL_TIME = 300_000;
const VERIFIED_READY_STATES = ["READY", "ERROR", "CANCELED"];

export interface DeploymentPollResult {
  url: string | null;
  status: string;
  ready: boolean;
  error: string | null;
  logs: string[];
}

export async function pollDeployment(
  deploymentId: string,
  vercelDeploymentId: string,
  onLog?: (log: string) => void
): Promise<DeploymentPollResult> {
  const vercel = createVercelClient();
  const startTime = Date.now();
  const logs: string[] = [];

  while (Date.now() - startTime < MAX_POLL_TIME) {
    const deployment = await vercel.getDeployment(vercelDeploymentId);
    const newLogs = await vercel.getDeploymentLogs(vercelDeploymentId, 50);

    for (const log of newLogs) {
      if (!logs.includes(log)) {
        logs.push(log);
        onLog?.(log);
      }
    }

    const dbStatus = mapVercelStatus(deployment.readyState);

    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: dbStatus,
        logs,
        url: deployment.url ? `https://${deployment.url}` : undefined,
        error:
          deployment.error
            ? `${deployment.error.code}: ${deployment.error.message}`
            : undefined,
      },
    });

    if (VERIFIED_READY_STATES.includes(deployment.readyState)) {
      const ready =
        deployment.readyState === "READY" && !!deployment.url;

      return {
        url: ready ? `https://${deployment.url}` : null,
        status: deployment.readyState,
        ready,
        error: deployment.error?.message ?? null,
        logs,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  await prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      status: "FAILED",
      error: "Deployment timed out after 5 minutes",
      logs,
    },
  });

  return {
    url: null,
    status: "TIMED_OUT",
    ready: false,
    error: "Deployment timed out after 5 minutes",
    logs,
  };
}

function mapVercelStatus(vercelState: string): DeploymentStatus {
  const map: Record<string, DeploymentStatus> = {
    INITIALIZING: "PENDING",
    BUILDING: "BUILDING",
    READY: "READY",
    ERROR: "FAILED",
    CANCELED: "CANCELED",
    QUEUED: "PENDING",
  };
  return map[vercelState] ?? "PENDING";
}
