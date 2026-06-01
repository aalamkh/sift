import type { Roadmap, RoadmapBucket, RoadmapEntry } from '../types';

interface RoadmapViewProps {
  roadmap: Roadmap;
}

interface ColumnStyle {
  bucket: RoadmapBucket;
  label: string;
  blurb: string;
  /** Tailwind classes for the column accents. */
  header: string;
  dot: string;
  rail: string;
  chip: string;
}

// Now = warm/urgent · Next = neutral · Later = cool.
const COLUMNS: ColumnStyle[] = [
  {
    bucket: 'now',
    label: 'Now',
    blurb: 'High RICE — start immediately',
    header: 'text-orange-700',
    dot: 'bg-orange-500',
    rail: 'from-orange-400 to-orange-600',
    chip: 'bg-orange-100 text-orange-700',
  },
  {
    bucket: 'next',
    label: 'Next',
    blurb: 'Solid value — queue it up',
    header: 'text-slate-700',
    dot: 'bg-slate-500',
    rail: 'from-slate-400 to-slate-600',
    chip: 'bg-slate-200 text-slate-700',
  },
  {
    bucket: 'later',
    label: 'Later',
    blurb: 'Deferred — revisit when capacity frees up',
    header: 'text-cyan-700',
    dot: 'bg-cyan-500',
    rail: 'from-cyan-400 to-cyan-600',
    chip: 'bg-cyan-100 text-cyan-700',
  },
];

function CompactCard({ entry }: { entry: RoadmapEntry }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-3.5 shadow-card transition hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug text-ink">{entry.name}</h4>
        <span className="shrink-0 rounded-lg bg-ink px-2 py-0.5 font-mono text-xs font-bold text-white tabular-nums">
          {entry.rice.score}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
        <span className="tabular-nums">
          {entry.count} mention{entry.count === 1 ? '' : 's'}
        </span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className="capitalize">{entry.sentiment}</span>
      </div>
    </div>
  );
}

/** Three-column Now / Next / Later board; entries arrive pre-sorted by score. */
export function RoadmapView({ roadmap }: RoadmapViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const entries = roadmap[col.bucket];
        return (
          <div
            key={col.bucket}
            className="overflow-hidden rounded-2xl border border-black/5 bg-slate-50/60"
          >
            <div className={`h-1 w-full bg-gradient-to-r ${col.rail}`} />
            <div className="p-4">
              <div className="flex items-baseline gap-2">
                <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                <h3 className={`font-display text-base font-bold ${col.header}`}>{col.label}</h3>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${col.chip}`}
                >
                  {entries.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{col.blurb}</p>

              <div className="mt-3 space-y-2.5">
                {entries.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
                    Nothing here yet.
                  </div>
                ) : (
                  entries.map((entry) => <CompactCard key={entry.id} entry={entry} />)
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
