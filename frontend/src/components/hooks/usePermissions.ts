import { useAppSelector } from "../store/store";
import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";
import {UserRoleEnum} from "../../enums/user-role.enum.ts";

export const usePermissions = (order?: IOrder) => {
    const currentUser = useAppSelector((state) => state.authStoreSlice.me);

    if (!currentUser) {
        return { canEdit: false, canComment: false, isAdmin: false };
    }

    const isAdmin = currentUser.role === UserRoleEnum.ADMIN;
    const currentUserId = Number(currentUser.id);
    const orderManagerId = order?.manager?.id ? Number(order.manager.id) : null;

    const isOwner = orderManagerId === currentUserId;
    const hasNoManager = !order?.manager;

    const canEdit = isAdmin || hasNoManager || isOwner;
    const canComment = isAdmin || hasNoManager || isOwner;


    return { canEdit, canComment, isAdmin, isOwner };
};