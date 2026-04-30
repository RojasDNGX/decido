# ENTERPRISE PLAN — DECIDO

Strategic reference for the evolution of Decido into a team-based decision system.

This is NOT a roadmap. This is NOT an implementation plan.
This document guides roadmap creation and aligns agent decisions.

---

## INTRODUCTION

Decido began as a personal decision engine — one person, one context, one action.

Enterprise evolution does not change this.

It extends the same principle to shared environments:

* **Core** — a single user receives one clear action, based on personal context.
* **Enterprise** — multiple actors share context, and the system still returns one clear action — but informed by collective state.

The interface does not change.
The decision behavior does not change.
Only the context expands.

---

## PRINCIPLES

**Maintain simplicity**
Every module must preserve the single-input, single-output contract. Complexity is absorbed internally, never exposed to the user.

**Preserve single primary action**
Enterprise does not mean multi-output. The system always returns one primary action, even in a team context.

**Context over features**
New capabilities are expressed as richer context, not as new UI surfaces or additional steps.

**Invisible expansion**
Enterprise features must feel like a natural part of the environment. If a user notices a new feature, it is too loud.

---

## MODULE STRUCTURE

---

### MODULE 0 — CORE
**Status: completed**

**Objective:** Establish the personal decision engine.

**Introduces:** Single-user input, AI-driven priority analysis, one primary action output.

**Validation goal:** A user with no instructions can submit a task list and receive one clear action.

---

### MODULE 1 — SHARED OUTPUT
**Status: validated**

**Objective:** Allow decision output to exist beyond the session.

**Introduces:** Copy action, local persistence, decision history.

**Validation goal:** A user can revisit and share a past decision without re-analysis.

---

### MODULE 2 — CONTINUITY
**Status: completed**

**Objective:** Give the system memory within a session.

**Introduces:** Context memory, refinement mode, recurrence awareness.

**Validation goal:** The system produces increasingly accurate decisions as context accumulates.

---

### MODULE 3 — SHARED DECISION
**Status: completed**

**Objective:** Introduce the concept of decision context beyond the individual.

**Introduces:** Shareable decision links (`/d/[id]`), persistent SQLite storage, read-only shared view, graceful fallback for invalid links.

**Validation goal:** A user can generate a link to a decision and share it — the recipient sees the result clearly, without accessing the system.

---

### MODULE 4 — COLLABORATIVE SIGNALS

**Objective:** Allow team members to signal priority without overriding individual decisions.

**Introduces:** Shared priority signals, passive team input layer.

**Validation goal:** A decision reflects team context without requiring explicit collaboration steps.

---

### MODULE 5 — WORKSPACE FOUNDATION

**Objective:** Establish the structural layer for team-based operation.

**Introduces:** Workspace identity, member context, shared decision scope.

**Validation goal:** Multiple users operate within a shared context and receive coherent, non-conflicting actions.

---

### MODULE 6 — DECISION HISTORY

**Objective:** Create a shared record of decisions made within a workspace.

**Introduces:** Team decision log, continuity across sessions and actors.

**Validation goal:** A team can review past decisions and understand how context evolved.

---

### MODULE 7 — ROLES & PERMISSIONS

**Objective:** Define who can influence context and how.

**Introduces:** Role differentiation, permission layers, context contribution rules.

**Validation goal:** A workspace operates with clear boundaries — no actor can corrupt another's primary action.

---

### MODULE 8 — INTEGRATIONS

**Objective:** Connect external signals to the decision context.

**Introduces:** Data inputs from external tools (calendar, project, communication).

**Validation goal:** External context enriches decisions without increasing user effort.

---

### MODULE 9 — CONSOLIDATION

**Objective:** Stabilize the full enterprise system.

**Introduces:** Performance, reliability, and coherence across all modules.

**Validation goal:** The system operates at enterprise scale with the same simplicity as the personal core.

---

## EXECUTION RULE

Modules are not strictly linear.

Some can run in parallel. Some depend on prior validation. None should be skipped.

**Each module must be validated before the next one expands.**

Validation means: a real user (or team) completes the intended flow without instruction, confusion, or friction.

A module is not complete when it is built.
A module is complete when it is invisible.

---

## CURRENT POSITION

→ **MODULE 3 completed. Ready for MODULE 4.**

Shared decision links are live and persistent.
A decision can now exist outside the individual session.
No auth. No collaboration yet. Foundation is in place.
