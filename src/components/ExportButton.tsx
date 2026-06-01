import { useState } from 'react';
import type { Roadmap } from '../types';
import { roadmapToMarkdown } from '../lib/exportMarkdown';

interface ExportButtonProps {
  roadmap: Roadmap;
  rationale: string;
}

/** Serializes the current roadmap + rationale to Markdown and copies it. */
export function ExportButton({ roadmap, rationale }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleCopy = async () => {
    const markdown = roadmapToMarkdown(roadmap, rationale);
    setFailed(false);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {failed && <span className="text-xs text-rose-600">Couldn’t access the clipboard.</span>}
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold
          shadow-sm transition ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'border border-slate-300 bg-white text-ink hover:border-slate-400 hover:bg-slate-50'
          }`}
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4" /> Copied
          </>
        ) : (
          <>
            <CopyIcon className="h-4 w-4 text-slate-500" /> Export Markdown
          </>
        )}
      </button>
    </div>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="8" y="8" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
