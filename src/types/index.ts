export interface Task {
  id: string;
  title: string;
  category: string;
  timeSpent: number; // in minutes
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MoodEntry {
  id: string;
  mood: number; // e.g., "happy", "sad", "neutral"
  date: string; // ISO date string
  notes?: string; // optional notes about the mood
  createdAt: string; // ISO date string
}

export interface ChartData {
  label: string;
  value: number;
  color: string; // color for the chart segment
}
export interface ProductivityData {
  date: string; // ISO date string
  tasksCompleted: number;
  timeSpent: number; // in minutes
  mood: number; // average mood rating for the day
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalTasks: number;
  completedTasks: number;
  totalTimeSpent: number; // in minutes
  averageMood: number; // average mood rating for the week
  topCategory: string; // category with the most tasks completed
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalTasks: number;
  completedTasks: number;
  totalTimeSpent: number; // in minutes
  averageMood: number; // average mood rating for the month
  productivityTrend: 'up' | 'down' | 'stable'; // trend of productivity for the month
}

export type RootStackParamList = {
  Main: undefined;
};
export type AppTabParamList = {
  Task: undefined;
  Dashboard: undefined;
  Calendar: undefined;
  Mood: undefined;
  Summary: undefined;
};
