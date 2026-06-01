interface RationaleBoxProps {
  rationale: string;
  onGenerate: () => void;
  loading: boolean;
  /** Disabled when there are no themes or no API key. */
  disabled: boolean;
}

/** Shows the AI-generated executive summary, with a button to (re)fetch it. */
export function RationaleBox({ rationale, onGenerate, loading, disabled }: RationaleBoxProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/80 to-white shadow-card">
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-2">
          <SparkIcon className="h-4 w-4 text-brand-500" />
          <h2 className="font-display text-sm font-semibold text-ink">Executive summary</h2>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled || loading}
          className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 py-1.5
            text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed
            disabled:opacity-50"
        >
          {loading && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          )}
          {loading ? 'Generating…' : rationale ? 'Regenerate' : 'Generate rationale'}
        </button>
      </div>

      <div className="px-5 pb-5 pt-3">
        {rationale ? (
          <p className="text-[15px] leading-relaxed text-slate-700">{rationale}</p>
        ) : (
          <p className="text-sm text-slate-500">
            Generate a short, decisive summary of what to tackle Now and why — and what’s
            deliberately deferred.
          </p>
        )}
      </div>
    </div>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
