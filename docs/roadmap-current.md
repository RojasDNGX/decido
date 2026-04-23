# 🚀 DECIDO — EXECUTION ROADMAP (WEEK 5 — CONTENT & TRACTION LAYER)

## AGENT EXECUTION INSTRUCTIONS (READ FIRST)

You are responsible for executing this roadmap step by step.

At the start of EVERY session:

1. Read this entire file.
2. Find the FIRST phase with Status: [ ] (not completed).
3. Execute ONLY that phase.
4. After finishing:
   - Explain what was implemented
   - Request human validation
   - All in brazilian portuguese
5. WAIT for approval before continuing.
6. After approval:
   - Mark the phase as [x]
   - Save this file
   - Suggest the next phase

---

## GLOBAL RULES (STRICT)

- DO NOT modify AI decision logic or prompts
- DO NOT refactor unrelated code
- DO NOT execute multiple phases at once
- DO NOT expand scope beyond defined tasks
- KEEP implementations minimal and focused
- PRIORITIZE real user behavior over assumptions

---

## WEEK 5 OBJECTIVE — CONTENT & TRACTION

Start generating real traffic and observe real user behavior.

Focus areas:
- SEO content creation
- traffic acquisition
- product entry points
- behavioral validation

---

## PHASE 1 — FIRST SEO ARTICLES (FOUNDATION)

Status: [x]

### Tasks:

Create 3 real blog articles inside `/blog`:

1. "Como priorizar tarefas de forma eficiente"
2. "Como decidir o que fazer primeiro no dia"
3. "Como parar de procrastinar na prática"

Each article MUST:

- Have a strong title (H1)
- Include structured sections (H2, H3)
- Provide real, useful content (not generic)
- Be at least medium-length (readable, not shallow)
- Include natural writing in pt-BR

### Constraints:

- Do NOT generate placeholder content
- Do NOT use overly generic AI text
- Content must feel human and practical

### Validation:

- Articles are readable and valuable
- Structure is clear and well-organized
- Content matches search intent

# AGENT TASK — SEO QUALITY PATCH (BLOG ARTICLES)

You are working on Week 5 — Content & Traction Layer.

---

## CONTEXT

Phase 1 (SEO Articles) and Phase 2 (CTA Integration) are already completed.

This is NOT a re-execution of those phases.

This is a QUALITY PATCH to ensure SEO and readability standards are correctly applied.

---

## OBJECTIVE

Validate and improve all existing blog articles to meet SEO and content quality best practices.

---

## TARGET FILES

- /app/blog/posts.ts
- /app/blog/[slug]/page.tsx

---

## REQUIRED CHECKS & FIXES

### 1. SINGLE H1 RULE

- Ensure each article renders ONLY one <h1>
- Convert any additional H1s into H2 or H3

---

### 2. FIRST PARAGRAPH OPTIMIZATION

- Ensure the first 2–3 paragraphs:
  - clearly answer the article’s main topic
  - naturally include the primary keyword
  - are direct and not generic

---

### 3. READABILITY IMPROVEMENT

- Ensure:
  - short paragraphs (2–4 lines max)
  - proper spacing between sections
  - use of bullet points or lists where applicable

---

### 4. META TAGS VALIDATION

For each article:

- Ensure <title> follows pattern:
  "[Article Title] | Decido"

- Ensure meta description:
  - is present
  - has 120–160 characters
  - clearly describes the article
  - matches search intent

---

### 5. INTERNAL LINKING (LIGHT)

- Add at least ONE internal link per article:
  - pointing to another blog post OR
  - pointing to /decidir

- Ensure link is contextual (inside a sentence, not isolated)

---

### 6. HTML SEMANTICS

- Ensure proper hierarchy:
  - H1 → H2 → H3
- Avoid skipping levels
- Use semantic structure correctly

---

## CONSTRAINTS

- DO NOT rewrite entire articles
- DO NOT change article meaning
- DO NOT modify CTA logic from Phase 2
- Only apply targeted improvements

---

## VALIDATION

After applying changes:

- Articles are more readable
- SEO structure is correct
- No structural errors (multiple H1, missing meta, etc.)
- Content remains natural and human

---

## FINAL STEP

After completion:

- Summarize all improvements made
- Request validation

---

## PHASE 2 — CTA INTEGRATION (BLOG → PRODUCT)

Status: [x]

### Tasks:

Inside each article:

- Add 1–2 contextual CTAs
- Use natural phrasing, for example:

  "Quer aplicar isso automaticamente? Use o Decido."

- Link CTA to:
  `/decidir`

- Place CTAs:
  - mid-content
  - end of article

### Constraints:

- Do NOT be aggressive
- Do NOT disrupt reading flow

### Validation:

- CTAs feel natural and helpful
- Links correctly redirect to product
- No UX friction

---

## PHASE 3 — BASIC ANALYTICS SETUP

Status: [x]

### Tasks:

Implement a lightweight analytics solution:

Options:
- Vercel Analytics (preferred)
- or similar minimal tool

Track at least:

- Page views
- Visits to `/decidir`
- Navigation from blog → product

### Constraints:

- Keep setup simple
- No heavy integrations

### Validation:

- Analytics is working
- Basic metrics are visible
- No performance impact

---

## PHASE 4 — LANDING MESSAGE ITERATION (BASED ON LOGIC)

Status: [x]

### Tasks:

Review landing page messaging and improve clarity:

- Refine headline if needed
- Improve subheadline clarity
- Ensure value is understood in <5 seconds

Focus on:

- decision relief
- immediate value
- simplicity

### Constraints:

- Do NOT redesign layout
- Only adjust text and clarity

### Validation:

- Message is clearer and more direct
- No increase in complexity
- Maintains original positioning

---

## PHASE 5 — USER FLOW OBSERVATION (NO CODE CHANGES)

Status: [x]

### Tasks:

Analyze expected user flow:

Landing → CTA → Product → Interaction

Evaluate:

- Is entry point clear?
- Is output understandable?
- Is next action obvious?

Document observations (no implementation required yet)

### Constraints:

- Do NOT implement new features
- Focus only on observation and reasoning

### Validation:

- Clear understanding of potential friction points
- Identified areas for future improvement

---

## PHASE 6 — FINAL VALIDATION (TRACTION READY)

Status: [x]

### Tasks:

Validate full system:

- Landing → Blog → Product flow
- All links working
- Articles accessible
- CTAs functional

Ensure:

- Product remains stable
- No regressions
- Experience is coherent

### Validation:

- User can discover → understand → use Decido
- No broken flows
- Ready for real users

---

## FINAL RULE

If something is not explicitly defined:

→ DO NOT IMPLEMENT  
→ ASK FOR CLARIFICATION

---

## EXECUTION RULE

- Execute ONE phase at a time
- ALWAYS wait for validation
- NEVER skip phases
- NEVER continue automatically