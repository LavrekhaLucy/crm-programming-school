import {useSearchParams} from "react-router-dom";
import {useAppDispatch} from "../components/store/store.ts";
import {useEffect} from "react";
import {ordersActions} from "../slices/ordersSlice.ts";
import OrdersFilters from "../components/ordersFilters/OrdersFilters.tsx";
import OrdersTable from "../components/ordersTable/ordersTable.tsx";
import {Pagination} from "../components/pagination/Pagination.tsx";

const OrdersPage = () => {

    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const onSort = (field: string) => {
        const currentOrder = searchParams.get("order");

        let nextOrder = field;
        if (currentOrder === field) nextOrder = `-${field}`;
        else if (currentOrder === `-${field}`) nextOrder = field;


        const params = new URLSearchParams(searchParams);
        params.set("order", nextOrder);
        params.set("page", "1");

        setSearchParams(params);

    };
        useEffect(() => {
            dispatch(
                ordersActions.loadOrders(
                    Object.fromEntries(searchParams.entries())
                )
            );
        }, [searchParams, dispatch]);


        return (
            <>
                <OrdersFilters/>
                <OrdersTable onSort={onSort}/>
                <Pagination totalPages={20}/>
            </>
        );
    };

export default OrdersPage;