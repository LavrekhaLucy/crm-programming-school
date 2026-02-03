import {AddCommentForm} from "../comment/AddCommentForm.tsx";
import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";
import type {FC} from "react";
import {Comment} from "../comment/Comment.tsx";

type ExpandedOrderPanelProps = {
    order: IOrder;
    onEdit: () => void;
    onAddComment: (orderId: string, text: string) => void;
};

export const ExpandedOrderPanel:FC<ExpandedOrderPanelProps> = ({ order, onEdit, onAddComment }) => {
    return (
        <tr>
            <td colSpan={12}>
                <Comment orderId={order.id} />

                <AddCommentForm orderId={order.id}  onSubmit={onAddComment} />

                <button
                    onClick={e => {
                        e.stopPropagation();
                        onEdit();
                    }}
                >
                    EDIT
                </button>
            </td>
        </tr>
    );
};
