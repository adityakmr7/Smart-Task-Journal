import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  formatDate,
  getDaysInMonth,
  formatDisplayDate,
} from '../utils/dateHelper';
import { TaskCard } from '../components/TaskCard';
import { MoodEntryCard } from '../components/MoodEntryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const tasks = useAppSelector((state) => state.tasks.tasks);
  const { entries: moodEntries } = useAppSelector((state) => state.mood);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((task) => formatDate(task.createdAt) === dateStr);
  };

  const getMoodForDate = (dateStr: string) => {
    return moodEntries.find((entry) => entry.date === dateStr);
  };

  const hasDataForDate = (day: number) => {
    const dateStr = formatDate(new Date(currentYear, currentMonth, day));
    const dayTasks = getTasksForDate(dateStr);
    const dayMood = getMoodForDate(dateStr);
    return dayTasks.length > 0 || dayMood;
  };

  const renderCalendarDay = (day: number | null, index: number) => {
    if (!day) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const dateStr = formatDate(new Date(currentYear, currentMonth, day));
    const isSelected = selectedDate === dateStr;
    const isToday = formatDate(new Date()) === dateStr;
    const hasData = hasDataForDate(day);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          isSelected && styles.calendarDaySelected,
          isToday && styles.calendarDayToday,
          isDark && styles.calendarDayDark,
        ]}
        onPress={() => setSelectedDate(isSelected ? null : dateStr)}
      >
        <Text
          style={[
            styles.calendarDayText,
            isSelected && styles.calendarDayTextSelected,
            isToday && styles.calendarDayTextToday,
            isDark && styles.calendarDayTextDark,
          ]}
        >
          {day}
        </Text>
        {hasData && (
          <View
            style={[
              styles.dataIndicator,
              isSelected && styles.dataIndicatorSelected,
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderCalendar = () => {
    const days = [];

    // Empty days at the beginning
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text
              key={day}
              style={[styles.weekDay, isDark && styles.weekDayDark]}
            >
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {days.map((day, index) => renderCalendarDay(day, index))}
        </View>
      </View>
    );
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedDateMood = selectedDate ? getMoodForDate(selectedDate) : null;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Calendar</Text>
      </View>

      <View
        style={[styles.monthNavigation, isDark && styles.monthNavigationDark]}
      >
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <ChevronLeft size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>

        <Text style={[styles.monthYear, isDark && styles.monthYearDark]}>
          {monthNames[currentMonth]} {currentYear}
        </Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </View>

      {renderCalendar()}

      {selectedDate && (
        <ScrollView
          style={styles.selectedDateContent}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              styles.selectedDateTitle,
              isDark && styles.selectedDateTitleDark,
            ]}
          >
            {formatDisplayDate(selectedDate)}
          </Text>

          {selectedDateMood && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
              >
                Mood
              </Text>
              <MoodEntryCard entry={selectedDateMood} />
            </View>
          )}

          {selectedDateTasks.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
              >
                Tasks ({selectedDateTasks.length})
              </Text>
              {selectedDateTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </View>
          )}

          {selectedDateTasks.length === 0 && !selectedDateMood && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No entries for this date
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {!selectedDate && (
        <View style={styles.instructionContainer}>
          <Text
            style={[
              styles.instructionText,
              isDark && styles.instructionTextDark,
            ]}
          >
            Tap on a date to view entries
          </Text>
          <Text
            style={[
              styles.instructionSubtext,
              isDark && styles.instructionSubtextDark,
            ]}
          >
            Dates with dots have tasks or mood entries
          </Text>
        </View>
      )}
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
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthNavigationDark: {
    backgroundColor: '#1C1C1E',
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  monthYearDark: {
    color: '#FFFFFF',
  },
  calendar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  weekDayDark: {
    color: '#CCCCCC',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
    position: 'relative',
  },
  calendarDayDark: {
    backgroundColor: 'transparent',
  },
  calendarDaySelected: {
    backgroundColor: '#007AFF',
  },
  calendarDayToday: {
    backgroundColor: '#E3F2FD',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  calendarDayTextDark: {
    color: '#FFFFFF',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarDayTextToday: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dataIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  dataIndicatorSelected: {
    backgroundColor: '#FFFFFF',
  },
  selectedDateContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  selectedDateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  selectedDateTitleDark: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    marginLeft: 16,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  emptyTextDark: {
    color: '#CCCCCC',
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  instructionText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionTextDark: {
    color: '#CCCCCC',
  },
  instructionSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  instructionSubtextDark: {
    color: '#AAAAAA',
  },
});
