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

### ROLE: IMPACT (Priority Focus)
* **Trigger**: task_id == selected_high_id (Highest Priority "alta")
* **Goal**: Explain why this is the most important thing.
* **Semantic focus**: Consequences, risks, deadlines, blocking factors.

### ROLE: EXECUTION (Action Focus)
* **Trigger**: task_id == primary_action_task_id
* **Goal**: Explain why this is the smartest thing to start NOW.
* **Semantic focus**: Speed, low effort, quick win, momentum.

### ROLE: DEFERRED
* **Trigger**: Neither of the above.
* **Goal**: Explain why this can wait.
* **Semantic focus**: Lack of urgency, flexibility.

---

## SEMANTIC INTEGRITY RULES (CRITICAL)

### THE "LEAKAGE" RULE
If a task has ROLE: EXECUTION but is NOT ROLE: IMPACT (i.e., it is "média" or "baixa" priority):
* **❌ FORBIDDEN**: Using words like "urgente", "crítico", "prioridade máxima", "vital", "perigoso", "risco", "fundamental", "não pode ser adiada", "questão de saúde", "importante", "essencial", "necessário".
* **✅ REQUIRED**: Using language that emphasizes "rapidez", "facilidade", "baixo esforço", "resolução imediata", "limpeza de pendência", "sem fricção", "momentum".

### CONFLICT RESOLUTION: PRIORITY HIERARCHY
The justification for the HIGH priority task MUST ALWAYS sound more important than any other. 

#### SAFETY & HEALTH VS URGENCY POLICY
If a safety (health/dependents) task exists alongside a task with strong explicit urgency:
1. The safety task remains HIGH (precautionary).
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

### ROLE: EXECUTION (Primary Action — if NOT High)

**⚠️ STRICT RULE**: Ignore all impact/urgency/health signals. Focus EXCLUSIVELY on:
* execution_cost (low effort)
* execution_time (fast)
* quick_win (mental relief)

Generate reasoning about:
* **The "Easy Win"**: Why doing it now is efficient.

Example directions:
* "É um agendamento rápido que você resolve em minutos."
* "Ação de baixo esforço para garantir progresso imediato."

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

1. **Hierarchy Check**: Is the HIGH task justification clearly the "heaviest" in terms of stakes?
2. **Action Check**: Does the PRIMARY ACTION justification sound "light" and "efficient" (if it's not the High task)?
3. **Template Check**: Are the phrases unique and grounded in the specific task name?

---

## PRINCIPLE

Execution is about EASE.
Impact is about IMPORTANCE.
Every justification must respect the assigned priority level.
If it's Medium, justify it as a "Quick Win", not a "Mission Critical" task.

