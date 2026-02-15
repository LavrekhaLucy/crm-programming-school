import type {OrderSortField} from "../../models/types/OrderSortField.ts";
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {OrderRow} from "../orderRow/orderRow.tsx";
import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";
import React, {Fragment, useEffect, useState} from "react";
import {ExpandedOrderPanel} from "../orderRow/expandedRowPanel.tsx";
import {EditOrderModal} from "./EditOrderModal.tsx";
import {groupActions} from "../../slices/groupSlice.ts";
import {ordersActions} from "../../slices/ordersSlice.ts";
import type {IUpdateOrder} from "../../models/interfaces/IOrders/IUpdateOrder.ts";

type OrdersTableProps = {
    onSort: (field: OrderSortField ) => void;

}


const OrdersTable: React.FC<OrdersTableProps> = ({ onSort  }) => {

    const dispatch = useAppDispatch();

    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [editOrder, setEditOrder] = useState<IOrder | null>(null);

    useEffect(() => {
        dispatch(groupActions.fetchGroups());
    }, [dispatch]);

    const { pageData, loading } = useAppSelector((state) => state.orderStoreSlice);

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
                              />
                        )}


                    </Fragment>
                ))}

                </tbody>
            </table>

            {editOrder && (
                <EditOrderModal
                    order={editOrder}
                    onClose={() => setEditOrder(null)}
                    onSubmit={async (updateData: IUpdateOrder) => {
                        dispatch(
                            ordersActions.loadUpdateOrder({
                                id: editOrder.id,
                                payload: updateData,
                            })
                        );
                        setEditOrder(null);
                    }}
                />
    )}

        </div>
    );
};
export default OrdersTable;