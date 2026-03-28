import {type SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch} from "../store/store.ts";
import {addManager} from "../../slices/adminSlice.ts";
import {type FC, useState} from "react";
import type {IManager} from "../../models/interfaces/IManager/IManager.ts";
import type {IApiError} from "../../models/interfaces/IError/IApiError.ts";

interface CreateManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateManagerModal: FC<CreateManagerModalProps> = ({isOpen, onClose}) => {

    const {register, handleSubmit, reset} = useForm<IManager>();
    const dispatch = useAppDispatch();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const isApiError = (error: unknown): error is IApiError => {
        return (
            typeof error === 'object' &&
            error !== null &&
            ('message' in error || 'statusCode' in error)
        );
    };

    const onSubmit: SubmitHandler<IManager> = async (data) => {
        try {
            setErrors({});

            const managerWithAuth = {
                ...data,
                username: data.email.split('@')[0],
                password: "DefaultPassword123!"
            };
            await dispatch(addManager(managerWithAuth)).unwrap();
            reset();
            onClose();

        } catch (err: unknown) {
            let errorMessage = "Failed to create manager";

            if (isApiError(err)) {
                errorMessage = Array.isArray(err.message) ? err.message[0] : (err.message || errorMessage);
            } else if (typeof err === 'string') {
                errorMessage = err;
            }

            setErrors({manager: errorMessage});
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-112.5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-xl font-semibold">Email</label>
                        <input
                            {...register("email", {
                                required: true,
                                onChange: () => setErrors({})
                            })}
                            className={`bg-gray-100 p-3 rounded mt-2 border ${errors.manager ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Email"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl font-semibold">Name</label>
                        <input {...register("name", {required: true})} className="bg-gray-100 p-3 rounded mt-2" placeholder="Name"/>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl font-semibold">Surname</label>
                        <input {...register("surname", {required: true})} className="bg-gray-100 p-3 rounded mt-2" placeholder="Surname"/>

                    </div>


                    {errors.manager && (
                        <span className="text-red-500 text-sm block mt-2 font-medium">
                            {errors.manager}
                        </span>
                    )}

                    <div className="flex justify-between gap-4 pt-4">
                        <button type="button" onClick={onClose}
                                className="bg-gray-400 text-white w-full py-3 rounded font-bold uppercase hover:bg-gray-500 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-600 text-white w-full py-3 rounded font-bold uppercase hover:bg-green-700 transition-colors">
                            Create
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
};
