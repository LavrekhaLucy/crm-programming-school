import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {IOrdersStats} from "../models/interfaces/IOrders/orders-stats.interface.ts";
import {getStatsByStatus} from "../services/api.service.tsx";

interface OrdersState {
    stats: IOrdersStats | null;
    loading: boolean;
    error: string | null;
}

const initialAdminState: OrdersState = {
    stats: null,
    loading: false,
    error: null,
};

export const fetchOrdersStats = createAsyncThunk(
    'orders/fetchStats',
    async (_, { rejectWithValue }) => {
        console.log("Thunk started!");
        try {
            // return await getStatsByStatus();
            const data = await getStatsByStatus();
            console.log("Data received:", data);
            return data;
        } catch (error) {
            console.error("API Error:", error);
            return rejectWithValue(error as string);
        }
    }
);

const adminSlice = createSlice({
    name: 'orders',
    initialState:initialAdminState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrdersStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersStats.fulfilled, (state, action: PayloadAction<IOrdersStats>) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchOrdersStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export default adminSlice;