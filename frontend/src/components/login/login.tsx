import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {type RootState, useAppDispatch, useAppSelector} from "../store/store";
import {authActions} from "../../slices/authSlice";
import * as React from "react";
import {getErrorMessage} from "../../utils/mapError.ts";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, token } = useAppSelector((state: RootState) => state.authStoreSlice);

  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");

  const validate = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !password.trim()) {
      setError("All fields are required.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters long");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(authActions.login({ login: email, password })).unwrap();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      }
  };


  useEffect(() => {
    if (token) navigate("/app/orders");
  }, [token, navigate]);

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#43a047]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-80">

          {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>

          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor='email' className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                  id ='email'
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}

                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label htmlFor='password' className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                  id ='password'
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}

                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;
