import axios from "axios";
import type {ILoginData} from "../models/ILogin/ILoginData.ts";
import type {ILoginResponse} from "../models/ILogin/ILoginResponse.ts";
import {baseUrl} from "../components/res_constants/info.ts";
import type {IOrdersResponseModel} from "../models/IOrders/IOrdersResponseModel.ts";


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


export const loginRequest = async (data: ILoginData): Promise<ILoginResponse> => {
    const response = await axiosInstance.post<ILoginResponse>("/auth/login", data);
    return response.data;
};


export const getOrders = async (page: number, limit: number):Promise<IOrdersResponseModel> => {
    const {data}= await axiosInstance.get<IOrdersResponseModel>(`/orders`,{
        params: {page,limit},
    });
    return data;
}
