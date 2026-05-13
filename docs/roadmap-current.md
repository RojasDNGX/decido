# DECIDO — OPERATIONAL STATUS

Status: STABLE — no active roadmap

---

## Current Phase

**OPERATION — not construction.**

The product reached a stable behavioral baseline as of week-18B.

The AI consistently returns ONE primary action with defensible priority distribution.
Billing, auth, rate limiting, and observability are all production-validated.

---

## What this means

There is no active roadmap to execute.

The current priority is:

* Observing real user behavior in production
* Monitoring retention and conversion signals
* Maintaining behavioral regression protection (Playwright suite)
* Responding to concrete production issues with minimal, isolated fixes

---

## When to open a new roadmap

Only when there is:

* Real regression evidence from production
* Consistent behavioral failure pattern
* Concrete user data motivating a specific change
* A structural problem that cannot be fixed with a small isolated fix

---

## Archive

All completed roadmaps are in `docs/archive/roadmaps/`:

* `decido-mvp/` — weeks 1–7 (MVP foundation through traction)
* `decido-pro/` — weeks 13–18B (billing, AI hardening, behavioral stabilization)
* `decido-enterprise/` — future cycles (placeholder)

---

## Next direction

See `docs/enterprise-direction.md` for the intended future scope.
