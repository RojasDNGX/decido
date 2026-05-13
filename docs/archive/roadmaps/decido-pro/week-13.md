# WEEK-13 — PRO ACTIVATION (CONTROLLED TOGGLE + PERCEPTION LAYER)

## 🎯 OBJECTIVE

Enable controlled activation of PRO status for a user AND introduce a minimal perceptual difference in output — without adding UI or changing flow.

---

## ⚠️ NON-NEGOTIABLE RULES

* DO NOT add pricing UI
* DO NOT add buttons in main flow
* DO NOT expose activation publicly
* DO NOT modify `/decidir` layout
* DO NOT add visible features

This is an **internal capability with perceptual impact**

---

## 🧠 PRINCIPLE

```text
Activation validates value
Perception validates differentiation
```

---

## PHASES

### STEP 1 — USER PLAN UPDATE FUNCTION
Status: [x]

**Target:** `/lib/users-db.ts`

Implement:

```ts
export function setUserPlan(email: string, plan: 'free' | 'pro') {
  const db = getDb()
  db.prepare(`
    UPDATE users
    SET plan = ?
    WHERE email = ?
  `).run(plan, email)
}
```

---

### STEP 2 — CREATE INTERNAL ACTIVATION ENDPOINT
Status: [x]

**Target:** `/app/api/dev/set-plan/route.ts`

Implement POST endpoint receiving `email` + `plan`:

```ts
import { setUserPlan } from '@/lib/users-db'

export async function POST(req: Request) {
  const { email, plan } = await req.json()

  if (!email || !plan) {
    return new Response('Invalid', { status: 400 })
  }

  setUserPlan(email, plan)

  return new Response('OK')
}
```

Constraints:
* No auth required (dev only)
* No UI exposure
* Only for controlled testing

---

### STEP 3 — VALIDATE PLAN USAGE (CORE LOGIC)
Status: [x]

Verify existing bypass logic is in place:

```ts
if (user.plan === 'pro') {
  // bypass usage limits
}
```

No changes needed if already present. Confirm and document.

---

### STEP 4 — INTRODUCE PERCEPTION LAYER (CRITICAL)
Status: [x]

**Target:** Decision generation logic (where the final action string is produced)

Create formatter:

```ts
function formatDecisionOutput(text: string, plan: 'free' | 'pro') {
  if (plan === 'pro') {
    return makeMoreDecisive(text)
  }
  return text
}

function makeMoreDecisive(text: string) {
  return text
    .replace(/você pode/gi, '')
    .replace(/talvez/gi, '')
    .replace(/considere/gi, '')
    .replace(/poderia/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}
```

Apply in pipeline:

```ts
const finalDecision = formatDecisionOutput(rawDecision, user.plan)
return finalDecision
```

Rules:
* DO NOT add new sentences
* DO NOT increase verbosity
* ONLY increase assertiveness

---

### STEP 5 — TEST FLOW
Status: [x]

**Scenario 1 — Free user:**
* hits limit
* receives normal tone decision

**Scenario 2 — Activate PRO:**
```bash
POST /api/dev/set-plan
{ "email": "user@email.com", "plan": "pro" }
```

**Scenario 3 — Verify behavior:**
* reload page
* run decision again
* limit disappears, usage unlocked

**Scenario 4 — Verify perception:**
* Compare output tone: free (softer) vs pro (more direct, more assertive)

---

## ✅ DEFINITION OF DONE

* [x] User can be switched to PRO via internal endpoint
* [x] Limit bypass works correctly
* [x] Output tone differs subtly but clearly between free and pro
* [x] No UI changes introduced
* [x] Flow remains identical
* [x] Perception shift is noticeable

---

## 🧠 FINAL PRINCIPLE

```text
PRO is not more access
PRO is more certainty
```
