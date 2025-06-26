import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { MoodEntry } from '../types';
import { formatDisplayDate } from '../utils/dateHelper';

interface MoodEntryCardProps {
  entry: MoodEntry;
  onPress?: () => void;
}

export const MoodEntryCard: React.FC<MoodEntryCardProps> = ({
  entry,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😕', '😐', '😊', '😄'];
    return emojis[mood - 1] || '😐';
  };

  const getMoodColor = (mood: number) => {
    const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF'];
    return colors[mood - 1] || '#FFCC00';
  };

  const getMoodLabel = (mood: number) => {
    const labels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
    return labels[mood - 1] || 'Neutral';
  };

  return (
    <TouchableOpacity
      style={[styles.container, isDark && styles.containerDark]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.moodContainer}>
          <Text style={styles.emoji}>{getMoodEmoji(entry.mood)}</Text>
          <View style={styles.moodInfo}>
            <Text
              style={[styles.moodLabel, { color: getMoodColor(entry.mood) }]}
            >
              {getMoodLabel(entry.mood)}
            </Text>
            <Text style={[styles.moodScore, isDark && styles.moodScoreDark]}>
              Score: {entry.mood}/5
            </Text>
          </View>
        </View>

        {entry.notes && (
          <Text
            style={[styles.notes, isDark && styles.notesDark]}
            numberOfLines={2}
          >
            {entry.notes}
          </Text>
        )}

        <Text style={[styles.date, isDark && styles.dateDark]}>
          {formatDisplayDate(entry.date)}
        </Text>
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
  content: {
    flex: 1,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  moodInfo: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  moodScore: {
    fontSize: 14,
    color: '#666666',
  },
  moodScoreDark: {
    color: '#CCCCCC',
  },
  notes: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
    lineHeight: 20,
  },
  notesDark: {
    color: '#DDDDDD',
  },
  date: {
    fontSize: 12,
    color: '#999999',
  },
  dateDark: {
    color: '#AAAAAA',
  },
});
