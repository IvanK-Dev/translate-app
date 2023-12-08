import { configureStore } from '@reduxjs/toolkit';
import { rootInitState } from './rootInitState';
import { localesReducer } from './locales/localesSlice';

export const store = configureStore({
  preloadedState: rootInitState,
  devTools: true,
  reducer: {
    locales: localesReducer,
  },
});
