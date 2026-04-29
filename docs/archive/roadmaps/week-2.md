# 🚀 Decido — Execution Roadmap (Week 2 — Productization Layer)

## PHASE 1 — DECISION DETAILS VIEW

Status: [x]

### Tasks:

* Allow user to expand a decision
* Show full explanation from AI
* Improve readability of reasoning

### Validation:

User can clearly understand why a decision was made

---

## PHASE 2 — COPY ACTION BUTTON

Status: [x]

### Tasks:

* Add a button to copy the recommended action
* Use clipboard API
* Provide visual feedback (copied state)

### Validation:

User can copy the recommendation instantly

---

## PHASE 3 — LOCAL HISTORY IMPROVEMENT

Status: [x]

### Tasks:

* Improve visualization of stored decisions
* Show clearer timestamps
* Improve readability and spacing

### Validation:

History feels like a real feature, not raw data

---

## PHASE 4 — RESET / CLEAR DATA

Status: [x]

### Tasks:

* Add option to clear all stored data
* Reset usage limit
* Reset history

### Validation:

User can restart usage cleanly

---

## PHASE 5 — BASIC EMPTY STATES

Status: [x]

### Tasks:

* Add UI for empty history
* Add UI when no input is provided
* Improve feedback clarity

### Validation:

No screen feels broken or incomplete

---

## PHASE 6 — FINAL POLISH VALIDATION

Status: [x]

### Tasks:

* Validate full flow again
* Check consistency across UI
* Ensure no regressions

### Validation:

Product feels stable and consistent

---

## ADDITIONAL REFINEMENTS (POST VALIDATION)

Status: [x]

---

## PHASE 6 — ADDITIONAL REFINEMENTS (POST VALIDATION)

Status: [x] COMPLETED

---

## 🎯 REFINEMENT 1 — INPUT BEHAVIOR IMPROVEMENT

### Tasks:

* Convert input field into a textarea
* Set a minimum height (~2 lines)
* Implement auto-resize based on content
* Limit maximum height (~5–6 lines)
* Add internal scroll after max height is reached
* Prevent layout shift during typing

### Validation:

Input expands naturally without breaking layout or causing visual jumps

---

## 🎯 REFINEMENT 2 — EMPTY STATE TEXT STRUCTURE

### Tasks:

* Remove the separate "Dica" element
* Merge guidance into the input placeholder
* Improve placeholder clarity (more instructive)
* Center text ONLY in empty state
* Keep left alignment when content exists

### Validation:

No redundant messaging; UI feels cleaner and clearer

---

## 🎯 REFINEMENT 3 — DYNAMIC EXAMPLE GENERATOR

### Tasks:

* Create a pool of 6–10 predefined example prompts
* Implement random selection logic
* Prevent immediate repetition of the last example
* On first click:

  * Fill input with an example
  * Change button label to "Tentar outro exemplo"
* On subsequent clicks:

  * Randomly rotate through examples

### Validation:

User can quickly explore different scenarios without repetition

---

## 🎯 REFINEMENT 4 — CONTEXT-AWARE PRIMARY ACTION

### Tasks:

* Detect when user is viewing a historical decision
* Replace "Analisar" button with "Nova análise"
* Ensure the new action resets the state correctly
* Prevent re-analysis of historical data

### Validation:

UI reflects context correctly and avoids misleading actions

---

## 🎯 REFINEMENT 5 — QUICK ACCESS ACTIONS

### Tasks:

* Add a left icon button (History)

  * Scrolls/anchors to history section
* Add a right icon button (New Analysis "+")

  * Resets the flow instantly
* Display these buttons ONLY after first analysis
* Keep them visually secondary to main CTA

### Validation:

User can access key actions without scrolling, without UI clutter

---

## 🎯 REFINEMENT 6 — PRIORITY VISUAL FEEDBACK

### Tasks:

* Apply subtle border color based on priority:

  * High → red
  * Medium → yellow
  * Low → green
* Enhance hover state with stronger border color
* Do NOT rely only on hover (must be visible by default)

### Validation:

Priority is visually distinguishable even without interaction

---

## 🎯 REFINEMENT 7 — INPUT VISUAL CORRECTIONS

### Tasks:

* Reset placeholder alignment to left
* Update placeholder text to:
  "Informe a situação que deseja decidir (seja específico sobre prazos e consequências se possível)."
* Ensure placeholder maintains proper padding and readability
* Prevent any center alignment behavior

### Validation:

Placeholder is left-aligned, clear, and consistent with input behavior

---

## 🎯 REFINEMENT 8 — CUSTOM SCROLLBAR (INPUT)

### Tasks:

* Customize textarea scrollbar appearance
* Match scrollbar thumb color to input border color
* Match scrollbar arrows color to input border color
* Make scrollbar track background transparent
* Ensure scrollbar does NOT break border-radius visually
* Keep scrollbar minimal and non-intrusive

### Validation:

Scrollbar integrates visually with input and does not interfere with rounded corners

---

## 🎯 REFINEMENT 9 — TOP NAVIGATION IMPROVEMENT

### Tasks:

* Remove "Nova análise" button from bottom section
* Add floating "Back to top" button
* Show button only after user scrolls down
* Smooth scroll to top on click
* Keep button visually subtle but accessible

### Validation:

User can quickly return to top without UI clutter

---

## 🎯 REFINEMENT 10 — HISTORY DETAIL ACTION FIX

### Tasks:

* Detect when user is viewing a historical decision
* Replace "Analisar" button with "Nova análise"
* Disable any re-analysis behavior in this state
* Ensure button resets app state correctly

### Validation:

User cannot trigger invalid actions from history context

---

## 🎯 REFINEMENT 11 — USAGE LIMIT MESSAGE FIX

### Tasks:

* Ensure usage limit message NEVER disappears
* When limit is reached:

  * Replace text with:
    "Faça upgrade para continuar decidindo sem limites."
* Optionally add hyperlink to future plans page
* Keep message visible in same position

### Validation:

User always understands their usage state and next step

---


STATUS WEEK 2: CLOSED (PRODUCTIZED LAYER COMPLETE)
