export interface PreviewTask {
  title: string;
  type?: string;
  priority?: string;
}

export interface ParsedPreview {
  tasks: PreviewTask[];
  clientErrors: string[];
  total: number;
}
