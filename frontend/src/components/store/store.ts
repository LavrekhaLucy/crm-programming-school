import {configureStore} from "@reduxjs/toolkit";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import authSlice from "../../slices/authSlice.ts";



export const store = configureStore({
    reducer: {
        authStoreSlice: authSlice,

    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();