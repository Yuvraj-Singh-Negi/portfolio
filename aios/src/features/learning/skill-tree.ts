export interface SkillTreeNode {
  id: string;
  label: string;
  category: string;
  level: number;
  color: string;
  prerequisites: string[];
  unlockedBy: string[];
  progress: number;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: SkillTreeNode[];
}

export const skillTree: SkillCategory[] = [];

export function getSkillById(id: string): SkillTreeNode | undefined {
  for (const category of skillTree) {
    const found = category.skills.find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getSkillCategory(id: string): SkillCategory | undefined {
  return skillTree.find((c) => c.id === id);
}

export function getUnlockedSkills(skillIds: Set<string>): SkillTreeNode[] {
  const unlocked: SkillTreeNode[] = [];
  for (const category of skillTree) {
    for (const skill of category.skills) {
      const canUnlock =
        skill.prerequisites.length === 0 || skill.prerequisites.every((p) => skillIds.has(p));
      if (canUnlock && !skillIds.has(skill.id)) {
        unlocked.push(skill);
      }
    }
  }
  return unlocked;
}

export function getSkillPath(targetId: string): SkillTreeNode[] {
  const path: SkillTreeNode[] = [];
  const visited = new Set<string>();
  const queue = [targetId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const skill = getSkillById(currentId);
    if (!skill) continue;

    path.unshift(skill);
    for (const prereqId of skill.prerequisites) {
      queue.push(prereqId);
    }
  }

  return path;
}

export function getOverallSkillProgress(): number {
  let total = 0;
  let count = 0;
  for (const category of skillTree) {
    for (const skill of category.skills) {
      total += skill.progress;
      count++;
    }
  }
  return count > 0 ? Math.round(total / count) : 0;
}
