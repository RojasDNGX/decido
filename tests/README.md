# Decido — Behavioral Regression Suite

This test suite is **critical regression infrastructure**, not optional QA tooling.

It lives in `main` intentionally. Its purpose is to protect the behavioral baseline
established after week-18B stabilization — not just to verify that the build passes.

## Why this matters

TypeScript, ESLint, and Next.js builds can pass while the product silently degrades.
Small changes to renderer logic, fallback behavior, or priority heuristics can destroy
cognitive trust without triggering any static check. This suite is the last line of defense.

**Run before any production merge:**

```bash
npx playwright test
# or
npm test
```

Zero failures required. No exceptions.

## Coverage

| File | What it tests |
|------|---------------|
| `decido.spec.ts` | Core decision flow, example button, limit page, priority adjustment, share/shared view |
| `billing.spec.ts` | Checkout and billing portal auth guards, webhook signature validation, account redirect |
| `security.spec.ts` | Guest redirect to signin, privacy policy page, forgot-password rate limiting, route protection |

## Technical notes

- Base URL: `http://localhost:3001` (local dev server — must be running)
- AI responses are mocked via `page.route('/api/analyze')` — no real AI or quota consumed
- Rate limiting tests use a unique email per run (`Date.now()`) to avoid state pollution
- Behavioral assertions (priority flow, result rendering) are the critical path

## What this suite does NOT cover yet

- Real AI output quality (mocked)
- Distribution correctness (HIGH/MEDIUM/LOW balance)
- Semantic regression of priority decisions

These are validated manually via the `run prod` protocol before each production merge.
As real usage data accumulates, behavioral tests may be added here.

## Operational protocol

| Scenario | Action |
|----------|--------|
| Feature branch | Tests optional, run subset |
| Merge to dev | Tests required, all must pass |
| Merge to main (run prod) | Tests mandatory, zero tolerance |
