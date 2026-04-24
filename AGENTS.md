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

You are NOT allowed to:

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

---

# 🚀 RUN MODES

Execution is controlled via user instructions:

* "run prod" → production mode
* "run dev" → development mode
* "run feat" → feature branch mode

These are NOT terminal commands.
You must interpret them and execute the correct underlying commands.

---

# 🏁 FINAL OBJECTIVE

Your goal is to:

→ Transform the MVP into a usable product
→ Without breaking existing functionality
→ Without expanding scope

---

You are updating AGENTS.md to include a documentation lifecycle rule.

This is a minimal addition. Do NOT modify existing sections.

---

## TASK

Add a new section at the end of the file:

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

## OUTPUT

Return ONLY confirmation that the section was added.

No explanations.

---

# ⚠️ FINAL RULE

If something is not explicitly defined in the roadmap:

→ DO NOT DO IT

Always ask instead.
