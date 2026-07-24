export interface DiagramVersion {
  version: number;
  xml: string;
  timestamp: string;
  editorName: string;
  editorNameEn?: string;
}

export interface Diagram {
  id: string;
  name: string;
  nameEn?: string;
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
  tags?: string[];
  xml: string;
  versions: DiagramVersion[];
}

export interface DiagramListItem {
  id: string;
  name: string;
  nameEn?: string;
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
  tags?: string[];
}
