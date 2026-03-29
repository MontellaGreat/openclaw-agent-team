# OpenClaw Agent Team

A **multi-agent governance spec repo for OpenClaw**.

> This repo is no longer a task runtime implementation repo.  
> `task runtime / ledger / supervisor / CLI / state machine` have been moved out to a dedicated project.

## Repository Scope

`openclaw-agent-team` now keeps only three categories of content:

1. **Governance rules**
   - Main-agent control principles
   - Specialist role boundaries
   - Risk / review / release discipline

2. **Team templates**
   - Role templates for main / chengshu / specialists
   - Workspace conventions
   - Delegation / handoff / phase-summary style templates

3. **Planning and methodology**
   - Multi-agent collaboration methods
   - Planning contracts
   - Control-center / observability / rollout governance language

No longer included here:
- Task ledger implementation
- State-machine executor
- Supervisor
- Task CLI
- Demo ledgers or runtime acceptance samples

## Good Fit

Use this repo when you want to:
- Build a governance skeleton for an OpenClaw team
- Define boundaries for main agent / coordinator / specialists
- Standardize review, release, handoff, and risk rules
- Reuse it as a multi-agent governance package or template repo

Do not use this repo to:
- Keep developing a task runtime here
- Treat it as a task orchestration engine
- Maintain ledger / scheduler / CLI execution logic here

## Document Entry Points

- `docs/v1-positioning.md`
- `docs/architecture.md`
- `docs/agent-specifications.md`
- `docs/main-agent-decision-flow.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/risk-and-review.md`
- `docs/planning-contract.md`
- `docs/control-center-contract.md`

## Migration Note

The task system has been split into a dedicated project. This repo now focuses only on:
- governance
- roles
- collaboration rules
- templates
- integration contracts

## Cleanup Status

This cleanup removed:
- `runtime-core/`
- `runtime/`
- task-runtime-related schema / transition / shell command docs
- runtime samples and demo ledger artifacts
- old README and planning wording that implied runtime implementation lives here

## Links

- GitHub: https://github.com/MontellaGreat/openclaw-agent-team
- OpenClaw Docs: https://docs.openclaw.ai
