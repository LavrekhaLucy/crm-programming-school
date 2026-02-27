import axios from "axios";
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
    (error) => {
        const status = error.response?.status;
        const responseData = error.response?.data;

        const serverMessage = responseData && typeof responseData === 'object'
            ? (Array.isArray(responseData.message) ? responseData.message[0] : responseData.message)
            : null;

        const message =
            serverMessage ||
            (status === 401 ? 'Incorrect login or password' : error.message) ||
            'Something went wrong';

        if (status === 401 && window.location.pathname !== "/login") {
            store.dispatch(authActions.logout());
            window.location.href = "/login";
            return Promise.reject('Session expired');
        }

        return Promise.reject(message);
    }
);

