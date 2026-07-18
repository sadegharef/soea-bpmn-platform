/**
 * BPMNlint local compliance configuration and rules implementation
 */

interface Reporter {
  report: (id: string, message: string) => void;
}

// Custom rules for BPMN process compliance
const rules: Record<string, (node: any, reporter: Reporter) => void> = {
  'start-event-required': function(node, reporter) {
    if (node.$type === 'bpmn:Process') {
      const flowElements = node.flowElements || [];
      const hasStart = flowElements.some((e: any) => e.$type === 'bpmn:StartEvent');
      if (!hasStart) {
        reporter.report(node.id, 'فرآیند باید حداقل دارای یک رویداد شروع (Start Event) باشد.');
      }
    }
  },
  'end-event-required': function(node, reporter) {
    if (node.$type === 'bpmn:Process') {
      const flowElements = node.flowElements || [];
      const hasEnd = flowElements.some((e: any) => e.$type === 'bpmn:EndEvent');
      if (!hasEnd) {
        reporter.report(node.id, 'فرآیند باید حداقل دارای یک رویداد پایان (End Event) باشد.');
      }
    }
  },
  'fake-join-split': function(node, reporter) {
    if (node.$type === 'bpmn:ExclusiveGateway' || node.$type === 'bpmn:ParallelGateway' || node.$type === 'bpmn:InclusiveGateway') {
      const incoming = node.incoming ? node.incoming.length : 0;
      const outgoing = node.outgoing ? node.outgoing.length : 0;
      
      if (incoming === 1 && outgoing === 1) {
        reporter.report(node.id, 'درگاه (Gateway) نمی‌تواند فقط یک ورودی و یک خروجی داشته باشد.');
      }
      
      if (incoming === 0 && node.$type !== 'bpmn:EventBasedGateway') {
        reporter.report(node.id, 'درگاه (Gateway) باید حداقل یک جریان ورودی داشته باشد.');
      }
      
      if (outgoing === 0) {
        reporter.report(node.id, 'درگاه (Gateway) باید حداقل یک جریان خروجی داشته باشد.');
      }
    }
  },
  'conditional-flows': function(node, reporter) {
    if (node.$type === 'bpmn:ExclusiveGateway' || node.$type === 'bpmn:InclusiveGateway') {
      const outgoing = node.outgoing || [];
      if (outgoing.length > 1) {
        let hasCondition = false;
        let hasDefault = !!node.default;
        
        for (const flow of outgoing) {
           if (flow.conditionExpression) hasCondition = true;
        }
        
        if (!hasCondition && !hasDefault) {
          reporter.report(node.id, 'خروجی‌های درگاه انحصاری (هنگام چندشاخگی) باید دارای شرط (Condition) یا مسیر پیش‌فرض (Default Flow) باشند.');
        }
      }
    }
  },
  'no-duplicate-id': function(node, reporter) {
    if (node.$type && node.$type.startsWith('bpmn:') && node.$type !== 'bpmn:Definitions' && node.$type !== 'bpmn:Process') {
      if (!node.name || node.name.trim() === '') {
        // Warning if label is missing on tasks or events
        if (node.$type === 'bpmn:UserTask' || node.$type === 'bpmn:ServiceTask' || node.$type === 'bpmn:ExclusiveGateway') {
          reporter.report(node.id, `عنصر از نوع ${node.$type.split(':')[1]} فاقد برچسب نام فارسی است.`);
        }
      }
    }
  }
};

const bpmnlintConfig = {
  resolver: {
    resolveRule: function(pkg: string, ruleName?: string) {
      const actualRuleName = ruleName || pkg;
      const name = actualRuleName.startsWith('bpmnlint/') ? actualRuleName.slice(9) : actualRuleName;
      const ruleFn = rules[name];
      if (ruleFn) {
        // bpmnlint expects a factory function returning an object with a check function
        return function() {
          return {
            check: ruleFn
          };
        };
      }
      return null;
    }
  },
  config: {
    rules: {
      'start-event-required': 'error',
      'end-event-required': 'error',
      'no-duplicate-id': 'warn',
      'fake-join-split': 'error',
      'conditional-flows': 'warn'
    }
  }
};

export default bpmnlintConfig;
