import {useAppSelector} from "../store/store.ts";


export const AdminPanel = () => {
    const { stats, loading } = useAppSelector((state) => state.adminStoreSlice);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="relative w-full min-h-75 mt-10">
            <div className="absolute left-10 top-10">
                <button
                    className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-6 py-2 rounded shadow-md uppercase font-bold transition-colors"
                    onClick={() => {/* Відкрити модалку створення */}}
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
                    <p className="mt-2 text-lg">New: {stats?.new || 0}</p>
                </div>
            </div>
        </div>
    );
};