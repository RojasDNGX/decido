## Type: MVP Finalization

This roadmap defines the final steps before promoting the MVP to production.

This is NOT a feature phase.

This is a **stabilization and transition phase**.

---

## 🎯 OBJECTIVE

Prepare the current MVP for production release (main branch),
ensuring it is:

→ stable
→ predictable
→ validated
→ clean

---

## ⚠️ RULE

NO new features.

Only:

→ validation
→ cleanup
→ consistency

---

# 🧩 PHASE 1 — FINAL VALIDATION

Status: [x]

---

## Tasks

* Validate full decision flow manually (end-to-end)
* Run Playwright tests (must pass 100%)
* Run documentation lint (must pass)
* Confirm no console errors in browser
* Validate freemium limit behavior (429 → /limite)
* Validate priority adjustment behavior
* Validate example input behavior

---

## Validation Criteria

* All flows behave exactly as expected
* No unexpected UI glitches
* No broken interactions

---

# 🧩 PHASE 2 — UX CONSISTENCY CHECK

Status: [x]

---

## Tasks

* Review all user-facing text (clarity and tone)
* Confirm morning-use positioning is clear
* Ensure no redundant UI elements
* Validate "primary action" visibility
* Confirm no cognitive overload in interface

---

## Validation Criteria

* Interface is clean and self-explanatory
* No conflicting signals

---

# 🧩 PHASE 3 — CODE & STRUCTURE CLEANUP

Status: [x]

---

## Tasks

* Remove unused code
* Remove debug logs (except analytics)
* Ensure folder structure is consistent
* Validate no duplicated logic
* Confirm environment variables are clean

---

## Validation Criteria

* Codebase is minimal and readable
* No dead code remains

---

# 🧩 PHASE 4 — ANALYTICS & INSIGHT VALIDATION

Status: [x]

---

## Tasks

* Validate events are firing correctly
* Validate attempt_id consistency
* Validate decidoInsights() output
* Confirm no duplicate events

---

## Validation Criteria

* Metrics reflect real usage
* No inconsistencies

---

# 🧩 PHASE 5 — FINAL BUILD CHECK

Status: [x]

---

## Tasks

* Run production build
* Validate no build errors
* Run application in production mode
* Perform quick smoke test

---

## Validation Criteria

* Build is successful
* App runs without issues

---

# 🧩 PHASE 6 — PRODUCTION PROMOTION

Status: [x]

---

## Tasks

* Merge current state into main branch
* Tag version (v1.0.0)
* Confirm CI passes on main
* Ensure README is up-to-date

---

---

## Versioning & Branch Promotion

### Tasks

* Ensure all validated changes are committed in the current working branch
* Trigger "run dev" to validate final integration state
* After validation passes, trigger "run prod" to promote the MVP to production

---

### Expected Behavior

* "run dev" must execute full validation (lint + tests)
* "run prod" must:

  → merge validated state into main
  → ensure CI passes on main
  → represent the official MVP release

---

### Constraints

* Do NOT bypass validation
* Do NOT promote incomplete or unvalidated state
* Do NOT perform manual or partial commits

---

### Validation Criteria

* main branch reflects final MVP state
* dev and main are aligned at release point
* no pending changes remain

---

## Validation Criteria

* main branch is stable
* version is clearly defined

---

# 🧩 PHASE 7 — DEV RESET FOR ENTERPRISE

Status: [ ]

---

## Tasks

* Create clean branch from main → dev
* Ensure dev starts from stable baseline
* Document next phase (Enterprise direction)
* DO NOT implement features yet

---

## Validation Criteria

* dev is clean and aligned with main
* ready for next phase

---

# 🎯 FINAL STATE

After completion:

* main = stable MVP in production
* dev = clean base for Enterprise
* system = validated and reliable

---

## FINAL RULE

If something feels unnecessary:

→ remove it

If something creates doubt:

→ fix it before production
