import {AdminPanel} from "../components/adminPanel/AdminPanel.tsx";
import {Header} from "../components/header/Header.tsx";
import {Pagination} from "../components/pagination/Pagination.tsx";
import {useAppSelector} from "../components/store/store.ts";
import {ORDERS_PER_PAGE} from "../components/res_constants/info.ts";

export const AdminPage = () => {

    const stats = useAppSelector(state => state.adminStoreSlice.stats);

    const totalPages = stats ? Math.ceil(stats.total/ ORDERS_PER_PAGE) : 1;

    return (
        <main className="w-full">
            <Header/>
            <AdminPanel />
            <Pagination totalPages={totalPages}/>
        </main>
    );
};
























