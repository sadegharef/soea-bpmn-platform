import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// Replace module imports
code = code.replace(/import embeddedCommentsModule from "bpmn-js-embedded-comments";/, 'import { customContextPadModule } from "../lib/CustomContextPadProvider";');
code = code.replace(/import "bpmn-js-embedded-comments\/assets\/comments\.css";/, '');

// Fix modules array
code = code.replace(/embeddedCommentsModule,/g, 'customContextPadModule,');

// Add Language toggle state
if (!code.includes('const [lang, setLang]')) {
  code = code.replace(/const \[theme, setTheme\] = useState<"light" | "dark">\(.*\);/, 
    'const [theme, setTheme] = useState<"light" | "dark">("light");\n  const [lang, setLang] = useState<"fa" | "en">("fa");'
  );
}

// Add state for selected element for comments
if (!code.includes('selectedElementId')) {
  code = code.replace(/const \[activeRightTab, setActiveRightTab\].*;/, 
    'const [activeRightTab, setActiveRightTab] = useState<"details" | "comments">("details");\n  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);'
  );
}

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
