import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { ordersActions } from "../../slices/ordersSlice.ts";
import { ORDERS_PER_PAGE } from "../res_constants/info.ts";

import {ORDER_TABLE_HEADERS} from "../res_constants/tableHeaders.ts";
import type {IOrder} from "../../models/IOrders/IOrder.ts";
import {OrderRow} from "../orderRow/orderRow.tsx";

const OrdersTable = () => {
    const dispatch = useAppDispatch();
    const pageData = useAppSelector((state) => state.orderStoreSlice.pageData);
    const loading = useAppSelector((state) => state.orderStoreSlice.loading);


    const [searchParams] = useSearchParams({ page: '1' });
    const page = Number(searchParams.get('page') ?? 1);
    const limit = ORDERS_PER_PAGE;

    useEffect(() => {
        dispatch(ordersActions.loadOrders({ page, limit }));
    }, [dispatch, page, limit]);

    console.log("pageData:", pageData);
    console.log("orders:", pageData?.data);

    if (loading && !pageData) {
        return <div>Loading orders...</div>;
    }

    const orders: IOrder[] = pageData?.data ?? [];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
                <thead className="bg-green-600 text-white">
                <tr>
                    {ORDER_TABLE_HEADERS.map((h) => (
                        <th key={h} className="px-3 py-2 text-left border-b border-gray-300">
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {orders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;
