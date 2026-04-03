import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../components/store/store.ts";
import {useForm} from "react-hook-form";
import {authActions} from "../slices/authSlice.ts";
import {toast} from "react-hot-toast";
import Input from "../components/ui/input.tsx";
import {useEffect} from "react";

interface IActivateForm {
    password: string;
    confirmPassword?: string;
}

export const AuthActionPage = ({ type }: { type: 'activate' | 'recovery' }) => {
    const { token } = useParams<{ token: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.authStoreSlice);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<IActivateForm>();

    useEffect(() => {
        dispatch(authActions.resetAuthState());
    }, [dispatch]);

    const onSubmit = async (formData: IActivateForm) => {
        const action = type === 'activate'
            ? authActions.activateAccount
            : authActions.resetPassword;

        const resultAction = await dispatch(action({
            token: token || "",
            password: formData.password
        }));

        if (action.fulfilled.match(resultAction)) {
            toast.success(type === 'activate' ? "Account activated!" : "Password updated!");
            navigate("/login");
        } else {
            toast.error(resultAction.payload as string || "Error occurred");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#43a047]">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
                <h2 className="text-center font-bold text-xl uppercase text-gray-700">
                    {type === 'activate' ? "Activate Account" : "Reset Password"}
                </h2>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">New Password</label>
                    <Input
                        id="password"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "Min 8 chars" }
                        })}
                        placeholder="Password"
                        className={`w-full border p-2 rounded ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                    <Input
                        id='confirmPassword'
                        type="password"
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) => value === watch('password') || "Passwords do not match"
                        })}
                        placeholder="Confirm Password"
                        className={`w-full border p-2 rounded ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded uppercase font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                    {loading ? "Processing..." : (type === 'activate' ? "Activate" : "Set New Password")}
                </button>
            </form>
        </div>
    );
};