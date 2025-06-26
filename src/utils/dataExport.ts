import * as FileSystem from 'expo-file-system';
import { Task, MoodEntry } from '../types';

export const exportDataAsJSON = async (
  tasks: Task[],
  moodEntries: MoodEntry[]
) => {
  const data = {
    exportDate: new Date().toISOString(),
    tasks,
    moodEntries,
    version: '1.0.0',
  };

  const jsonString = JSON.stringify(data, null, 2);
  const fileName = `task_journal_export_${
    new Date().toISOString().split('T')[0]
  }.json`;

  const fileUri = FileSystem.documentDirectory + fileName;

  try {
    await FileSystem.writeAsStringAsync(fileUri, jsonString);
    return fileUri;
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
};

export const shareExportFile = async (fileUri: string) => {
  try {
    const canShare = await FileSystem.getContentUriAsync(fileUri);
    // Note: In a real app, you would use expo-sharing here
    // For now, we'll just log the file path
    console.log('Export file saved at:', fileUri);
    return fileUri;
  } catch (error) {
    console.error('Failed to share export file:', error);
    throw error;
  }
};
