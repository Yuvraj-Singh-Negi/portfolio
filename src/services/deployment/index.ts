import { createVercelClient } from "./vercel";
import { pollDeployment } from "./polling";
import { prisma } from "@/lib/prisma";

export interface DeployOptions {
  projectId: string;
  userId: string;
  name?: string;
}

export interface DeployResult {
  deploymentId: string;
  url: string | null;
  status: string;
  ready: boolean;
  error: string | null;
  logs: string[];
}

export async function deployProject(
  options: DeployOptions
): Promise<DeployResult> {
  const { projectId, userId } = options;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      vfsSnapshot: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== userId) {
    throw new Error("Access denied: you do not own this project");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, tier: true },
  });

  const tier = subscription?.tier ?? "FREE";
  if (tier === "FREE") {
    throw new Error(
      "Deployments require a PRO or ENTERPRISE subscription. Please upgrade your plan."
    );
  }

  const snapshot = project.vfsSnapshot as { files?: Record<string, string> } | null;
  if (!snapshot?.files || Object.keys(snapshot.files).length === 0) {
    throw new Error(
      "Project has no files to deploy. Generate code first."
    );
  }

  const vercel = createVercelClient();
  const name = options.name ?? project.name;

  const vercelDeployment = await vercel.createDeployment(
    name,
    snapshot.files
  );

  const deployment = await prisma.$transaction(async (tx) => {
    const dep = await tx.deployment.create({
      data: {
        projectId,
        provider: "vercel",
        url: null,
        status: "PENDING",
        logs: [],
      },
    });

    await tx.deploymentEvent.create({
      data: {
        deploymentId: dep.id,
        type: "created",
        data: {
          vercelDeploymentId: vercelDeployment.id,
          name,
          files: Object.keys(snapshot.files!).length,
        },
      },
    });

    return dep;
  });

  const logs: string[] = [];
  const result = await pollDeployment(
    deployment.id,
    vercelDeployment.id,
    (log) => {
      logs.push(log);
    }
  );

  await prisma.deploymentEvent.create({
    data: {
      deploymentId: deployment.id,
      type: result.ready ? "ready" : "failed",
      data: { url: result.url, error: result.error },
    },
  });

  return {
    deploymentId: deployment.id,
    url: result.url,
    status: result.status,
    ready: result.ready,
    error: result.error,
    logs,
  };
}
