@AGENTS.md

---

## 🧠 Project Context — Decido

Decido is a decision engine.

It does NOT manage tasks.
It does NOT create plans.

It returns ONE clear action.

All implementations must reinforce this principle.

---

## 🎯 Core Product Rule (Non-Negotiable)

The system MUST ALWAYS:

→ Provide exactly ONE primary action
→ Reduce cognitive load
→ Avoid multi-step outputs
→ Avoid planning behavior

If any suggestion increases complexity:

→ Reject it

---

## 📐 Project Principle — Clarity First

This project prioritizes clarity over complexity.

All decisions must:

* favor simple and predictable structures
* avoid unnecessary abstractions
* maintain clean and readable code
* follow strict Git discipline (main / dev / feature)
* evolve incrementally, never in large uncontrolled changes

---

## 🧩 Behavior Rules

When generating or modifying code:

* DO NOT refactor beyond the scope of the task
* DO NOT introduce new layers or patterns unless necessary
* DO NOT create abstraction “just in case”
* DO NOT move files unless explicitly required

Prefer:

* minimal changes
* direct solutions
* readable logic

---

## 🎨 UI / UX Rules

* The interface must feel immediate and clear
* The primary action must always be obvious
* Avoid visual noise
* Avoid unnecessary animations or effects
* Prefer clarity over visual decoration

---

## 🤖 AI Integration Rules

* DO NOT modify decision logic without explicit instruction
* DO NOT change prompt structure arbitrarily
* DO NOT alter output format

The AI system is already calibrated.

---

## ⚠️ When in Doubt

If something is unclear:

→ Ask instead of assuming
→ Suggest minimal options
→ Do NOT improvise large changes

---

## 🧠 Final Principle

This is not a system that does more.

This is a system that decides better.

---

## 🚀 Operational Mode — Post-Launch

The product has reached a stable behavioral baseline as of week-18B.

The current phase is:

**OPERATION — not construction.**

### What this means

The priority is no longer adding features.
The priority is preserving stability and observing real usage.

### What to prioritize

* Observing real user behavior and logs
* Small, safe, isolated fixes
* Retention and conversion signals
* Quality of decisions in production
* Operational stability

### What to avoid

* Refactoring the AI decision engine without a concrete regression
* New heuristics, governance layers, or prompt experiments
* Multiple parallel architectural changes
* Any change that is not motivated by real production data

### Behavioral baseline is a strategic asset

The AI system is now calibrated and producing defensible, coherent decisions.
Any future change to the decision engine must be treated as a **critical behavioral change**
and validated with care — not as a routine code edit.

### Test suite status

`tests/` and `playwright.config.ts` are **permanent infrastructure** in `main`.
They represent behavioral regression protection, not optional tooling.
Run before every production merge. Zero failures required.

### When to open a new roadmap

Only when there is:

* Real regression evidence from production
* Consistent behavioral failure pattern
* Concrete user data motivating a specific change
* A structural problem that cannot be fixed with a small isolated fix
