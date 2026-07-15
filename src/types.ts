export interface DiagramVersion {
  version: number;
  xml: string;
  timestamp: string;
  editorName: string;
}

export interface Diagram {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
  xml: string;
  versions: DiagramVersion[];
}

export interface DiagramListItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
}
