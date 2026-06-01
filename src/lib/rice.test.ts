import { describe, it, expect } from 'vitest';
import { computeRiceScore, sortThemesByScore, bucketThemes, withRiceScore } from './rice';
import type { Sentiment, Theme } from '../types';

/** Build a Theme with a given RICE score (other fields are filler). */
function makeTheme(id: string, score: number, sentiment: Sentiment = 'mixed'): Theme {
  return {
    id,
    name: `Theme ${id}`,
    description: 'desc',
    count: 1,
    sentiment,
    quotes: [],
    // We only care about rice.score for sorting/bucketing tests.
    rice: { reach: 0, impact: 1, confidence: 1, effort: 1, score },
  };
}

describe('computeRiceScore', () => {
  it('computes (reach × impact × confidence) / effort', () => {
    // 800 * 2 * 0.8 / 3 = 426.666… → rounded to 426.7
    expect(computeRiceScore({ reach: 800, impact: 2, confidence: 0.8, effort: 3 })).toBe(426.7);
  });

  it('rounds to one decimal place', () => {
    // 100 * 1 * 0.5 / 3 = 16.666… → 16.7
    expect(computeRiceScore({ reach: 100, impact: 1, confidence: 0.5, effort: 3 })).toBe(16.7);
  });

  it('returns 0 when reach is 0', () => {
    expect(computeRiceScore({ reach: 0, impact: 3, confidence: 1, effort: 2 })).toBe(0);
  });

  it('handles fractional impact and confidence', () => {
    // 200 * 0.25 * 0.5 / 1 = 25
    expect(computeRiceScore({ reach: 200, impact: 0.25, confidence: 0.5, effort: 1 })).toBe(25);
  });

  // --- edge case: effort 0 ---
  it('clamps effort 0 to a small floor instead of dividing by zero', () => {
    const score = computeRiceScore({ reach: 1, impact: 1, confidence: 1, effort: 0 });
    expect(Number.isFinite(score)).toBe(true);
    // 1 / 0.01 = 100
    expect(score).toBe(100);
  });

  it('never yields Infinity or NaN for effort 0', () => {
    const score = computeRiceScore({ reach: 50, impact: 3, confidence: 1, effort: 0 });
    expect(Number.isFinite(score)).toBe(true);
    expect(Number.isNaN(score)).toBe(false);
  });

  it('withRiceScore attaches a score matching computeRiceScore', () => {
    const input = { reach: 300, impact: 1, confidence: 0.8, effort: 4 };
    expect(withRiceScore(input)).toEqual({ ...input, score: computeRiceScore(input) });
  });
});

describe('sortThemesByScore', () => {
  it('sorts themes by descending RICE score', () => {
    const themes = [makeTheme('a', 30), makeTheme('b', 120), makeTheme('c', 6)];
    expect(sortThemesByScore(themes).map((t) => t.id)).toEqual(['b', 'a', 'c']);
  });

  it('does not mutate the input array', () => {
    const themes = [makeTheme('a', 10), makeTheme('b', 50)];
    const originalOrder = themes.map((t) => t.id);
    sortThemesByScore(themes);
    expect(themes.map((t) => t.id)).toEqual(originalOrder);
  });

  // --- edge case: empty array ---
  it('returns an empty array unchanged', () => {
    expect(sortThemesByScore([])).toEqual([]);
  });

  // --- edge case: single theme ---
  it('returns a single theme as-is', () => {
    const themes = [makeTheme('solo', 42)];
    expect(sortThemesByScore(themes).map((t) => t.id)).toEqual(['solo']);
  });

  it('keeps equal-scored themes (no crash, stable enough)', () => {
    const themes = [makeTheme('a', 50), makeTheme('b', 50)];
    const ids = sortThemesByScore(themes).map((t) => t.id);
    expect(ids).toHaveLength(2);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
  });
});

describe('bucketThemes', () => {
  it('buckets by threshold: >=100 Now, >=30 Next, <30 Later', () => {
    const roadmap = bucketThemes([
      makeTheme('now', 150),
      makeTheme('next', 45),
      makeTheme('later', 10),
    ]);
    expect(roadmap.now.map((t) => t.id)).toEqual(['now']);
    expect(roadmap.next.map((t) => t.id)).toEqual(['next']);
    expect(roadmap.later.map((t) => t.id)).toEqual(['later']);
  });

  it('treats the threshold boundaries inclusively (100 → Now, 30 → Next)', () => {
    const roadmap = bucketThemes([
      makeTheme('exactly100', 100),
      makeTheme('exactly30', 30),
      makeTheme('justUnder30', 29.9),
    ]);
    expect(roadmap.now.map((t) => t.id)).toEqual(['exactly100']);
    expect(roadmap.next.map((t) => t.id)).toEqual(['exactly30']);
    expect(roadmap.later.map((t) => t.id)).toEqual(['justUnder30']);
  });

  it('sorts themes within each bucket by descending score', () => {
    const roadmap = bucketThemes([
      makeTheme('now-low', 110),
      makeTheme('now-high', 500),
      makeTheme('next-low', 31),
      makeTheme('next-high', 90),
    ]);
    expect(roadmap.now.map((t) => t.id)).toEqual(['now-high', 'now-low']);
    expect(roadmap.next.map((t) => t.id)).toEqual(['next-high', 'next-low']);
  });

  it('tags each entry with its bucket', () => {
    const roadmap = bucketThemes([makeTheme('a', 200), makeTheme('b', 50), makeTheme('c', 5)]);
    expect(roadmap.now[0].bucket).toBe('now');
    expect(roadmap.next[0].bucket).toBe('next');
    expect(roadmap.later[0].bucket).toBe('later');
  });

  // --- edge case: empty array ---
  it('returns three empty buckets for an empty array', () => {
    expect(bucketThemes([])).toEqual({ now: [], next: [], later: [] });
  });

  // --- edge case: single theme ---
  it('places a single theme into exactly one bucket', () => {
    const roadmap = bucketThemes([makeTheme('solo', 80)]);
    expect(roadmap.now).toHaveLength(0);
    expect(roadmap.next.map((t) => t.id)).toEqual(['solo']);
    expect(roadmap.later).toHaveLength(0);
  });

  it('does not mutate or drop themes (counts are preserved)', () => {
    const input = [makeTheme('a', 200), makeTheme('b', 50), makeTheme('c', 5), makeTheme('d', 1)];
    const roadmap = bucketThemes(input);
    const total = roadmap.now.length + roadmap.next.length + roadmap.later.length;
    expect(total).toBe(input.length);
  });
});
