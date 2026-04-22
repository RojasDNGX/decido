# 🚀 DECIDO — EXECUTION ROADMAP (WEEK 4 — LANDING & SEO FOUNDATION)

## AGENT EXECUTION INSTRUCTIONS (READ FIRST)

You are responsible for executing this roadmap step by step.

At the start of EVERY session:

1. Read this entire file.
2. Find the FIRST phase with Status: [ ] (not completed).
3. Execute ONLY that phase.
4. After finishing:
   - Explain what was implemented
   - Request human validation
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
- KEEP implementations minimal and functional
- PRIORITIZE clarity and conversion over visual complexity

---

## WEEK 4 OBJECTIVE — LANDING & SEO FOUNDATION

Create a high-conversion landing page and establish the base structure for SEO content.

Focus areas:
- product positioning
- conversion clarity
- acquisition foundation (blog structure)
- zero interference with product flow

---

## PHASE 1 — ROUTING STRUCTURE (FOUNDATION)

Status: [x]

### Tasks:

- Create new routes using App Router:

  /                → Landing page  
  /decidir         → Existing product entry  
  /blog            → Blog listing page  
  /blog/[slug]     → Dynamic blog article  
  /sobre           → About page  
  /contato         → Contact page  

- Ensure navigation between landing and product is working
- Do NOT modify product logic inside /decidir

### Validation:

- All routes are accessible
- Product still works exactly as before
- No broken navigation

---

## PHASE 2 — LANDING PAGE (CORE STRUCTURE)

Status: [x]

### Tasks:

Build landing page at `/` with the following sections:

1. Hero section:
   - Headline:
     "Pare de decidir o que fazer. Deixe o Decido decidir por você."
   - Subheadline
   - CTA → "/decidir"

2. Problem section:
   - Excess tasks
   - Decision fatigue
   - Lack of clarity

3. How it works (3 steps)

4. Example block (input → output → justification)

5. Differentiation section:
   - "Não organiza tarefas. Decide o que fazer agora."

6. Final CTA

### Constraints:

- Keep layout clean and minimal
- No animations required
- No external libraries unless necessary

### Validation:

- Message is clear in <10 seconds
- CTA is visible and functional
- Flow feels natural and convincing

---

## PHASE 3 — VISUAL HIERARCHY & UX POLISH

Status: [x]

### Tasks:

- Apply visual hierarchy:
  - Strong headline
  - Section spacing
  - Clear reading flow

- Improve typography:
  - Title > subtitle > body

- Ensure responsive layout (mobile-first)

- Keep consistent spacing and alignment

### Validation:

- Content is easy to scan
- No visual clutter
- Mobile experience is clean

---

## PHASE 4 — BLOG STRUCTURE (SEO FOUNDATION)

Status: [x]

### Tasks:

- Create `/blog` page:
  - Static list of placeholder articles

- Create `/blog/[slug]` dynamic page:
  - Render article title
  - Render content structure (mock data allowed)

- Prepare basic article layout:
  - Title
  - Sections (H2, H3)
  - Paragraphs

### Constraints:

- No CMS integration yet
- No real SEO optimization yet
- Focus only on structure

### Validation:

- Blog pages render correctly
- Dynamic route works
- Layout supports long-form content

---

## PHASE 5 — BASIC SEO SETUP

Status: [ ]

### Tasks:

- Add metadata to all main pages:
  - title
  - description

- Ensure semantic HTML:
  - h1, h2 hierarchy
  - proper structure

- Prepare for:
  - sitemap (basic)
  - robots.txt (optional placeholder)

### Validation:

- Each page has unique title/description
- HTML structure is semantic
- No missing metadata

---

## PHASE 6 — FINAL VALIDATION (NO NEW FEATURES)

Status: [ ]

### Tasks:

- Validate full flow:

  Landing → CTA → Product  
  Blog → Article → CTA → Product  

- Check for:
  - broken links
  - layout inconsistencies
  - responsiveness

- Ensure:
  - product experience unchanged
  - landing is clean and persuasive
  - blog is structurally ready

### Validation:

- Navigation works end-to-end
- No regressions in product
- Landing communicates value clearly

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