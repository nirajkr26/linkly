import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 1. Define the User shape
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

// 2. Define the State shape
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 3. Use PayloadAction to type the incoming user data
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Note: If using cookies, the backend usually clears the cookie.
      // If using localStorage for tokens, clear it here.
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;