import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {activateAccount, authActions} from "../slices/authSlice.ts";
import {useAppDispatch, useAppSelector} from "../components/store/store.ts";
import Input from "../components/ui/input.tsx";


interface IActivateForm {
    password: string;
    confirmPassword?: string;
}

export const ActivatePage = () => {
    const { token } = useParams<{ token: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading } = useAppSelector((state) => state.authStoreSlice);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<IActivateForm>();

    const onSubmit = async (formData: IActivateForm) => {
        const resultAction = await dispatch(authActions.activateAccount({
            token: token || "",
            password: formData.password
        }));

        if (activateAccount.fulfilled.match(resultAction)) {
            alert("Account activated successfully!");
            navigate("/login");
        } else {
            alert(resultAction.payload || "Error occurred");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#43a047]">
        <div className="flex items-center justify-center min-h-screen  bg-[#43a047">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96 space-y-4">

                <div>
                    <label htmlFor ="password" className="block text-sm font-medium mb-1"> Password</label>
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
                    <label htmlFor ="password" className="block text-sm font-medium mb-1">Confirm Password</label>
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


                <button disabled={loading}
                 type="submit"
                 className="w-full bg-green-600 text-white py-2 rounded uppercase font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                    {loading ? "Processing..." : "Activate"}
                </button>
            </form>
        </div>
        </div>
    );
};