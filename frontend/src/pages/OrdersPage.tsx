import OrdersTable from "../components/ordersTable/ordersTable.tsx";
import {PaginationPage} from "./PaginationPage.tsx";


const OrdersPage = () => {
    return (
        <div>
            <OrdersTable/>
            <PaginationPage/>
        </div>
    );
};

export default OrdersPage;

