import { prisma } from "@/lib/prisma";
import type { Prisma, DeploymentStatus, SubscriptionStatus } from "@prisma/client";

export async function createDeploymentWithEvents(params: {
  projectId: string;
  provider: string;
  url?: string;
  status?: DeploymentStatus;
}) {
  return prisma.$transaction(async (tx) => {
    const deployment = await tx.deployment.create({
      data: {
        projectId: params.projectId,
        provider: params.provider,
        url: params.url,
        status: params.status ?? "PENDING",
      },
    });

    await tx.deploymentEvent.create({
      data: {
        deploymentId: deployment.id,
        type: "created",
        data: { provider: params.provider },
      },
    });

    return deployment;
  });
}

export async function updateSubscriptionWithHistory(params: {
  userId: string;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.upsert({
      where: { userId: params.userId },
      create: {
        userId: params.userId,
        status: params.status,
        stripeCustomerId: params.stripeCustomerId,
        stripeSubscriptionId: params.stripeSubscriptionId,
        currentPeriodEnd: params.currentPeriodEnd,
      },
      update: {
        status: params.status,
        stripeCustomerId: params.stripeCustomerId,
        stripeSubscriptionId: params.stripeSubscriptionId,
        currentPeriodEnd: params.currentPeriodEnd,
      },
    });

    await tx.auditEvent.create({
      data: {
        userId: params.userId,
        action: "subscription.updated",
        entity: "subscription",
        entityId: subscription.id,
        metadata: {
          status: params.status,
          stripeCustomerId: params.stripeCustomerId,
        },
      },
    });

    return subscription;
  });
}

export async function createProjectVersion(params: {
  projectId: string;
  snapshot: Prisma.InputJsonValue;
}) {
  return prisma.$transaction(async (tx) => {
    const version = await tx.projectVersion.create({
      data: {
        projectId: params.projectId,
        snapshot: params.snapshot,
      },
    });

    await tx.project.update({
      where: { id: params.projectId },
      data: { vfsSnapshot: params.snapshot },
    });

    return version;
  });
}

export async function recordUsage(params: {
  userId: string;
  action: string;
  count?: number;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.$transaction(async (tx) => {
    const record = await tx.usageRecord.create({
      data: {
        userId: params.userId,
        action: params.action,
        count: params.count ?? 1,
        metadata: params.metadata,
      },
    });

    await tx.auditEvent.create({
      data: {
        userId: params.userId,
        action: `usage.${params.action}`,
        entity: "usage_record",
        entityId: record.id,
        metadata: params.metadata,
      },
    });

    return record;
  });
}
