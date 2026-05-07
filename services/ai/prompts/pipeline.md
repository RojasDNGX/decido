# DECIDO — FULL PIPELINE (FREE vs PRO)

Este documento define a orquestração final entre as camadas de inteligência.

---

# GLOBAL PRINCIPLE
Existe apenas UM motor de decisão.
FREE e PRO devem compartilhar:
* as mesmas tarefas
* a mesma ordenação
* o mesmo selected_high_id
* a mesma primary_action
Eles NUNCA devem divergir na decisão básica.

### SAFETY & HEALTH DEFAULT OVERRIDE
Questões de SAÚDE ou DEPENDENTES (filhos, pets, idosos) recebem prioridade cautelar (ALTA) por padrão. Decido prioriza segurança e responsabilidade sobre otimização.

### CONCRETE > ABSTRACT
O sistema deve sempre preferir alvos CONCRETOS e executáveis (ex: "ligar no banco") em vez de estados emocionais abstratos (ex: "estou sobrecarregado").

---

# PIPELINE

## STEP 1 — CORE (MANDATORY)
Executa a camada CORE para extração e ordenação básica.
Define: o que mais importa.

## STEP 2 — HEURISTICS (MANDATORY)
Executa a camada HEURISTICS para sinais de impacto e execução.
Define: por que importa e se pode ser feito agora.

## STEP 3 — PRIMARY ACTION (MANDATORY)
Executa a lógica de PRIMARY ACTION.
Define: o que fazer exatamente agora (pode diferir do selected_high_id se houver ganho de momentum).

## STEP 4 — PLAN BRANCHING
### FREE: Pula Context e Validation. Segue para RENDER (FREE).
### PRO: Executa CONTEXT e VALIDATION. Segue para RENDER (PRO).

---

# RENDER RULES (CRITICAL)
* NUNCA use templates ou frases prontas.
* SEMPRE derive a linguagem dos sinais das camadas anteriores.
* Justificativa deve obedecer rigorosamente à hierarquia de decisão.
* Se task == selected_high_id → Justificativa "PESADA" (IMPACTO): focada em riscos, prazos e consequências reais.
* Se task == primary_action_task_id (mas não High) → Justificativa "LEVE" (EXECUÇÃO): focada em rapidez, facilidade e momentum. PROIBIDO usar palavras como "urgente" ou "fundamental".
* Para as demais → Justificativa de ADIAMENTO: explicar por que o impacto é baixo ou o prazo é flexível.

---

# NATURAL LANGUAGE RULE
A linguagem deve ser: direta, humana e contextual.
FREE: mais curta e direta.
PRO: mais profunda e com mais nuances de confiança.
AMBOS: nunca robóticos.
