import { saasOnboarding, mobileApp, ecommerce } from '../data/sampleFeedback';

interface FeedbackInputProps {
  value: string;
  onChange: (text: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  /** Disabled when there is no API key or no feedback text. */
  disabled: boolean;
  /** True when the only thing missing is the API key (drives the hint). */
  needsKey: boolean;
}

const SAMPLES: { label: string; data: string[] }[] = [
  { label: 'B2B SaaS', data: saasOnboarding },
  { label: 'Mobile app', data: mobileApp },
  { label: 'E-commerce', data: ecommerce },
];

/**
 * Raw feedback entry: a large textarea, three "Load sample" buttons (one per
 * dataset), and the "Analyze feedback" action with a loading state.
 */
export function FeedbackInput({
  value,
  onChange,
  onAnalyze,
  loading,
  disabled,
  needsKey,
}: FeedbackInputProps) {
  const itemCount = value.split('\n').filter((l) => l.trim().length > 0).length;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <label htmlFor="feedback" className="text-sm font-semibold text-ink">
          Raw feedback
        </label>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 tabular-nums">
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </span>
      </div>

      <textarea
        id="feedback"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder={
          'Paste feedback, one item per line —\n  The export keeps timing out…\n  Please add dark mode…\n  Support never replied…'
        }
        className="mt-3 w-full flex-1 resize-y rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-3
          text-sm leading-relaxed text-ink outline-none transition placeholder:text-slate-400
          focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">Try a sample</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onChange(s.data.join('\n'))}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium
              text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            {s.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled || loading}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5
            text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700
            disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400
            disabled:shadow-none"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {loading ? 'Analyzing…' : 'Analyze feedback'}
          {!loading && <span aria-hidden>→</span>}
        </button>
      </div>

      {needsKey && (
        <p className="mt-2 text-right text-xs text-slate-400">
          Add your API key to enable analysis.
        </p>
      )}
    </div>
  );
}
