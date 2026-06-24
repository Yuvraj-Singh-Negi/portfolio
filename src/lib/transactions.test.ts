import { createDeploymentWithEvents, updateSubscriptionWithHistory, recordUsage, createProjectVersion } from '@/lib/transactions';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn((fn) => fn({
      deployment: { create: jest.fn(), },
      deploymentEvent: { create: jest.fn() },
      subscription: { upsert: jest.fn() },
      auditEvent: { create: jest.fn() },
      projectVersion: { create: jest.fn() },
      project: { update: jest.fn() },
      usageRecord: { create: jest.fn() },
    })),
  },
}));

describe('transactions', () => {
  const mockTx = {
    deployment: { create: jest.fn() },
    deploymentEvent: { create: jest.fn() },
    subscription: { upsert: jest.fn() },
    auditEvent: { create: jest.fn() },
    projectVersion: { create: jest.fn() },
    project: { update: jest.fn() },
    usageRecord: { create: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation((fn) => fn(mockTx));
  });

  describe('createDeploymentWithEvents', () => {
    it('creates deployment and event atomically', async () => {
      mockTx.deployment.create.mockResolvedValueOnce({ id: 'dep-1', projectId: 'proj-1' });

      const result = await createDeploymentWithEvents({
        projectId: 'proj-1',
        provider: 'vercel',
      });

      expect(mockTx.deployment.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ projectId: 'proj-1', provider: 'vercel' }) })
      );
      expect(mockTx.deploymentEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: 'created' }) })
      );
      expect(result.id).toBe('dep-1');
    });
  });

  describe('updateSubscriptionWithHistory', () => {
    it('upserts subscription and creates audit event', async () => {
      mockTx.subscription.upsert.mockResolvedValueOnce({ id: 'sub-1', userId: 'user-1', status: 'ACTIVE' });

      const result = await updateSubscriptionWithHistory({
        userId: 'user-1',
        status: 'ACTIVE',
        stripeCustomerId: 'cus_123',
      });

      expect(mockTx.subscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          create: expect.objectContaining({ status: 'ACTIVE' }),
        })
      );
      expect(mockTx.auditEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'subscription.updated' }),
        })
      );
      expect(result.status).toBe('ACTIVE');
    });
  });

  describe('recordUsage', () => {
    it('creates usage record and audit event', async () => {
      mockTx.usageRecord.create.mockResolvedValueOnce({ id: 'usage-1', count: 5 });

      const result = await recordUsage({
        userId: 'user-1',
        action: 'generation',
        count: 5,
      });

      expect(mockTx.usageRecord.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'generation', count: 5 }) })
      );
      expect(mockTx.auditEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'usage.generation' }) })
      );
      expect(result.count).toBe(5);
    });

    it('defaults count to 1', async () => {
      mockTx.usageRecord.create.mockResolvedValueOnce({ id: 'usage-1', count: 1 });

      await recordUsage({ userId: 'user-1', action: 'deploy' });

      expect(mockTx.usageRecord.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ count: 1 }) })
      );
    });
  });

  describe('createProjectVersion', () => {
    it('creates version and updates project vfsSnapshot', async () => {
      const snapshot = { files: { 'a.ts': 'content' } };
      mockTx.projectVersion.create.mockResolvedValueOnce({ id: 'ver-1' });

      const result = await createProjectVersion({ projectId: 'proj-1', snapshot });

      expect(mockTx.projectVersion.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { projectId: 'proj-1', snapshot } })
      );
      expect(mockTx.project.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'proj-1' }, data: { vfsSnapshot: snapshot } })
      );
      expect(result.id).toBe('ver-1');
    });
  });
});
