import axios, {type AxiosError} from "axios";
import {baseUrl} from "../../components/res_constants/info.ts";


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
        if (error.response?.status === 401) {
            return Promise.reject('Invalid email or password');
        }

        const message =
            error.response?.data?.message ||
            error.message ||
            'Request failed';

        return Promise.reject(message);
    }
);

