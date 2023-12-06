import { createSlice } from "@reduxjs/toolkit";
import { appInitState } from "./appInitState";

export const appSlice=createSlice({
    name:'app',
    initialState:appInitState,
    reducers:{
        setApptoState: (state,{payload})=>{
            state.app=payload
        }
    }
})

export const {setApptoState}=appSlice.actions
export const appReducer=appSlice.reducer