import type {ILoginData} from "../models/interfaces/ILogin/ILoginData.ts";
import type {ILoginResponse} from "../models/interfaces/ILogin/ILoginResponse.ts";
import type {IOrdersResponseModel} from "../models/interfaces/IOrders/IOrdersResponseModel.ts";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";
import {axiosInstance} from "./http/axios.ts";



export const loginRequest = async (data: ILoginData): Promise<ILoginResponse> => {
    const response = await axiosInstance.post<ILoginResponse>("/auth/login", data);
    return response.data;
};

export const getOrders = async (
    filters: IOrderFilters,
): Promise<IOrdersResponseModel> => {
    const { data } = await axiosInstance.get<IOrdersResponseModel>('/orders', {
        params: filters,
    });
    console.log('orders from API:', data);
    return data;
};