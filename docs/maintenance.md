# AGENT TASK — REPLACE IFRAME WITH LOCAL VIDEO (FINAL IMPLEMENTATION)

---

## CONTEXT

Previous implementation used iframe embed from Pexels, which caused:

* UI pollution
* incorrect rendering
* poor UX

We now have the video stored locally:

/public/videos/checklist.mp4

---

## OBJECTIVE

Replace ALL iframe-based video usage with local video implementation using the correct HTML5 <video> element.

---

# 🧩 TASK 1 — REMOVE IFRAME IMPLEMENTATION

* Locate all iframe usages related to video
* Remove them completely

---

# 🧩 TASK 2 — IMPLEMENT HERO BACKGROUND VIDEO

Update hero section:

<div className="relative overflow-hidden">

<video
 src="/videos/checklist.mp4"
 autoPlay
 muted
 loop
 playsInline
 className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
/>

  <div className="absolute inset-0 bg-white/80 dark:bg-black/70"></div>

  <div className="relative z-10">
    {/* existing hero content */}
  </div>

</div>

---

## RULES

* Video MUST be subtle (background only)
* Use opacity between 0.05 and 0.12
* MUST NOT affect readability
* MUST NOT capture pointer events

---

# 🧩 TASK 3 — IMPLEMENT VIDEO IN "VEJA NA PRÁTICA"

Insert:

<video
src="/videos/checklist.mp4"
autoPlay
muted
loop
playsInline
className="rounded-xl w-full mt-6 mb-6"
/>

---

# 🧩 TASK 4 — MOBILE OPTIMIZATION

* Ensure responsive scaling
* If needed, reduce opacity further on mobile
* Maintain performance

---

# 🧩 TASK 5 — PERFORMANCE SAFETY

* Do NOT preload aggressively
* Ensure no layout shift
* Keep video lightweight

---

# 🧩 TASK 6 — VALIDATION

Confirm:

* Video loads correctly from /public
* No iframe remains
* Hero readability is preserved
* CTA remains dominant
* Works on desktop and mobile

---

## CONSTRAINTS

* DO NOT add controls
* DO NOT enable audio
* DO NOT modify layout structure
* DO NOT add more videos

---

## FINAL STEP

* Confirm iframe removed
* Confirm local video working
* Request validation
