# Simple Task Playbook

This file captures the default handling pattern for **simple tasks**.

---

## Core Rule
If a task is simple, stable, and does not need multiple specialist capabilities, **Moying should do it directly**.

Do not split a task just to look like a team.

---

## Scenario 1: Short rewrite
### User goal
“Polish this sentence.”

### Handling
- Moying identifies it as simple
- Directly rewrites it
- No delegation

---

## Scenario 2: Quick judgment
### User goal
“Is this title okay?”

### Handling
- Moying gives a direct judgment
- Adds one or two improvement options if needed
- No delegation unless the user asks for deeper research or writing variants

---

## Scenario 3: Small visual extraction
### User goal
“What text is in this screenshot?”

### Handling
- If the main agent can answer stably, answer directly
- Only use visual-specialist flow when the screenshot is complex, ambiguous, or requires structured extraction

---

## Scenario 4: One-step explanation
### User goal
“Explain this config field.”

### Handling
- Moying explains directly if context is sufficient
- Only escalate if it requires deep documentation research or environment-specific verification

---

## Scenario 5: Tiny formatting task
### User goal
“Turn this into bullets.”

### Handling
- Moying transforms it directly
- No team dispatch

---

## When a simple task becomes complex
A simple task should be upgraded only if:
- the user expands scope
- external facts need verification
- implementation is requested
- testing/validation is requested
- risk increases significantly

---

## One-line rule
> Simple tasks should be solved directly; delegation is reserved for real complexity, not for show.
