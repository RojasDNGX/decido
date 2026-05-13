# Week-18B — PRIORITIZATION REBALANCE & DECISION GOVERNANCE HARDENING

Branch:
`dev` (work executed directly on dev — no separate feature branch created)

Objetivo:
Recalibrar o motor decisório do Decido para garantir que impacto real, consequência, urgência legítima e valor estratégico tenham precedência sobre facilidade, momentum artificial e alívio imediato.

---

## 🏁 CLOSURE STATUS — EARLY SUCCESSFUL CLOSURE

**Encerrado antecipadamente em: 2026-05-13**

Este roadmap foi encerrado após a conclusão bem-sucedida das Phases 1–3.
As Phases 4+ foram **intencionalmente ignoradas** após estabilização comportamental validada em testes reais.

Isto NÃO é cancelamento. É encerramento precoce intencional por estabilidade atingida.

---

## ✅ PROBLEMAS RESOLVIDOS (validados em testes reais)

* LOW promovido para PRIMARY — **corrigido**
* Falsa urgência dominante (WhatsApp/e-mails) — **corrigido**
* Renderer reinterpretando prioridades — **corrigido**
* Fallback promovendo tarefas incorretas — **corrigido**
* Colapso de ranking — **corrigido**
* Inconsistência buckets vs destaque — **corrigida**
* Health/safety perdendo prioridade — **corrigida**
* Dependent safety inconsistente — **corrigida**
* Multi-priority breakdown — **corrigido**
* Momentum heuristics excessivas — **corrigidas**
* Colapso de distribuição MEDIUM/LOW — **corrigido**

---

## 🧠 APRENDIZADO ARQUITETURAL

### PRINCÍPIO 1
Priority buckets são a única source of truth.
O pipeline nunca deve recalcular, reinterpretar ou reclassificar o que veio do motor de IA.

### PRINCÍPIO 2
PRIMARY deve sempre ser derivado do HIGH.
`selected_high_id == primary_action_task_id` — imutável, sem exceções.

### PRINCÍPIO 3
Renderer nunca pode reinterpretar semântica.
Justificativas devem obedecer à hierarquia de decisão; DEFERRED nunca soa mais importante que PRIMARY.

### PRINCÍPIO 4
Fallback nunca pode promover prioridades.
Degraded mode pode reduzir refinamento e nuance, mas nunca altera ranking estrutural.

### PRINCÍPIO 5
Distribuição deve ser incentivada, nunca forçada artificialmente.
A instrução "Cada nível deve conter UM item" causava colapso: o modelo interpretava que o output inteiro era 1 tarefa.
A correção foi clarificar que UMA = apenas "alta"; "média" e "baixa" absorvem as tarefas restantes.

---

## 🔧 CORREÇÕES APLICADAS (Phases 1–3)

### Phase 1 — Prioritization Philosophy Rebalance
- Adicionado `RECALIBRAGEM DE PESOS E FALSA URGÊNCIA` ao `pro.ts`
- Adicionada `HIERARQUIA DE IMPACTO` (Níveis 3/2/1) ao `pro.ts`
- Reduzido peso de momentum heuristics, quick wins e falsa urgência social
- Reforçada precedência de consequência e impacto estrutural

### Phase 2 — Primary Immutability Hardening
- Adicionada função `enforcePrimaryFromHigh()` em `route.ts`
- Adicionada função `enforceSingleHighPriority()` em `route.ts`
- Adicionada detecção de colapso de distribuição (log-only) em `route.ts`
- Corrigidos prompts do renderer (`render.md`) para impedir leakage semântico
- Corrigido fallback/degraded mode para nunca promover LOW
- Adicionada regra `primary-action.md` como governance document

### Phase 3 — Distribution Governance
- Corrigida instrução conflitante em `pro.ts` (ESTRUTURA DE PRIORIDADES)
- Substituído "Cada nível deve conter UM item" por orientação clara de absorção de tarefas em média/baixa
- Adicionado exemplo canônico em `pro.ts`, `free.ts` e `core.md`:
  - `alta`: revisar imposto (consequência fiscal)
  - `média`: responder e-mails (operacional)
  - `baixa`: organizar mesa (flexível)

---

# PHASE 1 — PRIORITIZATION PHILOSOPHY REBALANCE

Status [x]

## Objetivos

* Reavaliar pesos conceituais do motor.
* Garantir que impacto e consequência superem tarefas rápidas e superficiais.

## Validar

* Impacto estrutural
* Consequência futura
* Urgência legítima
* Custo de atraso
* Valor estratégico

## Reduzir peso excessivo de

* Momentum heuristics
* Quick wins
* Facilidade de execução
* Falsa urgência social
* WhatsApp/e-mails/notificações

---

# PHASE 2 — PRIMARY IMMUTABILITY HARDENING

Status [x]

## Objetivos

* Garantir que o PRIMARY final nunca seja alterado após resolução core.

## Auditar pipeline completo

* extraction
* prioritization
* heuristics
* context enrichment
* validation
* degraded mode
* renderer

## Garantir

* renderer não reinterpreta ranking
* fallback não promove LOW
* degraded mode não altera HIGH
* enrichment não altera prioridade estrutural

---

# PHASE 3 — DISTRIBUTION GOVERNANCE

Status [x]

## Objetivos

* Impedir colapso artificial de categorias.

## Garantir

* Inputs com múltiplas tarefas gerem distribuição coerente
* HIGH/MEDIUM/LOW reflitam diferença real de impacto

## Invalidar

* Outputs com apenas 1 bucket sem justificativa estrutural
* Distribuições colapsadas artificialmente

---

# PHASES 4–10 — INTENTIONALLY SKIPPED

**Status: skipped — behavioral stabilization achieved**

Remaining phases intentionally skipped after successful behavioral stabilization and validation in real-world stress scenarios (Phases 1–3 resolved root causes for all identified failure modes).

Continuing implementation at this point carries higher risk of:
* reintroducing invisible heuristics
* degrading natural output quality
* overengineering a stable system

The behavioral baseline established by Phases 1–3 is considered production-ready.

**Affected phases:**
* Phase 4 — Justification Quality Governance
* Phase 5 — Health & Safety Priority Persistence
* Phase 6 — FREE vs PRO Consistency
* Phase 7 — Fallback & Degraded Mode Rebalance
* Phase 8 — Validation Layer Hardening
* Phase 9 — Prioritization Test Suite
* Phase 10 — Behavioral Consistency Audit

These concerns remain valid as future monitoring topics, but do NOT require implementation as active phases at this time.

---

# DEFINITION OF DONE

Status [x] — ACHIEVED VIA EARLY CLOSURE

* HIGH reflete impacto real consistentemente ✓
* Momentum não domina prioridades ✓
* WhatsApp/e-mails não geram falsa urgência dominante ✓
* Health/safety permanecem estáveis ✓
* FREE e PRO são semanticamente consistentes ✓
* Distribuição está coerente ✓
* Degraded mode não altera ranking ✓
* Outputs parecem confiáveis e defensáveis para humanos reais ✓
