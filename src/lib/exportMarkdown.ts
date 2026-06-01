import type { Roadmap, RoadmapBucket, RoadmapEntry } from '../types';

const BUCKET_LABELS: Record<RoadmapBucket, string> = {
  now: 'Now',
  next: 'Next',
  later: 'Later',
};

function entryToMarkdown(entry: RoadmapEntry): string {
  const { rice } = entry;
  const lines: string[] = [];
  lines.push(`### ${entry.name} — RICE ${rice.score}`);
  lines.push('');
  lines.push(entry.description);
  lines.push('');
  lines.push(`- **Sentiment:** ${entry.sentiment} · **Mentions:** ${entry.count}`);
  lines.push(
    `- **RICE:** reach ${rice.reach} × impact ${rice.impact} × confidence ${rice.confidence} ÷ effort ${rice.effort} = **${rice.score}**`,
  );
  if (entry.quotes.length > 0) {
    lines.push('- **Quotes:**');
    for (const q of entry.quotes) {
      lines.push(`  - "${q}"`);
    }
  }
  return lines.join('\n');
}

/**
 * Serialize the roadmap (themes, buckets, scores) plus an optional rationale
 * to clean, copy-pasteable Markdown.
 */
export function roadmapToMarkdown(roadmap: Roadmap, rationale?: string): string {
  const sections: string[] = ['# Product Roadmap'];

  if (rationale && rationale.trim()) {
    sections.push('', '## Executive summary', '', rationale.trim());
  }

  for (const bucket of ['now', 'next', 'later'] as const) {
    const entries = roadmap[bucket];
    sections.push('', `## ${BUCKET_LABELS[bucket]}`);
    if (entries.length === 0) {
      sections.push('', '_Nothing in this bucket._');
      continue;
    }
    for (const entry of entries) {
      sections.push('', entryToMarkdown(entry));
    }
  }

  return sections.join('\n') + '\n';
}
