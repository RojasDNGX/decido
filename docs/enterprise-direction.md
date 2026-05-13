# Enterprise Direction — Decido

Status: DRAFT — pending real usage data and retention signals

---

## Context

Decido PRO is now stable in production.

The behavioral baseline was established in week-18B: the AI consistently returns
ONE primary action with defensible priority distribution (alta/média/baixa).

This document captures the intended direction for the Enterprise phase.

No implementation begins until a roadmap cycle is opened.

Enterprise roadmaps will live in:
→ `docs/archive/roadmaps/decido-enterprise/`

---

## Core Premise

PRO validated the monetization model:

→ One input → One clear decision → Paid upgrade for unlimited use

The Enterprise phase must scale this value to teams and organizations,
without compromising the simplicity that makes Decido work.

---

## Candidate Areas (not a commitment)

### 1. Decision History

- Persistent storage per user
- Review past decisions
- Track patterns and outcomes over time

### 2. API Access

- Allow integrations via API
- Enable automation for power users
- Potential for Zapier / n8n / webhooks

### 3. Team / Workspace Mode

- Shared context across a team
- Assign decisions to members
- Centralized decision log

### 4. Multi-user Accounts

- Organization-level accounts
- Individual seats and permissions
- Usage visibility per member

---

## Principles for Enterprise

* Every feature must preserve the ONE clear action output
* Complexity is allowed only in infrastructure, not in the interface
* The user experience must remain immediate and low-friction
* Do NOT add features that increase cognitive load for the end user

---

## What Enterprise is NOT

* A project manager
* A task tracker
* A planning tool
* A collaboration hub

Decido decides. It does not manage.

---

## When to begin

Enterprise development begins only when there is:

* Real retention data from PRO users
* A concrete behavioral need that cannot be served by the current product
* A first phase scoped to a single feature with clear validation criteria

Follow the standard roadmap execution model when ready.

---

*This document is a directional draft only. No implementation until a roadmap phase is defined.*
