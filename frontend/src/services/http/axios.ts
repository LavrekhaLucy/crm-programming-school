import axios, {type AxiosError} from "axios";
import {baseUrl} from "../../components/res_constants/info.ts";
import {store} from "../../components/store/store.ts";
import {authActions} from "../../slices/authSlice.ts";


export const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});


axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("JWT token sent:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        console.log('INTERCEPTOR ERROR STATUS:', error.response?.status);
        if (error.response?.status === 401) {

            // localStorage.removeItem("token");
            store.dispatch(authActions.logout());
            window.location.href ="/login";

            return Promise.reject('Unauthorized. Please log in again.');
        }

        const message =
            error.response?.data?.message ||
            error.message ||
            'Request failed';

        return Promise.reject(message);
    }
);

