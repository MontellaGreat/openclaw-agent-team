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

## 📌 Contents

- [What This Is](#-what-this-is)
- [Core Principles](#-core-principles)
- [Team Structure](#-team-structure)
- [Three-Layer Governance](#-three-layer-governance)
- [Quick Start](#-quick-start)
- [Best Fit](#-best-fit)
- [Document Map](#-document-map)
- [Examples And Samples](#-examples-and-samples)
- [Current Status](#-current-status)
- [License](#-license)

---

## 🎯 What This Is

`openclaw-agent-team` is a reusable **governance-layer specification for OpenClaw multi-agent systems**.

It provides:
- **Main Agent Control Rules** — Keep the main agent in control, not degenerated into a message relay
- **Specialist Role Definitions** — Clear role boundaries and responsibility specs
- **Multi-Step Coordination Patterns** — Task decomposition and orchestration flows for complex work
- **Handoff / Review / Release Discipline** — Stable quality gates and release rules
- **Runtime Observability Language** — Unified field schemas and state models
- **Control Center Integration Contracts** — Integration specs for external consoles

**Core Problems It Solves:**

| Problem | Consequence | How This Solves It |
|---------|-------------|-------------------|
| Main agent acts as both controller and random executor | Role confusion, low efficiency | Clear controller boundaries: direct execution for simple tasks, decomposition for complex ones |
| Specialists lack boundaries | Overstepping, duplicated work | Negative boundaries + role specs + handoff protocols |
| Multi-step tasks lack coordination | Scattered handoffs, lost state | Chengshu coordination layer + task lifecycle management |
| No stable review/release language | Uncontrollable quality, invisible risks | Quality gates + release discipline + risk classification |
| Runtime/Console lack shared schema | Hard integration, hard observability | Observability Schema + Control Contracts |

---

## 🧭 Core Principles

The core philosophy of this framework can be summarized in five principles:

```
1. Judge first, then dispatch   — Main agent judges task nature before deciding to delegate
2. Simple tasks: execute direct  — Don't decompose just to look like a team
3. Complex tasks: decompose      — Decomposition must bring efficiency, quality, or risk control gains
4. High-risk: mandatory review   — Specialists can analyze/implement, but final release authority stays with main agent
5. Handoff ≠ completion          — After output: Handoff → Review → Decision → Release
```

**Orchestration Mindset:**
> Orchestration is for solving problems, not for making the team look busy.

---

## 👥 Team Structure

This team is not a flat list of agents. It is a three-layer operating structure:

```
User
  ↓
Moying (Main Agent / Final Controller / Final Decision Maker)
  ↓
Chengshu (Coordination Layer / Process Pusher)
  ↓
Specialist Layer (Activated by task type, not always fully on)
  ├── Tanzhen (Research & Intelligence)
  ├── Biguan (Drafting & Writing)
  ├── Tieshou (Engineering Execution)
  ├── Wenxi (QA / Review)
  ├── Guanxiang (Structured Ops)
  └── Pianchang (Multimedia Orchestration)
```

### Role Quick Reference

| Role | Position | Core Responsibilities | In One Line |
|------|----------|----------------------|-------------|
| **Moying** | Control Center | Task judgment, complexity classification, final decision & release | Not a relay — the control center |
| **Chengshu** | Coordination | Multi-step orchestration, handoff collection, blocker surfacing | Carries process labor, not final authority |
| **Tanzhen** | Research | Research, pre-study, solution comparison, recommendation paths | Compress raw info into decision-ready conclusions |
| **Biguan** | Writing | Articles, reports, scripts, structured text outputs | Produce directly usable text deliverables |
| **Tieshou** | Engineering | Code, scripts, automation, configuration implementation | Deliver verifiable, rollback-ready implementations |
| **Wenxi** | QA / Review | Testing, troubleshooting, boundary checks, risk patching | The "second pair of eyes" before release |
| **Guanxiang** | Structured Ops |巡检, cron tasks, routine execution, summaries | Handle daily ops and structured recurring work |
| **Pianchang** | Multimedia Orchestration | Route image/video/edit tasks and consolidate outputs | An orchestration hub, not a universal executor |

**Detailed specs:** `docs/agent-specifications.md`

---

## 🏗️ Three-Layer Governance

The repo forms a complete three-layer structure, from flow to discipline to closure:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Governance Closure                             │
│  draft → reviewable → releasable → released             │
│  Unified schema + staged rollout + Control Center contract│
├─────────────────────────────────────────────────────────┤
│  Layer 2: Boundaries And Runtime Discipline              │
│  Negative boundaries + A2A delegation + Session hygiene  │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Organization And Flow                          │
│  Main agent judgment + Specialist routing + Handoff      │
└─────────────────────────────────────────────────────────┘
```

### Layer 1: Organization And Flow

**Solves:** How the main agent judges, how specialists are routed, how complex tasks are decomposed, how lifecycle/handoff/review flow

**Core Docs:**
- `docs/main-agent-decision-flow.md` — Main agent decision flow
- `docs/agent-routing-matrix.md` — Task → Role routing matrix
- `docs/task-lifecycle.md` — Task lifecycle definition
- `docs/handoff-protocol.md` — Handoff protocol and format
- `docs/review-quality-gates.md` — Quality gate standards

### Layer 2: Boundaries And Runtime Discipline

**Solves:** What each role should not do, how delegation requests are structured, when sessions should be opened/reused/stopped

**Core Docs:**
- `docs/negative-boundaries.md` — Negative boundaries per role (what not to do)
- `docs/a2a-delegation-protocol.md` — Agent-to-agent delegation protocol
- `docs/session-hygiene.md` — Session management norms

### Layer 3: Governance Closure

**Solves:** State definitions, unified schemas, roster stability, staged rollout, what Control Center should see

**Core Docs:**
- `docs/release-discipline.md` — Release discipline and state transitions
- `docs/observability-schema.md` — Observability Schema
- `docs/roster-discipline.md` — Team roster norms
- `docs/staged-rollout.md` — Staged rollout strategy
- `docs/control-center-contract.md` — Control center integration contract

---

## 🚀 Quick Start

### Three Integration Paths

| Path | Best For | Suggested Order |
|------|----------|-----------------|
| **A. Prompts Only** | Validate structure, defer runtime integration | `QUICKSTART.md` → `prompt/PROMPT_SHORT.md` |
| **B. Workspace Template** | Drop into OpenClaw workspace as long-term norms | `INSTALL.md` → `docs/workspace-bootstrap.md` |
| **C. Real Multi-Agent** | Turn rules into operating layer, connect Control Center | `docs/openclaw-runtime-mapping.md` → `docs/control-center-contract.md` |

### 3-Minute Minimum Validation

Regardless of which path you choose, we recommend running these three validation tasks first:

| Task Type | Example | Expected Behavior |
|-----------|---------|-------------------|
| **Simple Task** | "Help me polish this paragraph" | Main agent executes directly, no over-decomposition |
| **Complex Task** | "Research options, write a report, then suggest visuals" | Explain decomposition plan first, then dispatch, then consolidate |
| **High-Risk Task** | "Change production config and deploy" | Identify as high-risk, provide plan/draft first, don't execute directly |

**Validation Pass Criteria:**
1. ✅ Simple tasks are not over-decomposed
2. ✅ Complex tasks explain decomposition before dispatching
3. ✅ High-risk tasks are not executed directly to completion
4. ✅ Sub-agents do not overstep to make final decisions

---

## ✅ Best Fit

### Good Fit When You Want To:

- ✅ Build a clear main-agent + specialist team for OpenClaw
- ✅ Keep the main agent in control instead of turning it into a relay
- ✅ Add review / release discipline for high-risk tasks
- ✅ Provide a unified governance layer for Control Center / Runtime
- ✅ Start with prompts first, then connect runtime gradually

### Less Useful When You Only Need:

- ❌ A single lightweight assistant
- ❌ No specialist routing at all
- ❌ No interest in handoff, review, release, or risk discipline
- ❌ One-time demo without long-term operation plans

---

## 📚 Document Map

### Find By Need

| If You Want To... | Start With These Docs |
|-------------------|----------------------|
| Understand project positioning | `docs/v1-positioning.md` · `docs/upgrade-announcement.md` |
| Use it directly | `QUICKSTART.md` · `prompt/one-shot-prompt.md` |
| Understand main agent judgment | `docs/main-agent-decision-flow.md` · `docs/task-complexity-levels.md` |
| Understand role division | `docs/agent-specifications.md` · `docs/agent-routing-matrix.md` |
| Nail down handoff and review | `docs/handoff-protocol.md` · `docs/review-quality-gates.md` |
| Understand three-layer governance | `docs/release-discipline.md` · `docs/observability-schema.md` |
| Integrate with Runtime | `docs/openclaw-runtime-mapping.md` · `runtime/` samples |
| Integrate with Control Center | `docs/control-center-contract.md` · `docs/control-center-integration.md` |
| Configure multimedia orchestration | `docs/pianchang-orchestration.md` · `rules/pianchang-*.md` |

### Full Document Categories

**1. Positioning And Overall Design**
`docs/v1-positioning.md` · `docs/architecture.md` · `docs/final-audit-and-upgrade-summary.md`

**2. Judgment, Routing, And Coordination**
`docs/main-agent-decision-flow.md` · `docs/agent-routing-matrix.md` · `docs/agent-specifications.md`

**3. Lifecycle, Handoff, Risk**
`docs/task-lifecycle.md` · `docs/handoff-protocol.md` · `docs/review-quality-gates.md` · `docs/risk-and-review.md`

**4. Second-Layer Discipline**
`docs/negative-boundaries.md` · `docs/a2a-delegation-protocol.md` · `docs/session-hygiene.md`

**5. Third-Layer Governance**
`docs/release-discipline.md` · `docs/observability-schema.md` · `docs/staged-rollout.md` · `docs/control-center-contract.md`

**6. OpenClaw Integration**
`docs/openclaw-runtime-mapping.md` · `docs/runtime-state-model.md` · `openclaw.example.json`

**7. Multimedia System**
`docs/pianchang-orchestration.md` · `rules/pianchang-image-input.md` · `rules/pianchang-video-input.md`

---

## 📋 Examples And Samples

### Playbooks (Scenario-Based Examples)

| File | Description |
|------|-------------|
| `examples/simple-task-playbook.md` | Simple task handling flow example |
| `examples/complex-task-playbook.md` | Complex task decomposition and orchestration example |
| `examples/example-delegation-patterns.md` | Common delegation pattern examples |
| `examples/real-openclaw-multi-agent-playbook.md` | Real OpenClaw multi-agent scenarios |
| `examples/governance-playbook-release-chain.md` | Release chain governance example |
| `examples/governance-playbook-ops-escalation.md` | Operations escalation handling example |

### Runtime Samples (Structured Data)

| File | Description |
|------|-------------|
| `runtime/task-board.example.jsonl` | Task board state example |
| `runtime/handoff-event.example.json` | Handoff event format |
| `runtime/review-card.example.md` | Review Card template |
| `runtime/release-decision.example.json` | Release decision format |

---

## 📊 Current Status

This repo has completed its upgrade from a "role prompt repo" to a "governance spec repo":

- ✅ Role structure restructured (Moying/Chengshu/Specialist three-layer)
- ✅ Second-layer discipline hardened (negative boundaries + delegation protocol + session hygiene)
- ✅ Third-layer governance closure (release discipline + observability schema + control contracts)
- ✅ Formal summary docs (`docs/final-audit-and-upgrade-summary.md`)
- ✅ Runtime governance samples (`runtime/` directory)
- ✅ Governance Playbooks (`examples/` directory)

> **Ready to use as-is for building OpenClaw multi-agent governance layers.**

---

## 📄 License

MIT License · See `LICENSE` file

---

## 🔗 Related Links

- **GitHub**: https://github.com/MontellaGreat/openclaw-agent-team
- **OpenClaw Docs**: https://docs.openclaw.ai
- **Community**: https://discord.com/invite/clawd
