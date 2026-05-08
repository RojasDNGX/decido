# DECIDO — ROADMAP WEEK 16 (AUTH & IDENTITY HARDENING)

Status: [x]

## 🧱 PHASE 1 — IDENTITY ARCHITECTURE REFACTOR

* [x] Separate authentication from monetization logic
* [x] Implement structured user roles: Guest, Authenticated FREE, Authenticated PRO
* [x] Decouple login from automatic PRO status (Login = identity, Subscription = PRO)

---

## 🟣 PHASE 2 — GUEST EXPERIENCE GOVERNANCE

* [x] Implement official Guest user flow with limited experience
* [x] Set strict Guest limitations (no history, no easy resets)
* [x] Implement server-side Guest quota (IP/Fingerprint based)
* [x] Add clear CTA for free account creation

---

## 🟢 PHASE 3 — AUTHENTICATED FREE PLAN

* [x] Create real server-side persistence for FREE users
* [x] Implement basic history for authenticated FREE
* [x] Link usage quotas to user ID instead of browser storage

---

## 🔐 PHASE 4 — TRADITIONAL AUTHENTICATION

* [x] Implement Email/Password registration and login
* [x] Add secure logout, password reset, and email verification
* [x] Set up account recovery flow

---

## 🤝 PHASE 5 — SOCIAL LOGIN CONSOLIDATION

* [x] Consolidate existing social providers (Google)
* [x] Ensure correct persistence and session synchronization
* [x] Validate consistency across different providers

---

## 🔗 PHASE 6 — IDENTITY LINKING

* [x] Implement logic to link multiple providers to the same email
* [x] Handle conflicts (Google login + Email/Password)
* [x] Ensure identity uniqueness and safe account merging

---

## 🛡️ PHASE 7 — SERVER-SIDE USAGE ENFORCEMENT

* [x] Migrate all limits, quotas, and locks to server-side authority
* [x] Remove dependencies on cookies/localStorage for critical gating
* [x] Prevent limit resets through browser cleaning

---

## 📊 PHASE 8 — DATABASE AUDIT & HARDENING

* [x] Audit and refine database schema (Users, Providers, Subs, Quotas, Sessions)
* [x] Ensure relational integrity and email uniqueness
* [x] Prepare schema for future billing integration

---

## 🔒 PHASE 9 — SECURITY HARDENING

* [x] Implement strong password hashing and secure sessions (httpOnly)
* [x] Add CSRF, brute-force protection, and rate limiting
* [x] Configure session expiration and token invalidation

---

## ⚖️ PHASE 10 — LGPD MINIMAL READINESS

* [x] Add basic consent flow and privacy policy
* [x] Implement opt-in for communications
* [x] Prepare infrastructure for "Right to be Forgotten" (account deletion)

---

## 🎨 PHASE 11 — AUTH UX REFINEMENT

* [x] Simplify login and registration interfaces
* [x] Clearly differentiate FREE vs PRO value during auth
* [x] Ensure auth feels like "continuity/trust" rather than a block

---

## 🧪 PHASE 12 — VALIDATION & STRESS TESTS

* [x] Test limit resets, provider switching, and account recovery
* [x] Validate session expiration and multi-device persistence
* [x] Verify FREE quotas and abuse prevention

---

## 🚨 SUCCESS CRITERIA

* [x] Authenticated FREE plan operational with server-side history
* [x] 100% server-authoritative quotas (no browser-only bypass)
* [x] Functional traditional and social authentication
* [x] Stable identity linking and audited database
* [x] System ready for real-world production monetization