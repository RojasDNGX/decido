# PATCH — ROADMAP CURRENT (DECIDO)

You are updating `docs/roadmap-current.md`.

This roadmap is already structured for a decision-oriented product.

DO NOT rewrite or restructure the document.

Apply ONLY the adjustments below.

---

## 🎯 OBJECTIVE

Align roadmap with:

* agent-assisted workflow
* validation-first execution
* decision-driven evolution

---

## 🧩 CHANGES

---

### 1. ADD SECTION (AFTER "🧠 CONTEXTO ATUAL")

Insert:

## ⚠️ EXECUTION MODEL

This roadmap is NOT a task list.

It is a **decision and validation guide**.

Execution happens through:

* small, targeted implementations
* direct user instructions
* runtime validation

The agent MUST NOT:

* execute phases autonomously
* assume linear progression

The agent MAY:

* assist when explicitly requested
* implement isolated steps
* support validation and analysis

---

### 2. ADD SECTION (AFTER "🎯 FOCO DA SPRINT ATUAL")

Insert:

## ✅ VALIDATION CHECKPOINT

This sprint is only complete if:

* [ ] Insight Layer is implemented
* [ ] `decidoInsights()` returns valid data
* [ ] Metrics reflect real usage behavior
* [ ] No inconsistencies detected in event flow

If any item fails:

→ Sprint is NOT complete

---

### 3. ADD SECTION (END OF DOCUMENT)

Insert:

## 🧭 EXECUTION RULE

If resuming after pause:

1. Run `decidoInsights()`
2. Observe metrics
3. Identify anomalies or patterns
4. Decide next action BEFORE implementing anything

---

## 🚫 CONSTRAINTS

* DO NOT remove existing content
* DO NOT rewrite sections
* DO NOT convert into checklist-style roadmap
* DO NOT introduce technical tasks

---

## OUTPUT

Return ONLY the inserted sections.

Do NOT repeat the full document.
