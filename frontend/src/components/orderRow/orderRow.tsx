import type { FC } from "react";
import type { IOrder } from "../../models/IOrders/IOrder";

type OrderRowProps = {
    order: IOrder;
};

export const OrderRow: FC<OrderRowProps> = ({ order }) => {
    return (
        <tr className="hover:bg-green-50">
            <td className="px-3 py-2">{order.id}</td>
            <td className="px-3 py-2 font-medium">{order.name ?? "null"}</td>
            <td className="px-3 py-2">{order.surname ?? "null"}</td>
            <td className="px-3 py-2">{order.email ?? "null"}</td>
            <td className="px-3 py-2">{order.phone ?? "null"}</td>
            <td className="px-3 py-2 text-center">{order.age ?? "null"}</td>
            <td className="px-3 py-2">{order.course}</td>
            <td className="px-3 py-2">{order.course_format}</td>
            <td className="px-3 py-2">{order.course_type}</td>

            <td className="px-3 py-2">
        <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
          {order.status}
        </span>
            </td>

            <td className="px-3 py-2">{order.sum ?? "null"}</td>
            <td className="px-3 py-2 text-green-600">
                {order.alreadyPaid ?? "null"}
            </td>
            <td className="px-3 py-2">{order.group ?.name ?? "null"}</td>
            <td className="px-3 py-2 text-gray-500">{order.created_at}</td>
            <td className="px-3 py-2">{order.manager?.name ?? "null"}</td>
        </tr>
    );
};

