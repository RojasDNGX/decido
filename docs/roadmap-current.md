# ROADMAP CURRENT — WEEK 11 (MODULE 6: DECISION REEVALUATION)

Status: [x]

---

## 🎯 Objetivo

Permitir que o usuário **re-execute a decisão explicitamente** quando o contexto mudar.

---

## 🧩 PHASE 1 — RE-EVALUATION ACTION

Status: [x]

**Ação:**
- Adicionar ação secundária "Reavaliar decisão" abaixo do card de decisão ou próximo a "Refinar informações".
- O botão deve disparar o fluxo de decisão novamente.
- Estilo minimalista, sem peso visual excessivo.

**Validação:**
- Ação é visível mas não dominante?
- O fluxo de decisão é reiniciado corretamente?
- Não há aumento de complexidade na UI?

## 🧩 PHASE 2 — FLOW ALIGNMENT & ACTION CONSOLIDATION

Status: [x]

**Ação:**
- Unificar o fluxo de decisão usando o botão primário para re-análise.
- Alterar label do botão para "Rever decisão" após o resultado.
- Remover "Reavaliar decisão" do card de resultado.
- Simplificar o header removendo redundâncias (botão "Voltar").

**Validação:**
- Botão altera entre "Analisar" e "Rever decisão"?
- Card de resultado permanece limpo?
- Header está simplificado e funcional?

## 🧩 PHASE 3 — MICRO INTERACTION (LOADING FEEDBACK)

Status: [x]

**Ação:**
- Implementar animação sutil de pontos no botão primário durante o loading.
- Remover todos os outros indicadores de loading (spinners, skeletons) fora do botão.
- Garantir que o botão seja a única fonte de feedback de processamento.

**Validação:**
- Animação de pontos é sutil e funcional?
- Spinners externos foram removidos?
- Layout permanece estável durante o loading?

## 🧩 PHASE 4 — MICRO REFINEMENTS

Status: [x]

**Ação:**
- Harmonizar o link "Refinar informações" (cores mais suaves, tipografia integrada).
- Adicionar interação de gradiente sutil no card de decisão (`.recommended-card`).
- Garantir que o polimento não altere a hierarquia visual.

**Validação:**
- O link "Refinar informações" parece mais integrado e menos ruidoso?
- O card de decisão tem um movimento de gradiente sutil ao passar o mouse?
- A hierarquia visual permanece inalterada?

---

## 🚫 Fora do escopo

- Auto-refresh de decisões
- Confirmações ou modais
- Histórico de versões de decisão
- Comparações entre decisões
