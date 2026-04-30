# ⚠️ AGENT OPERATING MANUAL — DECIDO

This project is operated primarily by AI agents.

You must follow these instructions strictly.

---

# 🚀 PRIMARY ENTRY POINT

Before performing ANY task, you MUST read:

→ /docs/roadmap-current.md

This file defines:

* what to execute
* current phase
* validation flow
* execution rules

---

# 🧠 CORE EXECUTION MODEL

You do not explore freely or invent features.

You MAY reason, suggest improvements, and refine implementations,
as long as you remain aligned with the current product scope.

You MUST:

1. Read `/docs/roadmap-current.md`
2. Identify the first incomplete phase: `Status: [ ]`
3. Execute ONLY that phase
4. Stop and request human validation
5. Wait for approval
6. After approval:

   * Mark phase as `[x]`
   * Save file
   * Suggest next phase

---

# ❌ STRICT PROHIBITIONS

AGENTS ARE NOT allowed to:

* Execute multiple phases at once
* Skip phases
* Modify AI decision logic
* Change prompts related to decision-making
* Refactor unrelated code
* Do not introduce new features outside the roadmap
  UNLESS explicitly requested by the user in the current session.
* Introduce unnecessary dependencies
* Infer requirements outside the roadmap

---

# ✅ ALLOWED ACTIONS

You MAY:

* Implement only what is defined in the current phase
* Create minimal supporting code
* Fix blocking issues related to the current phase
* Improve clarity ONLY if it does not change behavior

---

# 🧩 PROJECT PURPOSE

Decido is a decision engine that:

* receives tasks in natural language
* analyzes context and priorities
* explains reasoning
* returns ONE clear primary action

Your job is NOT to redesign it.

Your job is to **evolve it incrementally**.

---

# 🧠 DEVELOPMENT PRINCIPLES

* Simplicity over complexity
* Stability over perfection
* Clarity over cleverness
* Working solution over ideal architecture

---

# 🧪 VALIDATION RULE

After implementing any phase:

* You MUST explain what was done
* You MUST request human validation
* You MUST NOT continue automatically

---

# 📁 ROADMAP STRUCTURE

You must understand the roadmap system:

* `/docs/roadmap-current.md` → ACTIVE execution file
* `/docs/roadmap-history.md` → past summaries
* `/docs/roadmaps/week-X.md` → archived snapshots

The roadmap is the primary execution reference.

However, you may also follow explicit instructions provided in the current session,
as long as they do not conflict with the roadmap or core product principles.

---

# 🔄 SESSION BEHAVIOR

At the start of EVERY new session:

* Re-read the roadmap
* Do NOT rely on previous chat memory
* Do NOT assume progress without checking file state

---

# 🚨 FAILURE HANDLING

If something breaks:

* Stop execution
* Explain the issue clearly
* Suggest a minimal fix
* Wait for approval before applying major changes

---

# 🚀 RUN MODES

Execution is controlled via user instructions:

* "run prod" → production mode
* "run dev" → development mode
* "run feat" → feature branch mode

These are NOT terminal commands.
You must interpret them and execute the correct underlying commands.

---

# 🧪 PLAYWRIGHT VALIDATION RULE

Playwright is used as a validation layer for critical user flows.

It must be executed according to RUN MODES.

---

## EXECUTION RULES

### run feat

* Playwright execution is OPTIONAL
* May run a minimal subset of tests
* Must NOT block execution

---

### run dev

* Playwright execution is REQUIRED
* Must run all critical tests
* If any test fails:
  → STOP execution
  → Request human validation

---

### run prod

* Production URL: http://10.10.0.47:3000
* Playwright execution is MANDATORY
* Must run full test suite
* ZERO tolerance for failure

If any test fails:

→ DO NOT proceed
→ Explain failure
→ Wait for human decision

---

## PURPOSE

Ensure that:

* Development remains fast (run feat)
* Integration is validated (run dev)
* Production is protected (run prod)

---

## CONSTRAINTS

* Do NOT introduce new commands
* Do NOT change existing run mode behavior
* Do NOT automate beyond current system
* Do NOT bypass human validation flow

---

# 📦 ROADMAP ARCHIVING RULE

When a weekly roadmap file (week-X.md) is fully completed:

Definition of "completed":

* All phases are marked as [x]
* No remaining [ ] items

---

## REQUIRED ACTION

* Move the file from:
  docs/roadmaps/

* To:
  docs/archive/roadmaps/

---

## CONSTRAINTS

* Do NOT modify file content
* Do NOT rename the file
* Do NOT duplicate the file
* Do NOT leave a copy in the original location

---

## PURPOSE

Keep the active docs clean and focused only on current execution,
while preserving completed work in a structured archive.

---

# 📁 DOCS/ BRANCH SYNCHRONIZATION RULE

The `docs/` folder and all its contents (roadmaps, archive, etc.)
exist ONLY in `dev` and `feature/*` branches.

---

## RULE: main has NO docs/

The `main` branch must NEVER contain a `docs/` folder.

`main` is production. Planning and development artifacts do not belong there.

If production-relevant documentation is needed in the future:
→ Create it intentionally at that moment
→ Add it directly to `main` via a dedicated commit
→ Do NOT carry it over from dev automatically

---

## RULE: dev and feature/* must stay in sync for docs/

At any point in time, `docs/` content in `feature/*` branches must reflect
the most current state in `dev` — and vice versa.

This includes:
* `docs/roadmaps/` — active roadmap files
* `docs/archive/roadmaps/core/` — completed core roadmaps
* `docs/archive/roadmaps/enterprise/` — completed enterprise roadmaps
* Any future subfolder created under `docs/`

---

## WHEN TO SYNC

* When a roadmap is archived on `dev` → apply the same on the active `feature/*` branch
* When a `feature/*` branch adds a doc → ensure `dev` reflects it before merging
* When starting a new `feature/*` branch → it should branch from `dev` and inherit current `docs/`

---

## CONSTRAINTS

* Do NOT leave `docs/` diverged between `dev` and `feature/*` branches
* Do NOT merge a `feature/*` branch into `dev` with a stale `docs/` state
* Do NOT push roadmap or planning files into `main` during a merge

---

# 🏁 FINAL OBJECTIVE

Your goal is to:

→ Transform the MVP into a usable product
→ Without breaking existing functionality
→ Without expanding scope
---

# ⚠️ FINAL RULE

If something is not explicitly defined in the roadmap:

→ DO NOT DO IT

Always ask instead.
