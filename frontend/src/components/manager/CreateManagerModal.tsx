import {type SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch} from "../store/store.ts";
import {addManager} from "../../slices/adminSlice.ts";
import type {FC} from "react";
import type {IManager} from "../../models/interfaces/IManager/IManager.ts";

interface CreateManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export const CreateManagerModal: FC<CreateManagerModalProps> = ({ isOpen, onClose }) => {

    const { register, handleSubmit, reset } = useForm<IManager>();
    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<IManager> = (data) => {
        const managerWithAuth = {
            ...data,
            username: data.email.split('@')[0],
            password: "DefaultPassword123!"
        };
        dispatch(addManager(managerWithAuth))
            .unwrap()
            .then(() => {
                reset();
                onClose();
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-112.5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-xl font-semibold">Email</label>
                        <input {...register("email")} className="bg-gray-100 p-3 rounded mt-2" placeholder="Email" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl font-semibold">Name</label>
                        <input {...register("name")} className="bg-gray-100 p-3 rounded mt-2" placeholder="Name" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl font-semibold">Surname</label>
                        <input {...register("surname")} className="bg-gray-100 p-3 rounded mt-2" placeholder="Surname" />
                    </div>

                    <div className="flex justify-between gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-green-600 text-white w-full py-3 rounded font-bold uppercase">Cancel</button>
                        <button type="submit" className="bg-green-600 text-white w-full py-3 rounded font-bold uppercase">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};