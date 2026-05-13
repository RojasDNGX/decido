# RENDER LAYER — DECIDO (SIGNAL-BASED JUSTIFICATION ENGINE)

## OBJECTIVE

Generate natural, unique justifications for each task based on reasoning signals.

This layer:

* reads impact_signals and execution_signals from HEURISTICS
* detects the ROLE of each task
* generates contextual, non-repetitive reasoning

---

## ROLE DETECTION (MANDATORY FIRST STEP)

For each task in the output, identify its role based on the decision system:

### ROLE: PRIMARY (Highest Priority = Primary Action)
* **Trigger**: task_id == selected_high_id == primary_action_task_id (they are ALWAYS the same)
* **Goal**: Explain why this is the most important thing to do RIGHT NOW.
* **Semantic focus**: Consequences, risks, deadlines, blocking factors, impact.
* **NOTE**: selected_high_id and primary_action_task_id MUST NEVER differ.

### ROLE: DEFERRED
* **Trigger**: Any task that is NOT the PRIMARY.
* **Goal**: Explain why this can wait.
* **Semantic focus**: Lack of urgency, flexibility, lower impact.

---

## SEMANTIC INTEGRITY RULES (CRITICAL)

### THE "LEAKAGE" RULE
DEFERRED tasks (média/baixa) MUST NEVER sound more important than the PRIMARY task:
* **❌ FORBIDDEN**: Using words like "urgente", "crítico", "prioridade máxima", "vital", "perigoso", "risco", "fundamental", "não pode ser adiada", "questão de saúde", "importante", "essencial", "necessário" for DEFERRED tasks.
* **✅ REQUIRED**: DEFERRED justifications should emphasize flexibility, low urgency, or that they can wait.

### CONFLICT RESOLUTION: PRIORITY HIERARCHY
The justification for the PRIMARY task MUST ALWAYS sound more important than any DEFERRED task.
The PRIMARY task IS the HIGH priority task IS the primary_action. They are ONE thing.

#### SAFETY & HEALTH VS URGENCY POLICY
If a safety (health/dependents) task exists alongside a task with strong explicit urgency:
1. The safety task remains HIGH and is the PRIMARY action.
2. **FREE**: Use a direct justification (e.g., "Segurança e saúde merecem prioridade.").
3. **PRO**: Use **PRECAUTIONARY LANGUAGE** (e.g., "Questões de segurança ou saúde recebem prioridade até que a urgência seja melhor definida") and frame the relationship between tasks.
4. **REFINEMENT HOOK (PRO ONLY)**: Subtly mention that if it's only routine, the order could change.

---

## SAFETY / HEALTH / LIFE RENDERING POLICY

### PRECAUTIONARY FRAMING (REQUIRED)
Use language that suggests safety, responsibility and trust.

**❌ FORBIDDEN (Alarmist)**: "é urgente", "emergência", "crítico", "risco imediato" (unless user explicitly stated these).

**✅ REQUIRED (Precautionary — PRO ONLY)**:
* "Questões de segurança e cuidado recebem atenção prioritária por precaução."
* "Mesmo sem urgência explícita, o ideal é tratar responsabilidades de cuidado como prioridade preventiva."
* "Antes de assumir que pode esperar, a recomendação é resolver a pendência de segurança ou saúde."

**✅ REQUIRED (Direct — FREE ONLY)**:
* "Cuidado e segurança são prioridades por precaução."
* "É melhor resolver a questão de segurança antes do restante."
* "Saúde e cuidado vêm em primeiro lugar."

---

## GENERATION RULES BY ROLE

### ROLE: IMPACT (High Priority)

Draw from:
* urgency (deadlines, "hoje", "sexta")
* impact (financial, health, legal, professional)
* blocking (prevents other work)

Generate reasoning about:
* **What is at stake**: The specific penalty or risk of not doing it.
* **Timing**: Why this is the anchor of the day's priority.

Example directions:
* "O prazo de sexta é rígido — atrasar compromete a entrega do projeto."
* "Vencimento imediato gera multa e complicações financeiras."

---

### ROLE: DEFERRED

Generate reasoning about:
* **Flexibility**: Why it doesn't need to happen today.

Example directions:
* "Pode ser feito em qualquer momento, sem pressa."

---

## LANGUAGE QUALITY RULES

### FORBIDDEN (The "Semantic Failure" List)
* **❌ NO**: Saying a Medium task "cannot be delayed" (não pode ser adiada).
* **❌ NO**: Saying a Medium task is "fundamental" when a High task exists.
* **❌ NO**: Letting the Medium/Low task sound more "heavy" or "serious" than the High task.

---

## SELF-CHECK (MANDATORY)

Before returning the final response, verify:

1. **Derivation Check**: Is the PRIMARY ACTION derived from the HIGH priority task? If not → REGENERATE.
2. **Hierarchy Check**: Is the PRIMARY/HIGH task justification clearly the "heaviest" in terms of stakes?
3. **Template Check**: Are the phrases unique and grounded in the specific task name?

---

## PRINCIPLE

PRIMARY ACTION = HIGH PRIORITY TASK. Always.
Impact determines what to do first.
Every justification must respect the assigned priority level.
DEFERRED tasks explain why they can wait, not why they should be done.

