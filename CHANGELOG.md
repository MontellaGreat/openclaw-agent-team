# CHANGELOG

All notable changes to this project will be documented in this file.

## [Unreleased]
- Ongoing refinement of prompts, routing rules, and OpenClaw migration guidance.

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
