import {Outlet} from "react-router-dom";
import {Pagination} from "../components/pagination/Pagination.tsx";




export const PaginationPage = () => {
       return (
        <div>

            <Outlet/>
            <Pagination totalPages={20} />




        </div>
    );
};