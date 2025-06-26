import {
  Task,
  MoodEntry,
  ProductivityData,
  WeeklySummary,
  MonthlySummary,
} from '../types';
import {
  formatDate,
  getWeekStart,
  getWeekEnd,
  getMonthStart,
  getMonthEnd,
} from './dateHelper';

export const calculateProductivityData = (
  tasks: Task[],
  moodEntries: MoodEntry[]
): ProductivityData[] => {
  const dataMap = new Map<string, ProductivityData>();

  // Process tasks
  tasks.forEach((task) => {
    const date = formatDate(task.createdAt);
    if (!dataMap.has(date)) {
      dataMap.set(date, {
        date,
        tasksCompleted: 0,
        timeSpent: 0,
        mood: 0,
      });
    }

    const data = dataMap.get(date)!;
    if (task.completed) {
      data.tasksCompleted += 1;
    }
    data.timeSpent += task.timeSpent;
  });

  // Process mood entries
  moodEntries.forEach((entry) => {
    if (!dataMap.has(entry.date)) {
      dataMap.set(entry.date, {
        date: entry.date,
        tasksCompleted: 0,
        timeSpent: 0,
        mood: entry.mood,
      });
    } else {
      dataMap.get(entry.date)!.mood = entry.mood;
    }
  });

  return Array.from(dataMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

export const calculateWeeklySummary = (
  tasks: Task[],
  moodEntries: MoodEntry[],
  weekStart: Date
): WeeklySummary => {
  const weekEnd = getWeekEnd(weekStart);
  const weekStartStr = formatDate(weekStart);
  const weekEndStr = formatDate(weekEnd);

  const weekTasks = tasks.filter((task) => {
    const taskDate = formatDate(task.createdAt);
    return taskDate >= weekStartStr && taskDate <= weekEndStr;
  });

  const weekMoodEntries = moodEntries.filter(
    (entry) => entry.date >= weekStartStr && entry.date <= weekEndStr
  );

  const completedTasks = weekTasks.filter((task) => task.completed).length;
  const totalTimeSpent = weekTasks.reduce(
    (sum, task) => sum + task.timeSpent,
    0
  );
  const averageMood =
    weekMoodEntries.length > 0
      ? weekMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
        weekMoodEntries.length
      : 0;

  // Find top category
  const categoryMap = new Map<string, number>();
  weekTasks.forEach((task) => {
    categoryMap.set(
      task.category,
      (categoryMap.get(task.category) || 0) + task.timeSpent
    );
  });

  const topCategory =
    Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    'None';

  return {
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    totalTasks: weekTasks.length,
    completedTasks,
    totalTimeSpent,
    averageMood,
    topCategory,
  };
};

export const calculateMonthlySummary = (
  tasks: Task[],
  moodEntries: MoodEntry[],
  date: Date
): MonthlySummary => {
  const monthStart = getMonthStart(date);
  const monthEnd = getMonthEnd(date);
  const monthStartStr = formatDate(monthStart);
  const monthEndStr = formatDate(monthEnd);

  const monthTasks = tasks.filter((task) => {
    const taskDate = formatDate(task.createdAt);
    return taskDate >= monthStartStr && taskDate <= monthEndStr;
  });

  const monthMoodEntries = moodEntries.filter(
    (entry) => entry.date >= monthStartStr && entry.date <= monthEndStr
  );

  const completedTasks = monthTasks.filter((task) => task.completed).length;
  const totalTimeSpent = monthTasks.reduce(
    (sum, task) => sum + task.timeSpent,
    0
  );
  const averageMood =
    monthMoodEntries.length > 0
      ? monthMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
        monthMoodEntries.length
      : 0;

  // Calculate productivity trend (simplified)
  const firstHalf = monthTasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    return taskDate.getDate() <= 15;
  });
  const secondHalf = monthTasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    return taskDate.getDate() > 15;
  });

  const firstHalfCompleted = firstHalf.filter((t) => t.completed).length;
  const secondHalfCompleted = secondHalf.filter((t) => t.completed).length;

  let productivityTrend: 'up' | 'down' | 'stable' = 'stable';
  if (secondHalfCompleted > firstHalfCompleted) {
    productivityTrend = 'up';
  } else if (secondHalfCompleted < firstHalfCompleted) {
    productivityTrend = 'down';
  }

  return {
    month: date.toLocaleDateString('en-US', { month: 'long' }),
    year: date.getFullYear(),
    totalTasks: monthTasks.length,
    completedTasks,
    totalTimeSpent,
    averageMood,
    productivityTrend,
  };
};

export const getCategoryTimeData = (tasks: Task[]) => {
  const categoryMap = new Map<string, number>();

  tasks.forEach((task) => {
    const current = categoryMap.get(task.category) || 0;
    categoryMap.set(task.category, current + task.timeSpent);
  });

  const colors = [
    '#007AFF',
    '#34C759',
    '#FF9500',
    '#FF3B30',
    '#AF52DE',
    '#00C7BE',
  ];

  return Array.from(categoryMap.entries()).map(([category, time], index) => ({
    label: category,
    value: time,
    color: colors[index % colors.length],
  }));
};
