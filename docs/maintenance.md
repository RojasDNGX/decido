# 🛠️ Decido — Maintenance Notes

This document records relevant technical issues encountered during development.

It is not used for execution.

---

## Network Access Issue (Resolved)

Problem:
Client interactivity failed when accessing the app via local IP.

Root cause:
Incorrect environment assumptions and API handling.

Fix applied:

* Ensured proper client component usage
* Replaced localhost references with internal routes
* Validated API calls and button state
* Confirmed correct production execution mode

---

## Rule

Do not store executable tasks or step-by-step fixes here.

Only keep high-level technical notes when relevant.
