import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loginRequest } from "../services/api.service.tsx";
import type {ILoginData} from "../models/interfaces/ILogin/ILoginData.ts";

type AuthState = {
    token: string | null;
    loading: boolean;
    error: string | null;
};

const initialAuthState: AuthState = {
    token: null,
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
            });
    },
});

export const { logout } = authSlice.actions;
export const authActions = {...authSlice.actions, login};
export default authSlice;


