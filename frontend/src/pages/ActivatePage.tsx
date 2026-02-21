// import {useNavigate, useParams} from "react-router-dom";
// import {useForm} from "react-hook-form";
//
//
// export const ActivatePage = () => {
//     const { token } = useParams<{ token: string }>();
//     const navigate = useNavigate();
//
//
//     const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors, isSubmitting }
//     } = useForm();
//
//     const password = watch("password");
//
//     const onSubmit = async (data: any) => {
//         try {
//               await axiosInstance.patch(`/auth/activate/${token}`, {
//                 password: data.password
//             });
//
//             alert("Account activated successfully!");
//             navigate("/login");
//         } catch (e: any) {
//             const errorMsg = e.response?.data?.message || "Token is invalid or expired (30 min)";
//             alert(errorMsg);
//         }
//     };
//
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
//                 <h2 className="text-xl font-bold text-center">Set New Password</h2>
//
//                 <input
//                     type="password"
//                     {...register("password", { required: true, minLength: 8 })}
//                     placeholder="New Password"
//                     className="w-full border p-2 rounded"
//                 />
//
//                 <input
//                     type="password"
//                     {...register("confirmPassword", {
//                         validate: (value) => value === watch('password') || "Passwords do not match"
//                     })}
//                     placeholder="Confirm Password"
//                     className="w-full border p-2 rounded"
//                 />
//
//                 <button type="submit" className="w-full bg-green-600 text-white py-2 rounded uppercase font-bold">
//                     Activate Account
//                 </button>
//             </form>
//         </div>
//     );
// };