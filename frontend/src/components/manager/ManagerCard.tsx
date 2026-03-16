import {type FC, useState} from "react";
import type {IUser} from "../../models/interfaces/IUser/IUser.ts";
import {useAppDispatch} from "../store/store.ts";
import {adminActions} from "../../slices/adminSlice.ts";

type State = {
    user: IUser ;
}

export const ManagerCard: FC<State> = ({ user }) => {
    const [isCopied, setIsCopied] = useState(false);
    const dispatch = useAppDispatch();


    const handleCopyLink = (userId: number) => {
        dispatch(adminActions.copyActivationLink(userId));
        setIsCopied(true);

        setTimeout(() => setIsCopied(false), 2000);
    };
    const handleToggleBan = (userId: number, action: 'ban' | 'unban') => {
        setIsCopied(false);
        dispatch(adminActions.toggleUserBan({ userId, action }));
    };


    return (
        <div className="border-2 border-green-600 rounded-xl p-4 flex justify-between items-start">
            <div className="text-sm space-y-1">
                <p>id: {user.id}</p>
                <p>email: {user.email}</p>
                <p>name: {user.name}</p>
                <p>surname: {user.surname}</p>
                <p>isActive: <span className={user.isActive ? "text-green-600" : "text-red-600"}>
                    {String(user.isActive)}
                </span></p>

                <p>last login:{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</p>
            </div>

            <div className="flex flex-col items-end gap-4">

                <div className="flex gap-2">
                    <p>Total: {user.stats?.total || 0}</p>
                    <p>Agree: {user.stats?.agree || 0}</p>
                    <p>In work: {user.stats?.in_work || 0}</p>
                    <p>Disagree: {user.stats?.disagree || 0}</p>
                    <p>Dubbing: {user.stats?.dubbing || 0}</p>
                    <p>New: {user.stats?.new || 0}</p>

                    <div className="min-w-35 flex justify-end">
                        <button
                            onClick={() => handleCopyLink(user.id)}
                            className="w-fit whitespace-nowrap bg-green-600 text-white px-3 py-1 rounded text-xs uppercase"
                        >
                            {isCopied
                                ? "COPY TO CLIPBOARD"
                                : (user.isActive ? "Recovery Password" : "Activate")
                            }
                        </button>
                    </div>


                    <button
                        onClick={() => handleToggleBan(user.id, 'ban')}
                        disabled={!user.isActive}
                        className={`px-3 py-1 rounded text-xs uppercase transition-colors ${
                            user.isActive
                                ? "bg-green-600 text-white px-3 py-1 rounded text-xs uppercase"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >

                        Ban
                    </button>

                    <button
                        onClick={() => handleToggleBan(user.id, 'unban')}
                        disabled={user.isActive}
                        className={`px-3 py-1 rounded text-xs uppercase transition-colors ${
                            !user.isActive
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Unban
                    </button>

                </div>

                </div>

            </div>
    );
};
