import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {IOrdersStats} from "../models/interfaces/IOrders/orders-stats.interface.ts";
import {createManager, getAllUsers, getStatsByStatus} from "../services/api.service.tsx";
import type {IUser} from "../models/interfaces/IUser/IUser.ts";
import type {IManager} from "../models/interfaces/IManager/IManager.ts";

interface OrdersState {
    users: IUser[];
    stats: IOrdersStats | null;
    loading: boolean;
    error: string | null;
}

const initialAdminState: OrdersState = {
    users: [],
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

export const fetchAllUsers = createAsyncThunk (
    'users/fetchAllUsers',
    async (_,{rejectWithValue})=> {
        try {
            return await getAllUsers();
        } catch(error){
            return rejectWithValue(error as string);
        }
    }
);

export const addManager = createAsyncThunk(
    'admin/addManager',
    async (managerData: IManager, { rejectWithValue }) => {
        try {
            return await createManager(managerData);
        } catch(error){
            return rejectWithValue(error as string);
        }
    }
)

const adminSlice = createSlice({
    name: 'orders',
    initialState:initialAdminState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetchOrdersStats
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
            })

            //fetchAllUsers
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //addManager
            .addCase(addManager.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addManager.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(addManager.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export default adminSlice;