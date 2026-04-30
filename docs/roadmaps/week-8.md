# SYSTEM EXECUTION — WEEK-8 (MODULE 3: SHARED DECISION — PUBLIC LINK)

You are executing Week-8 based on the enterprise strategy.

---

## 🎯 OBJECTIVE

Validate if a decision can exist outside the individual context.

---

## ⚠️ SCOPE

This is NOT collaboration.

This is ONLY:

→ decision → shareable link → read-only access

---

## ⚠️ NON-NEGOTIABLE RULES

* DO NOT change decision logic
* DO NOT modify `/decidir` flow
* DO NOT introduce UI complexity
* DO NOT require authentication
* DO NOT introduce editing or interaction

---

# 🧩 PHASE 1 — SHAREABLE DECISION (LINK GENERATION)

Status: [ ]

---

## Tasks

* Create endpoint:

POST /api/share

* Input:

{
decision: <full decision object>
}

---

* Generate unique ID:

Example:
abc123xyz

---

* Store decision:

Use temporary storage (in-memory or lightweight file/db)

---

* Return:

{
share_url: "/d/abc123xyz"
}

---

## Constraints

* No authentication
* No persistence guarantees required
* Keep it simple

---

## Validation Criteria

* Link is generated successfully
* Link can be opened

---

# 🧩 PHASE 2 — READ-ONLY VIEW

Status: [ ]

---

## Tasks

Create route:

/d/[id]

---

Display:

* primary action (highlighted)
* justification
* priority list

---

## Constraints

* NO input field
* NO editing
* NO actions (except copy optional)
* must feel static and clean

---

## Validation Criteria

* Decision is readable
* No interaction confusion
* No UI overload

---

# 🧩 PHASE 3 — INTEGRATION (MINIMAL)

Status: [ ]

---

## Tasks

* Add subtle "copy link" capability AFTER decision is generated

---

## Constraints

* Must NOT compete with primary action
* Must NOT be visually prominent
* No share modal

---

## Validation Criteria

* Link accessible when needed
* Does not affect flow

---

# 🧩 PHASE 4 — BEHAVIOR OBSERVATION

Status: [ ]

---

## Tasks

Observe:

* Are links being used?
* Are decisions understandable outside context?
* Does external viewing add value?

---

## Validation Criteria

* Decision still makes sense standalone
* No confusion without input context

---

# 🧩 PHASE 5 — STABILITY CHECK

Status: [ ]

---

## Tasks

* Run Playwright tests
* Run docs lint
* Validate no regression

---

## Validation Criteria

* System unchanged for core usage
* No new friction

---

# 🎯 FINAL STATE

After completion:

* Decisions can be accessed via link
* External viewing works
* No increase in complexity
* Core experience unchanged

---

## FINAL RULE

If sharing adds friction → rollback
If sharing feels invisible → keep

---

Execute with discipline.
