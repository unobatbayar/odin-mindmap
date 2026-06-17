export type DashboardDateRange = "7d" | "30d" | "90d";

export interface DashboardProject {
  id: string;
  name: string;
  taskCount: number;
}

export interface DashboardAssignee {
  id: number;
  name: string;
  profilePicture?: string | null;
}

export interface DashboardTaskSummary {
  id: string;
  name: string;
  status: { label: string; color: string; type: string };
  updatedAt: string;
  assignees: DashboardAssignee[];
  listName?: string;
  url: string;
}

export interface DashboardMilestone {
  id: string;
  name: string;
  status: { label: string; color: string; type: string };
  dueDate?: string | null;
  assignees: DashboardAssignee[];
  listName?: string;
  url: string;
  isOverdue: boolean;
  group: "upcoming" | "in_progress" | "completed" | "overdue";
}

export interface DashboardGoalKeyResult {
  name: string;
  type: string;
  progress?: { current?: number | null; target?: number | null; unit?: string };
}

export interface DashboardGoal {
  id: string;
  name: string;
  percentComplete: number;
  url?: string;
  keyResults: DashboardGoalKeyResult[];
}

export interface DashboardForecast {
  remaining: number;
  velocityPerWeek: number | null;
  estimatedCompletion: string | null;
  confidence: "high" | "low" | "none";
  weeksRemaining: number | null;
  velocityWindowWeeks: number;
}

export interface DashboardMilestoneForecast {
  milestoneId: string;
  milestoneName: string;
  dueDate: string | null;
  status: "on_track" | "at_risk" | "unknown";
}

export interface DashboardStats {
  generatedAt: string;
  range: DashboardDateRange;
  listId: string | null;
  projects: DashboardProject[];
  totals: {
    open: number;
    inProgress: number;
    closed: number;
    overdue: number;
    dueThisWeek: number;
    collabTasks: number;
    activeCollaborators: number;
    total: number;
    completionRate: number;
  };
  milestones: DashboardMilestone[];
  goals: DashboardGoal[];
  recentActivity: {
    updated: DashboardTaskSummary[];
    completed: DashboardTaskSummary[];
  };
  weeklyCompleted: { weekLabel: string; count: number }[];
  forecast: DashboardForecast;
  nextMilestoneForecast: DashboardMilestoneForecast | null;
}
