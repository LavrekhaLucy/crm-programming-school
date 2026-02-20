import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {getMeRequest, loginRequest} from "../services/api.service.tsx";
import type {ILoginData} from "../models/interfaces/ILogin/ILoginData.ts";
import type {IUser} from "../models/interfaces/IUser/IUser.ts";

type AuthState = {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
};

const initialAuthState: AuthState = {
    user:null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
};


export const login = createAsyncThunk<
    string,
    ILoginData,
    { rejectValue: string }
>(
    'auth/login',
    async (data:ILoginData, { rejectWithValue }) => {
        try {
            const response = await loginRequest(data);

            if (!response.accessToken) {
                return rejectWithValue('No token returned from server');
            }

            localStorage.setItem('token', response.accessToken);
            return response.accessToken;
        } catch (error) {
          return rejectWithValue(error as string);
        }
    }
);
export const fetchMe = createAsyncThunk<IUser, void>(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            return await getMeRequest();
        } catch (error) {
            return rejectWithValue(error as string);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState:initialAuthState,
    reducers: {
        logout(state) {
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? "Incorrect login or password";
            })

            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem("token");
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export const authActions = {...authSlice.actions, login,fetchMe};
export default authSlice;


