// import {useAppDispatch} from "../components/store/store.ts";
// import {useEffect} from "react";
// import {fetchOrdersStats} from "../slices/adminSlice.ts";
// import {AdminPanel} from "../components/adminPanel/AdminPanel.tsx";
//
// export const AdminPage = () => {
//     const dispatch = useAppDispatch();
//
//     useEffect(() => {
//         dispatch(fetchOrdersStats());
//     }, [dispatch]);
//     return (
//         <main className="p-6 max-w-7xl mx-auto">
//             <header className="mb-8">
//                 <h1 className="text-3xl font-bold text-gray-800">Панель адміністратора</h1>
//                 <p className="text-gray-600">Керування замовленнями та перегляд статистики</p>
//             </header>
//
//             <section className="bg-white rounded-lg shadow-md p-4">
//                 <AdminPanel/>
//             </section>
//         </main>
//     );
// };


import { AdminPanel } from "../components/adminPanel/AdminPanel.tsx";
import {Header} from "../components/header/Header.tsx";

export const AdminPage = () => {
    return (
        <main className="w-full">
            <Header/>
            <AdminPanel />
        </main>
    );
};
























