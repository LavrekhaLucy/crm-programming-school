import type {ILoginData} from "../models/interfaces/ILogin/ILoginData.ts";
import type {ILoginResponse} from "../models/interfaces/ILogin/ILoginResponse.ts";
import type {IOrdersResponseModel} from "../models/interfaces/IOrders/IOrdersResponseModel.ts";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";
import {axiosInstance} from "./http/axios.ts";
import type {IComment} from "../models/interfaces/IComments/IComment.ts";
import type {ICommentResponse} from "../models/interfaces/IComments/ICommentResponse.ts";
import type {IGroup} from "../models/interfaces/IGroup/IGroup.ts";
import type {IOrder} from "../models/interfaces/IOrders/IOrder.ts";
import type {IUpdateOrder} from "../models/interfaces/IOrders/IUpdateOrder.ts";
import type {IOrdersStats} from "../models/interfaces/IOrders/orders-stats.interface.ts";
import type {IUser} from "../models/interfaces/IUser/IUser.ts";



// Auth
export const loginRequest = async (data: ILoginData): Promise<ILoginResponse> => {
    const { data: res } = await axiosInstance.post<ILoginResponse>('/auth/login', data);
    return res;
};

export const getMeRequest = async (): Promise<IUser> => {
    const { data: res } = await axiosInstance.get<IUser>('/auth/me');
    return res;
};

// Orders
export const getOrders = async (filters: IOrderFilters,): Promise<IOrdersResponseModel> => {
    const { data } = await axiosInstance.get<IOrdersResponseModel>('/orders', {
        params: filters,
    });
      return data;
};

export const updateOrders = async (id: string, payload: IUpdateOrder): Promise<IOrder> => {
    const { data } = await axiosInstance.patch(`/orders/${id}`, payload);
    return data;
};

export const exportOrdersToExcel = async (filters: IOrderFilters): Promise<Blob> => {
    const { data } = await axiosInstance.get('/orders/excel', {
        params: filters,
        responseType: 'blob',
    });
    return data;
};

//Admin
export const getStatsByStatus = async ():Promise<IOrdersStats> => {
    const { data } = await axiosInstance.get('/admin/orders/stats', {});
    return data;

}


// Comments
export const createComments = async (orderId: string, data: IComment): Promise<ICommentResponse> => {
    const { data: res } = await axiosInstance.post<ICommentResponse>(`/orders/${orderId}/comments`, data);
    return res;
};

export const getCommentsByOrder = async (orderId: string): Promise<ICommentResponse[]> => {
    const { data: res } = await axiosInstance.get<ICommentResponse[]>(`/orders/${orderId}/comments`);
    return res;
};

// Groups
export const createGroup = async (data: { name: string }) => {
    const { data: res } = await axiosInstance.post<IGroup>('/groups', data);
    return res;
};

export const getGroups = async () => {
    const { data: res } = await axiosInstance.get<IGroup[]>('/groups');
    return res;
};

export const getGroupById = async (id: number) => {
    const { data: res } = await axiosInstance.get<IGroup>(`/groups/${id}`);
    return res;
};