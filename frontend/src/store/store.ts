import { configureStore } from '@reduxjs/toolkit';
import authReducer, { type AuthState } from './slice/authSlice';

/**
 * Interface for the persisted state structure
 */
interface PersistedState {
  auth: AuthState;
}

// Load state from localStorage with type safety
const loadState = (): PersistedState | undefined => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return undefined;
    }
    return { auth: JSON.parse(serializedState) };
  } catch (err) {
    console.error("Failed to load state:", err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: { auth: AuthState }) => {
  try {
    const serializedState = JSON.stringify(state.auth);
    localStorage.setItem('authState', serializedState);
  } catch (err) {
    // Ignore write errors or log them
    console.error("Failed to save state:", err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

// Subscribe to store changes to persist auth state
store.subscribe(() => {
  saveState(store.getState());
});

// --- TYPE EXPORTS ---

// 1. RootState: Represents the entire state tree
export type RootState = ReturnType<typeof store.getState>;

// 2. AppDispatch: The type of the store's dispatch function
export type AppDispatch = typeof store.dispatch;

// 3. AppStore: The type of the store instance itself (useful for TanStack context)
export type AppStore = typeof store;

export default store;