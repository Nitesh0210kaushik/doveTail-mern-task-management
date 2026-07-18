import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../../services/task.service';
import type { Task, TaskFilters, TaskInput, TaskListResponse } from '../../features/tasks/types/task.types';
import { getApiErrorMessage } from '../../utils/api-error';

interface TasksState {
  list: TaskListResponse | null;
  selected: Task | null;
  loading: boolean;
  error: string;
}

const initialState: TasksState = {
  list: null,
  selected: null,
  loading: false,
  error: '',
};

export const fetchTasksThunk = createAsyncThunk<TaskListResponse, TaskFilters, { rejectValue: string }>(
  'tasks/list',
  async (filters, { rejectWithValue }) => {
    try {
      return (await getTasks(filters)).data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Unable to load tasks.'));
    }
  },
);

export const fetchTaskThunk = createAsyncThunk<Task, string, { rejectValue: string }>(
  'tasks/get',
  async (taskId, { rejectWithValue }) => {
    try {
      return (await getTask(taskId)).data.task;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Unable to load task.'));
    }
  },
);

export const createTaskThunk = createAsyncThunk<Task, TaskInput, { rejectValue: string }>(
  'tasks/create',
  async (input, { rejectWithValue }) => {
    try {
      return (await createTask(input)).data.task;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Unable to create task.'));
    }
  },
);

export const updateTaskThunk = createAsyncThunk<
  Task,
  { taskId: string; input: Partial<TaskInput> },
  { rejectValue: string }
>('tasks/update', async ({ taskId, input }, { rejectWithValue }) => {
  try {
    return (await updateTask(taskId, input)).data.task;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, 'Unable to update task.'));
  }
});

export const deleteTaskThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/delete',
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Unable to delete task.'));
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
    reducers: {
      clearSelectedTask: (state) => {
        state.selected = null;
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load tasks.';
      })
      .addCase(fetchTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.selected = null;
      })
      .addCase(fetchTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load task.';
      })
      .addCase(createTaskThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTaskThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to create task.';
      })
      .addCase(updateTaskThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to update task.';
      })
      .addCase(deleteTaskThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.loading = false;

        if (state.list) {
          state.list.tasks = state.list.tasks.filter(
            (task) => task.id !== action.payload,
          );
          state.list.totalRecords = Math.max(0, state.list.totalRecords - 1);
        }
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to delete task.';
      });
  },
});

export const { clearSelectedTask } = tasksSlice.actions;
export default tasksSlice.reducer;
