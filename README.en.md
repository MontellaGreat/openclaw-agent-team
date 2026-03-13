# OpenClaw Agent Team

A reusable **multi-agent operating blueprint for OpenClaw**.

## Goal
- Define a main agent and specialist sub-agents with a single prompt
- Keep the main agent in charge of orchestration, review, and release decisions
- Make sub-agents useful without letting them overstep
- Allow fast reuse on a different OpenClaw instance with minimal setup

---

## What this repo is
This is not a business-specific project.
It is a reusable collaboration spec for running OpenClaw as a coordinated agent team.

It solves problems like:
- the main agent acting as both controller and random executor
- sub-agents having vague boundaries
- no shared routing, review, or release rules

This repo provides:
- role definitions
- routing rules
- prompt variants
- migration guidance
- install guidance
- decision flow for the main agent
- task playbooks
- multimedia orchestration rules
- lifecycle / handoff / review gate / complexity docs

---

## Team Structure
### Main Agent: Moying
Responsibilities:
- receive user goals
- judge task type, complexity, and priority
- decide whether to execute directly or decompose
- delegate specialist subtasks when needed
- review and merge results
- make final risk/release decisions

### Specialist Agents
- Biguan — writing and content planning
- Tanzhen — research and intelligence
- Guanxiang — visual understanding
- Tieshou — engineering execution
- Wenxi — testing and troubleshooting
- Pianchang — multimedia orchestration hub
  - image generation
  - video generation
  - image editing

---

## Core Rule
**The main agent must judge first.**

If the task is simple and can be handled reliably, do it directly.
Only split the task when it is truly complex, risky, or requires specialist capability.

The operating model also includes:
- lifecycle tracking
- handoff protocol
- review gates
- complexity levels
- parallel delegation rules

---

## Key Files
- `INSTALL.md`
- `prompt/PROMPT_SHORT.md`
- `prompt/PROMPT_FULL.md`
- `docs/main-agent-decision-flow.md`
- `docs/agent-routing-matrix.md`
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/task-complexity-levels.md`
- `docs/pianchang-orchestration.md`
- `examples/simple-task-playbook.md`
- `examples/complex-task-playbook.md`

---

## Repo
- https://github.com/MontellaGreat/openclaw-agent-team

## License
MIT
