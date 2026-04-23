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

You DO NOT explore or improvise.

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
* Add new features outside roadmap
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

Decido is an AI decision assistant that:

* receives tasks in natural language
* prioritizes them (high, medium, low)
* explains why
* recommends what to do now

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

You ONLY operate using:

→ roadmap-current.md

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

Use the correct command for your current goal:

* `npm run dev` → **Local Development**: Standard mode for coding (localhost).
* `npm run dev:lan` → **Network Testing**: Exposes the server to the LAN (use when accessing via IP).
* `npm run build` && `npm run start` → **Production Mode**: Best for real user testing and stability (no HMR overhead).

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
