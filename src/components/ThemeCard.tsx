import type { RiceScore, Sentiment, Theme } from '../types';
import { IMPACT_OPTIONS, CONFIDENCE_OPTIONS } from '../lib/rice';

interface ThemeCardProps {
  theme: Theme;
  /** Called with the full set of RICE inputs whenever one is edited. */
  onRiceChange: (id: string, inputs: Omit<RiceScore, 'score'>) => void;
}

const SENTIMENT_STYLES: Record<Sentiment, { badge: string; dot: string }> = {
  negative: { badge: 'bg-rose-50 text-rose-700 ring-rose-600/15', dot: 'bg-rose-500' },
  mixed: { badge: 'bg-amber-50 text-amber-700 ring-amber-600/15', dot: 'bg-amber-500' },
  positive: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15', dot: 'bg-emerald-500' },
};

/** A single editable theme: summary, sentiment, quotes, and live RICE inputs. */
export function ThemeCard({ theme, onRiceChange }: ThemeCardProps) {
  const { rice } = theme;
  const sentiment = SENTIMENT_STYLES[theme.sentiment];

  // Build the next RICE input set from a single changed field and bubble up.
  const update = (patch: Partial<Omit<RiceScore, 'score'>>) => {
    onRiceChange(theme.id, {
      reach: rice.reach,
      impact: rice.impact,
      confidence: rice.confidence,
      effort: rice.effort,
      ...patch,
    });
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-card transition hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold leading-snug text-ink">{theme.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{theme.description}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${sentiment.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${sentiment.dot}`} />
          {theme.sentiment}
        </span>
      </div>

      <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400 tabular-nums">
        {theme.count} mention{theme.count === 1 ? '' : 's'}
      </div>

      {theme.quotes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {theme.quotes.map((q, i) => (
            <li
              key={i}
              className="rounded-lg border-l-2 border-brand-200 bg-brand-50/40 py-1.5 pl-3 pr-2 text-sm italic text-slate-600"
            >
              “{q}”
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <NumberField
            label="Reach"
            value={rice.reach}
            min={0}
            onChange={(n) => update({ reach: Math.max(0, Math.floor(n || 0)) })}
          />
          <SelectField
            label="Impact"
            value={rice.impact}
            options={IMPACT_OPTIONS}
            onChange={(n) => update({ impact: n })}
          />
          <SelectField
            label="Confidence"
            value={rice.confidence}
            options={CONFIDENCE_OPTIONS}
            onChange={(n) => update({ confidence: n })}
          />
          <NumberField
            label="Effort"
            value={rice.effort}
            min={1}
            onChange={(n) => update({ effort: Math.max(1, Math.floor(n || 1)) })}
          />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-ink px-4 py-2.5">
          <span className="text-xs font-medium uppercase tracking-wider text-white/60">
            RICE score
          </span>
          <span className="font-mono text-lg font-bold text-white tabular-nums">{rice.score}</span>
        </div>
      </div>
    </div>
  );
}

function fieldLabelClass() {
  return 'flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500';
}
function fieldInputClass() {
  return `rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-ink
    outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100`;
}

function NumberField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className={fieldLabelClass()}>
      {label}
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${fieldInputClass()} tabular-nums`}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: readonly number[];
  onChange: (n: number) => void;
}) {
  return (
    <label className={fieldLabelClass()}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={fieldInputClass()}
      >
        {options.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}
