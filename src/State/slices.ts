import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "@/app/redux";

export interface globalState {
    isDarkMode: boolean;
    sidebarToggle: boolean;
}

const initialState: globalState = {
    isDarkMode: false,
    sidebarToggle: false,
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
        }
    }
})

export const {darkModeToggle, navbarToogle} = globalSlice.actions;
export default globalSlice.reducer;