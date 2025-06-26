import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { DeleteIcon, Edit3Icon } from 'lucide-react-native';
import {
  TaskBottomSheet,
  TaskBottomSheetRef,
} from '../components/TaskBottomSheet';
import Header from '../components/Header';
import {
  createTask,
  deleteTask,
  updateTask,
} from '../store/features/tasks/taskSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { FlatList } from 'react-native-gesture-handler';
import { Task } from '../types';

const TaskScreen = () => {
  const dispatch = useAppDispatch();
  const sheetRef = useRef<TaskBottomSheetRef>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const handleAddTask = () => {
    setEditingTask(null);
    sheetRef.current?.open();
  };
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    sheetRef.current?.open(task);
  };
  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id) as any);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Task" handleAddTask={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {}}
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#E0E0E0',
              }}
            >
              <Text style={{ fontSize: 18, color: '#000000' }}>
                {item.title}
              </Text>
              <Text style={{ color: '#888888' }}>{item.category}</Text>
              <Text style={{ color: '#888888' }}>{item.timeSpent} minutes</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => handleEditTask(item)}>
                <Edit3Icon />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <DeleteIcon />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TaskBottomSheet
        ref={sheetRef}
        onSave={(taskData) => {
          if (taskData?.id && tasks.some((t) => t.id === taskData.id)) {
            dispatch(updateTask(taskData) as any);
          } else {
            dispatch(createTask(taskData) as any);
          }
          sheetRef.current?.close();
        }}
        onDelete={(id) => dispatch(deleteTask(id) as any)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});
export default TaskScreen;
