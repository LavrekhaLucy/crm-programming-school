import {createAsyncThunk, createSlice,} from "@reduxjs/toolkit";
import {getOrders} from "../services/api.service.tsx";
import type {IOrdersResponseModel} from "../models/interfaces/IOrders/IOrdersResponseModel.ts";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";


type OrderSliceType = {
    pageData: IOrdersResponseModel | null;
    loading: boolean;
    error: string | null;
    filters: IOrderFilters;
    order: string | null;

}

const initOrdersSliceState: OrderSliceType  = {
    pageData:null, loading: false, error: null, filters: { page: "1", limit: "25" }, order: null,};



export const loadOrders = createAsyncThunk<
    IOrdersResponseModel,
    IOrderFilters,
    { rejectValue: string }
>(
    "orders/loadOrders",
    async (filters, { rejectWithValue }) => {
        try {
            return await getOrders(filters); // всі параметри йдуть прямо в API
        } catch (error) {
            return rejectWithValue(error as string);
        }
    }
);


const ordersSlice = createSlice({
    name: 'orders',
    initialState: initOrdersSliceState,
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
                state.error = action.payload ?? "Failed to load orders";
            });
    },
});

export const ordersActions = {...ordersSlice.actions, loadOrders};
export default ordersSlice;

