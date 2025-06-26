import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Task } from '../types';
import { formatTime, formatDisplayDate } from '../utils/dateHelper';
import { CheckCircle2, Circle, Clock, Tag } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggleComplete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleComplete,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Work: '#007AFF',
      Personal: '#34C759',
      Health: '#FF9500',
      Learning: '#AF52DE',
      Other: '#666666',
    };
    return colors[category] || '#666666';
  };

  return (
    <TouchableOpacity
      style={[styles.container, isDark && styles.containerDark]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onToggleComplete?.(task.id)}
          style={styles.checkboxContainer}
        >
          {task.completed ? (
            <CheckCircle2 size={24} color="#34C759" />
          ) : (
            <Circle size={24} color={isDark ? '#CCCCCC' : '#666666'} />
          )}
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text
            style={[
              styles.title,
              isDark && styles.titleDark,
              task.completed && styles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          <View style={styles.metaContainer}>
            <View style={styles.categoryContainer}>
              <Tag size={14} color={getCategoryColor(task.category)} />
              <Text
                style={[
                  styles.category,
                  { color: getCategoryColor(task.category) },
                ]}
              >
                {task.category}
              </Text>
            </View>

            {task.timeSpent > 0 && (
              <View style={styles.timeContainer}>
                <Clock size={14} color={isDark ? '#CCCCCC' : '#666666'} />
                <Text style={[styles.time, isDark && styles.timeDark]}>
                  {formatTime(task.timeSpent)}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.date, isDark && styles.dateDark]}>
            {formatDisplayDate(task.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 22,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  timeDark: {
    color: '#CCCCCC',
  },
  date: {
    fontSize: 12,
    color: '#999999',
  },
  dateDark: {
    color: '#AAAAAA',
  },
});
