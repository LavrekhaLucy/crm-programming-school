import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loginRequest } from "../services/apiService";
import type { ILoginData } from "../models/ILogin/ILoginData";
import {AxiosError} from "axios";

type AuthState = {
    token: string | null;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    token: null,
    loading: false,
    error: null,
};


export const login = createAsyncThunk<string, ILoginData, { rejectValue: string }>(
    "auth/login",
    async (data: ILoginData, thunkAPI) => {
        try {
            const response = await loginRequest(data);
            localStorage.setItem("token", response.token);

            return response.token;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                if (e.response?.status === 401) {
                    return thunkAPI.rejectWithValue("Invalid email or password");
                }
                const serverMessage = e.response?.data?.message;
                return thunkAPI.rejectWithValue(serverMessage || "Authorization failed");
            }
            if (e instanceof Error) {
                return thunkAPI.rejectWithValue(e.message);
            }
            return thunkAPI.rejectWithValue("An unknown error occurred");
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
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
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
