"use strict";

function normalizeTextParts(value) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeTextParts(item));
  }
  if (typeof value !== 'string') return [];
  return value
    .split(/\n+/)
    .flatMap((line) => line.split(/[；;]+/))
    .flatMap((line) => line.split(/[。]+/))
    .flatMap((line) => line.split(/(?:\s+-\s+|^[-*]\s+)/))
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferCheckType(text) {
  const lower = text.toLowerCase();
  if (/文件|file|落盘|生成|写入|产出/.test(text)) return 'file_exists';
  if (/命令|command|脚本|cli|运行/.test(text)) return 'command_success';
  if (/状态|status|进入|迁移|review|required|done/.test(lower)) return 'status_match';
  if (/人工|人工确认|复核|验收|检查|确认/.test(text)) return 'human_check';
  return 'custom';
}

function buildCheckId(text, index) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
  return slug ? `check-${index + 1}-${slug}` : `check-${index + 1}`;
}

function compileDoneDefinition(doneDefinition) {
  const parts = normalizeTextParts(doneDefinition);
  const seen = new Set();
  const checks = [];
  for (const text of parts) {
    if (seen.has(text)) continue;
    seen.add(text);
    checks.push({
      id: buildCheckId(text, checks.length),
      description: text,
      type: inferCheckType(text),
      evidence_required: inferCheckType(text) !== 'human_check',
      status: 'pending',
    });
  }
  return checks;
}

function ensureDoneChecks(taskLike) {
  const hasExisting = Array.isArray(taskLike.done_checks) && taskLike.done_checks.length > 0;
  if (hasExisting) return taskLike.done_checks;
  return compileDoneDefinition(taskLike.done_definition || '');
}

module.exports = {
  normalizeTextParts,
  inferCheckType,
  compileDoneDefinition,
  ensureDoneChecks,
};
