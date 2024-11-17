import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "@/app/redux";

export interface globalState {
    isDarkMode: boolean;
    sidebarToggle: boolean;
    isModalNewProject: boolean,
    isModalNewTask: boolean
}

const initialState: globalState = {
    isDarkMode: false,
    sidebarToggle: false,
    isModalNewProject:false,
    isModalNewTask: false,
}

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        darkModeToggle: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
        navbarToogle: (state, action:PayloadAction<boolean>) => {
            state.sidebarToggle = action.payload;
        },
        modalNewProjectToggle: (state, action: PayloadAction<boolean>) => {
            state.isModalNewProject = action.payload;
        },
        modalNewTaskToggle: (state, action: PayloadAction<boolean>) => {
            state.isModalNewTask = action.payload
        }
    }
    
})

export const {darkModeToggle, navbarToogle, modalNewProjectToggle, modalNewTaskToggle} = globalSlice.actions;
export default globalSlice.reducer;