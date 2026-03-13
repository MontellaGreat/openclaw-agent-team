# PUBLISH_CHECKLIST

## Pre-release checks
- [ ] README and README.en are up to date
- [ ] INSTALL guide matches current repo structure
- [ ] Prompt files match latest operating model
- [ ] Agent role definitions are consistent across docs
- [ ] Pianchang rules reflect current 3-subagent design
- [ ] FAQ and troubleshooting are present
- [ ] Roadmap and changelog are updated
- [ ] Example playbooks are present
- [ ] Release notes are ready

## Quality checks
- [ ] Main-agent rule is explicit: simple first, complex second
- [ ] High-risk review rule is explicit
- [ ] Handoff protocol is documented
- [ ] Review gate is documented
- [ ] Lifecycle states are documented
- [ ] Complexity levels are documented
- [ ] Parallel delegation rules are documented

## Release checks
- [ ] Decide release tag (recommended: `v1.0.0`)
- [ ] Prepare GitHub release title
- [ ] Prepare GitHub release body
- [ ] Push final branch to GitHub
- [ ] Create release tag
- [ ] Publish release notes

## Post-release checks
- [ ] Verify repository pages render correctly
- [ ] Verify README links work
- [ ] Verify key docs are discoverable from README
- [ ] Verify prompt files are easy to find
- [ ] Verify first-time users can understand how to start
