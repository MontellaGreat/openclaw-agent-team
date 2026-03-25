# OpenClaw Agent Team

A **multi-agent governance spec repo for OpenClaw**.

> This is not a multi-agent runtime engine, and not a control-center source repo.  
> It exists to make **roles, boundaries, delegation, handoff, review, release, observability, and rollout** explicit and reusable.

<p align="center">
  <img src="https://img.shields.io/badge/OpenClaw-Multi--Agent-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Main%20Agent-Moying-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Coordination-Chengshu-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Governance-3%20Layers-green?style=for-the-badge" />
</p>

---

## Contents

- [What This Repo Is](#what-this-repo-is)
- [Why This Matters](#why-this-matters)
- [Project Positioning](#project-positioning)
- [Three Layers](#three-layers)
- [Team Structure](#team-structure)
- [Quick Start](#quick-start)
- [Reading Paths](#reading-paths)
- [Document Map](#document-map)
- [Examples And Runtime Samples](#examples-and-runtime-samples)
- [Best Fit](#best-fit)
- [Current Status](#current-status)
- [Repo](#repo)
- [License](#license)

---

## What This Repo Is

`openclaw-agent-team` is no longer just a prompt bundle.

It is a reusable governance layer for:
- **main-agent control rules**
- **specialist role definitions**
- **multi-step coordination patterns**
- **handoff / review / release discipline**
- **runtime observability language**
- **control-center integration contracts**

You can think of it as:

> **the policy layer / governance layer / collaboration-spec layer for OpenClaw multi-agent systems.**

It solves problems like:
- the main agent acting as both controller and random executor
- specialists overstepping or duplicating work
- multi-step tasks lacking a clear coordination layer
- no stable language for review, release, and risk
- runtime and control center lacking shared structured fields

---

## Why This Matters

A lot of multi-agent projects stop at this point:
- many roles
- long prompts
- but weak long-term operating discipline

This repo is not mainly about inventing more agents.
It is about hardening the parts that usually break:
- who does what
- who should not do what
- when delegation is worth it
- how handoff works
- how review works
- how release works
- how observability works
- how rollout should be staged

That makes it useful for teams who want:
- something stable, not just demo-friendly
- a main agent that stays in control instead of becoming a relay
- a governance layer that can later connect to runtime and control-center layers

---

## Project Positioning

In one line:

> `openclaw-agent-team` is a **multi-agent governance spec repo for OpenClaw**.

It is not:
- a runtime framework implementation
- a control-center UI source repo
- an automatic orchestration engine

It is mainly responsible for:
- role design
- risk and release rules
- handoff discipline
- review and release semantics
- observability conventions
- rollout strategy
- control-center contract

Formal wrap-up docs:
- `docs/final-audit-and-upgrade-summary.md`
- `docs/upgrade-announcement.md`

---

## Three Layers

The repo now has a full three-layer structure.

### Layer 1: Organization And Flow
This layer defines:
- how the main agent judges
- how specialists are routed
- how complex tasks are decomposed
- how lifecycle / handoff / review should work

Core docs:
- `docs/main-agent-decision-flow.md`
- `docs/agent-routing-matrix.md`
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`

### Layer 2: Boundaries And Runtime Discipline
This layer defines:
- what each role should not do
- how delegation requests should be structured
- when sessions should be opened, reused, or stopped

Core docs:
- `docs/negative-boundaries.md`
- `docs/a2a-delegation-protocol.md`
- `docs/session-hygiene.md`

### Layer 3: Governance Closure
This layer defines:
- what counts as `draft / reviewable / releasable / released`
- what shared schema task board / handoff / review / release should use
- how roster composition stays stable over time
- how rollout is staged
- what control center should actually see

Core docs:
- `docs/release-discipline.md`
- `docs/observability-schema.md`
- `docs/roster-discipline.md`
- `docs/staged-rollout.md`
- `docs/control-center-contract.md`

---

## Team Structure

### Main Agent: Moying
Position: **the only final controller**

Responsibilities:
- receive user goals
- judge task type, complexity, and risk
- decide direct execution / decomposition / review
- make final decisions
- own final review and release decisions

### Coordination Layer: Chengshu
Position: **process coordinator**

Responsibilities:
- coordinate multi-step execution chains
- track phase progress
- collect handoffs
- surface blockers and dependency gaps
- send staged summaries back to Moying

### Specialist Layer
- `Tanzhen`: research and intelligence
- `Biguan`: drafting and writing
- `Tieshou`: engineering execution
- `Wenxi`: testing / QA / review
- `Guanxiang`: daily ops / recurring structured execution
- `Pianchang`: multimedia orchestration hub

Detailed specs:
- `docs/agent-specifications.md`
- `docs/pianchang-orchestration.md`

---

## Quick Start

### Path A: Start With Prompts Only
Best when you want to:
- validate whether the structure feels right
- avoid runtime or control-center integration for now

Suggested order:
1. `QUICKSTART.md`
2. `prompt/PROMPT_SHORT.md`
3. `prompt/one-shot-prompt.md`

### Path B: Use It As A Workspace Governance Template
Best when you want to:
- drop this into an OpenClaw workspace
- make it part of long-term team rules

Suggested order:
1. `INSTALL.md`
2. `docs/workspace-bootstrap.md`
3. `workspace-template/`

### Path C: Connect Real Sub-Agents Or A Control Center
Best when you want to:
- turn the rules into an operating layer
- attach runtime or control-center support

Suggested order:
1. `docs/openclaw-runtime-mapping.md`
2. `docs/observability-schema.md`
3. `docs/control-center-contract.md`
4. `docs/control-center-integration.md`

---

## Reading Paths

### If You Just Want To Understand The Project
1. `docs/upgrade-announcement.md`
2. `README.en.md`
3. `docs/final-audit-and-upgrade-summary.md`

### If You Want To Use It Directly
1. `QUICKSTART.md`
2. `prompt/one-shot-prompt.md`
3. `docs/main-agent-decision-flow.md`
4. `docs/agent-routing-matrix.md`

### If You Want The Second-Layer Rules
1. `docs/negative-boundaries.md`
2. `docs/a2a-delegation-protocol.md`
3. `docs/session-hygiene.md`

### If You Want The Third-Layer Governance Loop
1. `docs/release-discipline.md`
2. `docs/observability-schema.md`
3. `docs/roster-discipline.md`
4. `docs/staged-rollout.md`
5. `docs/control-center-contract.md`

### If You Want Runtime Or Control-Center Integration
1. `docs/openclaw-runtime-mapping.md`
2. `runtime/task-board.example.jsonl`
3. `runtime/handoff-event.example.json`
4. `runtime/release-decision.example.json`
5. `docs/control-center-integration.md`

---

## Document Map

### 1. Positioning And Overall Design
- `docs/v1-positioning.md`
- `docs/architecture.md`
- `docs/openclaw-adaptation.md`
- `docs/final-audit-and-upgrade-summary.md`
- `docs/upgrade-announcement.md`

### 2. Judgment, Routing, And Coordination
- `docs/main-agent-decision-flow.md`
- `docs/agent-routing-matrix.md`
- `docs/routing-rules.md`
- `docs/task-complexity-levels.md`
- `docs/agent-specifications.md`

### 3. Lifecycle, Handoff, Risk, And Recovery
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/risk-and-review.md`
- `docs/failure-recovery.md`
- `docs/doctor.md`

### 4. Second-Layer Discipline
- `docs/negative-boundaries.md`
- `docs/a2a-delegation-protocol.md`
- `docs/session-hygiene.md`

### 5. Third-Layer Governance
- `docs/release-discipline.md`
- `docs/observability-schema.md`
- `docs/roster-discipline.md`
- `docs/staged-rollout.md`
- `docs/control-center-contract.md`
- `docs/metrics-and-evaluation.md`

### 6. OpenClaw Integration
- `docs/openclaw-runtime-mapping.md`
- `docs/runtime-state-model.md`
- `docs/agent-io-contracts.md`
- `docs/control-center-integration.md`
- `openclaw.example.json`

### 7. Multimedia System
- `docs/pianchang-orchestration.md`
- `rules/pianchang-image-input.md`
- `rules/pianchang-video-input.md`
- `rules/pianchang-edit-input.md`

---

## Examples And Runtime Samples

### Playbooks
- `examples/simple-task-playbook.md`
- `examples/complex-task-playbook.md`
- `examples/example-delegation-patterns.md`
- `examples/real-openclaw-multi-agent-playbook.md`
- `examples/governance-playbook-release-chain.md`
- `examples/governance-playbook-ops-escalation.md`

### Runtime Samples
- `runtime/task-board.example.jsonl`
- `runtime/handoff.example.md`
- `runtime/handoff-event.example.json`
- `runtime/review-card.example.md`
- `runtime/release-decision.example.json`

---

## Best Fit

Good fit when you want to:
- keep a main agent in charge instead of turning it into a relay
- define clear role boundaries for research, writing, engineering, QA, structured ops, and multimedia work
- add a coordination layer for multi-step collaboration without removing final control from the main agent
- start with prompts first, then connect runtime later
- add stable review / release / risk semantics to team operations
- provide a governance layer that control center or runtime integrations can consume

Less useful when you only need:
- a single lightweight assistant
- no specialist routing
- no handoff, review, release, or governance discipline

---

## Current Status

The repo now includes:
- role restructuring
- second-layer discipline hardening
- third-layer governance closure
- formal wrap-up documentation
- public-facing upgrade announcement
- runtime governance samples
- governance playbooks

Which means it has moved from a “role prompt repo” into:

> **a reusable governance-spec repo for building OpenClaw multi-agent operating layers.**

---

## Repo

- GitHub: `https://github.com/MontellaGreat/openclaw-agent-team`

---

## License

MIT
