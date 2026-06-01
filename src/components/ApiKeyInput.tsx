import { useState } from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (key: string) => void;
}

/**
 * Runtime entry field for the Anthropic API key.
 *
 * The key lives only in React state in the parent (in memory). It is never
 * read from an env var and never written to localStorage / sessionStorage.
 */
export function ApiKeyInput({ apiKey, onChange }: ApiKeyInputProps) {
  const [revealed, setRevealed] = useState(false);
  const looksValid = apiKey.startsWith('sk-ant-') && apiKey.length > 20;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <KeyIcon className="h-4 w-4 text-brand-500" />
        <label htmlFor="api-key" className="text-sm font-semibold text-ink">
          Anthropic API key
        </label>
        {looksValid && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ready
          </span>
        )}
      </div>

      <div className="mt-3 flex items-stretch gap-2">
        <input
          id="api-key"
          type={revealed ? 'text' : 'password'}
          autoComplete="off"
          spellCheck={false}
          placeholder="sk-ant-..."
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2.5 font-mono
            text-sm text-ink outline-none transition focus:border-brand-500 focus:bg-white
            focus:ring-4 focus:ring-brand-100"
        />
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-600
            transition hover:border-slate-400 hover:bg-slate-50"
        >
          {revealed ? 'Hide' : 'Show'}
        </button>
      </div>

      {apiKey.length > 0 && !looksValid ? (
        <p className="mt-2 text-xs text-amber-600">
          That doesn’t look like an Anthropic key (expected to start with{' '}
          <code className="font-mono">sk-ant-</code>).
        </p>
      ) : (
        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
          <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          Your key stays in your browser and is never stored or sent anywhere but Anthropic.
        </p>
      )}
    </div>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m11 11 7 7m-2 0 2-2m-4-1 2-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
