# OpenClaw Agent Team

A reusable **multi-agent operating blueprint for OpenClaw**.

---

## Contents
- [Goal](#goal)
- [What this repo is](#what-this-repo-is)
- [Team Structure](#team-structure)
- [Core Rule](#core-rule)
- [Quick Paths](#quick-paths)
- [Key Files](#key-files)
- [Best Fit](#best-fit)
- [Repo](#repo)
- [License](#license)

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
- no shared routing, review, release, or recovery rules
- no clear coordination layer for multi-step task execution

This repo provides:
- role definitions
- routing rules
- prompt variants
- migration guidance
- install guidance
- quickstart guidance
- doctor / troubleshooting guidance
- workspace templates
- config example
- recipes for common workflows
- decision flow for the main agent
- task playbooks
- multimedia orchestration rules
- lifecycle / handoff / review gate / complexity docs
- runtime state model
- agent I/O contracts
- failure recovery guidance
- OpenClaw runtime mapping
- evaluation metrics
- runtime examples

---

## Team Structure
### Main Agent: Moying
Responsibilities:
- receive user goals
- judge task type, complexity, and priority
- decide whether to execute directly or decompose
- decide who should take primary responsibility
- make final risk/release decisions

### Coordination Layer: Chengshu
Responsibilities:
- coordinate multi-step execution chains
- track task state and handoffs
- surface blockers, dependencies, and gaps
- submit staged summaries back to Moying

### Specialist Agents
- Biguan — content drafting and structured writing
- Tanzhen — research and intelligence
- Tieshou — engineering execution
- Wenxi — testing, QA, and review
- Guanxiang — daily ops / recurring structured execution
- Pianchang — multimedia orchestration hub
  - image generation
  - video generation
  - image editing

---

## Core Rule
**The main agent must judge first.**

If the task is simple and can be handled reliably, do it directly.
Only split the task when it is truly complex, risky, or requires specialist capability.
For multi-step work, Chengshu may handle coordination, but final judgment stays with Moying.

The operating model also includes:
- lifecycle tracking
- handoff protocol
- review gates
- complexity levels
- parallel delegation rules
- runtime state modeling
- failure recovery
- evaluation metrics
- workspace templating
- reusable operating recipes

---

## Quick Paths
### If you just want to try it fast
1. Read `QUICKSTART.md`
2. Read `prompt/PROMPT_SHORT.md`
3. Read `INSTALL.md`
4. Validate with `examples/simple-task-playbook.md`

### If you want the full operating model
1. Read `docs/v1-positioning.md`
2. Read `docs/main-agent-decision-flow.md`
3. Read `docs/agent-routing-matrix.md`
4. Read `docs/task-lifecycle.md`
5. Continue with `docs/handoff-protocol.md` and `docs/review-quality-gates.md`
6. Then read `docs/runtime-state-model.md`
7. Then read `docs/agent-io-contracts.md`
8. Then read `docs/failure-recovery.md`
9. Finish with `docs/openclaw-runtime-mapping.md`

### If you want to wire real sub-agents
1. Read `QUICKSTART.md`
2. Read `INSTALL.md`
3. Read `docs/workspace-bootstrap.md`
4. Review `openclaw.example.json`
5. Review `docs/recipes.md`
6. Review `examples/real-openclaw-multi-agent-playbook.md`

---

## Key Files
- `QUICKSTART.md`
- `INSTALL.md`
- `prompt/PROMPT_SHORT.md`
- `prompt/PROMPT_FULL.md`
- `docs/main-agent-decision-flow.md`
- `docs/agent-routing-matrix.md`
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/task-complexity-levels.md`
- `docs/runtime-state-model.md`
- `docs/agent-io-contracts.md`
- `docs/failure-recovery.md`
- `docs/openclaw-runtime-mapping.md`
- `docs/metrics-and-evaluation.md`
- `docs/pianchang-orchestration.md`
- `docs/doctor.md`
- `docs/recipes.md`
- `examples/real-openclaw-multi-agent-playbook.md`
- `runtime/task-board.example.jsonl`
- `runtime/handoff.example.md`
- `runtime/review-card.example.md`
- `docs/workspace-bootstrap.md`
- `openclaw.example.json`
- `workspace-template/SOUL.md`
- `workspace-template/AGENTS.md`

---

## Best Fit
Good fit when you want to:
- keep a main agent in charge instead of turning it into a message relay
- define clean role boundaries for research, writing, engineering, QA, structured ops, and multimedia work
- add a coordination layer for multi-step collaboration without removing final control from the main agent
- start with prompts first, then gradually connect real sub-agents
- add review gates for risky actions like publishing, code merge, config changes, or permissions
- add runtime state, recovery, and evaluation layers over time
- turn the method into reusable workspace files instead of relying on one giant prompt

Less useful when you only need:
- a single lightweight agent with almost no task decomposition
- no specialist routing, no review process, and no handoff discipline

## Repo
- https://github.com/MontellaGreat/openclaw-agent-team

## License
MIT
