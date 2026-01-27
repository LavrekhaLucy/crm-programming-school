import {useAppDispatch} from "../components/store/store.ts";
import {ordersActions} from "../slices/ordersSlice.ts";
import OrdersTable from "../components/ordersTable/ordersTable.tsx";
import {PaginationPage} from "./PaginationPage.tsx";
import OrdersFilters from "../components/ordersFilters/OrdersFilters.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";
import {StatusesEnum} from "../enums/statuses.enum.ts";



const OrdersPage = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const query: IOrderFilters = {
            page: searchParams.get("page") || "1",
            limit: searchParams.get("limit") || "25",
            order: searchParams.get("order") || undefined,
            name: searchParams.get("name") || undefined,
            status: Object.values(StatusesEnum).includes(searchParams.get("status") as StatusesEnum)
                ? (searchParams.get("status") as StatusesEnum)
                : undefined,
            // інші фільтри
        };

        dispatch(ordersActions.loadOrders(query));
    }, [dispatch, searchParams]);

    const onSort = (field: string) => {
        const currentOrder = searchParams.get("order");

        let nextOrder = field;
        if (currentOrder === field) nextOrder = `-${field}`;
        else if (currentOrder === `-${field}`) nextOrder = field;


        const params = new URLSearchParams(searchParams);
        params.set("order", nextOrder);
        params.set("page", "1");

        setSearchParams(searchParams);


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