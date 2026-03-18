import {AdminPanel} from "../components/adminPanel/AdminPanel.tsx";
import {Header} from "../components/header/Header.tsx";
import {Pagination} from "../components/pagination/Pagination.tsx";
import {useAppDispatch, useAppSelector} from "../components/store/store.ts";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {fetchAllUsers} from "../slices/adminSlice.ts";


export const AdminPage = () => {
    const dispatch = useAppDispatch();
    const totalUsers = useAppSelector(state => state.adminStoreSlice.total);

    const USERS_PER_PAGE = 5;
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE) || 1;

    const [searchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        dispatch(fetchAllUsers({ page: currentPage, limit: USERS_PER_PAGE }));
    }, [dispatch, currentPage, USERS_PER_PAGE]);

    return (
        <main className="w-full">
            <Header/>
            <AdminPanel />
            <Pagination totalPages={totalPages} />
        </main>
    );
};


















