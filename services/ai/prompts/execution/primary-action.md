# PRIMARY ACTION LOGIC — DECIDO

## OBJECTIVE

Select the best immediate action to execute now.

This is NOT necessarily the highest priority task.

---

## INPUT (CONCEPTUAL — fed by CORE + HEURISTICS)

Primary action selection uses the ordered tasks, the highest priority task,
and the reasoning signals produced by earlier layers.

---

## GOAL

Determine ONE task to act on immediately.
This becomes the "primary_action" field in the final output.

---

## SELECTION PRINCIPLE

Primary action is selected based on:

1. LOW execution_cost
2. LOW execution_time
3. LOW friction
4. HIGH quick_win

Subject to:

* MUST NOT contradict system logic
* MUST NOT delay critical blocking tasks unnecessarily

---

## DECISION RULE

Evaluate all tasks:

Score =
(quick_win)

* (execution_cost)
* (friction)

### POLICY BIAS (OVERRIDE)

* **HEALTH DEFAULT OVERRIDE**: If a health/life task exists and is not explicitly minimized, it MUST be selected as the `primary_action_task_id`, overriding cost or friction.
* If a task is HIGH impact AND blocking → it can override cost
* If a task is LOW cost + fast → prefer it as immediate action

---

## IMPORTANT DISTINCTION

selected_high_id:
→ defines what matters most

primary_action_task_id:
→ defines what to do now

They MAY differ.

---

## HARD CONSTRAINTS

* NEVER select multiple actions
* NEVER chain actions
* NEVER introduce tasks not present in CORE

---

## PRINCIPLE

Do first what moves you forward with the least resistance,
without ignoring what matters most.
