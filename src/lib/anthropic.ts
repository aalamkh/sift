import type { Sentiment, Theme } from '../types';
import { withRiceScore } from './rice';

/**
 * Anthropic API client (browser-side).
 *
 * These functions call the Messages API directly from the browser with
 * `fetch`. That requires the `anthropic-dangerous-direct-browser-access: true`
 * header — without it the API rejects cross-origin browser requests. The user
 * supplies their own API key at runtime (held in memory only); it is passed in
 * per call and sent solely to api.anthropic.com.
 */

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

/** Shared headers for every request. */
function buildHeaders(apiKey: string): HeadersInit {
  return {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    // Required for direct browser-to-API calls (no proxy/server in between).
    'anthropic-dangerous-direct-browser-access': 'true',
  };
}

const ANALYZE_SYSTEM_PROMPT = `You are a senior product manager analyzing raw user feedback.
Below is a list of unstructured feedback items. Your job:
1. Group them into 3-7 distinct themes. Each theme is a coherent product
   problem or opportunity, not a vague category.
2. For each theme write a theme name (max 5 words) and a one-sentence
   description of the underlying need.
3. Count how many feedback items map to each theme.
4. Extract up to 2 short representative quotes per theme, verbatim,
   trimmed to under 15 words each.
5. Assess overall sentiment per theme: "negative", "mixed", or "positive".
6. Propose RICE inputs as a starting estimate:
   - reach: integer, users affected per quarter (scale from item count)
   - impact: one of 0.25, 0.5, 1, 2, 3
   - confidence: one of 0.5, 0.8, 1.0
   - effort: integer person-months, minimum 1
Return ONLY valid JSON, no preamble, no markdown fences, in this shape:
{ "themes": [ { "name": string, "description": string, "count": number,
  "sentiment": "negative"|"mixed"|"positive", "quotes": [string],
  "rice": { "reach": number, "impact": number, "confidence": number,
  "effort": number } } ] }`;

/** Wrap the raw feedback in the exact delimiters the prompt expects. */
function buildAnalyzeUserPrompt(feedback: string): string {
  return `Feedback items:\n<\n${feedback}\n>>>`;
}

/** Minimal shape of the Messages API response we care about. */
interface MessagesResponse {
  content?: Array<{ type: string; text?: string }>;
}

/**
 * POST to the Messages API and return the assistant's text block.
 * Throws a clean Error on HTTP failure or missing text.
 */
async function callMessages(
  apiKey: string,
  system: string | undefined,
  userContent: string,
  maxTokens: number,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: buildHeaders(apiKey),
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        ...(system ? { system } : {}),
        messages: [{ role: 'user', content: userContent }],
      }),
    });
  } catch (err) {
    throw new Error(
      `Network error calling Anthropic API: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.error?.message ?? JSON.stringify(body);
    } catch {
      detail = await response.text().catch(() => '');
    }
    throw new Error(
      `Anthropic API error (${response.status} ${response.statusText})${detail ? `: ${detail}` : ''}`,
    );
  }

  const data = (await response.json()) as MessagesResponse;
  const text = data.content?.find((b) => b.type === 'text' && typeof b.text === 'string')?.text;
  if (!text) {
    throw new Error('Anthropic API returned no text content.');
  }
  return text;
}

/** Strip a leading/trailing ```json (or ```) fence if the model added one. */
function stripJsonFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

const VALID_SENTIMENTS: ReadonlySet<string> = new Set(['negative', 'mixed', 'positive']);

/** Type guard validating a single raw theme object from the model. */
function isValidRawTheme(t: unknown): t is {
  name: string;
  description: string;
  count: number;
  sentiment: Sentiment;
  quotes: string[];
  rice: { reach: number; impact: number; confidence: number; effort: number };
} {
  if (typeof t !== 'object' || t === null) return false;
  const o = t as Record<string, unknown>;
  const rice = o.rice as Record<string, unknown> | undefined;
  return (
    typeof o.name === 'string' &&
    typeof o.description === 'string' &&
    typeof o.count === 'number' &&
    typeof o.sentiment === 'string' &&
    VALID_SENTIMENTS.has(o.sentiment) &&
    Array.isArray(o.quotes) &&
    o.quotes.every((q) => typeof q === 'string') &&
    typeof rice === 'object' &&
    rice !== null &&
    typeof rice.reach === 'number' &&
    typeof rice.impact === 'number' &&
    typeof rice.confidence === 'number' &&
    typeof rice.effort === 'number'
  );
}

/** Generate a stable-ish unique id for a theme. */
function makeThemeId(index: number): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `theme-${index}-${Date.now()}`;
}

/**
 * Analyze raw feedback: cluster into themes, score with RICE, return Theme[].
 *
 * @param feedback newline-separated raw feedback items
 * @param apiKey   user-supplied Anthropic API key (in memory only)
 */
export async function analyzeFeedback(feedback: string, apiKey: string): Promise<Theme[]> {
  try {
    const raw = await callMessages(
      apiKey,
      ANALYZE_SYSTEM_PROMPT,
      buildAnalyzeUserPrompt(feedback),
      2000,
    );

    let parsed: unknown;
    try {
      parsed = JSON.parse(stripJsonFences(raw));
    } catch {
      throw new Error('Could not parse the analysis response as JSON.');
    }

    const themesRaw = (parsed as { themes?: unknown })?.themes;
    if (!Array.isArray(themesRaw)) {
      throw new Error('Analysis response did not contain a "themes" array.');
    }

    const themes: Theme[] = themesRaw.map((t, i) => {
      if (!isValidRawTheme(t)) {
        throw new Error(`Theme at index ${i} has an unexpected shape.`);
      }
      return {
        id: makeThemeId(i),
        name: t.name,
        description: t.description,
        count: t.count,
        sentiment: t.sentiment,
        quotes: t.quotes.slice(0, 2),
        // Recompute the derived RICE score locally so it always matches inputs.
        rice: withRiceScore({
          reach: t.rice.reach,
          impact: t.rice.impact,
          confidence: t.rice.confidence,
          effort: t.rice.effort,
        }),
      };
    });

    if (themes.length === 0) {
      throw new Error('Analysis returned no themes.');
    }

    return themes;
  } catch (err) {
    // Surface a single, readable error to the caller.
    throw err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Generate a short executive rationale for the prioritized roadmap.
 *
 * @param themes themes to summarize (sorted internally by RICE, highest first)
 * @param apiKey user-supplied Anthropic API key (in memory only)
 */
export async function generateRationale(themes: Theme[], apiKey: string): Promise<string> {
  const sorted = [...themes].sort((a, b) => b.rice.score - a.rice.score);
  const themesJson = JSON.stringify(sorted);

  const prompt = `You are a product lead writing a brief roadmap rationale. Given these
prioritized themes with RICE scores, write a 2-3 sentence executive
summary explaining the prioritization: what to tackle Now and why, and
what is deliberately deferred. Be specific and decisive. Return plain
text only.
Themes (sorted by RICE, highest first): ${themesJson}`;

  try {
    const text = await callMessages(apiKey, undefined, prompt, 1000);
    return text.trim();
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err));
  }
}
