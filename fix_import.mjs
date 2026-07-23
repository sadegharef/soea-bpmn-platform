import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

if (!code.includes("import { t, formatDateTime } from '../lib/i18n';")) {
  code = code.replace(/import React, \{ useState, useEffect, useRef \} from "react";/, 'import React, { useState, useEffect, useRef } from "react";\nimport { t, formatDateTime } from "../lib/i18n";');
}

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
