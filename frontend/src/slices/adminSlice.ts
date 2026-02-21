import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {IOrdersStats} from "../models/interfaces/IOrders/orders-stats.interface.ts";
import {banUser, createManager, getActivationLink, getAllUsers, getStatsByStatus, unbanUser} from "../services/api.service.tsx";
import type {IUser} from "../models/interfaces/IUser/IUser.ts";
import type {IManager} from "../models/interfaces/IManager/IManager.ts";

interface OrdersState {
    users: IUser[];
    stats: IOrdersStats | null;
    loading: boolean;
    error: string | null;
    items: [];
}

const initialAdminState: OrdersState = {
    users: [],
    stats: null,
    loading: false,
    error: null,
    items: [],
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
);
export const copyActivationLink = createAsyncThunk(
    'admin/copyActivationLink',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await getActivationLink(userId);
            const link = response.link;

            if (!navigator.clipboard) {
                return rejectWithValue('Clipboard API not available');
            }

            await navigator.clipboard.writeText(link);
            alert('Link copied to clipboard!');

            return { userId, link };

        } catch (error) {
            const message = error as string || 'Failed to copy link';
            alert (message);
            return rejectWithValue(message);
        }
    }
);

export const toggleUserBan = createAsyncThunk(
    'admin/toggleUserBan',
    async ({ userId, action }: { userId: number; action: 'ban' | 'unban' }, { rejectWithValue }) => {
        try {
            const data = action === 'ban' ? await banUser(userId) : await unbanUser(userId);
            return data;
        } catch (error) {
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
            })

            //copyActivationLink
            .addCase(copyActivationLink.pending, (state) => {
                state.loading = true;
            })
            .addCase(copyActivationLink.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(copyActivationLink.rejected, (state) => {
                state.loading = false;
            })
        //toggleUserBan
            .addCase(toggleUserBan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleUserBan.fulfilled, (state, action) => {
                const { userId, action: banAction } = action.meta.arg;

                const user = state.users.find(u => u.id === userId);

                if (user) {
                    user.isActive = (banAction === 'unban');
                }
            })
            .addCase(toggleUserBan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const adminActions = {...adminSlice.actions, fetchAllUsers, addManager, copyActivationLink, fetchOrdersStats, toggleUserBan};
export default adminSlice;