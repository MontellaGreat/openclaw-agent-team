# RELEASE_NOTES_v1

## OpenClaw Agent Team v1

`openclaw-agent-team` v1 is the first structured public release of this project.

It turns an early multi-agent prompt idea into a reusable operating spec for OpenClaw teams.

---

## What v1 delivers

### 1. A main-agent-first operating model
The main agent (Moying / 墨影) is defined as the only final controller.
It must:
- receive user goals
- judge simple vs complex first
- execute simple tasks directly
- decompose only when collaboration adds real value
- review high-risk work before release

### 2. Clear specialist roles
The repo includes structured specifications for:
- writing
- research
- visual understanding
- engineering execution
- testing / troubleshooting
- multimedia orchestration

### 3. Routing and orchestration rules
v1 includes:
- routing matrix
- task complexity levels (L1-L4)
- lifecycle model
- handoff protocol
- review / quality gates
- parallel delegation rules

### 4. Multimedia orchestration via Pianchang
Pianchang is defined as a multimedia orchestration hub, not a generic producer.
It routes work to:
- image generation
- video generation
- image editing

### 5. Migration-ready structure
You can use this repo in three ways:
1. prompt-only startup
2. prompt + real sub-agent mapping
3. prompt + orchestration rules + control center pairing

---

## Why this release matters

Most multi-agent setups fail in one of two ways:
- everything is delegated, even trivial tasks
- roles exist, but routing / handoff / review are undefined

v1 addresses both.

Its core design is:
- direct execution when possible
- decomposition only when justified
- explicit review for risky work
- structured collaboration when multiple agents are involved

---

## Included in v1

- prompt variants
- install guide
- decision flow
- routing matrix
- task playbooks
- task lifecycle
- handoff protocol
- review gates
- complexity levels
- pianchang orchestration
- FAQ
- troubleshooting
- machine-readable example config
- roadmap / changelog

---

## Recommended next step after v1

After adopting v1:
1. test one simple task
2. test one complex task
3. test one high-risk mock task
4. adapt agent mappings to your own OpenClaw instance

---

## One-line summary

**v1 makes OpenClaw multi-agent teamwork practical, disciplined, and reusable.**
