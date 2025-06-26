import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Task } from '../types';

export type TaskBottomSheetRef = {
  open: (task?: Task | null) => void;
  close: () => void;
};

type Props = {
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
};

const categories = ['Work', 'Personal', 'Health', 'Learning', 'Other'];

export const TaskBottomSheet = forwardRef<TaskBottomSheetRef, Props>(
  ({ onSave, onDelete }, ref) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%'], []);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Work');
    const [timeSpent, setTimeSpent] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useImperativeHandle(ref, () => ({
      open: (task?: Task | null) => {
        if (task) {
          setEditingTask(task);
          setTitle(task.title);
          setCategory(task.category);
          setTimeSpent(task.timeSpent.toString());
        } else {
          resetForm();
        }
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const resetForm = () => {
      setTitle('');
      setCategory('Work');
      setTimeSpent('');
      setEditingTask(null);
    };

    const handleSave = () => {
      if (!title.trim()) return;
      const now = new Date().toISOString();
      const taskToSave: Task = {
        id: editingTask?.id || Math.random().toString(),
        title: title.trim(),
        category,
        timeSpent: parseInt(timeSpent) || 0,
        completed: editingTask?.completed ?? false,
        createdAt: editingTask?.createdAt || now,
        updatedAt: now,
      };
      onSave(taskToSave);
      resetForm();
      bottomSheetRef.current?.close();
    };

    const handleDelete = () => {
      if (editingTask && onDelete) {
        onDelete(editingTask.id);
        resetForm();
        bottomSheetRef.current?.close();
      }
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: isDark ? '#121212' : '#FFFFFF' }}
        handleIndicatorStyle={{ backgroundColor: isDark ? '#666' : '#CCC' }}
      >
        <BottomSheetView>
          <ScrollView contentContainerStyle={styles.content}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Task Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={isDark ? '#CCC' : '#888'}
            />

            <Text style={[styles.label, isDark && styles.labelDark]}>
              Category
            </Text>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 28 }}
              horizontal
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.category,
                    category === cat && styles.categoryActive,
                    isDark && styles.categoryDark,
                    category === cat && isDark && styles.categoryActiveDark,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isDark && styles.categoryTextDark,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, isDark && styles.labelDark]}>
              Time Spent (minutes)
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={timeSpent}
              onChangeText={setTimeSpent}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={isDark ? '#CCC' : '#888'}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save Task</Text>
            </TouchableOpacity>

            {editingTask && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteText}>Delete Task</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#1C1C1E',
    color: '#FFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  labelDark: {
    color: '#FFF',
  },
  category: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryDark: {
    backgroundColor: '#2C2C2E',
  },
  categoryActive: {
    backgroundColor: '#007AFF',
  },
  categoryActiveDark: {
    backgroundColor: '#0A84FF',
  },
  categoryText: {
    color: '#666',
  },
  categoryTextDark: {
    color: '#CCC',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  saveText: {
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  deleteText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});
