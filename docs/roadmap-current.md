# ROADMAP CURRENT — WEEK 8 (MODULE 3: SHARED DECISION)

Status: [x]

---

## 🎯 Objetivo

Validar que uma decisão pode existir fora do contexto individual.

Realizado por:

→ geração de link compartilhável
→ renderização da decisão em view read-only

---

## 🧩 PHASE 1 — SHARE ENDPOINT

Status: [x]

**Implementado:**
- `POST /api/share` — recebe objeto de decisão, gera ID único (10 chars), persiste em SQLite, retorna `{ share_url: "/d/{id}" }`
- `GET /api/share/[id]` — recupera decisão por ID
- `lib/share-db.ts` — SQLite via `better-sqlite3` + `customAlphabet` nanoid

---

## 🧩 PHASE 2 — READ-ONLY PAGE

Status: [x]

**Implementado:**
- Rota `/d/[id]` — Server Component read-only
- Exibe: ação primária destacada, justificativa, lista de prioridades
- Badge "Visualização compartilhada" no header
- Link sutil "Tomar sua própria decisão →" no rodapé
- Sem input, sem edição, sem interação

---

## 🧩 PHASE 3 — MINIMAL INTEGRATION

Status: [x]

**Implementado:**
- Botão "Copiar link" adicionado ao `recommended-card-header` (visualmente secundário — `opacity: 0.7`)
- On demand: ao clicar, chama `POST /api/share`, copia URL absoluta para clipboard
- Reseta com nova análise (`useEffect` no `result`)
- Não compete com a ação primária

---

## 🧩 PHASE 4 — BEHAVIOR VALIDATION

Status: [x]

**Validado:**
- Decisão compreensível de forma standalone (sem input field visível)
- Clareza do output preservada na view compartilhada
- Sem dependências ocultas no campo de entrada

---

## 🧩 PHASE 5 — STABILITY CHECK

Status: [x]

**Resultados:**
- 7/7 testes Playwright passando (4 regressão + 3 novos)
- TypeScript: zero erros
- Nenhuma degradação de UI no fluxo principal `/decidir`

---

## 🔧 PATCH — PERSISTENCE FIX

Status: [x]

- Substituído `global.__DECIDO_SHARE_STORE__` (memória) por SQLite (`data/shares.db`)
- Links sobrevivem a reinicializações do servidor
- `lib/share-store.ts` removido

---

## 🔧 PATCH — FAIL-SAFE RENDERING

Status: [x]

- Link inválido ou expirado renderiza fallback calmo: "Decisão indisponível"
- Removido `notFound()` — sem erro de sistema exposto ao usuário
- Link secundário para `/decidir`

---

## ✅ ESTADO FINAL

- Decisão acessível via link público `/d/{id}`
- Links persistem após reinício do servidor
- Links inválidos tratados com fallback invisível
- View read-only funciona de forma independente
- Nenhum impacto no fluxo principal
- Nenhuma complexidade adicionada ao usuário

---

## 📋 Arquivos modificados/criados

| Arquivo | Ação |
|---|---|
| `lib/share-db.ts` | NOVO — SQLite layer |
| `app/api/share/route.ts` | NOVO — POST endpoint |
| `app/api/share/[id]/route.ts` | NOVO — GET endpoint |
| `app/d/[id]/page.tsx` | NOVO — página read-only + fallback |
| `app/decidir/page.tsx` | MODIFICADO — botão "Copiar link" |
| `app/globals.css` | MODIFICADO — `.share-btn` |
| `next.config.ts` | MODIFICADO — `serverExternalPackages` |
| `services/analytics/metrics.ts` | MODIFICADO — evento `share_link_copied` |
| `tests/decido.spec.ts` | MODIFICADO — 3 novos testes |
