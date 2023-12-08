import { createSlice } from "@reduxjs/toolkit";
import { localesInitState } from "./localesInitState";
import { getLocalesThunk } from "./localesThunk";
import { STATUS } from "../../constants";

export const localesSlice = createSlice({
  name: "locales",
  initialState: localesInitState,
  reducers: {
    changeLanguage: (state, { payload }) => {
      state.locales = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getLocalesThunk.pending, (state) => {
        state.status = STATUS.loading;
      })
      .addCase(getLocalesThunk.fulfilled, (state, { payload }) => {
        state.status = STATUS.success;
        state.primaryLocale = payload?.primaryLocale;
        state.locales = payload?.locales;
      })
      .addCase(getLocalesThunk.rejected, (state) => {
        state.status = STATUS.error;
      }),
});

export const { changeLanguage } = localesSlice.actions;
export const localesReducer = localesSlice.reducer;
