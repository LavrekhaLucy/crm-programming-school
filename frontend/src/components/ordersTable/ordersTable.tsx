import type {OrderSortField} from "../../models/types/OrderSortField.ts";
import {useAppSelector} from "../store/store.ts";
import {OrderRow} from "../orderRow/orderRow.tsx";
import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";
import React from "react";

type OrdersTableProps = {
    onSort: (field: OrderSortField ) => void;
}


const OrdersTable: React.FC<OrdersTableProps> = ({ onSort }) => {
    const { pageData, loading } = useAppSelector(
        (state) => state.orderStoreSlice
    );

    if (loading && !pageData) {
        return <div>Loading orders...</div>;
    }

    const orders: IOrder[] = pageData?.data ?? [];



    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-black border-gray-300 ">
                <thead>
                <tr>
                    <th onClick={() => onSort("id")}>id</th>
                    <th onClick={() => onSort("name")}>name</th>
                    <th onClick={() => onSort("surname")}>surname</th>
                    <th onClick={() => onSort("email")}>email</th>
                    <th onClick={() => onSort("phone")}>phone</th>
                    <th onClick={() => onSort("age")}>age</th>
                    <th onClick={() => onSort("course")}>course</th>
                    <th onClick={() => onSort("course_format")}>course_format</th>
                    <th onClick={() => onSort("course_type")}>course_type</th>
                    <th onClick={() => onSort("status")}>status</th>
                    <th onClick={() => onSort("sum")}>sum</th>
                    <th onClick={() => onSort("alreadyPaid")}>alreadyPaid</th>
                    <th onClick={() => onSort("group")}>group</th>
                    <th onClick={() => onSort("created_at")}>created_at</th>
                    <th onClick={() => onSort("manager")}>Manager</th>
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