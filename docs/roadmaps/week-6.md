# WEEK 6 — CONTEXT EXPANSION (PRE-ENTERPRISE)

This roadmap introduces the first controlled expansion of the decision context.

This is NOT Enterprise yet.

This is the **foundation for Enterprise**.

---

## 🎯 OBJECTIVE

Allow richer input context without increasing complexity or breaking the core experience.

---

## ⚠️ RULES

* DO NOT change decision logic
* DO NOT introduce multi-step flows
* DO NOT add new screens
* DO NOT break "single primary action"

---

# 🧩 PHASE 1 — INPUT CONTEXT ENHANCEMENT

Status: [ ]

---

## Tasks

* Improve placeholder text to guide richer input

Example:

Before:
"Digite suas tarefas..."

After:
"Descreva tudo que está competindo pela sua atenção hoje (tarefas, prazos, problemas...)"

---

* Add subtle helper text below input:

Example:
"Quanto mais contexto você der, melhor será a decisão."

---

## Validation Criteria

* Users provide slightly richer input
* No increase in friction
* Input still feels simple and fast

---

# 🧩 PHASE 2 — CONTEXT-AWARE ANALYSIS (PASSIVE)

Status: [ ]

---

## Tasks

* Ensure backend/AI correctly handles richer descriptions
* No change in response structure
* Validate that priority reasoning improves with context

---

## Validation Criteria

* Responses remain clean and focused
* Justifications reflect deeper understanding
* No increase in verbosity

---

# 🧩 PHASE 3 — DECISION CONFIDENCE REINFORCEMENT

Status: [ ]

---

## Tasks

* Slightly refine explanation tone to reflect contextual awareness

Example:

Before:
"Esta é a melhor próxima ação."

After:
"Considerando o seu contexto, esta é a melhor próxima ação."

---

* Keep tone subtle and confident

---

## Validation Criteria

* Users perceive higher confidence
* No UI clutter added

---

# 🧩 PHASE 4 — BEHAVIOR OBSERVATION

Status: [ ]

---

## Tasks

* Observe if users naturally provide more context
* Identify if decisions improve in acceptance
* Monitor if priority adjustments decrease

---

## Validation Criteria

* Increase in first-attempt acceptance
* Slight reduction in manual adjustments

---

# 🧩 PHASE 5 — STABILITY CHECK

Status: [ ]

---

## Tasks

* Run Playwright tests
* Run documentation lint
* Validate no regression in UX

---

## Validation Criteria

* All tests pass
* No behavior break

---

# 🎯 FINAL STATE

After completion:

* Users provide richer context naturally
* Decisions feel more accurate
* System is ready for multi-entity context (Enterprise foundation)

---

## FINAL RULE

If context increases complexity:

→ rollback

If context improves clarity:

→ keep
