import { createSelector } from "@reduxjs/toolkit";

export const selectLocalesStatus = ({ locales }) => locales.status;

export const selectPrimaryLocale = ({ locales }) => locales.primaryLocale;

export const selectLocalesArray = ({ locales }) => locales.locales;

export const selectActiveLocale = createSelector(
  selectLocalesArray,
  (locales) => locales.find((locale) => locale?.active) || null
);
