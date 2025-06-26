import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React, { useRef, useState } from 'react';
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
import { TaskCard } from '../components/TaskCard';

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
  // delete task
  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id) as any);
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      dispatch(
        updateTask({
          ...task,
          completed: !task.completed,
        }) as any
      );
    }
  }

  const renderTaskCard = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onPress={() => handleEditTask(item)}
      onToggleComplete={handleToggleComplete}
    />
  );


  return (
    <SafeAreaView style={styles.container}>
      <Header title="Task" handleAddTask={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskCard}
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
