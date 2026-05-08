# DECIDO — ROADMAP WEEK 16 (AUTH & IDENTITY HARDENING)

Status: [ ]

## 🧱 PHASE 1 — IDENTITY ARCHITECTURE REFACTOR

* [ ] Separate authentication from monetization logic
* [ ] Implement structured user roles: Guest, Authenticated FREE, Authenticated PRO
* [ ] Decouple login from automatic PRO status (Login = identity, Subscription = PRO)

---

## 🟣 PHASE 2 — GUEST EXPERIENCE GOVERNANCE

* [ ] Implement official Guest user flow with limited experience
* [ ] Set strict Guest limitations (no history, no easy resets)
* [ ] Implement server-side Guest quota (IP/Fingerprint based)
* [ ] Add clear CTA for free account creation

---

## 🟢 PHASE 3 — AUTHENTICATED FREE PLAN

* [ ] Create real server-side persistence for FREE users
* [ ] Implement basic history for authenticated FREE
* [ ] Link usage quotas to user ID instead of browser storage

---

## 🔐 PHASE 4 — TRADITIONAL AUTHENTICATION

* [ ] Implement Email/Password registration and login
* [ ] Add secure logout, password reset, and email verification
* [ ] Set up account recovery flow

---

## 🤝 PHASE 5 — SOCIAL LOGIN CONSOLIDATION

* [ ] Consolidate existing social providers (Google)
* [ ] Ensure correct persistence and session synchronization
* [ ] Validate consistency across different providers

---

## 🔗 PHASE 6 — IDENTITY LINKING

* [ ] Implement logic to link multiple providers to the same email
* [ ] Handle conflicts (Google login + Email/Password)
* [ ] Ensure identity uniqueness and safe account merging

---

## 🛡️ PHASE 7 — SERVER-SIDE USAGE ENFORCEMENT

* [ ] Migrate all limits, quotas, and locks to server-side authority
* [ ] Remove dependencies on cookies/localStorage for critical gating
* [ ] Prevent limit resets through browser cleaning

---

## 📊 PHASE 8 — DATABASE AUDIT & HARDENING

* [ ] Audit and refine database schema (Users, Providers, Subs, Quotas, Sessions)
* [ ] Ensure relational integrity and email uniqueness
* [ ] Prepare schema for future billing integration

---

## 🔒 PHASE 9 — SECURITY HARDENING

* [ ] Implement strong password hashing and secure sessions (httpOnly)
* [ ] Add CSRF, brute-force protection, and rate limiting
* [ ] Configure session expiration and token invalidation

---

## ⚖️ PHASE 10 — LGPD MINIMAL READINESS

* [ ] Add basic consent flow and privacy policy
* [ ] Implement opt-in for communications
* [ ] Prepare infrastructure for "Right to be Forgotten" (account deletion)

---

## 🎨 PHASE 11 — AUTH UX REFINEMENT

* [ ] Simplify login and registration interfaces
* [ ] Clearly differentiate FREE vs PRO value during auth
* [ ] Ensure auth feels like "continuity/trust" rather than a block

---

## 🧪 PHASE 12 — VALIDATION & STRESS TESTS

* [ ] Test limit resets, provider switching, and account recovery
* [ ] Validate session expiration and multi-device persistence
* [ ] Verify FREE quotas and abuse prevention

---

## 🚨 SUCCESS CRITERIA

* [ ] Authenticated FREE plan operational with server-side history
* [ ] 100% server-authoritative quotas (no browser-only bypass)
* [ ] Functional traditional and social authentication
* [ ] Stable identity linking and audited database
* [ ] System ready for real-world production monetization