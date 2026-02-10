import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";
import type {FC} from "react";
import {Comment} from "../comment/Comment.tsx";
type ExpandedOrderPanelProps = {
    order: IOrder;
    onEdit: () => void;
};

export const ExpandedOrderPanel:FC<ExpandedOrderPanelProps> = ({ order, onEdit }) => {
    return (
        <tr>
            <td colSpan={12}>
                <div className="expandedRow flex justify-between gap-20 p-16">
                {/* ЛІВА ЧАСТИНА */}
                <div className="expandedLeft flex flex-col gap-8 flex-[0_0_30%]">
                        <div>
                            <strong>Message:</strong> {order.msg ?? "null"}
                        </div>

                        <div>
                            <strong>UTM:</strong> {order.utm ?? "null"}
                        </div>
                </div>


                    {/* ПРАВА ЧАСТИНА */}
                <div className="expandedRight flex flex-col gap-12 flex-[0_0_60%]">

                    <div className="flex flex-col gap-10">

                        <Comment orderId={order.id}/>


                     </div>


                </div>


                    <button
                        onClick={e => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="bg-[#43a047] text-white rounded-[5px] self-start"
                    >
                        EDIT
                    </button>

                </div>
            </td>
        </tr>
    );
};
