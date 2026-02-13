import type {ILoginData} from "../models/interfaces/ILogin/ILoginData.ts";
import type {ILoginResponse} from "../models/interfaces/ILogin/ILoginResponse.ts";
import type {IOrdersResponseModel} from "../models/interfaces/IOrders/IOrdersResponseModel.ts";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";
import {axiosInstance} from "./http/axios.ts";
import type {IComment} from "../models/interfaces/IComments/IComment.ts";
import type {ICommentResponse} from "../models/interfaces/IComments/ICommentResponse.ts";
import type {IGroup} from "../models/interfaces/IGroup/IGroup.ts";


// Auth
export const loginRequest = async (data: ILoginData): Promise<ILoginResponse> => {
    const { data: res } = await axiosInstance.post<ILoginResponse>('/auth/login', data);
    return res;
};

// Orders
export const getOrders = async (filters: IOrderFilters,): Promise<IOrdersResponseModel> => {
    const { data } = await axiosInstance.get<IOrdersResponseModel>('/orders', {
        params: filters,
    });
      return data;
};

// Comments
export const createComment = async (orderId: string, data: IComment,):Promise<ICommentResponse> => {
    const response = await axiosInstance.post<ICommentResponse>( `/orders/${orderId}/comment`, data);
    return response.data;
};

export const getCommentsByOrder = async (orderId: string): Promise<ICommentResponse[]> => {
    const response = await axiosInstance.get<ICommentResponse[]>(`/orders/${orderId}/comment`);
    return response.data;
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