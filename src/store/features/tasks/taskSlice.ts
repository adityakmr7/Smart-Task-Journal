import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../../types';
import { sqliteService } from '../../../service/sqliteService';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [
    // {
    //   id: '1',
    //   title: 'Sample Task',
    //   category: 'Work',
    //   timeSpent: 0,
    //   completed: false,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // },
    // {
    //   id: '2',
    //   title: 'Another Task',
    //   category: 'Personal',
    //   timeSpent: 30,
    //   completed: true,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // },
    // Add more samp
  ],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const tasks = await sqliteService.getTasks();
  return tasks;
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask = {
      ...taskData,
      createdAt: now,
      updatedAt: now,
    };

    const id = await sqliteService.createTask(newTask);
    return { ...newTask, id };
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (taskData: Task) => {
    const updatedTask = {
      ...taskData,
      updatedAt: new Date().toISOString(),
    };

    await sqliteService.updateTask(updatedTask);
    return updatedTask;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    await sqliteService.deleteTask(taskId);
    return taskId;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });

    // Create task
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create task';
      });

    // Update task
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task';
      });

    // Delete task
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
