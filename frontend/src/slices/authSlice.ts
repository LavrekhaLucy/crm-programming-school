// import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import { loginRequest } from "../services/authService.tsx";
//
// interface AuthState {
//     token: string | null;
//     email: string | null;
//     loading: boolean;
//     error: string | null;
// }
//
// const initialState: AuthState = {
//     token: null,
//     email: null,
//     loading: false,
//     error: null,
// };
//
// // thunk для логіну
// export const login = createAsyncThunk(
//     "auth/login",
//     async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
//         try {
//             const response = await loginRequest({ email, password });
//             localStorage.setItem("token", response.token);
//             return { token: response.token, email };
//         } catch (err: any) {
//             return rejectWithValue(err.message || "Сталася помилка при логіні");
//         }
//     }
// );
//
// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         logout(state) {
//             state.token = null;
//             state.email = null;
//             localStorage.removeItem("token");
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(login.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; email: string }>) => {
//                 state.loading = false;
//                 state.token = action.payload.token;
//                 state.email = action.payload.email;
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             });
//     },
// });
//
// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
