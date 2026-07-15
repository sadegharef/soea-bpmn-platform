const rules = { 'start-event-required': true };
function resolveRule(pkg, ruleName) {
  const actualRuleName = ruleName || pkg;
  const name = actualRuleName.startsWith('bpmnlint/') ? actualRuleName.slice(9) : actualRuleName;
  const ruleFn = rules[name];
  console.log("pkg:", pkg, "ruleName:", ruleName, "actualRuleName:", actualRuleName, "name:", name, "found:", !!ruleFn);
  if (ruleFn) return () => ({ check: ruleFn });
  return null;
}
resolveRule('bpmnlint', 'start-event-required');
resolveRule('start-event-required');
resolveRule('bpmnlint/start-event-required');
