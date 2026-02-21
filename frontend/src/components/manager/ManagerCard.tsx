import type {FC} from "react";
import type {IUser} from "../../models/interfaces/IUser/IUser.ts";
type State = {
    user: IUser ;
}

export const ManagerCard: FC<State> = ({ user }) => {
    return (
        <div className="border-2 border-green-600 rounded-xl p-4 flex justify-between items-start">
            <div className="text-sm space-y-1">
                <p>id: {user.id}</p>
                <p>email: {user.email}</p>
                <p>name: {user.name}</p>
                <p>surname: {user.surname}</p>
                <p>is_active: <span className={user.isActive ? "text-green-600" : "text-red-600"}>
                    {String(user.isActive)}
                </span></p>
                <p>last_login: {user.last_login || 'null'}</p>
            </div>

            <div className="flex flex-col items-end gap-4">
                <p className="font-bold">total: {user.total_orders || 0}</p>
                <div className="flex gap-2">
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-xs uppercase">Activate</button>
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-xs uppercase">Ban</button>
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-xs uppercase">Unban</button>
                </div>
            </div>
        </div>
    );
};