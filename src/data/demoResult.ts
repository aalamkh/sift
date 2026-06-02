import type { Theme } from '../types';
import { withRiceScore } from '../lib/rice';
import { saasOnboarding } from './sampleFeedback';

/**
 * A pre-computed analysis of the `saasOnboarding` sample dataset.
 *
 * This powers **Demo Mode** so anyone can experience the full app — roadmap,
 * RICE cards, editable scoring, rationale, export — without an Anthropic API
 * key. It mirrors the exact shape `analyzeFeedback` returns, so the UI treats
 * it identically to a live result. RICE scores are computed with the same
 * `withRiceScore` helper the live path uses, so the math is always consistent.
 */
export const demoThemes: Theme[] = [
  {
    id: 'demo-export',
    name: 'Large CSV exports fail',
    description: 'Exports above ~40k rows time out or silently truncate, corrupting downstream analysis.',
    count: 4,
    sentiment: 'negative',
    quotes: [
      'Anything over 20k rows crawls or fails.',
      'Silently cut off my report at 50k rows.',
    ],
    rice: withRiceScore({ reach: 900, impact: 2, confidence: 0.8, effort: 3 }),
  },
  {
    id: 'demo-sso',
    name: 'Enterprise SSO missing',
    description: 'Security teams block company-wide rollout without SAML/Okta single sign-on.',
    count: 4,
    sentiment: 'negative',
    quotes: [
      "Can't roll out company-wide until you support SAML SSO.",
      'Does this integrate with Okta?',
    ],
    rice: withRiceScore({ reach: 500, impact: 3, confidence: 0.8, effort: 5 }),
  },
  {
    id: 'demo-onboarding',
    name: 'Confusing onboarding',
    description: 'New admins hit an empty dashboard with no guided setup, template, or demo data.',
    count: 4,
    sentiment: 'mixed',
    quotes: [
      'The onboarding is a maze.',
      'No template, just an empty dashboard staring at me.',
    ],
    rice: withRiceScore({ reach: 400, impact: 1, confidence: 0.5, effort: 4 }),
  },
  {
    id: 'demo-billing',
    name: 'Billing & seat confusion',
    description: 'Invoices, plan tiers, and seat counts disagree, eroding trust in charges.',
    count: 3,
    sentiment: 'negative',
    quotes: [
      'Got charged for Business while on the Team plan.',
      "The seat math doesn't add up.",
    ],
    rice: withRiceScore({ reach: 300, impact: 1, confidence: 0.8, effort: 8 }),
  },
  {
    id: 'demo-support',
    name: 'Slow support response',
    description: 'Tickets sit for days with only an automated acknowledgment, leaving users stuck.',
    count: 3,
    sentiment: 'negative',
    quotes: [
      "It's Thursday and all I've gotten is the automated email.",
      "When something breaks you're on your own for days.",
    ],
    rice: withRiceScore({ reach: 250, impact: 1, confidence: 0.5, effort: 6 }),
  },
];

/** Pre-written executive rationale matching the demo themes above. */
export const demoRationale =
  'Tackle large-export reliability and enterprise SSO now: both are high-reach, high-impact ' +
  'blockers that actively cost deals and erode trust, with SSO gating company-wide rollouts. ' +
  'Confusing onboarding and billing clarity come next — real activation and trust wins, but ' +
  'lower impact than the showstoppers. Slow support response is deliberately deferred this ' +
  'cycle: it’s painful, but better solved through staffing and process than product work.';

/** The raw feedback text the demo result was derived from (for the textarea). */
export const demoFeedbackText = saasOnboarding.join('\n');
