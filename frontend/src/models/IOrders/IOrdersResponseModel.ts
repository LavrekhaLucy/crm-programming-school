import type {IOrder} from "./IOrder.ts";

export interface IOrdersResponseModel {
    "page": number,
    "results":IOrder[],
    "total_pages": number,
    "total_results": number
}