import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../../services/auth.service';
import type { AuthResponse, LoginInput, RegisterInput } from '../../features/auth/types/auth.types';
import { getApiErrorMessage } from '../../utils/api-error';

type AuthUser = AuthResponse['user'];

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  checked: boolean;
  error: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  checked: false,
  error: '',
};

export const loginThunk = createAsyncThunk<AuthUser, LoginInput, { rejectValue: string }>(
  'auth/login',
  async (input, { rejectWithValue }) => {
    try {
      return (await loginUser(input)).data.user;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const registerThunk = createAsyncThunk<AuthUser, RegisterInput, { rejectValue: string }>(
  'auth/register',
  async (input, { rejectWithValue }) => {
    try {
      return (await registerUser(input)).data.user;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const currentUserThunk = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  'auth/currentUser',
  async (_, { rejectWithValue }) => {
    try {
      return (await getCurrentUser()).data.user;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Unable to sign out.'));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
    reducers: {
      clearAuth: () => initialState,
    },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to sign in.';
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.user = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to create account.';
      })
      .addCase(currentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(currentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.user = action.payload;
      })
      .addCase(currentUserThunk.rejected, (state) => {
        state.loading = false;
        state.checked = true;
        state.user = null;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to sign out.';
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
