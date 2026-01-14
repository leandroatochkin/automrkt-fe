import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Usage {
    used: number,
    limit: number,
    remaining: number
}

export interface UserState {
    id: string;
    //name: string;
    email: string;
    isLoggedIn: boolean;
    //role: 'user' | 'admin';
    //usage: Usage | null,
    //plan: 'free' | 'premium' | 'pro' | null
    //subscriptionId: string | null
}

interface UpdatePlan {
    plan: 'free' | 'premium' | 'pro' | null
    subscriptionId: string | null
}


const initialState: UserState = {
    id: '',
    //name: '',
    email: '',
    isLoggedIn: false,
    //role: 'user',
    //usage: null,
    //plan: 'free',
    //subscriptionId: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        storeLogin: (
            state, 
            action: PayloadAction<{
                id: string; 
                //name: string; 
                email: string; 
                //role: 'user' | 'admin'; 
                isLoggedIn: boolean, 
                //usage: Usage, 
                //plan: 'free' | 'premium' | 'pro', 
                //subscriptionId: string | null
            }>) => {
            state.id = action.payload.id;
            //state.name = action.payload.name;
            state.email = action.payload.email;
            state.isLoggedIn = action.payload.isLoggedIn;
            // state.role = action.payload.role;
            // state.usage = action.payload.usage;
            // state.plan = action.payload.plan;
            // state.subscriptionId = action.payload.subscriptionId
        },
        // updateUsage: (state, action: PayloadAction<Usage>) => {
        //     if (state.usage) {
        //         state.usage.used = action.payload.used;
        //         state.usage.remaining = action.payload.remaining;
        //         state.usage.limit = action.payload.limit;
        //     }
        // },
        // updatePlan: (state, action: PayloadAction<UpdatePlan>) => {
        //     if (state.plan) {
        //         state.plan = action.payload.plan;
        //         state.subscriptionId = action.payload.subscriptionId;
        //     }
        // },
        logout: (state) => {
            state.id = '';
            state.email = '';
            state.isLoggedIn = false;
            //state.role = 'user';
            //state.usage = null;
            //state.plan = null;
            //state.subscriptionId = null

            localStorage.removeItem("sb-cbbvploublqutmbiwwaq-auth-token");
        } 
    }
});

export const { 
    storeLogin, 
    logout, 
    // updateUsage, 
    // updatePlan 
} = userSlice.actions;

export default userSlice.reducer;