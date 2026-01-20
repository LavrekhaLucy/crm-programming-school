import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {ordersActions} from "../../slices/ordersSlice.ts";
import {OrderCard} from "../orderCard/orderCard.tsx";
import {ORDERS_PER_PAGE} from "../res_constants/info.ts";


const OrdersList = () => {
    const dispatch = useAppDispatch();
    const pageData = useAppSelector((state) => state.orderStoreSlice.pageData);
    const loading = useAppSelector((state) => state.orderStoreSlice.loading);
    const token = useAppSelector((state) => state.authStoreSlice.token); // <- токен

    const [searchParams] = useSearchParams({ page: '1' });
    const page = Number(searchParams.get('page') ?? 1);
    const limit = ORDERS_PER_PAGE;

    useEffect(() => {
        if (!token) return; // чекаємо токен
        dispatch(ordersActions.loadOrders({ page, limit }));
    }, [dispatch, page, limit, token]);

    console.log("OrdersList pageData:", pageData);

    // useEffect(() => {
    //     dispatch(ordersActions.loadOrders({ page, limit }));
    // }, [dispatch, page, limit]);
    // console.log("OrdersList pageData:", pageData);

    if (loading && !pageData) {
        return <div>Loading orders...</div>;
    }

    return (
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {pageData?.data.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
};

export default OrdersList;