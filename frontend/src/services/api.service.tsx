import type {ILoginData} from "../models/interfaces/ILogin/ILoginData.ts";
import type {ILoginResponse} from "../models/interfaces/ILogin/ILoginResponse.ts";
import type {IOrdersResponseModel} from "../models/interfaces/IOrders/IOrdersResponseModel.ts";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";
import {axiosInstance} from "./http/axios.ts";
import type {IComment} from "../models/interfaces/IComments/IComment.ts";
import type {ICommentResponse} from "../models/interfaces/IComments/ICommentResponse.ts";



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
export const createComment = async (orderId: string, data: IComment,):Promise<ICommentResponse> => {
    const response = await axiosInstance.post<ICommentResponse>( `/orders/${orderId}/comment`, data);
    return response.data;
};