import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildActivity, createStrava } from './strava';

describe('buildActivity', () => {
  const summary = {
    startedAt: new Date('2026-07-06T10:00:00').getTime(),
    elapsed: 150,
    timers: [
      { name: 'Cat-Cow', time: 90 },
      { name: 'Sphinx Pose', time: 60 },
    ],
  };

  it('builds a Strava activity from a workout summary', () => {
    const activity = buildActivity(summary);

    expect(activity.name).toBe('Yoga');
    expect(activity.sport_type).toBe('Yoga');
    expect(activity.elapsed_time).toBe(150);
    expect(activity.description).toBe('Cat-Cow — 01:30\nSphinx Pose — 01:00');
  });

  it('formats start date as local time without timezone suffix', () => {
    const activity = buildActivity(summary);

    expect(activity.start_date_local).toBe('2026-07-06T10:00:00');
  });
});

describe('upload', () => {
  const summary = {
    startedAt: new Date('2026-07-06T10:00:00').getTime(),
    elapsed: 15,
    timers: [{ name: 'Test 1', time: 5 }],
  };

  const stubFetch = response => vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: () =>
        JSON.stringify({
          accessToken: 'token',
          refreshToken: 'refresh',
          expiresAt: Date.now() / 1000 + 3600,
        }),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves when the response body is empty', async () => {
    stubFetch({ ok: true, status: 201, text: async () => '' });

    await expect(createStrava().upload(summary)).resolves.toBeNull();
  });

  it('returns the parsed activity when the response has a body', async () => {
    stubFetch({ ok: true, status: 201, text: async () => '{"id":42}' });

    await expect(createStrava().upload(summary)).resolves.toEqual({ id: 42 });
  });

  it('treats 409 duplicate as success', async () => {
    stubFetch({ ok: false, status: 409, text: async () => '' });

    await expect(createStrava().upload(summary)).resolves.toBeNull();
  });

  it('throws on other error statuses', async () => {
    stubFetch({ ok: false, status: 500, text: async () => '' });

    await expect(createStrava().upload(summary)).rejects.toThrow('500');
  });
});
