import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchFunc from "../../utils/fetchFunc";

export const getLocalesThunk = createAsyncThunk("getLocales", async (app) => {
  const query = fetchFunc(app);
  try {
    const localesData = await query.get("/api/shop/locales");
    const primaryLocaleIndex = localesData?.findIndex(
      (locale) => locale.primary
    );
    const primaryLocale = localesData?.splice(primaryLocaleIndex, 1)[0];
    const locales = localesData?.map((locale) => ({
      ...locale,
      active: false,
    }));
    locales[0].active = true;
    return {
      primaryLocale,
      locales,
    };
  } catch (error) {
    console.error("Error fetching locales:", error);
  }
});
