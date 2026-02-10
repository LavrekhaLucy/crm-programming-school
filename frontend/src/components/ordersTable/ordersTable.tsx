import type {OrderSortField} from "../../models/types/OrderSortField.ts";
import {useAppSelector} from "../store/store.ts";
import {OrderRow} from "../orderRow/orderRow.tsx";
import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";
import React, {Fragment, useState} from "react";
import {ExpandedOrderPanel} from "../orderRow/expandedRowPanel.tsx";
import {EditOrderModal} from "./EditOrderModal.tsx";

type OrdersTableProps = {
    onSort: (field: OrderSortField ) => void;

}


const OrdersTable: React.FC<OrdersTableProps> = ({ onSort  }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [editOrder, setEditOrder] = useState<IOrder | null>(null);


    const { pageData, loading } = useAppSelector(
        (state) => state.orderStoreSlice
    );

    if (loading && !pageData) {
        return <div>Loading orders...</div>;
    }

     const orders: IOrder[] = pageData?.data ?? [];



    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-gray-300">
                <thead className="bg-emerald-600 text-white">
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

                {orders.map(order => (
                    <Fragment key={order.id}>
                        <OrderRow
                            order={order}
                            isExpanded={expandedOrderId === order.id}
                            onToggle={() =>
                                setExpandedOrderId(
                                    expandedOrderId === order.id ? null : order.id
                                )
                            }
                            onEdit={() => setEditOrder(order)}
                        />

                        {expandedOrderId === order.id && (
                            <ExpandedOrderPanel
                                order={order}
                                onEdit={() => setEditOrder(order)}
                                // onAddComment={handleAddComment}
                            />
                        )}
                        {editOrder && (
                            <EditOrderModal
                                order={editOrder}
                                onClose={() => setEditOrder(null)}
                                onSubmit={(updatedOrder) => {
                                    console.log("Updated order:", updatedOrder);
                                    setEditOrder(null);
                                }}
                            />
                        )}

                    </Fragment>
                ))}





                </tbody>
            </table>
        </div>
    );
};
export default OrdersTable;