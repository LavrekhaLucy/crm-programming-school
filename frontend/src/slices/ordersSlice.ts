import {createAsyncThunk, createSlice,} from "@reduxjs/toolkit";
import {getOrders} from "../services/api.service.tsx";
import type {IOrdersResponseModel} from "../models/IOrders/IOrdersResponseModel.ts";


type orderSliceType = {
    pageData: IOrdersResponseModel | null;
    loading: boolean;
    error: string | null;
}

const initOrdersSliceState: orderSliceType  = {pageData:null, loading: true, error: null};


const loadOrders = createAsyncThunk<
    IOrdersResponseModel,
    { page: number; limit: number }>(
    'orders/loadOrders',
    async ({ page, limit }) => {
        return await getOrders(page,limit);


    }
);



const ordersSlice = createSlice({
    name: 'orders',
    initialState:initOrdersSliceState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.pageData = action.payload;
            })
            .addCase(loadOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to load orders';
            });
    },
});

export default ordersSlice.reducer;
