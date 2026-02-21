import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../slices/adminSlice.ts";
import { ManagerCard } from "../manager/ManagerCard.tsx";
import {CreateManagerModal} from "../manager/CreateManagerModal.tsx";


export const AdminPanel = () => {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { stats, users, loading } = useAppSelector((state) => state.adminStoreSlice);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    if (loading && !users.length) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="p-10">

            <div className="relative w-full mb-10">
                <div className="absolute left-0 top-0">
                    <button
                        className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-6 py-2 rounded shadow-md uppercase font-bold transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-xl font-bold mb-4">Orders statistic</h2>
                    <div className="space-y-1 font-semibold text-gray-700">
                        <p>Total: {stats?.total || 0}</p>
                        <p>Agree: {stats?.agree || 0}</p>
                        <p>In work: {stats?.in_work || 0}</p>
                        <p>Disagree: {stats?.disagree || 0}</p>
                        <p>Dubbing: {stats?.dubbing || 0}</p>
                        <p className="mt-2 text-lg text-green-700">New: {stats?.new || 0}</p>
                    </div>
                </div>
            </div>

            <hr className="border-[#43a047] mb-10" />


            <div className="max-w-5xl mx-auto space-y-4">
                {users?.map(user => (
                    <ManagerCard key={user.id} user={user} />
                ))}
            </div>


            <CreateManagerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};