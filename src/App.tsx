import { useMemo, useState } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { FeedbackInput } from './components/FeedbackInput';
import { ThemeCard } from './components/ThemeCard';
import { RoadmapView } from './components/RoadmapView';
import { RationaleBox } from './components/RationaleBox';
import { ExportButton } from './components/ExportButton';
import { analyzeFeedback, generateRationale } from './lib/anthropic';
import { bucketThemes, withRiceScore } from './lib/rice';
import { demoThemes, demoRationale, demoFeedbackText } from './data/demoResult';
import type { RiceScore, Theme } from './types';

export default function App() {
  // All state lives here; nothing is persisted to any browser storage.
  const [apiKey, setApiKey] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rationale, setRationale] = useState('');
  const [rationaleLoading, setRationaleLoading] = useState(false);
  // True when the on-screen result is the canned demo (no live API call).
  const [isDemo, setIsDemo] = useState(false);

  const hasKey = apiKey.trim().length > 0;
  const hasFeedback = feedbackText.trim().length > 0;

  // Buckets + sorting recompute automatically whenever a theme's RICE changes.
  const roadmap = useMemo(() => bucketThemes(themes), [themes]);

  async function handleAnalyze() {
    setError(null);
    setLoading(true);
    setIsDemo(false);
    try {
      const result = await analyzeFeedback(feedbackText, apiKey);
      setThemes(result);
      setRationale(''); // stale once the themes change
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  // Demo Mode: load a pre-computed sample result — no API key, no network call.
  // A short delay shows the analyzing state so the flow feels real.
  function handleLoadDemo() {
    setError(null);
    setFeedbackText(demoFeedbackText);
    setLoading(true);
    window.setTimeout(() => {
      setThemes(demoThemes);
      setRationale(demoRationale);
      setIsDemo(true);
      setLoading(false);
    }, 650);
  }

  async function handleGenerateRationale() {
    setError(null);
    setRationaleLoading(true);
    try {
      const text = await generateRationale(themes, apiKey);
      setRationale(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRationaleLoading(false);
    }
  }

  // Update one theme's RICE inputs; the derived score is recomputed here so
  // bucketing and sorting (via useMemo above) stay in sync.
  function handleRiceChange(id: string, inputs: Omit<RiceScore, 'score'>) {
    setThemes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, rice: withRiceScore(inputs) } : t)),
    );
  }

  const hasThemes = themes.length > 0;
  const totalMentions = themes.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Header />

        <main className="mt-10 space-y-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
            </div>
            <div className="lg:col-span-3">
              <FeedbackInput
                value={feedbackText}
                onChange={setFeedbackText}
                onAnalyze={handleAnalyze}
                onLoadDemo={handleLoadDemo}
                loading={loading}
                disabled={!hasKey || !hasFeedback}
                needsKey={!hasKey}
              />
            </div>
          </div>

          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          {loading && <AnalyzingState />}

          {!loading && !hasThemes && <EmptyState onLoadDemo={handleLoadDemo} />}

          {hasThemes && (
            <div className="space-y-8 animate-fade-in-up">
              {isDemo && <DemoBanner hasKey={hasKey} />}
              <section>
                <SectionHeading
                  title="Prioritized roadmap"
                  subtitle={`${themes.length} themes · ${totalMentions} mentions clustered`}
                  action={<ExportButton roadmap={roadmap} rationale={rationale} />}
                />
                <RoadmapView roadmap={roadmap} />
              </section>

              <RationaleBox
                rationale={rationale}
                onGenerate={handleGenerateRationale}
                loading={rationaleLoading}
                disabled={!hasKey}
              />

              <section>
                <SectionHeading
                  title="Themes & RICE scoring"
                  subtitle="Tune any input — the roadmap re-buckets and re-sorts instantly."
                />
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {themes.map((theme) => (
                    <ThemeCard key={theme.id} theme={theme} onRiceChange={handleRiceChange} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout pieces                                                       */
/* ------------------------------------------------------------------ */

function Header() {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
          <FunnelIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            Feedback&nbsp;<span className="text-brand-600">→</span>&nbsp;Roadmap
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 sm:text-[15px]">
            Cluster raw feedback into themes, score them with RICE, ship a Now / Next / Later plan.
          </p>
        </div>
      </div>
      <span className="hidden items-center gap-2 self-start whitespace-nowrap rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 sm:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        Powered by Claude
      </span>
    </header>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-card animate-fade-in-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100">
        <span className="text-rose-600" aria-hidden>
          !
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-rose-800">Something went wrong</p>
        <p className="mt-0.5 break-words text-sm text-rose-700">{message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg px-2 py-1 text-sm text-rose-500 hover:bg-rose-100"
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  );
}

function AnalyzingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white/70 px-6 py-16 text-center shadow-card">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600" />
      <p className="mt-4 font-display font-semibold text-ink">Reading the feedback…</p>
      <p className="mt-1 text-sm text-slate-500">
        Clustering into themes and proposing RICE estimates. This usually takes a few seconds.
      </p>
    </div>
  );
}

function EmptyState({ onLoadDemo }: { onLoadDemo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
        <FunnelIcon className="h-7 w-7 text-brand-500" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">No roadmap yet</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        Paste your raw feedback above — or load a sample dataset — then hit{' '}
        <span className="font-medium text-brand-700">Analyze feedback</span> to see it clustered,
        scored, and prioritized.
      </p>
      <div className="mt-5 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onLoadDemo}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700"
        >
          ▶ See a sample result
        </button>
        <span className="text-xs text-slate-400">No API key required — instant demo.</span>
      </div>
    </div>
  );
}

function DemoBanner({ hasKey }: { hasKey: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
      <span className="mt-0.5 shrink-0 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
        Demo
      </span>
      <p className="text-sm text-brand-900/80">
        This is a pre-computed sample analysis — no API call was made. Everything below is fully
        interactive: edit any RICE input to re-prioritize, or export the roadmap.{' '}
        {hasKey
          ? 'Click “Analyze feedback” above to run it for real on this data.'
          : 'Add your own Anthropic API key above to analyze your own feedback live.'}
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/5 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-400 sm:flex-row sm:px-6">
        <p>
          Feedback&nbsp;→&nbsp;Roadmap — a portfolio project. Your API key never leaves your
          browser.
        </p>
        <p>Built with React, Tailwind &amp; the Anthropic API.</p>
      </div>
    </footer>
  );
}

function FunnelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 5.5h18l-7 8v5.5l-4 2v-7.5l-7-8Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
