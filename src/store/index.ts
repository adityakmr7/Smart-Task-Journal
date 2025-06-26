import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tasksReducer from './features/tasks/taskSlice';
import moodReducer from './features/mood/moodSlice';

const tasksPersistConfig = {
  key: 'tasks',
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const moodPersistConfig = {
  key: 'mood',
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const persistedTasksReducer = persistReducer(tasksPersistConfig, tasksReducer);
const persistedMoodReducer = persistReducer(moodPersistConfig, moodReducer);

export const store = configureStore({
  reducer: {
    tasks: persistedTasksReducer,
    mood: persistedMoodReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
