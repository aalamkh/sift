// Core domain types for the feedback-to-roadmap pipeline.

/** A single piece of raw product feedback as it enters the system. */
export interface FeedbackItem {
  id: string;
  /** The raw feedback text (support ticket, review, interview note, etc.). */
  text: string;
  /** Optional source channel, e.g. "intercom", "app-store", "sales-call". */
  source?: string;
  /** Optional ISO date string for when the feedback was captured. */
  date?: string;
  /** Optional customer/account identifier. */
  customer?: string;
}

/** RICE scoring inputs and the derived score for a theme. */
export interface RiceScore {
  /** Reach: how many users/accounts are affected per time period. */
  reach: number;
  /** Impact: magnitude per user. Conventionally 0.25 / 0.5 / 1 / 2 / 3. */
  impact: number;
  /** Confidence: 0–1 (e.g. 0.5, 0.8, 1.0). */
  confidence: number;
  /** Effort: person-months (or any consistent unit). Must be > 0. */
  effort: number;
  /** Derived: (reach * impact * confidence) / effort. */
  score: number;
}

/** Overall sentiment of the feedback within a theme. */
export type Sentiment = 'negative' | 'mixed' | 'positive';

/** A cluster of related feedback items with an AI-generated summary + RICE. */
export interface Theme {
  id: string;
  /** Short, human-readable theme name (max ~5 words). */
  name: string;
  /** One-sentence description of the underlying need. */
  description: string;
  /** How many raw feedback items map to this theme. */
  count: number;
  /** Overall sentiment across the theme's feedback. */
  sentiment: Sentiment;
  /** Up to 2 short, verbatim representative quotes. */
  quotes: string[];
  /** RICE scoring for the theme (includes the derived `score`). */
  rice: RiceScore;
}

/** The roadmap bucket a theme falls into based on its RICE score. */
export type RoadmapBucket = 'now' | 'next' | 'later';

/** A theme placed into a roadmap bucket. */
export interface RoadmapEntry extends Theme {
  bucket: RoadmapBucket;
}

/** The full prioritized roadmap, grouped by bucket. */
export interface Roadmap {
  now: RoadmapEntry[];
  next: RoadmapEntry[];
  later: RoadmapEntry[];
}
