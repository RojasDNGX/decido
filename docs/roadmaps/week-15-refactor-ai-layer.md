# DECIDO — AI LAYER REFACTOR (WEEK-15-REFORM)

Refactor the AI architecture of Decido.

This is a structural refactor.

DO NOT degrade output quality.
DO NOT simplify logic.
DO NOT break PRO behavior.

---

# 🎯 GOAL

Unify intelligence across plans using a layered architecture.

FREE must derive from PRO — not be rebuilt separately.

---

# 🧠 CORE PRINCIPLE

```text
One intelligence.
Multiple capability layers.
```

---

# 🚨 CRITICAL RULES

* PRO is the source of truth
* FREE must NOT have independent logic
* No duplicated decision rules
* No regression in prioritization quality
* No robotic language reintroduced

---

# 🧱 PHASE 1 — EXTRACT PRO INTO LAYERS [x]

Break current PRO prompt into modular files:

---

## core.md

Contains:

* task extraction
* priority structure
* output format
* single primary action rule

---

## heuristics.md

Contains:

* human priority rules (work > optional)
* health priority
* basic decision logic

---

## context.md

Contains:

* implicit urgency
* semantic interpretation
* context inference

---

## validation.md

Contains:

* final validation loop
* anti-duplication rules
* distribution enforcement

---

## (future) memory.md

Placeholder only

---

# 🧱 PHASE 2 — REMOVE FREE PARALLEL LOGIC [x]

* delete or deactivate FREE-specific prompt logic
* remove duplicated reasoning rules
* ensure no divergence from PRO base

---

# 🧱 PHASE 3 — REBUILD FREE AS SUBSET

FREE must use:

```text
core + heuristics + forced_decision
```

---

FREE must NOT use:

* context.md
* validation.md (full version)
* memory

---

# 🧱 PHASE 4 — IMPLEMENT FORCED DECISION AS LAYER

Create:

forced_decision.md

Contains:

* must produce HIGH / MEDIUM / LOW
* cannot collapse priorities
* cannot use same justification repeatedly
* must decide even under uncertainty

---

# 🧱 PHASE 5 — PLAN COMPOSITION (ORCHESTRATOR)

Refactor orchestrator:

---

## FREE

```ts
core + heuristics + forcedDecision
```

---

## PRO

```ts
core + heuristics + context + validation
```

---

## ENTERPRISE (placeholder)

```ts
core + heuristics + context + memory + validation
```

---

# 🧱 PHASE 6 — REMOVE TEMPLATE JUSTIFICATION

Ensure:

* no fixed sentence patterns
* no rigid reasoning templates
* justifications must adapt to task context

---

# 🧱 PHASE 7 — CONSISTENCY RULE

FREE and PRO must produce:

* same priority ordering for same input
* same core reasoning logic

Difference must be:

* depth
* clarity
* context awareness

NOT correctness.

---

# 🧱 PHASE 8 — REGRESSION TESTS

Test scenarios:

---

## CASE 1

"Terminar funcionalidade, ler livro, fazer exercício"

---

## CASE 2

"Levar cachorro ao veterinário, pagar conta, assistir série"

---

## CASE 3

"Arrumar torneira, trocar lâmpada, trabalhar"

---

## EXPECTATION

* FREE and PRO agree on priority order
* PRO provides deeper reasoning
* FREE remains natural and coherent

---

# 🧱 PHASE 9 — STABILITY TEST

Run same input 3–5 times.

Ensure:

* no oscillation
* no fallback collapse
* no repeated justifications

---

# 🚨 FORBIDDEN

* do NOT create separate logic per plan
* do NOT reintroduce generic fallback dominance
* do NOT simplify reasoning into templates
* do NOT degrade natural language

---

# 🎯 FINAL EXPECTATION

System must behave as:

→ same intelligence baseline
→ different capability levels

---

# 📦 OUTPUT

Return:

* new file structure
* layer composition logic
* comparison FREE vs PRO outputs
* regression results

---

Execute this refactor safely and incrementally.
