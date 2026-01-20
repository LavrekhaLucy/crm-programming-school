import type {FC} from "react";
import type {IOrder} from "../../models/IOrders/IOrder.ts";

type OrderPropsType = {
    order: IOrder;
};

export const OrderCard: FC<OrderPropsType> = ({order} ) => {
 return(
     <div>
         <strong>{order.name}</strong>
         <div>Status: {order.status}</div>
 </div>

 )};
