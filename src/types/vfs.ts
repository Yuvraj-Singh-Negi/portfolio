export interface FileNode {
  path: string;
  name: string;
  content: string;
  language: string;
  type: "file" | "directory";
  children?: FileNode[];
}

export interface VFSEntry {
  path: string;
  content: string;
  language: string;
}

export interface VFSSnapshot {
  files: Record<string, string>;
  timestamp: number;
}

export interface WorkspaceState {
  projectId: string | null;
  projectName: string;
  openTabs: string[];
  activeTab: string | null;
  vfs: Record<string, string>;
  lastSaved: number | null;
}

export function detectLanguage(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const langMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    css: "css",
    scss: "scss",
    html: "html",
    md: "markdown",
    svg: "xml",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    sh: "shell",
    bash: "shell",
    py: "python",
    rs: "rust",
    go: "go",
    sql: "sql",
    graphql: "graphql",
    gql: "graphql",
    prisma: "prisma",
    env: "dotenv",
  };
  return langMap[ext] ?? "plaintext";
}

export function buildFileTree(files: Record<string, string>): FileNode[] {
  const root: FileNode[] = [];
  const dirMap = new Map<string, FileNode>();

  for (const [path, content] of Object.entries(files)) {
    const parts = path.split("/");
    const fileName = parts.pop()!;
    const dirPath = parts.join("/");

    let parent = root;

    if (dirPath) {
      const partsAccum: string[] = [];
      for (const part of parts) {
        partsAccum.push(part);
        const currentPath = partsAccum.join("/");
        if (!dirMap.has(currentPath)) {
          const dir: FileNode = {
            path: currentPath,
            name: part,
            content: "",
            language: "",
            type: "directory",
            children: [],
          };
          dirMap.set(currentPath, dir);
          const parentPath = partsAccum.slice(0, -1).join("/");
          if (parentPath && dirMap.has(parentPath)) {
            dirMap.get(parentPath)!.children!.push(dir);
          } else {
            root.push(dir);
          }
        }
        parent = dirMap.get(currentPath)!.children!;
      }
    }

    const file: FileNode = {
      path,
      name: fileName,
      content,
      language: detectLanguage(path),
      type: "file",
    };
    parent.push(file);
  }

  return root;
}
