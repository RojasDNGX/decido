# 🚀 Decido — Execution Roadmap (Alpha Week)

## AGENT EXECUTION INSTRUCTIONS (READ FIRST)

You are responsible for executing this roadmap step by step.

At the start of EVERY session:

1. Read this entire file.
2. Find the FIRST phase with Status: [ ] (not completed).
3. Execute ONLY that phase.
4. After finishing:

   * Explain what was implemented
   * Request human validation
5. WAIT for approval before continuing.
6. After approval:

   * Mark the phase as [x]
   * Save this file
   * Suggest the next phase

---

## GLOBAL RULES (STRICT)

* DO NOT modify AI decision logic or prompt
* DO NOT refactor unrelated code
* DO NOT execute multiple phases at once
* DO NOT expand scope
* KEEP everything minimal and functional
* PRIORITIZE stability over perfection

---

## PHASE 1 — USER IDENTIFICATION

Status: [x]

### Tasks:

* Generate a unique user ID
* Store in localStorage
* Persist across sessions

### Validation:

User ID remains after reload

---

## PHASE 2 — DECISION STORAGE

Status: [x]

### Tasks:

* Save decisions (input, output, timestamp)
* Store in localStorage
* Limit to last 5

### Validation:

Decisions persist and rotate correctly

---

## PHASE 3 — HISTORY UI

Status: [x]

### Tasks:

* Display list of past decisions
* Show input + timestamp
* Allow re-open

### Validation:

User can view previous decisions

---

## PHASE 4 — USAGE LIMIT

Status: [x]

### Tasks:

* Limit to 5 analyses
* Block after limit
* Show message

### Validation:

Limit enforced correctly

---

## PHASE 5 — ONBOARDING

Status: [x]

### Tasks:

* Add placeholder
* Add example
* Add "Try example"

### Validation:

User understands usage instantly

---

## PHASE 6 — METRICS

Status: [x]

### Tasks:

* Track usage count
* Log events

### Validation:

Metrics visible in logs

---

## PHASE 7 — FINAL VALIDATION

Status: [x]

### Tasks:

* Test full flow
* Validate edge cases
* Ensure stability

### Validation:

No broken flows

---

## EXECUTION RULE

* Always execute ONE phase at a time
* Always wait for human validation
* Never skip phases
* Never continue automatically
