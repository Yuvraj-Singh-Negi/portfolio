import { describe, it, expect } from "vitest";
import {
  createTask,
  createMilestone,
  updateMilestoneProgress,
  getOverdueMilestones,
  canTransitionTask,
  getTaskPriorityScore,
  sortTasksByPriority,
  getRecommendedMilestones,
} from "../engine";
import { getProjectStats } from "../types";
import type { Project, ProjectTask, Milestone } from "../types";

describe("Project Engine", () => {
  it("creates a task", () => {
    const task = createTask("proj-1", "Test task", "A test", "high", ["test"]);
    expect(task.id).toBeTruthy();
    expect(task.projectId).toBe("proj-1");
    expect(task.status).toBe("backlog");
    expect(task.priority).toBe("high");
  });

  it("creates a milestone", () => {
    const ms = createMilestone("proj-1", "MS1", "Desc", "2026-08-01", ["task-1"]);
    expect(ms.status).toBe("pending");
    expect(ms.tasks).toContain("task-1");
  });

  it("updates milestone progress", () => {
    const ms: Milestone = {
      id: "ms-1",
      projectId: "proj-1",
      title: "MS",
      description: "",
      dueDate: "",
      status: "active",
      tasks: ["t1", "t2"],
      progress: 0,
      createdAt: "",
    };
    const tasks: ProjectTask[] = [
      {
        id: "t1",
        projectId: "proj-1",
        title: "",
        description: "",
        status: "done",
        priority: "medium",
        assignees: 0,
        comments: 0,
        labels: [],
        order: 0,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "t2",
        projectId: "proj-1",
        title: "",
        description: "",
        status: "in-progress",
        priority: "medium",
        assignees: 0,
        comments: 0,
        labels: [],
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
    ];
    const updated = updateMilestoneProgress(ms, tasks);
    expect(updated.progress).toBe(50);
  });

  it("detects overdue milestones", () => {
    const project = {
      milestones: [
        { status: "active", dueDate: "2020-01-01" },
        { status: "completed", dueDate: "2020-01-01" },
        { status: "pending", dueDate: "2099-01-01" },
      ],
    } as unknown as Project;
    const overdue = getOverdueMilestones(project);
    expect(overdue).toHaveLength(1);
  });

  it("validates task transitions", () => {
    const task = createTask("p1", "t", "d");
    expect(canTransitionTask(task, "in-progress")).toBe(true);
    expect(canTransitionTask(task, "done")).toBe(false);
  });

  it("scores task priorities", () => {
    expect(getTaskPriorityScore("urgent")).toBe(4);
    expect(getTaskPriorityScore("low")).toBe(1);
  });

  it("sorts tasks by priority", () => {
    const tasks = [
      createTask("p1", "low", "d", "low"),
      createTask("p1", "urgent", "d", "urgent"),
      createTask("p1", "high", "d", "high"),
    ];
    const sorted = sortTasksByPriority(tasks);
    expect(sorted[0].title).toBe("urgent");
    expect(sorted[2].title).toBe("low");
  });

  it("recommends milestones based on tech stack", () => {
    const ms = getRecommendedMilestones(["typescript", "react", "postgresql"]);
    expect(ms.length).toBeGreaterThanOrEqual(4);
    expect(ms.some((m) => m.title.includes("TypeScript"))).toBe(true);
  });
});

describe("Project Stats", () => {
  it("calculates correct stats", () => {
    const project = {
      tasks: [
        { status: "done" },
        { status: "done" },
        { status: "in-progress" },
        { status: "backlog" },
      ],
    } as unknown as Project;
    const stats = getProjectStats(project);
    expect(stats.total).toBe(4);
    expect(stats.done).toBe(2);
    expect(stats.progress).toBe(50);
  });
});
