# WEEK-11 — MODULE 6: DECISION REEVALUATION

Status: [x]

---

## 🎯 OBJECTIVE

Allow the user to **explicitly re-run the decision** when context changes.

---

## 🧠 PROBLEM

The current decision may become outdated as context evolves.
But automatic updates would:
→ reduce trust
→ create noise
→ break predictability

---

## ⚠️ NON-NEGOTIABLE RULES

* DO NOT auto-refresh decisions
* DO NOT trigger re-evaluation automatically
* DO NOT add background logic
* DO NOT create multi-step flows

---

## 🧠 STRATEGY

Add a **single, explicit action**:
→ user chooses when to reconsider

---

## 🔧 IMPLEMENTATION

### 🧩 PHASE 1 — RE-EVALUATION ACTION

Status: [x]

Add a secondary action near the decision:
`Reavaliar decisão`

**Placement:**
* below the main decision card
* or near “Refinar informações”
* must not compete with primary action

**Style Rules:**
* secondary visual weight
* no button emphasis
* no strong color
* no animation

**Behavior:**
On click:
→ triggers the same decision flow (`/decidir`)

### 🧩 PHASE 2 — FLOW ALIGNMENT & ACTION CONSOLIDATION

Status: [x]

**Action:**
* Unify decision flow using the primary button for re-evaluation.
* Switch button label to `Rever decisão` when a result is present.
* Remove `Reavaliar decisão` from the result card.
* Simplify header by removing redundant `Voltar` action.

### 🧩 PHASE 3 — MICRO INTERACTION (LOADING FEEDBACK)

Status: [x]

**Action:**
* Implement subtle loading dots animation inside the primary button.
* Remove any other loading indicators outside the button.
* Ensure the primary button is the single source of feedback.

### 🧩 PHASE 4 — MICRO REFINEMENTS

Status: [x]

**Action:**
* Harmonize "Refinar informações" link visual integration.
* Implement subtle gradient micro-interaction on the decision card.
* Ensure refinements do not increase cognitive load or change hierarchy.

---

## 🚫 DO NOT

* add confirmation steps
* add modal
* add explanation text
* add history or comparison

---

## 🧪 VALIDATION

Check:
* Is the action discoverable but not dominant?
* Does it feel optional?
* Does it preserve simplicity?

---

## ✅ DEFINITION OF DONE

* Re-evaluation action added
* No UI complexity increase
* No behavior side effects
* No regression
