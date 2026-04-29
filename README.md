![CI Status](https://github.com/RojasDNGX/decido/actions/workflows/playwright.yml/badge.svg)

# Decido

Decido is a decision engine designed to eliminate cognitive overload.

It does not manage tasks.
It tells you what to do next.

---

## 🎯 What it does

You input your tasks in natural language.

Decido:

* analyzes context
* prioritizes what matters
* explains the reasoning
* returns ONE clear action

---

## 🧠 Core Principle

Always return a single primary action.

No lists.
No planning.
No ambiguity.

---

## ⚙️ How it works

1. User inputs tasks
2. AI analyzes priorities
3. System enforces structured output
4. The highest priority becomes the primary action

---

## 🧩 Key Features

* AI-powered prioritization
* Structured decision output (JSON enforced)
* Multi-model fallback (Ollama + Groq)
* Focus-first UI
* Refinement without additional cost

---

## 💡 Product Philosophy

* Clarity over complexity
* Action over planning
* One decision at a time

---

## 🚧 Current Stage

**v1.0.0 — Production MVP.**

Validated, stable, and ready for real users.

---

## 🏗️ Architecture Overview

* Next.js (App Router)
* Modular feature-based structure
* AI orchestration layer — Ollama (local) + Groq (cloud fallback)
* Cookie + IP-based server-side rate limiting
* Lightweight client-side persistence
* In-browser analytics via `window.decidoInsights()`

---

## 🚀 Getting Started

```bash
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local
npm install
npm run dev
```

Open:

http://localhost:3000/decidir

---

## ⚠️ Important

This project evolves incrementally.

No overengineering.
No unnecessary features.
No deviation from core purpose.

---

## 🧠 Final Note

Decido is not about doing more.

It's about doing the right thing next.
