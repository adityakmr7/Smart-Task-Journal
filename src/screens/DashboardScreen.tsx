import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from '../components/BarChart';
import { LineChart } from '../components/LineChart';
import { SummaryTile } from '../components/SummaryTile';
import {
  getCategoryTimeData,
  calculateProductivityData,
} from '../utils/analytics';
import { formatTime } from '../utils/dateHelper';
import { CheckSquare, Clock, Heart, TrendingUp } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 32;
import { useAppSelector, useAppDispatch } from '../store/hooks';
import Header from '../components/Header';
export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { tasks } = useAppSelector((state) => state.tasks);
  const { entries: moodEntries } = useAppSelector((state) => state.mood);

  const categoryData = useMemo(() => getCategoryTimeData(tasks), [tasks]);
  const productivityData = useMemo(
    () => calculateProductivityData(tasks, moodEntries),
    [tasks, moodEntries]
  );

  // Calculate summary statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalTimeSpent = tasks.reduce((sum, task) => sum + task.timeSpent, 0);
  const averageMood =
    moodEntries.length > 0
      ? (
          moodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
          moodEntries.length
        ).toFixed(1)
      : 0;

  // Prepare line chart data for mood vs productivity correlation
  const moodProductivityData = productivityData
    .filter((data) => data.mood > 0)
    .slice(-30) // Last 30 days
    .map((data, index) => ({
      x: index,
      y: data.mood,
      label: data.date,
    }));

  const productivityTrendData = productivityData
    .slice(-30) // Last 30 days
    .map((data, index) => ({
      x: index,
      y: data.tasksCompleted,
      label: data.date,
    }));

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="Dashboard" />

        {/* Summary Tiles */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <SummaryTile
              title="Completion Rate"
              value={`${completionRate}%`}
              subtitle={`${completedTasks}/${totalTasks} tasks`}
              color="#34C759"
              icon={<CheckSquare size={20} color="#34C759" />}
            />
            <SummaryTile
              title="Time Spent"
              value={formatTime(totalTimeSpent)}
              subtitle="Total hours"
              color="#007AFF"
              icon={<Clock size={20} color="#007AFF" />}
            />
          </View>

          <View style={styles.summaryRow}>
            <SummaryTile
              title="Average Mood"
              value={averageMood}
              subtitle="Out of 5.0"
              color="#FF9500"
              icon={<Heart size={20} color="#FF9500" />}
            />
            <SummaryTile
              title="Productivity"
              value={productivityData.length > 0 ? '📈' : '📊'}
              subtitle={`${productivityData.length} days tracked`}
              color="#AF52DE"
              icon={<TrendingUp size={20} color="#AF52DE" />}
            />
          </View>
        </View>

        {/* Charts */}
        <View style={styles.chartsContainer}>
          {categoryData.length > 0 && (
            <View style={styles.chartCard}>
              <BarChart
                data={categoryData}
                width={chartWidth}
                height={280}
                title="Time Spent by Category"
              />
            </View>
          )}

          {moodProductivityData.length > 0 && (
            <View style={styles.chartCard}>
              <LineChart
                data={moodProductivityData}
                width={chartWidth}
                height={280}
                title="Mood Trend (Last 30 Days)"
                color="#FF9500"
              />
            </View>
          )}

          {productivityTrendData.length > 0 && (
            <View style={styles.chartCard}>
              <LineChart
                data={productivityTrendData}
                width={chartWidth}
                height={280}
                title="Tasks Completed Trend"
                color="#34C759"
              />
            </View>
          )}
        </View>

        {tasks.length === 0 && moodEntries.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
              Start tracking tasks and moods to see your dashboard insights!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  subtitleDark: {
    color: '#CCCCCC',
  },
  summaryContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartsContainer: {
    paddingHorizontal: 16,
  },
  chartCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightsContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  insightsTitleDark: {
    color: '#FFFFFF',
  },
  insights: {
    gap: 12,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  insightEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  insightTextDark: {
    color: '#DDDDDD',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyTextDark: {
    color: '#CCCCCC',
  },
});
