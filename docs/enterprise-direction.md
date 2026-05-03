# Enterprise Direction — Decido

Status: DRAFT (no implementation yet)

---

## Context

Decido v1.0.0 (MVP) is now stable in production.

This document captures the intended direction for the next phase: Enterprise.

---

## Core Premise

The MVP validated the core concept:

→ One input → One clear decision

The Enterprise phase must scale this value to teams and organizations,
without compromising the simplicity that makes Decido work.

---

## Candidate Areas (not a commitment)

### 1. Multi-user Support

- User accounts and authentication
- Individual decision history
- Shared team context (optional)

### 2. Decision History

- Persistent storage per user
- Review past decisions
- Track outcomes over time

### 3. API Access

- Allow integrations via API
- Enable automation for power users
- Potential for Zapier / n8n / webhooks

### 4. Team / Workspace Mode

- Shared context across a team
- Assign decisions to members
- Centralized decision log

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

## Next Step

When enterprise development begins:

1. Create `docs/roadmaps/week-6.md`
2. Define the first enterprise phase (single feature, minimal scope)
3. Follow the standard roadmap execution model

---

*This document is a directional draft only. No implementation until a roadmap phase is defined.*
