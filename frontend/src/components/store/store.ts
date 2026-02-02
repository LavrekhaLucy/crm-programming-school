import {configureStore} from "@reduxjs/toolkit";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import authSlice from "../../slices/authSlice.ts";
import ordersSlice from "../../slices/ordersSlice.ts";
import commentSlice from "../../slices/commentSlice.ts";



export const store = configureStore({
    reducer: {
        authStoreSlice: authSlice.reducer,
        orderStoreSlice:ordersSlice.reducer,
        commentStoreSlice:commentSlice.reducer,

    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();