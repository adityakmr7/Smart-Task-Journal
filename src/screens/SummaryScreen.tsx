import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SummaryTile } from '../components/SummaryTile';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  calculateWeeklySummary,
  calculateMonthlySummary,
} from '../utils/analytics';
import { exportDataAsJSON, shareExportFile } from '../utils/dataExport';
import { formatTime, getWeekStart, getWeekEnd } from '../utils/dateHelper';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Clock,
  CheckSquare,
  Heart,
} from 'lucide-react-native';

export default function SummaryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { tasks } = useAppSelector((state) => state.tasks);
  const { entries: moodEntries } = useAppSelector((state) => state.mood);

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>(
    'week'
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const weeklySummary = useMemo(() => {
    const weekStart = getWeekStart(currentDate);
    return calculateWeeklySummary(tasks, moodEntries, weekStart);
  }, [tasks, moodEntries, currentDate]);

  const monthlySummary = useMemo(() => {
    return calculateMonthlySummary(tasks, moodEntries, currentDate);
  }, [tasks, moodEntries, currentDate]);

  const handleExportData = async () => {
    try {
      const fileUri = await exportDataAsJSON(tasks, moodEntries);
      await shareExportFile(fileUri);
      Alert.alert(
        'Export Successful',
        `Data exported successfully to ${fileUri}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export data. Please try again.', [
        { text: 'OK' },
      ]);
    }
  };

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (selectedPeriod === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} color="#34C759" />;
      case 'down':
        return <TrendingDown size={16} color="#FF3B30" />;
      default:
        return <Minus size={16} color="#666666" />;
    }
  };

  const currentSummary =
    selectedPeriod === 'week' ? weeklySummary : monthlySummary;
  const periodTitle =
    selectedPeriod === 'week'
      ? `${weeklySummary.weekStart} - ${weeklySummary.weekEnd}`
      : `${monthlySummary.month} ${monthlySummary.year}`;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            Summary
          </Text>
          <TouchableOpacity
            style={[styles.exportButton, isDark && styles.exportButtonDark]}
            onPress={handleExportData}
          >
            <Download size={20} color={isDark ? '#FFFFFF' : '#007AFF'} />
            <Text
              style={[
                styles.exportButtonText,
                isDark && styles.exportButtonTextDark,
              ]}
            >
              Export
            </Text>
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View
          style={[styles.periodSelector, isDark && styles.periodSelectorDark]}
        >
          <View style={styles.periodToggle}>
            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === 'week' && styles.periodOptionActive,
                isDark && styles.periodOptionDark,
              ]}
              onPress={() => setSelectedPeriod('week')}
            >
              <Text
                style={[
                  styles.periodOptionText,
                  selectedPeriod === 'week' && styles.periodOptionTextActive,
                  isDark && styles.periodOptionTextDark,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === 'month' && styles.periodOptionActive,
                isDark && styles.periodOptionDark,
              ]}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text
                style={[
                  styles.periodOptionText,
                  selectedPeriod === 'month' && styles.periodOptionTextActive,
                  isDark && styles.periodOptionTextDark,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.periodNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigatePeriod('prev')}
            >
              <Text
                style={[
                  styles.navButtonText,
                  isDark && styles.navButtonTextDark,
                ]}
              >
                ‹
              </Text>
            </TouchableOpacity>

            <Text
              style={[styles.periodTitle, isDark && styles.periodTitleDark]}
            >
              {periodTitle}
            </Text>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigatePeriod('next')}
            >
              <Text
                style={[
                  styles.navButtonText,
                  isDark && styles.navButtonTextDark,
                ]}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Tiles */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <SummaryTile
              title="Total Tasks"
              value={currentSummary.totalTasks}
              subtitle={`${currentSummary.completedTasks} completed`}
              color="#007AFF"
              icon={<FileText size={20} color="#007AFF" />}
            />
            <SummaryTile
              title="Completion Rate"
              value={`${
                currentSummary.totalTasks > 0
                  ? Math.round(
                      (currentSummary.completedTasks /
                        currentSummary.totalTasks) *
                        100
                    )
                  : 0
              }%`}
              subtitle="Tasks finished"
              color="#34C759"
              icon={<CheckSquare size={20} color="#34C759" />}
            />
          </View>

          <View style={styles.summaryRow}>
            <SummaryTile
              title="Time Spent"
              value={formatTime(currentSummary.totalTimeSpent)}
              subtitle="Total focus time"
              color="#FF9500"
              icon={<Clock size={20} color="#FF9500" />}
            />
            <SummaryTile
              title="Average Mood"
              value={
                currentSummary.averageMood > 0
                  ? currentSummary.averageMood.toFixed(1)
                  : 'N/A'
              }
              subtitle="Out of 5.0"
              color="#AF52DE"
              icon={<Heart size={20} color="#AF52DE" />}
            />
          </View>
        </View>

        {/* Additional Stats */}
        <View
          style={[styles.statsContainer, isDark && styles.statsContainerDark]}
        >
          <Text style={[styles.statsTitle, isDark && styles.statsTitleDark]}>
            Additional Statistics
          </Text>

          {selectedPeriod === 'week' && (
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                Top Category
              </Text>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                {weeklySummary.topCategory}
              </Text>
            </View>
          )}

          {selectedPeriod === 'month' && (
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                Productivity Trend
              </Text>
              <View style={styles.trendContainer}>
                {getTrendIcon(monthlySummary.productivityTrend)}
                <Text
                  style={[styles.statValue, isDark && styles.statValueDark]}
                >
                  {monthlySummary.productivityTrend === 'up'
                    ? 'Improving'
                    : monthlySummary.productivityTrend === 'down'
                    ? 'Declining'
                    : 'Stable'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.statItem}>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
              Daily Average Tasks
            </Text>
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>
              {selectedPeriod === 'week'
                ? (currentSummary.totalTasks / 7).toFixed(1)
                : (
                    currentSummary.totalTasks /
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      0
                    ).getDate()
                  ).toFixed(1)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
              Daily Average Time
            </Text>
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>
              {formatTime(
                Math.round(
                  currentSummary.totalTimeSpent /
                    (selectedPeriod === 'week'
                      ? 7
                      : new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth() + 1,
                          0
                        ).getDate())
                )
              )}
            </Text>
          </View>
        </View>

        {tasks.length === 0 && moodEntries.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
              Start tracking your tasks and mood to see detailed summaries!
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exportButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  exportButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  exportButtonTextDark: {
    color: '#FFFFFF',
  },
  periodSelector: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodSelectorDark: {
    backgroundColor: '#1C1C1E',
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  periodOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodOptionDark: {
    backgroundColor: 'transparent',
  },
  periodOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  periodOptionTextDark: {
    color: '#CCCCCC',
  },
  periodOptionTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  periodNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  navButtonTextDark: {
    color: '#FFFFFF',
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
  },
  periodTitleDark: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsContainer: {
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
  statsContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  statsTitleDark: {
    color: '#FFFFFF',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statLabelDark: {
    color: '#CCCCCC',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  statValueDark: {
    color: '#FFFFFF',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insightsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
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
