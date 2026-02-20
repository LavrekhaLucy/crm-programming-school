import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {useNavigate} from "react-router-dom";
import {logout} from "../../slices/authSlice.ts";
import {fetchOrdersStats} from "../../slices/adminSlice.ts";
import {useEffect} from "react";

export const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { error } = useAppSelector(state => state.adminStoreSlice);

    useEffect(() => {
        if (error === 'Unauthorized') {
            navigate('/login');
        }
    }, [error, navigate]);

    const handleAdminPanel = () => {
        dispatch(fetchOrdersStats());
        navigate("/admin");

    };
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

        return (
            <div className="w-full">
                <header className="bg-[#43a047] p-6 flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">
                        Logo
                    </div>

                    <div className="w-50 h-10 flex items-center  text-2xl text-white gap-2 ">
                        admin
                        <button
                            type="button"
                            onClick={handleAdminPanel}
                            style={{backgroundImage: `url('http://bigbird.space:81/static/media/admin.c305133bad8700df7d8be698c350c2bb.svg')`}}
                            className="bg-[#2e7d32] hover:bg-[#1b5e20] transition-colors bg-center bg-no-repeat bg-size-[20px_20px] w-10 h-10 rounded-[5px]">
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            style={{backgroundImage: `url('http://bigbird.space:81/static/media/logOut.7e73deefd22b4062b49d7ed47c46a9e1.svg')`}}
                            className="bg-[#2e7d32] hover:bg-[#1b5e20] transition-colors bg-center bg-no-repeat bg-size-[20px_20px] w-10 h-10 rounded-[5px]">
                        </button>
                    </div>

                </header>
            </div>
        );
    };