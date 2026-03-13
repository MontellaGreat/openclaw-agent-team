# CHANGELOG

All notable changes to this project will be documented in this file.

## [Unreleased]
- Preparing v1 release notes and tag.

## [0.6.0] - 2026-03-13
### Added
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/task-complexity-levels.md`
- `docs/faq.md`
- `docs/troubleshooting.md`
- `docs/diagrams.md`
- `team-config.example.yaml`

### Changed
- Main Agent upgraded with explicit orchestration awareness.
- Complexity grading introduced: L1 / L2 / L3 / L4.
- Parallel delegation rules strengthened.
- Handoff and review gates formalized.
- README and prompts updated to reflect v1 operating model.

## [0.5.0] - 2026-03-13
### Added
- `CHANGELOG.md`
- `ROADMAP.md`
- `README.en.md`
- `examples/simple-task-playbook.md`

### Changed
- Project upgraded toward open-source readiness.
- README expanded with install, examples, roadmap, and English entrypoint.

## [0.4.0] - 2026-03-13
### Added
- `INSTALL.md` for quick setup on a new OpenClaw instance.
- `docs/main-agent-decision-flow.md` for main-agent decision SOP.
- `examples/complex-task-playbook.md` for complex task collaboration patterns.

### Changed
- Main Agent now explicitly follows: **judge simple vs complex first; direct-execute simple tasks; split only complex tasks**.
- README navigation expanded for install, decision flow, and playbooks.

## [0.3.0] - 2026-03-13
### Added
- `docs/agent-routing-matrix.md`
- `docs/pianchang-orchestration.md`
- `rules/pianchang-image-input.md`
- `rules/pianchang-edit-input.md`
- `rules/pianchang-video-input.md`

### Changed
- Pianchang redefined as a **multimedia orchestration hub**.
- Pianchang simplified to 3 sub-agents: image, video, edit.
- Video swap merged into `片场-视频` instead of becoming a separate sub-agent.

## [0.2.0] - 2026-03-13
### Added
- `docs/agent-specifications.md`
- `prompt/PROMPT_FULL.md`
- `prompt/PROMPT_SHORT.md`

### Changed
- Agent role definitions upgraded into executable specifications.
- README updated with prompt variants and richer project structure.

## [0.1.0] - 2026-03-13
### Added
- Initial GitHub repository: `openclaw-agent-team`
- Core project README and LICENSE
- One-shot prompt and modular prompt
- Base docs and examples
- Control Center integration guidance
