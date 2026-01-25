import {Outlet} from "react-router-dom";
import OrdersPage from "./OrdersPage.tsx";

export const MainPage = () => {


    return (
        <main className="p-6">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                Заявки
            </h1>
            <OrdersPage />
            <Outlet/>
        </main>
    );
};



























