import {type FC, useState} from "react";
import type {IUser} from "../../models/interfaces/IUser/IUser.ts";
import {useAppDispatch} from "../store/store.ts";
import {adminActions} from "../../slices/adminSlice.ts";
import {useAuth} from "../hooks/useAuth.ts";
import { toast } from 'react-hot-toast';

type State = {
    user: IUser ;
}

export const ManagerCard: FC<State> = ({ user }) => {
    const [copyStep, setCopyStep] = useState<'idle' | 'ready' | 'copied'>('idle');
    const dispatch = useAppDispatch();
    const {me, loading} = useAuth();

    const isSelf = !loading && me?.id === user.id;


    const handleActionClick = async () => {
        if (copyStep === 'idle') {
            setCopyStep('ready');
        }
        else if (copyStep === 'ready') {
            const action = user.isActive
                ? adminActions.copyRecoveryLink
                : adminActions.copyActivationLink;

            try {
                const { link } = await dispatch(action(user.id)).unwrap();
                if (link) {
                    await navigator.clipboard.writeText(link);
                    setCopyStep('copied');

                    setTimeout(() => setCopyStep('idle'), 3000);
                }
            } catch (err) {
                toast.error(typeof err === 'string' ? err : 'Error');
                setCopyStep('idle');
            }
        }
    };

        const handleToggleBan = (userId: number, action: 'ban' | 'unban') => {
            setCopyStep('idle');
            if (isSelf) return;
            dispatch(adminActions.toggleUserBan({userId, action}));
        };


        return (

            <div className={`border-2 rounded-xl p-4 flex justify-between items-start transition-all ${
                isSelf ? "border-blue-400 bg-blue-50/10" : "border-green-600"
            }`}>
                <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold">id: {user.id}</p>
                        {isSelf && (
                            <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                            You
                        </span>
                        )}
                    </div>

                    <p>email: {user.email}</p>
                    <p>name: {user.name}</p>
                    <p>surname: {user.surname}</p>
                    <p>isActive: <span className={user.isActive ? "text-green-600" : "text-red-600"}>
                    {String(user.isActive)}
                </span></p>

                    <p>last login:{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</p>
                </div>

                <div className="flex flex-col items-end gap-2">

                    <div className="flex gap-2">
                        <p>Total: {user.stats?.total || 0}</p>
                        <p>Agree: {user.stats?.agree || 0}</p>
                        <p>In work: {user.stats?.in_work || 0}</p>
                        <p>Disagree: {user.stats?.disagree || 0}</p>
                        <p>Dubbing: {user.stats?.dubbing || 0}</p>
                        <p>New: {user.stats?.new || 0}</p>

                        <div className="min-w-35 flex flex-col items-center">
                            <button
                                onClick={handleActionClick}
                                disabled={loading || isSelf || copyStep === 'copied'}
                                className={`min-w-40 h-8.5 flex items-center justify-center px-4 rounded text-[12px] uppercase font-bold border transition-all ${
                                    isSelf
                                        ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                                        : copyStep === 'idle'
                                            ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                                            : "bg-green-500 text-white border-green-600 hover:bg-green-700"
                                } ${copyStep === 'copied' ? "cursor-default" : ""}`}
                                title={isSelf ? "You cannot manage your own links" : ""}
                            >
                                {copyStep === 'idle' && (user.isActive ? "Recovery Password" : "Activate")}
                                {copyStep === 'ready' && "Copy to clipboard"}
                                {copyStep === 'copied' && "Link copied"}
                            </button>

                        </div>

                        <button
                            onClick={() => handleToggleBan(user.id, 'ban')}
                            disabled={loading || isSelf || !user.isActive}
                            className={`min-w-17.5 h-8.5 flex items-center justify-center px-3 rounded text-[12px] uppercase font-bold transition-colors ${
                                !loading && !isSelf && user.isActive
                                    ? "bg-green-600 text-white px-3 py-1 rounded text-xs uppercase"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            title={isSelf ? "You cannot ban yourself" : ""}
                        >
                            Ban
                        </button>

                        <button
                            onClick={() => handleToggleBan(user.id, 'unban')}
                            disabled={loading || isSelf || user.isActive}
                            className={`min-w-17.5 h-8.5 flex items-center justify-center px-3 rounded text-[12px] uppercase font-bold transition-colors ${
                                !loading && !isSelf && !user.isActive
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            title={isSelf ? "You cannot unban yourself" : ""}
                        >
                            Unban
                        </button>

                    </div>

                </div>

            </div>
        );
    };
