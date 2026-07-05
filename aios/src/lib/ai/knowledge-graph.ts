import type { KnowledgeNode } from "./types";

interface GraphConnection {
  source: string;
  target: string;
  weight: number;
}

interface GraphPath {
  nodes: string[];
  totalWeight: number;
}

export class KnowledgeGraphEngine {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private adjList: Map<string, Map<string, number>> = new Map();

  constructor(nodes?: KnowledgeNode[]) {
    if (nodes) {
      nodes.forEach((n) => this.addNode(n));
    }
  }

  addNode(node: KnowledgeNode): void {
    this.nodes.set(node.id, node);
    if (!this.adjList.has(node.id)) {
      this.adjList.set(node.id, new Map());
    }
    node.connections.forEach((connId) => {
      this.addConnection(node.id, connId, 1);
    });
  }

  addConnection(from: string, to: string, weight = 1): void {
    if (!this.adjList.has(from)) this.adjList.set(from, new Map());
    if (!this.adjList.has(to)) this.adjList.set(to, new Map());
    this.adjList.get(from)!.set(to, weight);
    this.adjList.get(to)!.set(from, weight);
  }

  getNode(id: string): KnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  getAllNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values());
  }

  getConnections(): GraphConnection[] {
    const seen = new Set<string>();
    const connections: GraphConnection[] = [];

    for (const [from, targets] of this.adjList) {
      for (const [to, weight] of targets) {
        const key = [from, to].sort().join("-");
        if (!seen.has(key)) {
          seen.add(key);
          connections.push({ source: from, target: to, weight });
        }
      }
    }

    return connections;
  }

  getPrerequisites(nodeId: string): KnowledgeNode[] {
    const node = this.nodes.get(nodeId);
    if (!node) return [];

    return node.connections
      .map((id) => this.nodes.get(id))
      .filter((n): n is KnowledgeNode => n !== undefined)
      .filter((n) => n.completed);
  }

  getMissingPrerequisites(nodeId: string): KnowledgeNode[] {
    const node = this.nodes.get(nodeId);
    if (!node) return [];

    return node.connections
      .map((id) => this.nodes.get(id))
      .filter((n): n is KnowledgeNode => n !== undefined)
      .filter((n) => !n.completed);
  }

  findShortestPath(from: string, to: string): GraphPath | null {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    for (const id of this.nodes.keys()) {
      distances.set(id, id === from ? 0 : Infinity);
      previous.set(id, null);
      unvisited.add(id);
    }

    while (unvisited.size > 0) {
      let current: string | null = null;
      let minDist = Infinity;

      for (const id of unvisited) {
        const dist = distances.get(id)!;
        if (dist < minDist) {
          minDist = dist;
          current = id;
        }
      }

      if (current === null || current === to) break;
      unvisited.delete(current);

      const neighbors = this.adjList.get(current);
      if (!neighbors) continue;

      for (const [neighbor, weight] of neighbors) {
        if (!unvisited.has(neighbor)) continue;
        const alt = distances.get(current)! + weight;
        if (alt < distances.get(neighbor)!) {
          distances.set(neighbor, alt);
          previous.set(neighbor, current);
        }
      }
    }

    if (distances.get(to) === Infinity) return null;

    const path: string[] = [];
    let current: string | null = to;
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }

    return { nodes: path, totalWeight: distances.get(to)! };
  }

  getRelatedConcepts(nodeId: string, maxDepth = 2): KnowledgeNode[] {
    const visited = new Set<string>();
    const related: KnowledgeNode[] = [];
    const queue: { id: string; depth: number }[] = [{ id: nodeId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visited.has(id) || depth > maxDepth) continue;
      visited.add(id);

      if (depth > 0) {
        const node = this.nodes.get(id);
        if (node) related.push(node);
      }

      const neighbors = this.adjList.get(id);
      if (neighbors) {
        for (const neighborId of neighbors.keys()) {
          queue.push({ id: neighborId, depth: depth + 1 });
        }
      }
    }

    return related;
  }

  suggestLearningPath(targetId: string, currentKnowledge: Set<string>): KnowledgeNode[] {
    const target = this.nodes.get(targetId);
    if (!target) return [];

    const path: KnowledgeNode[] = [];
    const queue: { id: string; depth: number }[] = [
      ...target.connections.map((id) => ({ id, depth: 1 })),
    ];
    const visited = new Set<string>([targetId]);

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visited.has(id) || depth > 5) continue;
      visited.add(id);

      const node = this.nodes.get(id);
      if (!node) continue;

      if (!currentKnowledge.has(id)) {
        path.push(node);
      }

      for (const connId of node.connections) {
        queue.push({ id: connId, depth: depth + 1 });
      }
    }

    return path;
  }
}
