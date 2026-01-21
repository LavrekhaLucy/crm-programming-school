import {Outlet} from "react-router-dom";
import OrdersTable from "../components/ordersTable/ordersTable.tsx";

export const MainPage = () => {


    return (
        <main className="p-6">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                Заявки
            </h1>
            <OrdersTable/>
            <Outlet/>
        </main>
    );
};



























