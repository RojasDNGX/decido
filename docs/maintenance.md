# AGENT TASK — UPDATE PRIMARY MODEL TO GEMMA4:E4B

---

## CONTEXT

We are upgrading the primary AI model to a newer version:

gemma4:e4b

---

## OBJECTIVE

Replace current primary model with gemma4:e4b while preserving system stability.

---

## TASK 1 — UPDATE MODEL PRIORITY

Set model order:

1. gemma4:e4b
2. gemma3:4b
3. phi4:14b
4. Groq (fallback)

---

## TASK 2 — UPDATE REQUEST CONFIG

Ensure all calls use:

{
  "model": "gemma4:e4b",
  "options": {
    "temperature": 0.2,
    "num_predict": 250
  }
}

---

## TASK 3 — KEEP SAFETY LAYERS

Maintain:

- JSON validation
- language validation (pt-BR)
- fallback logic

---

## TASK 4 — LOGGING

Log model usage:

console.log("Model used:", modelName)

---

## CONSTRAINTS

- DO NOT change UI
- DO NOT change response structure
- DO NOT change prompt logic

---

## VALIDATION

- Responses still valid JSON
- Responses in pt-BR
- Latency acceptable
- Fallback works if needed