# VALIDATION LAYER — DECIDO (STRUCTURAL CONSISTENCY ONLY)

## OBJECTIVE

Validate structural integrity and consistency of the system output.

This layer:

* DOES NOT change decisions
* DOES NOT reorder priorities
* DOES NOT regenerate output

It only verifies that the system output is coherent and reliable.

---

## INPUT

{
"tasks": Task[],
"ordered_tasks": Task[],
"selected_high_id": string,
"reasoning": [...],
"context_signals": [...]
}

---

## OUTPUT

{
"is_consistent": boolean,
"issues": string[],
"confidence": number (0–1)
}

---

## VALIDATION CHECKS

### TASK INTEGRITY

* All tasks extracted from input are present
* No duplicated tasks
* Each task is atomic (single action)
* Each task starts with a verb

---

### PRIORITY STRUCTURE

* There is exactly ONE selected_high_id
* selected_high_id exists in tasks
* ordered_tasks contains all tasks

---

### STRUCTURAL CONSISTENCY

* reasoning entries exist for each task
* context_signals (if present) map correctly to tasks
* No orphan or mismatched task_id

---

### SIGNAL COHERENCE

* dominant_factor exists for each reasoning entry
* confidence values are within valid range (0–1)

---

## CONFIDENCE CALCULATION

Confidence should reflect:

* clarity of dominant signals
* absence of ambiguity
* structural completeness

---

## HARD CONSTRAINTS

* DO NOT introduce new tasks
* DO NOT remove tasks
* DO NOT change priority order
* DO NOT reinterpret reasoning
* DO NOT regenerate output

---

## PRINCIPLE

Validation verifies.
Validation never corrects.
