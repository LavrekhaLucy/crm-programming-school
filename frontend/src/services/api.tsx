import axios from 'axios';
import {apiToken, baseUrl} from "../components/res_constants/info.ts";
import type {IOrdersResponseModel} from "../models/IOrders/IOrdersResponseModel.ts";


const axiosInstance = axios.create({
    baseURL: baseUrl,
    params: {},
    headers: { Authorization: `Bearer ${apiToken}` },
})
axiosInstance.interceptors.request.use((request) => {

    return request;
});

export const getOrders = async (page: string):Promise<IOrdersResponseModel> => {


    const {data}= await axiosInstance.get<IOrdersResponseModel>(`/orders`,{
        params: {
            page: +page,
        },
    });
    return data;
}
