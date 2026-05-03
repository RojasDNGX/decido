# ROADMAP CURRENT (DECIDO)

→ Active week: none
→ week-13 archived at `docs/archive/roadmaps/week-13.md`

---

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

## 🎯 WEEK-13 — PRO ACTIVATION (CONTROLLED TOGGLE + PERCEPTION LAYER)

### STEP 1 — USER PLAN UPDATE FUNCTION
Status: [x]

Add `setUserPlan(email, plan)` to `/lib/users-db.ts`

---

### STEP 2 — CREATE INTERNAL ACTIVATION ENDPOINT
Status: [x]

Create `/app/api/dev/set-plan/route.ts` (POST, dev only, no auth)

---

### STEP 3 — VALIDATE PLAN USAGE (CORE LOGIC)
Status: [x]

Confirm `if (user.plan === 'pro')` bypass exists in decision flow

---

### STEP 4 — INTRODUCE PERCEPTION LAYER (CRITICAL)
Status: [x]

Add `formatDecisionOutput(text, plan)` + `makeMoreDecisive(text)` to decision pipeline

---

### STEP 5 — TEST FLOW
Status: [x]

Validate free vs PRO behavior — limit bypass + tone perception

---

## ✅ VALIDATION CHECKPOINT

Sprint is only complete if:

* [x] `setUserPlan` function exists and works
* [x] `/api/dev/set-plan` endpoint responds correctly
* [x] PRO users bypass usage limit
* [x] Decision output tone differs between free and pro
* [x] No UI changes introduced

If any item fails:

→ Sprint is NOT complete

---

## 🧭 EXECUTION RULE

If resuming after pause:

1. Read `docs/roadmaps/week-13.md`
2. Identify first incomplete step: `Status: [ ]`
3. Execute ONLY that step
4. Stop and request human validation
