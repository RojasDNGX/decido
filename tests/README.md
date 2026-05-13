# Decido — Test Suite

Playwright E2E regression suite. Run with:

```bash
npx playwright test
# or
npm test
```

## Coverage

| File | What it tests |
|------|---------------|
| `decido.spec.ts` | Core decision flow, example button, limit page, priority adjustment, share/shared view |
| `billing.spec.ts` | Checkout and billing portal auth guards, webhook signature validation, account redirect |
| `security.spec.ts` | Guest redirect to signin, privacy policy page, forgot-password rate limiting, route protection |

## Notes

- Base URL: `http://localhost:3001` (dev server)
- All AI responses are mocked via `page.route('/api/analyze')` — no real AI calls
- Rate limiting tests use unique emails per run to avoid state pollution across runs
- Intended as CI regression gate before production merges (`run prod` protocol)
