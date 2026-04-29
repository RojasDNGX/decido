# WEEK 7 — CONTROLLED EXPANSION (EVIDENCE-DRIVEN)

This roadmap introduces the first **controlled expansion layer** after context improvements.

This is NOT full Enterprise.

This is **evidence-driven expansion with zero complexity increase**.

---

## 🎯 OBJECTIVE

Validate real expansion behaviors (sharing, persistence, reuse)
WITHOUT breaking simplicity, speed, or decision clarity.

---

## ⚠️ RULES (NON-NEGOTIABLE)

* DO NOT change decision logic
* DO NOT introduce multi-step flows
* DO NOT add new screens
* DO NOT break "single primary action"
* DO NOT introduce system complexity (auth, roles, multi-user structures)
* ALL changes must feel invisible or optional

---

# 🧩 PHASE 1 — DECISION SHARING (MINIMAL)

Status: [x]

---

## Tasks

* Add a **subtle share action** to the decision result

Examples:

* Copy to clipboard
* Generate simple shareable text
* (Optional) lightweight share link (no auth)

---

## Constraints

* Must NOT interrupt flow
* Must NOT appear before decision is shown
* Must be visually secondary

---

## Validation Criteria

* Users occasionally share decisions
* No impact on primary flow
* No confusion introduced

---

# 🧩 PHASE 2 — LIGHT PERSISTENCE (LOCAL-FIRST)

Status: [x]

---

## Tasks

* Store recent decisions locally (client-side only)

Examples:

* last 3–5 decisions
* session/localStorage based

---

## Constraints

* No UI screen for history
* No navigation changes
* No backend persistence

---

## Validation Criteria

* Users benefit from implicit memory
* No added complexity
* No awareness required from user

---

# 🧩 PHASE 3 — REUSE SIGNAL DETECTION

Status: [x]

---

## Tasks

* Detect repeated or similar inputs

Examples:

* similar phrases
* recurring topics

---

## Behavior

* System passively improves prioritization based on recurrence
* No UI indication required

---

## Constraints

* No visible feature
* No explanation to user
* No change in response structure

---

## Validation Criteria

* Improved consistency in repeated scenarios
* Faster convergence of correct decisions

---

# 🧩 PHASE 4 — BEHAVIOR OBSERVATION

Status: [ ]

---

## Tasks

* Observe:

  * sharing usage frequency
  * recurrence patterns
  * repeated input behavior
  * decision acceptance stability

---

## Validation Criteria

* Sharing is organic (not forced)
* Recurring inputs produce consistent outputs
* No increase in confusion or friction

---

# 🧩 PHASE 5 — STABILITY CHECK

Status: [ ]

---

## Tasks

* Run Playwright tests
* Validate no regression in UX
* Validate no increase in cognitive load
* Ensure no new visible complexity

---

## Validation Criteria

* All tests pass
* System feels identical — just slightly more capable

---

# 🎯 FINAL STATE

After completion:

* Users can share decisions naturally
* System remembers lightly (without being explicit)
* Repeated scenarios become more accurate
* No perceived increase in complexity

---

## FINAL RULE

If expansion introduces complexity:

→ rollback

If expansion feels invisible and useful:

→ keep

---

## POSITIONING

This week validates:

→ Does Decido benefit from expanded context beyond a single interaction?

NOT:

→ How to build Enterprise

---

Execute with discipline.
