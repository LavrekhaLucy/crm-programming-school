import type {OrderSortField} from "../models/types/OrderSortField.ts";
import {useAppDispatch} from "../components/store/store.ts";
import {loadOrders, setSort} from "../slices/ordersSlice.ts";
import OrdersTable from "../components/ordersTable/ordersTable.tsx";
import {PaginationPage} from "./PaginationPage.tsx";
import OrdersFilters from "../components/ordersFilters/OrdersFilters.tsx";


const OrdersPage = () => {
    const dispatch = useAppDispatch();

    const onSort = (field: OrderSortField) => {
        dispatch(setSort(field));
        dispatch(loadOrders());
    };

      return (
        <div>

            <OrdersFilters />
            <OrdersTable onSort={onSort}/>

            <PaginationPage />

        </div>
    );
};
export default OrdersPage;