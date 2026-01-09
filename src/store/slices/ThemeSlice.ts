import { createSlice } from "@reduxjs/toolkit";
import { lightTheme, darkTheme } from "../../lib/theme";

interface ThemeState {
    colors: typeof lightTheme.colors;
    fonts: typeof lightTheme.fonts;
    fontSizes: typeof lightTheme.fontSizes;
    spacing: typeof lightTheme.spacing;
    borderRadius: string;
    boxShadow: string;
    mode: 'light' | 'dark';
}


const initialState: ThemeState = {...lightTheme, mode: 'light'};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            if(state.mode === 'light') {
                return {...darkTheme, mode: 'dark'};
            } else {
                return {...lightTheme, mode: 'light'};
            }
    }
}
        })

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;