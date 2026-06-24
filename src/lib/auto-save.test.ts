import { persistWorkspaceToServer, debouncedSave, saveBeforeNavigation } from '@/lib/auto-save';

global.fetch = jest.fn();

describe('auto-save utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('persistWorkspaceToServer', () => {
    it('calls fetch with correct payload on success', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const result = await persistWorkspaceToServer('proj-1', { 'file.ts': 'content' });

      expect(fetch).toHaveBeenCalledWith(
        '/api/v1/projects/proj-1/versions',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"file.ts":"content"'),
        })
      );
      expect(result).toBe(true);
    });

    it('returns false on network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await persistWorkspaceToServer('proj-1', { 'file.ts': 'content' });

      expect(result).toBe(false);
    });

    it('returns false on non-ok response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await persistWorkspaceToServer('proj-1', { 'file.ts': 'content' });

      expect(result).toBe(false);
    });
  });

  describe('debouncedSave', () => {
    it('delays callback execution', () => {
      const callback = jest.fn();
      debouncedSave(callback);
      expect(callback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(250);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('cancels previous timer on rapid calls', () => {
      const callback = jest.fn();
      debouncedSave(callback);
      debouncedSave(callback);
      debouncedSave(callback);
      jest.advanceTimersByTime(250);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
