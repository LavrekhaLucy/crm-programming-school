import axios from "axios";
import type {ILoginData} from "../models/ILogin/ILoginData.ts";
import type {ILoginResponse} from "../models/ILogin/ILoginResponse.ts";
import {baseUrl} from "../components/res_constants/info.ts";


export const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});


axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export const loginRequest = async (data: ILoginData): Promise<ILoginResponse> => {
    const response = await axiosInstance.post<ILoginResponse>("/auth/login", data);
    return response.data;
};
