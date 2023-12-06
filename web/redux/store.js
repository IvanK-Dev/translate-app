import { configureStore } from '@reduxjs/toolkit';
import { rootInitState } from './rootInitState';
import { localesReducer } from './locales/localesSlice';
import { appReducer } from './app/appSlice';

export const store = configureStore({
  preloadedState: rootInitState,
  devTools: true,
  reducer: {
    app: appReducer,
    locales: localesReducer,
  },
});
