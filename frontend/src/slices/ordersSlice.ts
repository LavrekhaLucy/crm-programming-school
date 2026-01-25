import {createAsyncThunk, createSlice, type PayloadAction,} from "@reduxjs/toolkit";
import {getOrders} from "../services/api.service.tsx";
import type {IOrdersResponseModel} from "../models/interfaces/IOrders/IOrdersResponseModel.ts";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";
import type {OrderSortField} from "../models/types/OrderSortField.ts";
import type {RootState} from "../components/store/store.ts";
import {SortOrder} from "../enums/sort-order.enum.ts";


type OrderSliceType = {
    pageData: IOrdersResponseModel | null;
    loading: boolean;
    error: string | null;
    filters: IOrderFilters;
    sortField: OrderSortField | null;
    sortOrder: SortOrder;

}

const initOrdersSliceState: OrderSliceType  = {
    pageData:null, loading: false, error: null, filters: { page: "1", limit: "25" }, sortField: null, sortOrder: "asc"};


export const loadOrders = createAsyncThunk<
    IOrdersResponseModel,
    void,
    { state: RootState; rejectValue: string }
>("orders/loadOrders", async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState().orderStoreSlice;

        const apiSortOrder: IOrderFilters["sortOrder"] =
            state.sortOrder === SortOrder.ASC ? "ASC" : "DESC";
        return await getOrders({
            ...state.filters,
            sortBy: state.sortField ?? undefined,
            sortOrder: apiSortOrder,
        });

    } catch (error) {
       return rejectWithValue(error as string);
    }
});


const ordersSlice = createSlice({
    name: 'orders',
    initialState: initOrdersSliceState,
    reducers: {
        setFilters(state, action: PayloadAction<IOrderFilters>) {
            state.filters = { ...state.filters, ...action.payload, page: "1" };
        },
        resetFilters(state) {
            state.filters = { page: "1", limit: state.filters.limit };
        },
        setSort(state, action: PayloadAction<OrderSortField>) {
            if (state.sortField === action.payload) {
                state.sortOrder =
                    state.sortOrder === SortOrder.ASC
                        ? SortOrder.DESC
                        : SortOrder.ASC;
            } else {
                state.sortField = action.payload;
                state.sortOrder = "asc";
            }
        },
         clearOrders: (state) => {
            state.pageData = null;
            state.loading = false;
            state.error = null;
        },
    },
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

export const { setFilters, resetFilters, setSort, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;

