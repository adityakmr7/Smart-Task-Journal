import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useColorScheme,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchMoodEntries,
  createMoodEntry,
} from '../store/features/mood/moodSlice';
import { MoodEntryCard } from '../components/MoodEntryCard';
import { formatDate } from '../utils/dateHelper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import Header from '../components/Header';

export default function MoodScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();

  const { entries, loading, error } = useAppSelector((state) => state.mood);

  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [todayEntry, setTodayEntry] = useState<any>(null);

  const today = formatDate(new Date());

  useEffect(() => {
    dispatch(fetchMoodEntries() as any);
  }, [dispatch]);

  useEffect(() => {
    const todaysEntry = entries.find((entry) => entry.date === today);
    setTodayEntry(todaysEntry);
    if (todaysEntry) {
      setSelectedMood(todaysEntry.mood);
      setNotes(todaysEntry.notes || '');
    }
  }, [entries, today]);

  const handleSaveMood = () => {
    dispatch(
      createMoodEntry({
        date: today,
        mood: selectedMood,
        notes: notes.trim(),
      }) as any
    );
  };

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

  const recentEntries = entries.filter((entry) => entry.date !== today);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="Mood Log" />

        <View style={[styles.moodSelector, isDark && styles.moodSelectorDark]}>
          <Text
            style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
          >
            Select Your Mood
          </Text>

          <View style={styles.moodOptions}>
            {[1, 2, 3, 4, 5].map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodOption,
                  selectedMood === mood && styles.moodOptionSelected,
                  selectedMood === mood && { borderColor: getMoodColor(mood) },
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                <Text
                  style={[styles.moodNumber, isDark && styles.moodNumberDark]}
                >
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.moodIndicator}>
            <Text
              style={[
                styles.selectedMoodLabel,
                { color: getMoodColor(selectedMood) },
              ]}
            >
              {getMoodLabel(selectedMood)}
            </Text>
            <Text
              style={[
                styles.selectedMoodScore,
                isDark && styles.selectedMoodScoreDark,
              ]}
            >
              Score: {selectedMood}/5
            </Text>
          </View>

          <View style={styles.notesSection}>
            <Text style={[styles.notesLabel, isDark && styles.notesLabelDark]}>
              Notes (optional)
            </Text>
            <TextInput
              style={[styles.notesInput, isDark && styles.notesInputDark]}
              value={notes}
              onChangeText={setNotes}
              placeholder="How was your day? What affected your mood?"
              placeholderTextColor={isDark ? '#CCCCCC' : '#999999'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: getMoodColor(selectedMood) },
            ]}
            onPress={handleSaveMood}
          >
            <Text style={styles.saveButtonText}>
              {todayEntry ? 'Update Mood' : 'Save Mood'}
            </Text>
          </TouchableOpacity>
        </View>

        {recentEntries.length > 0 && (
          <View style={styles.historySection}>
            <Text
              style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
            >
              Recent Entries
            </Text>
            {recentEntries.slice(0, 5).map((entry) => (
              <MoodEntryCard key={entry.id} entry={entry} />
            ))}
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
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
  moodSelector: {
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
  moodSelectorDark: {
    backgroundColor: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#F8F8F8',
    flex: 1,
    marginHorizontal: 4,
  },
  moodOptionSelected: {
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  moodNumberDark: {
    color: '#CCCCCC',
  },
  moodIndicator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedMoodLabel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectedMoodScore: {
    fontSize: 14,
    color: '#666666',
  },
  selectedMoodScoreDark: {
    color: '#CCCCCC',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  notesLabelDark: {
    color: '#FFFFFF',
  },
  notesInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 100,
  },
  notesInputDark: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderColor: '#38383A',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    margin: 16,
    marginTop: 0,
  },
  errorContainer: {
    backgroundColor: '#FF3B30',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
