import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db.json");

// Middleware to parse JSON
app.use(express.json({ limit: "50mb" }));

// Initial BPMN 2.0 XML
const DEFAULT_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="شروع فرآیند" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="162" y="145" width="58" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

interface DiagramVersion {
  version: number;
  xml: string;
  timestamp: string;
  editorName: string;
}

interface Diagram {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
  tags?: string[];
  xml: string;
  versions: DiagramVersion[];
}

interface DB {
  diagrams: Record<string, Diagram>;
}

// Database Helper functions
function readDB(): DB {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialDB: DB = { diagrams: {} };
      // Pre-populate with a demo diagram
      const demoId = "demo-process";
      initialDB.diagrams[demoId] = {
        id: demoId,
        name: "فرآیند نمونه خرید سازمانی",
        tags: ["نمونه", "AS-IS", "فرآیند خرید"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latestVersion: 1,
        xml: DEFAULT_BPMN_XML,
        versions: [
          {
            version: 1,
            xml: DEFAULT_BPMN_XML,
            timestamp: new Date().toISOString(),
            editorName: "سیستم"
          }
        ]
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), "utf8");
      return initialDB;
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return { diagrams: {} };
  }
}

function writeDB(db: DB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

// Initialize DB on startup
readDB();

// API Routes

// Get all diagrams (metadata only or small payloads)
app.get("/api/diagrams", (req, res) => {
  const db = readDB();
  const list = Object.values(db.diagrams).map(({ id, name, createdAt, updatedAt, latestVersion, tags }) => ({
    id,
    name,
    createdAt,
    updatedAt,
    latestVersion,
    tags: tags || [],
  }));
  res.json(list);
});

// Get single diagram
app.get("/api/diagrams/:id", (req, res) => {
  const db = readDB();
  const diagram = db.diagrams[req.params.id];
  if (!diagram) {
    return res.status(404).json({ error: "Diagram not found" });
  }
  res.json(diagram);
});

// Create new diagram
app.post("/api/diagrams", (req, res) => {
  const { name, editorName, tags } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const db = readDB();
  const id = "proc_" + Math.random().toString(36).substring(2, 11);
  const now = new Date().toISOString();

  const newDiagram: Diagram = {
    id,
    name,
    tags: tags || [],
    createdAt: now,
    updatedAt: now,
    latestVersion: 1,
    xml: DEFAULT_BPMN_XML,
    versions: [
      {
        version: 1,
        xml: DEFAULT_BPMN_XML,
        timestamp: now,
        editorName: editorName || "کاربر ناشناس"
      }
    ]
  };

  db.diagrams[id] = newDiagram;
  writeDB(db);

  res.status(210).json(newDiagram);
});

// Save new version
app.put("/api/diagrams/:id", (req, res) => {
  const { xml, editorName, name } = req.body;
  if (!xml) {
    return res.status(400).json({ error: "XML content is required" });
  }

  const db = readDB();
  const diagram = db.diagrams[req.params.id];
  if (!diagram) {
    return res.status(404).json({ error: "Diagram not found" });
  }

  const now = new Date().toISOString();
  const nextVersionNum = diagram.latestVersion + 1;

  const newVersion: DiagramVersion = {
    version: nextVersionNum,
    xml,
    timestamp: now,
    editorName: editorName || "ویرایشگر ناشناس"
  };

  diagram.xml = xml;
  diagram.latestVersion = nextVersionNum;
  diagram.updatedAt = now;
  if (name) {
    diagram.name = name;
  }
  diagram.versions.push(newVersion);

  db.diagrams[req.params.id] = diagram;
  writeDB(db);

  res.json(diagram);
});

// Get version list for a diagram
app.get("/api/diagrams/:id/versions", (req, res) => {
  const db = readDB();
  const diagram = db.diagrams[req.params.id];
  if (!diagram) {
    return res.status(404).json({ error: "Diagram not found" });
  }
  // Return metadata about versions, omit full xml to keep response light
  const list = diagram.versions.map(({ version, timestamp, editorName }) => ({
    version,
    timestamp,
    editorName
  }));
  res.json(list);
});

// Get specific XML version of a diagram
app.get("/api/diagrams/:id/versions/:version", (req, res) => {
  const db = readDB();
  const diagram = db.diagrams[req.params.id];
  if (!diagram) {
    return res.status(404).json({ error: "Diagram not found" });
  }
  const versionNum = parseInt(req.params.version, 10);
  const version = diagram.versions.find(v => v.version === versionNum);
  if (!version) {
    return res.status(404).json({ error: "Version not found" });
  }
  res.json(version);
});

// Delete diagram
app.delete("/api/diagrams/:id", (req, res) => {
  const db = readDB();
  if (!db.diagrams[req.params.id]) {
    return res.status(404).json({ error: "Diagram not found" });
  }
  delete db.diagrams[req.params.id];
  writeDB(db);
  res.json({ success: true });
});

async function startServer() {
  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BPMN Web Modeler server listening on port ${PORT}`);
  });
}

startServer();
