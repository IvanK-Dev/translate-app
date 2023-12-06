import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchFunc from "../../utils/fetchFunc";


export const getLocalesThunk=createAsyncThunk('getLocales', async(app)=>{
    const query = fetchFunc(app);
    try {
        const localesData = await query.get('/api/shop/locales');
        return localesData
      } catch (error) {
        console.error('Error fetching locales:', error);

      }
})