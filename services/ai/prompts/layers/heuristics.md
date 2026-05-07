# HEURISTICS LAYER — DECIDO (REASONING ENGINE)

## OBJECTIVE

Transform CORE output into structured reasoning signals.

This layer:

* DOES NOT decide priority order
* DOES NOT reorder tasks
* DOES NOT generate final user-facing text

It provides structured signals to explain:

1. Why a task is important (impact reasoning)
2. Why a task should be executed now (action reasoning)

---

## INPUT

{
"tasks": Task[],
"ordered_tasks": Task[],
"selected_high_id": string
}

---

## OUTPUT

{
"reasoning": [
{
"task_id": string,
"impact_signals": {
"health": number (0–1),
"urgency": number (0–1),
"impact": number (0–1),
"human_dependency": number (0–1),
"blocking": number (0–1)
},
"execution_signals": {
"execution_cost": number (0–1),
"execution_time": number (0–1),
"friction": number (0–1),
"quick_win": number (0–1)
},
"dominant_impact_factor": string,
"dominant_execution_factor": string,
"confidence": number (0–1)
}
]
}

---

### HEALTH
* medication, illness, physical condition, safety, hospital, doctor, medical.
* **Precautionary Signal**: If a task belongs to the health domain, this signal MUST be high (0.8–1.0) unless explicitly minimized by the user.

---

## REASONING SIGNALS

### IMPACT SIGNALS (WHY IT MATTERS)
* **health_risk**: high if health/safety related.
* **dependent_safety**: high if involves children, pets, elder care.
* **financial_risk**: high if costs money or generates loss.
* **legal_risk**: high if law/regulation related.
* **professional_block**: high if prevents work from others.
* **concrete_target**: high if task is a clear, executable action (vs abstract).
* **urgency**: high if explicit deadlines are present.

### EXECUTION SIGNALS (WHY NOW)
* **execution_cost**: effort required to start immediately.
* **execution_time**: how fast it can be completed.
* **friction**: resistance to start (mental or operational).
* **quick_win**: small action that reduces cognitive load.

---

## POLICY OVERRIDE (CRITICAL)

### SAFETY & HEALTH DEFAULT OVERRIDE
The system defaults to high impact for health and dependent tasks as a safety policy. Heuristics must reflect this by ensuring these signals are dominant unless "minimization keywords" are present (e.g., "rotina", "não urgente").

### URGENCY

* explicit deadlines, "hoje", "urgente", "vence", "atrasado"

### IMPACT

* financial, client, delivery consequence

### HUMAN_DEPENDENCY

* requires interaction (call, message, response)

### BLOCKING

* prevents other tasks from progressing

---

## EXECUTION SIGNALS (WHY NOW)

### EXECUTION_COST

* effort required to start and complete immediately

### EXECUTION_TIME

* how fast it can be completed

### FRICTION

* resistance to start (mental or operational)

### QUICK_WIN

* small action that clears pending or reduces cognitive load

---

## RULES

* Signals are independent (0–1 scale)
* DO NOT compute priority levels (HIGH/MED/LOW)
* DO NOT override selected_high_id

---

## INTERPRETATION PRINCIPLE

Impact signals explain:
→ why something is important in the overall scenario

Execution signals explain:
→ why something is worth doing immediately

These are separate dimensions.

---

## HARD CONSTRAINTS

* DO NOT generate sentences
* DO NOT create templates
* DO NOT define priority categories
* DO NOT override CORE decision

---

## PRINCIPLE

Heuristics produces structured reasoning.

It does not decide.
It does not speak.
