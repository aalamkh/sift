import type { RiceScore, Theme, Roadmap, RoadmapEntry, RoadmapBucket } from '../types';

/** Allowed values for the Impact RICE input (multiplier per user). */
export const IMPACT_OPTIONS = [0.25, 0.5, 1, 2, 3] as const;

/** Allowed values for the Confidence RICE input (0–1). */
export const CONFIDENCE_OPTIONS = [0.5, 0.8, 1.0] as const;

/**
 * Compute the RICE score: (Reach × Impact × Confidence) / Effort.
 * Effort is clamped to a small positive floor to avoid division by zero.
 */
export function computeRiceScore(input: Omit<RiceScore, 'score'>): number {
  const effort = Math.max(input.effort, 0.01);
  const raw = (input.reach * input.impact * input.confidence) / effort;
  // Round to one decimal for stable, readable display.
  return Math.round(raw * 10) / 10;
}

/** Return a complete RiceScore, recomputing the derived `score` field. */
export function withRiceScore(input: Omit<RiceScore, 'score'>): RiceScore {
  return { ...input, score: computeRiceScore(input) };
}

/**
 * Bucket a theme into Now / Next / Later based on its RICE score.
 * Thresholds are intentionally simple and tunable.
 */
export function bucketForScore(score: number): RoadmapBucket {
  if (score >= 100) return 'now';
  if (score >= 30) return 'next';
  return 'later';
}

/**
 * Return a new array of themes sorted by descending RICE score.
 * Pure: the input array is not mutated. Generic so it also sorts RoadmapEntry[].
 */
export function sortThemesByScore<T extends Theme>(themes: T[]): T[] {
  return [...themes].sort((a, b) => b.rice.score - a.rice.score);
}

/**
 * Turn a flat list of scored themes into a prioritized Now/Next/Later roadmap.
 * Each theme is tagged with its bucket, and themes within each bucket are
 * sorted by descending RICE score.
 */
export function bucketThemes(themes: Theme[]): Roadmap {
  const roadmap: Roadmap = { now: [], next: [], later: [] };

  for (const theme of themes) {
    const bucket = bucketForScore(theme.rice.score);
    const entry: RoadmapEntry = { ...theme, bucket };
    roadmap[bucket].push(entry);
  }

  roadmap.now = sortThemesByScore(roadmap.now);
  roadmap.next = sortThemesByScore(roadmap.next);
  roadmap.later = sortThemesByScore(roadmap.later);

  return roadmap;
}
